import os
from fastapi import FastAPI, HTTPException, status, Request
import pydantic
from pydantic import BaseModel, EmailStr
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from email.mime.text import MIMEText
import base64
from helpers.__pred_methods__ import multiprocessing_predictions, serial_predictions
from helpers.dir_module import image_dir_to_array
import tensorflow as tf
import cv2
from fastapi.middleware.cors import CORSMiddleware
import logging
from helpers.utils import save_response_to_csv
import shutil
import datetime
import requests
import json
import csv

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

class SendEmailModel(BaseModel):
    access_token: str
    receiver_email: EmailStr
    sender_email: EmailStr
    csv_path: str

def create_message(sender: str, to: str, subject: str, message_text: str) -> dict:
    message = MIMEText(message_text)
    message['to'] = to
    message['from'] = sender
    message['subject'] = subject
    raw = base64.urlsafe_b64encode(message.as_bytes()).decode()
    return {'raw': raw}

@app.post("/send-email")
async def send_email(model: SendEmailModel):
    access_token = model.access_token
    sender_email = model.sender_email
    receiver_email = model.receiver_email
    csv_path = model.csv_path

    print(access_token, receiver_email, send_email, csv_path)

    if not os.path.isfile(csv_path):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="CSV file not found")
       

    try:
        creds = Credentials(token=access_token)
        if creds.expired:
            # Refresh the credentials if they are expired
            creds.refresh(Request())
        service = build('gmail', 'v1', credentials=creds)

        subject = "CSV File"
        body = "Please find the CSV file attached."

        message = create_message(sender_email, receiver_email, subject, body)

        send_message = service.users().messages().send(userId="me", body=message).execute()
        print(f'Message Id: {send_message["id"]}')
        return {"message": "Email sent successfully"}
    except HttpError as error:
        print(f'An error occurred: {error}')
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(error))


def copy_images_to_visioMark(image_dir: str, course_code: str, user_id: str):
    exam_sheets_dir = os.path.join(os.path.expanduser("~"), "Documents", "VisioMark", user_id, "exam_sheets")

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
async def predict_score(ipm: ImageProcessingModel, request: Request):
    user_id = request.headers.get('User-ID')  # Assume user ID is passed in request headers
    if not user_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User ID not provided")

    # Validate the directory path
    if not os.path.isdir(ipm.image_dir):
        error_detail = f"Invalid directory path: `{ipm.image_dir}`"
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=error_detail)

    image_file_names = image_dir_to_array(image_dir=ipm.image_dir)
    print(image_file_names)

    if len(image_file_names):
        logging.info("Serial predictions started.")
        response = serial_predictions(ipm, image_file_names)

        # Move images to visioMark folder
        image_dir = copy_images_to_visioMark(ipm.image_dir, ipm.course_code, user_id)

    if len(image_file_names) == 0:
        raise HTTPException(status_code=status.HTTP_200_OK, detail="No images found in the directory.")

    csv_file = save_response_to_csv(response_data=response, course_code=ipm.course_code, department_code=ipm.department_code, new_image_dir=image_dir, marking_scheme=ipm.master_key, user_id = user_id)
    print(f"CSV_FILE {csv_file}")

    return [csv_file, response]

class UserInfoModel(pydantic.BaseModel):
    access_token: str

def create_user_csv(file_path, user_details):
    # Check if the file exists
    file_exists = os.path.isfile(file_path)

    # Read existing users if file exists
    if file_exists:
        with open(file_path, mode='r', newline='') as file:
            existing_users = [row['email'] for row in csv.DictReader(file)]
            if user_details['email'] in existing_users:
                print(f"User {user_details['email']} already exists.")
                return

    # Append user details
    with open(file_path, mode='a', newline='') as file:
        fieldnames = ['id', 'name', 'email', 'picture']
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        if not file_exists:
            writer.writeheader()  # Write the header only once when file is created
        writer.writerow(user_details)

# @app.post("/auth/login")
# async def user_info(request: Request):
#     data = await request.json()
#     print(data)

#     response = requests.get(f"https://www.googleapis.com/oauth2/v3/userinfo?access_token={data['access_token']}")
#     print(response.json())
#     return response.json()

@app.post("/auth/login")
async def user_info(request: Request):
    data = await request.json()
    print(data)
    response = requests.get(f"https://www.googleapis.com/oauth2/v3/userinfo?access_token={data['access_token']}")
    user_info = response.json()

    # Define the directory path
    visiomark_auth_dir = os.path.join(os.path.expanduser("~"), "AppData", "Local", "visiomarkAuth")
    os.makedirs(visiomark_auth_dir, exist_ok=True)

    # Define the file path within the directory
    file_path = os.path.join(visiomark_auth_dir, 'user_details.csv')

    user_details = {
        'id': user_info.get('sub'),
        'name': user_info.get('name'),
        'email': user_info.get('email'),
        'picture': user_info.get('picture')
    }

    create_user_csv(file_path, user_details)

    return user_info
