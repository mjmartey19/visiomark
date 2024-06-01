import numpy as np
import tensorflow as tf
import logging 
from fastapi import HTTPException, status
from typing import Dict
from datetime import datetime
import csv
import os

from datetime import datetime, timedelta

def set_current_academic_year():
    """
    Set the current academic year based on the current date.
    Assumes the academic year starts in September.
    """
    current_date = datetime.now()
    if current_date.month >= 9:  # Academic year starts in September
        start_year = current_date.year
        end_year = start_year + 1
    else:
        end_year = current_date.year
        start_year = end_year - 1
    return f"{start_year}/{end_year}"

def get_current_datetime():
    current_datetime = datetime.now().strftime("%Y-%m-%dT%H:%M:%S.%fZ")
    return current_datetime
    

# Labeled Training Data (Integer Encoding)
def index_to_label(index: int): 
    shading= {
                    0: 'A',
                    1: 'B',
                    2: 'C', 
                    3: 'D', 
                    4: 'E',
                    5: 'Double',
                    6: ''
                }
    # index = np.apply_along_axis(tf.argmax, 1, predictions)[0]
    return shading.get(index, f"wrong index {index}")


def make_predictions(shading_arr: np.ndarray, idx_num_arr: np.ndarray):
    shading_arr = np.apply_along_axis(lambda x: x/255, 1, shading_arr)
    # arr = np.apply_along_axis(lambda x: np.expand_dims(x, axis=0), 1, arr)
    # load the model
    try:
        shading_model = tf.keras.models.load_model("models/saved_models/model_2.h5")
        idx_num_model = tf.keras.models.load_model("models/idx_models/idx_model_0.h5")
    except:
        logging.error("Model not found")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail= "Model not found")
    # predictions = shading_model.predict(np.expand_dims(arr/255, axis=0))
    shading_prediction = shading_model.predict(shading_arr)
    idx_num_prediction = idx_num_model.predict(idx_num_arr)
    labels, index_number = process_predictions(shading_prediction, idx_num_prediction)
    return labels, index_number

def process_predictions(predictions, idx_predictions):
    # print(predictions)
    indices = np.apply_along_axis(tf.argmax, 1, predictions)
    index_numbers = (np.apply_along_axis(tf.argmax, 1, idx_predictions))
    index_number = ''
    for i in index_numbers:
        index_number += str(i)
    labels = np.array(list(map(index_to_label, indices)))
    return labels, index_number

def mark_predictions(prediction: Dict[int, str],  master_key: Dict[str, str]) -> int: 
    count = 0

    for key in master_key:
        converted_key = int(key)
        if converted_key in prediction and master_key[key] == prediction[converted_key]:
            count += 1

    return count
            

def save_response_to_csv(response_data, course_code, department_code, new_image_dir, marking_scheme):
    academic_year = set_current_academic_year()
    createdAt = get_current_datetime()
    # Create the CSV file path with the dynamic part in the file name
    predictions_csv_file_name  = f"{course_code}_{department_code}.csv"
    predictions_csv_file_path = os.path.join(os.path.expanduser("~"), "Documents", "VisioMark", "result", predictions_csv_file_name)

   # Check if the predictions CSV file already exists
    predictions_file_exists = os.path.isfile(predictions_csv_file_path)

    # Extract the keys for the CSV header
    predictions_header = ['file_name', 'predictions', 'score', 'index_number']

    # Write the response data to the predictions CSV file
    with open(predictions_csv_file_path, 'w', newline='') as predictions_csv_file:
        writer = csv.DictWriter(predictions_csv_file, fieldnames=predictions_header)
        writer.writeheader()
        writer.writerows([
            {
                'file_name': item['file_name'],
                'predictions': ', '.join(item['predictions'].values()),
                'score': item['score'],
                'index_number': item['index_number']
            }
            for item in response_data
        ])


    # Create a separate CSV file for metadata
    metadata_file_name = f"metadata.csv"
    metadata_file_path = os.path.join(os.path.expanduser("~"), "Documents", "VisioMark", "result", metadata_file_name)

    # Check if the metadata CSV file already exists
    metadata_file_exists = os.path.isfile(metadata_file_path)

    # Extract the keys for the metadata CSV header
    metadata_header = ['file_name', 'academic_year', 'course_code', 'department_code', 'createdAt', 'image_dir', 'marking_scheme']

    academic_year = set_current_academic_year()
    createdAt = get_current_datetime()
    # Write the metadata to the metadata CSV file
    with open(metadata_file_path, 'a', newline='') as metadata_file:
        metadata_writer = csv.DictWriter(metadata_file, fieldnames=metadata_header)
        if not metadata_file_exists:
            metadata_writer.writeheader()
        metadata_writer.writerow({
            'file_name': predictions_csv_file_name,
            'academic_year': academic_year,
            'course_code': course_code,
            'department_code': department_code,
            'createdAt': createdAt,
            'image_dir': new_image_dir,
            'marking_scheme': marking_scheme,
        })
  
    print(f"Marking Scheme:  {len(marking_scheme)}")
    # print(f"Metadata saved at: {metadata_file_path}")
    # print(f"CSV file with predictions saved at: {predictions_csv_file_path}")

    return predictions_csv_file_name

        