import os
from fastapi import FastAPI, HTTPException, status
import pydantic
from helpers.__pred_methods__ import multiprocessing_predictions, serial_predictions
from helpers.dir_module import image_dir_to_array
import tensorflow as tf
import cv2
from fastapi.middleware.cors import CORSMiddleware
import logging
from helpers.utils import save_response_to_csv, a


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
    master_key: dict = {}


@app.get("/")
def read_root():
    return {"Hello": "World"}
    
    
@app.post("/predict")
async def predict_score(ipm: ImageProcessingModel):
    # image_corruption_check(ipm.image_dir)
    print(ipm.image_dir)
    
     # Validate the directory path
    if not os.path.isdir(ipm.image_dir):
        error_detail = f"Invalid directory path: `{ipm.image_dir}`"
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail= error_detail)
    
    image_file_names = image_dir_to_array(image_dir=ipm.image_dir)
    print(image_file_names)
    
    if len(image_file_names):
        logging.info("Serial predictions started.")
        response = serial_predictions(ipm, image_file_names)
    
    # if len(image_file_names) > 10:
    #     logging.info("Multiprocessing predictions started.")
    #     response = multiprocessing_predictions(ipm, image_file_names)
    
    if len(image_file_names) == 0:
        raise HTTPException(status_code=status.HTTP_200_SUCCESS, detail= "No images found in the directory.")
    
    a(response_data=response)
    
    return response

