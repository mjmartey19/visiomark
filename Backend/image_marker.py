import os
import logging
import tensorflow as tf
import cv2
import numpy as np
import imutils
from typing import Dict, Tuple
from fastapi import HTTPException, status
from imutils.perspective import four_point_transform
from helpers.utils import make_predictions, mark_predictions
from helpers.__img_utils__ import load_diff_images_for_idx_no, load_diff_images_for_shading , get_n_columns, find_contours, get_all_cropped_index_number
import multiprocessing
os.environ['CUDA_VISIBLE_DEVICES'] = ''


class ImageMarker:
    def __init__(self, image_path: str, no_of_questions: str, master_key: dict) -> None:
        self.image_path = image_path
        self.width = 1162
        self.height = 1600
        self.questions = int(no_of_questions)
        self.master_key = master_key
        
    def predict_selections(self) -> Dict[int, str]:
        """This function helps you to make predictions

        Returns:
            Dict[int, str]: returns a dictionary of the file name, predictions and score
        """
        question_data = self.start_shading_processing()
        idx_diff_images = self.start_indx_processing()
        
        predictions, index_number = make_predictions(shading_arr=question_data, idx_num_arr=idx_diff_images)
        results = {
            id + 1: predicted_label for id, predicted_label in enumerate(predictions)
        }
        score = mark_predictions(results, self.master_key)
        
        file_name = (self.image_path).split('/')[-1]
        file_name = file_name.split('\\')[-1]
        accum_result = {
            "file_name": file_name,
            'predictions': results,
            "score": score,
            "index_number": index_number
        }
        return accum_result
    
    def start_shading_processing(self):
        """This function starts the processing of the image

        Returns:
            img, gray_img, canny_img: Original image, Grayscale image, Canny image
        """
        diff_images_for_shading = load_diff_images_for_shading(image_path=self.image_path, width=self.width, height=self.height)
        question_data = self.get_questions_data(diff_images=diff_images_for_shading)        
        
        return question_data
    
    def start_indx_processing(self):
        """This function starts the processing of the image

        Returns:
            img, gray_img, canny_img: Original image, Grayscale image, Canny image
        """
        diff_images_for_idx = load_diff_images_for_idx_no(image_path=self.image_path, width=2550, height=3510)
        index_number = self.get_index_no(diff_images=diff_images_for_idx)
        
        
        return index_number
    
    
    def process_image_for_shading(self,diff_images) -> np.ndarray:
        """this function helps you to preprocess your images and get gets
        the biggest contour

        Args:
            image (str): path of image from the crop_columns function

        Returns:
            paper: an array of the biggest contour
        """

        img , gray_img, canny_img = diff_images
        img_big_contour = gray_img.copy()

        cnts = find_contours(canny_img)
        try:
            cnts = imutils.grab_contours(cnts)
        except:
            logging.error("Could not grab contours.")
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail= "Error occuring during image processing: grabbing contours")
        
        doc_cnt = None

        # ensure that at least one contour was found
        if len(cnts) > 0:
            # sort the contours according to their size in
            # descending order
            cnts = sorted(cnts, key=cv2.contourArea, reverse=True)

            # loop over the sorted contours
            for c in cnts:
                # approximate the contour
                peri = cv2.arcLength(c, True)
                approx = cv2.approxPolyDP(c, 0.02 * peri, True)

                # if our approximated contour has four points,
                # then we can assume we have found the shaded area
                if len(approx) == 4:
                    doc_cnt = approx
                    break
        else:
            logging.error("No contours found.")
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail= "Error occuring during image processing: finding contours")

        # apply a four point perspective transform to both the
        # original image and grayscale image to obtain a top-down
        # view of the document
        paper = four_point_transform(img, doc_cnt.reshape(4, 2))
        warped = four_point_transform(gray_img, doc_cnt.reshape(4, 2))
       
        del gray_img, cnts, img_big_contour, doc_cnt, warped

        logging.info("Image preprocessing completed.")

        return paper
                  
    def get_index_no(self, diff_images) -> np.ndarray:
        """This function gets a canny(ied) image and processes it to get the section
        for the index number.

        Args:
            img (np.ndarray): Canny image
        """        
        img, gray_img, canny_img = diff_images
        # # Resize the original image to get just the area around the index number.
        # resized_img = img[10:img.shape[0]//3, 30:img.shape[1]//3]

        contours = find_contours(canny_img)[0]

        guided_image = gray_img.copy()

        biggest_cnt = None
        for cnt in range(0, len(contours)):
            if cv2.contourArea(contours[cnt]) > 20000:
                print(cv2.contourArea(contours[cnt]))
                biggest_cnt = cnt
                cv2.drawContours(guided_image, contours, cnt, (255, 0, 0), 10)

        cnt = contours[biggest_cnt]
        
        # Find the bounding rectangle of the contour
        x, y, w, h = cv2.boundingRect(cnt)

        # Crop the image based on the contour
        idxno_image = gray_img[y:y+h, x:x+w]
        # cv2.imshow("idxno_image", idxno_image)
        cv2.waitKey(0)
        cv2.destroyAllWindows()


        # REMOVE [n] PIXELS FORM EACH SIDE
        resized_image = idxno_image[80:155, 125:idxno_image.shape[1] - 4]
       
        combined_images = get_all_cropped_index_number(resized_image=resized_image)
        logging.info("Got the combined images.")
        imgs = [self.preprocess_idx_img(img) for img in combined_images]
        logging.info("Got all the processed images")
        imgs = tf.convert_to_tensor(imgs)
        logging.info("Converted to tensor")
        return imgs
        
    def preprocess_idx_img(self, img:np.ndarray) -> tf.Tensor:
        """This function helps you to preprocess the index number image

        Args:
            img (np.ndarray): The index number image

        Returns:
            np.ndarray: The preprocessed index number image
        """
        logging.info("Preprocessing the index number image...")
        if img.size == 0:
            raise ValueError("Empty image provided.")
        try:
            img = np.invert(img)
        except:
            raise Exception("Could not invert the image.")
        try:
            img = img.astype(np.float32) / 255.0  # Normalize the pixel values
        except:
            raise Exception("Could not normalize image.")

        if img.shape[0] == 0 or img.shape[1] == 0:
            raise ValueError("Invalid image dimensions.")

        return img
    

    def get_cropped_columns(self, diff_images) -> list:
        """This function helps you to crop the columns of the image

        Returns:
            list[(list, int)]: returns a list of tuples of the cropped columns with the start_question_number
        """
        paper = self.process_image_for_shading(diff_images=diff_images)
        print("[INFO] Cropping columns...")
        # Resize the image just to get rid of the black border
        try:
            resize = paper[30 : paper.shape[0] - 25, 39 : paper.shape[1] - 33]
        except Exception as exc:
            logging.error(f"Could not resize the big contour image.- error: {exc}")
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail= "Error occuring during image processing: resizing image")
               
        selected_columns = get_n_columns(questions=self.questions, resized_img=resize)
       
        return selected_columns

    def get_questions_data(self, diff_images ) -> np.ndarray:
        """this function helps you to crop the rows of the image
        """
        columns = self.get_cropped_columns(diff_images=diff_images)
        logging.info("Cropping rows...")

        questions_data = []
        for col_data, start_of_question in columns:
            # set the values
            count = 0
            r_delta = 0
            question = start_of_question
            for r in range(0, col_data.shape[0], 17):
                if question >= self.questions + 1:
                    break
                x = 20
                row = col_data[r + r_delta : r + r_delta + x, :]
                resize = tf.image.resize(row, [130, 20])
                questions_data.append(resize)

                count += 1
                question += 1
                if count % 5 == 0:  # Should jump r_delta times of pixels every 5th time
                    r_delta += 18
                if count == 40:
                    break

        questions_data = np.array(questions_data)
        
        return questions_data
