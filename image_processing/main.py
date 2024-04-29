import imutils
from imutils.perspective import four_point_transform
import cv2
import numpy as np
import os

width= 1162
height = 1600

input_folder = 'exam_sheets'
output_folder = 'output'

if not os.path.exists(output_folder):
    os.makedirs(output_folder)
    
# Get the list of all files in directory tree at given path
image_files = [f for f in os.listdir(input_folder) if os.path.isfile(os.path.join(input_folder, f))]

for image_file in image_files:
    cv2.imread(os.path.join(input_folder, image_file))
    img = cv2.imread(os.path.join(input_folder, image_file))
    img = cv2.resize(img, (width, height))
    gray_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    imgBlur = cv2.GaussianBlur(gray_img, (3, 3), 0)
    Canny_img = cv2.Canny(imgBlur, 75, 220)
    cnts = cv2.findContours(Canny_img, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    imgBigContour = gray_img.copy()


    
    kernel = np.array([[-1,-1,-1], [-1,9,-1], [-1,-1,-1]])
    img = cv2.filter2D(imgBigContour, -1, kernel)
    # img = cv2.adaptiveThreshold(img, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 11, 2)
        
    # cnts = cv2.findContours(Canny_img, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    cnts = imutils.grab_contours(cnts)
    docCnt = None

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
            # then we can assume we have found the paper
            if len(approx) == 4:
                docCnt = approx
                break

    # apply a four point perspective transform to both the
    # original image and grayscale image to obtain a top-down
    # birds eye view of the paper
    paper = four_point_transform(img, docCnt.reshape(4, 2))
    warped = four_point_transform(img, docCnt.reshape(4, 2))

    # apply Otsu's thresholding method to binarize the warped
    # piece of paper
    thresh = cv2.threshold(warped, 0, 255, cv2.THRESH_BINARY_INV | cv2.THRESH_OTSU)[1]


    # Resize the image just to get right of the black border
    resize = paper[30:paper.shape[0] - 25, 39:paper.shape[1] - 33]
    
    # Cropping the image into 5 columns
    firstCol = resize[0:resize.shape[0], 35: 172]
    secondCol = resize[0:resize.shape[0], 225: 367]
    thirdCol  = resize[0:resize.shape[0], 420: 560]
    fourthCol = resize[0: resize.shape[0], 610: 755]
    fifthCol  = resize[0:resize.shape[0], 810: 1100]
    
    
    count = 0
    r_delta = 0
    question = 1
    for r in range(0,firstCol.shape[0],17):
        x = 20
        for c in range(0,firstCol.shape[1],200):
            # print(r+r_delta, r+x)
            row = (firstCol[r+r_delta:r+r_delta+x, c:c+200])
            file_folder = os.path.splitext(image_file)[0]
            output_file_folder = os.path.join(output_folder, file_folder)
            os.makedirs(output_file_folder, exist_ok=True)
            cv2.imwrite(f"{output_file_folder}/Question{question}-{image_file}", row)
            count += 1
            question += 1
            if count % 5 == 0:
                # print(count)
                r_delta += 18
                # plt.imshow(firstCol[r+r_delta:r+r_delta+x, c:c+200], cmap='gray')
        if count == 40:
            break

    
    cv2.imwrite(os.path.join(output_folder, image_file), resize)
    cv2.imshow('image', img)
    
    # Reset the values
    count = 0
    r_delta = 0
    question = 41
    for r in range(0,secondCol.shape[0],17):
        x = 20
        for c in range(0,secondCol.shape[1],200):
            # print(r+r_delta, r+x)
            row = (secondCol[r+r_delta:r+r_delta+x, c:c+200])
            file_folder = os.path.splitext(image_file)[0]
            output_file_folder = os.path.join(output_folder, file_folder)
            os.makedirs(output_file_folder, exist_ok=True)
            cv2.imwrite(f"{output_file_folder}/Question{question}-{image_file}", row)
            count += 1
            question += 1
            if count % 5 == 0:
                # print(count)
                r_delta += 18
                # plt.imshow(secondCol[r+r_delta:r+r_delta+x, c:c+200], cmap='gray')
        if count == 40:
            break
    
     # Reset the values
    count = 0
    r_delta = 0
    question = 81
    for r in range(0,thirdCol.shape[0],17):
        x = 20
        for c in range(0,thirdCol.shape[1],200):
            # print(r+r_delta, r+x)
            row = (thirdCol[r+r_delta:r+r_delta+x, c:c+200])
            file_folder = os.path.splitext(image_file)[0]
            output_file_folder = os.path.join(output_folder, file_folder)
            os.makedirs(output_file_folder, exist_ok=True)
            cv2.imwrite(f"{output_file_folder}/Question{question}-{image_file}", row)
            count += 1
            question += 1
            if count % 5 == 0:
                # print(count)
                r_delta += 18
                # plt.imshow(thirdCol[r+r_delta:r+r_delta+x, c:c+200], cmap='gray')
        if count == 40:
            break
        
    
     # Reset the values
    count = 0
    r_delta = 0
    question = 121
    for r in range(0,fourthCol.shape[0],17):
        x = 20
        for c in range(0,fourthCol.shape[1],200):
            # print(r+r_delta, r+x)
            row = (fourthCol[r+r_delta:r+r_delta+x, c:c+200])
            file_folder = os.path.splitext(image_file)[0]
            output_file_folder = os.path.join(output_folder, file_folder)
            os.makedirs(output_file_folder, exist_ok=True)
            cv2.imwrite(f"{output_file_folder}/Question{question}-{image_file}", row)
            count += 1
            question += 1
            if count % 5 == 0:
                # print(count)
                r_delta += 18
                # plt.imshow(fourthCol[r+r_delta:r+r_delta+x, c:c+200], cmap='gray')
        if count == 40:
            break
        
    
     # Reset the values
    count = 0
    r_delta = 0
    question = 161
    for r in range(0,fifthCol.shape[0],17):
        x = 20
        for c in range(0,fifthCol.shape[1],200):
            # print(r+r_delta, r+x)
            row = (fifthCol[r+r_delta:r+r_delta+x, c:c+200])
            file_folder = os.path.splitext(image_file)[0]
            output_file_folder = os.path.join(output_folder, file_folder)
            os.makedirs(output_file_folder, exist_ok=True)
            cv2.imwrite(f"{output_file_folder}/Question{question}-{image_file}", row)
            count += 1
            question += 1
            if count % 5 == 0:
                # print(count)
                r_delta += 18
                # plt.imshow(fifthCol[r+r_delta:r+r_delta+x, c:c+200], cmap='gray')
        if count == 40:
            break