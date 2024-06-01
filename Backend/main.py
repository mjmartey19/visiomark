import os
from fastapi import FastAPI, HTTPException, status
import pydantic
from helpers.__pred_methods__ import multiprocessing_predictions, serial_predictions
from helpers.dir_module import image_dir_to_array
import tensorflow as tf
import cv2
from fastapi.middleware.cors import CORSMiddleware
import logging
from helpers.utils import save_response_to_csv
import shutil
import datetime


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=['GET', 'POST'],
    allow_headers=["*"],
)

# Configure the root logger
logging.basicConfig(level=logging.INFO)  # Set the desired log level

class ImageProcessingModel(pydantic.BaseModel):
    image_dir: str
    no_of_questions: str = '40',
    course_code: str
    department_code: str
    master_key: dict = {}

def copy_images_to_visioMark(image_dir: str, course_code: str):
    exam_sheets_dir = os.path.join(os.path.expanduser("~"), "Documents", "VisioMark", "exam_sheets")

    timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S")

    target_dir = os.path.join(exam_sheets_dir, course_code.replace(' ', ''))


    new_dir_name = f"{target_dir}_{timestamp}"
    os.makedirs(new_dir_name)
   
    visioMark_dir = f"{course_code.replace(' ', '')}_{timestamp}"
    
    # Move files from image_dir to the new directory
    for root, dirs, files in os.walk(image_dir):
        for file in files:
            shutil.copy(os.path.join(root, file), new_dir_name)
    
    print(f"Directory moved to visioMark folder: {new_dir_name}")
    return visioMark_dir


@app.get("/")
def read_root():
    return {"Hello": "World"}
    
    
@app.post("/predict")
async def predict_score(ipm: ImageProcessingModel):
    # image_corruption_check(ipm.image_dir)
    print(ipm.image_dir, ipm.no_of_questions, ipm.course_code, ipm.department_code)
    
     # Validate the directory path
    if not os.path.isdir(ipm.image_dir):
        error_detail = f"Invalid directory path: `{ipm.image_dir}`"
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail= error_detail)
    
    image_file_names = image_dir_to_array(image_dir=ipm.image_dir)
    print(image_file_names)
    
    if len(image_file_names):
        logging.info("Serial predictions started.")
        response = serial_predictions(ipm, image_file_names)

        # Move images to visioMark folder
        image_dir = copy_images_to_visioMark(ipm.image_dir, ipm.course_code)
    # if len(image_file_names) > 10:
    #     logging.info("Multiprocessi ng predictions started.")
    #     response = multiprocessing_predictions(ipm, image_file_names)
    
    if len(image_file_names) == 0:
        raise HTTPException(status_code=status.HTTP_200_SUCCESS, detail= "No images found in the directory.")
    
    csv_file = save_response_to_csv(response_data=response, course_code=ipm.course_code, department_code=ipm.department_code, new_image_dir=image_dir, marking_scheme=ipm.master_key)
    print(f"CSV_FILE {csv_file}")
    
    return [ csv_file, response ]

