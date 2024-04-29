import os
import numpy as np
import cv2
from fastapi import HTTPException, status
import logging
from typing import Tuple
from helpers.dir_module import image_dir_to_array



def add_brightness(img: np.ndarray):
    """Add brightness and sharpness filter to the image

    Args:
        img (np.ndarray): _description_
    """
    kernel = np.array([[-1, -1, -1], [-1, 9, -1], [-1, -1, -1]])
    img = cv2.filter2D(img, -1, kernel)
    return img


def load_diff_images_for_shading(image_path, width, height) -> Tuple[np.ndarray, np.ndarray, np.ndarray]:
    """This function helps you read, resize, and grayscale your images using TensorFlow

    Args:
        image_path (str): Path of the image to be read

    Returns:
        img: Original image as a TensorFlow tensor
        gray_img: Grayscale image as a TensorFlow tensor
        cnts: Contours
    """
    try:
        img = cv2.imread(image_path)
        img = cv2.resize(img, (width, height))
        img = add_brightness(img)
        gray_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        img_blur = cv2.GaussianBlur(gray_img, (3, 3), 0)
        canny_img = cv2.Canny(img_blur, 75, 220)
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Image not found"
        )

    return img, gray_img, canny_img

def load_diff_images_for_idx_no(image_path: str, width:int, height:int)-> Tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
    """This function helps you read, resize, and grayscale your images using TensorFlow

    Args:
        image_path (str): Path of the image to be read

    Returns:
        img: Original image as a TensorFlow tensor
        gray_img: Grayscale image as a TensorFlow tensor
        cnts: Contours
    """
    try:
        img = cv2.imread(image_path)
        img = cv2.resize(img, (width, height))
        img = add_brightness(img)
        resized_img = img[260:img.shape[0]//3, 30:img.shape[1]//3]
        cv2.imshow("idxno_image", resized_img)
        cv2.waitKey(0)
        cv2.destroyAllWindows()
        gray_img = cv2.cvtColor(resized_img, cv2.COLOR_BGR2GRAY)
        img_blur = cv2.GaussianBlur(gray_img, (5, 5), 1)
        canny_img = cv2.Canny(img_blur, 10, 70)
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Image not found"
        )

    return img, gray_img, canny_img


def find_contours(img: np.ndarray)->np.ndarray:
    """This function helps you to find the contours of the image

    Args:
        img (np.ndarray): Grayscale image as a TensorFlow tensor

    Returns:
        cnts (np.nparray): Contours
    """
    try:
        cnts = cv2.findContours(img, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Could not find contours"
        )

    return cnts


def get_n_columns(questions: int, resized_img: np.ndarray):
    # Cropping the image into 5 columns

    selected_columns = []
    try:
        if questions >= 1 or questions >= 40:
            first_col = resized_img[0 : resized_img.shape[0], 35:172]
            selected_columns.append((first_col, 1))
    except:
        logging.error("Could not crop the first column")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not crop the first column",
        )
    try:
        if questions >= 41 or questions >= 80:
            second_col = resized_img[0 : resized_img.shape[0], 225:367]
            selected_columns.append((second_col, 41))
    except:
        logging.error("Could not crop the second column")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not crop the second column",
        )
    try:
        if questions >= 81 or questions >= 120:
            third_col = resized_img[0 : resized_img.shape[0], 420:560]
            selected_columns.append((third_col, 81))
    except:
        logging.error("Could not crop the third column")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not crop the third column",
        )
    try:
        if questions >= 121 or questions >= 160:
            fourth_col = resized_img[0 : resized_img.shape[0], 610:755]
            selected_columns.append((fourth_col, 121))
    except:
        logging.error("Could not crop the fourth column")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not crop the fourth column",
        )
    try:
        if questions >= 161 or questions >= 200:
            fifth_col = resized_img[0 : resized_img.shape[0], 810:1100]
            selected_columns.append((fifth_col, 161))
    except:
        logging.error("Could not crop the fifth column")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not crop the fifth column",
        )

    logging.info("Cropping columns completed.")

    return selected_columns


def get_all_cropped_index_number(resized_image: np.ndarray):
    if resized_image.size == 0:
        logging.error("Error with the resized image of the index number.")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Error with resized image"
        )
    combined_images = []
    first_num = resized_image[3 : resized_image.shape[0] - 3, 3:55]
    first_num = cv2.resize(first_num, (28, 28))
    combined_images.append(first_num)
    
    second_num = resized_image[3 : resized_image.shape[0] - 3, 63:115]
    second_num = cv2.resize(second_num, (28, 28))
    combined_images.append(second_num)

    third_num = resized_image[3 : resized_image.shape[0] - 3, 125:180]
    third_num = cv2.resize(third_num, (28, 28))
    combined_images.append(third_num)

    fourth_num = resized_image[3 : resized_image.shape[0] - 3, 185:240]
    fourth_num = cv2.resize(fourth_num, (28, 28))
    combined_images.append(fourth_num)

    fifth_col = resized_image[3 : resized_image.shape[0] - 3, 248:300]
    fifth_col = cv2.resize(fifth_col, (28, 28))
    combined_images.append(fifth_col)

    sixth_col = resized_image[3 : resized_image.shape[0] - 3, 310:360]
    sixth_col = cv2.resize(sixth_col, (28, 28))
    combined_images.append(sixth_col)

    seventh_col = resized_image[3 : resized_image.shape[0] - 3, 370:-5]
    seventh_col = cv2.resize(seventh_col, (28, 28))
    combined_images.append(seventh_col)
    # cv2.imshow("wei", seventhCol)
    # cv2.waitKey(0)
    # cv2.destroyAllWindows()

    return combined_images

def image_corruption_check(image_dir):
    """This function will check if the image is corrupted or not.

    Args:
        image_dir (str): The path of the image directory
    """    
    
     # Validate the directory path
    if not os.path.isdir(image_dir):
        error_detail = f"Invalid directory path: `{image_dir}`"
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail= error_detail)
    
    image_files = image_dir_to_array(image_dir)
    for image_file in image_files: # type: ignore
        try:
            img = cv2.imread(os.path.join(image_dir, image_file))
            dummy = img.shape  # this line will throw the exception
        except:
            logging.error(" Image is not available or corrupted.")
            print(os.path.join(image_dir, image_file))
    logging.info("Image corruption check completed.")