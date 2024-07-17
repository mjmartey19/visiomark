import numpy as np
import tensorflow as tf
import logging 
from fastapi import HTTPException, status
from typing import Dict
from datetime import datetime
import csv
import os

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
    return datetime.now().strftime("%Y-%m-%dT%H:%M:%S.%fZ")
    
# Labeled Training Data (Integer Encoding)
def index_to_label(index: int): 
    shading = {
        0: 'A',
        1: 'B',
        2: 'C', 
        3: 'D', 
        4: 'E',
        5: '',
        6: 'Exceptions',
    }
    return shading.get(index, f"wrong index {index}")

def make_predictions(shading_arr: np.ndarray, idx_num_arr: np.ndarray):
    shading_arr = np.apply_along_axis(lambda x: x/255, 1, shading_arr)
    try:
        shading_model = tf.keras.models.load_model("models/saved_models/model_2.h5")
        idx_num_model = tf.keras.models.load_model("models/idx_models/idx_model_0.h5")
    except:
        logging.error("Model not found")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail= "Model not found")
    shading_prediction = shading_model.predict(shading_arr)
    idx_num_prediction = idx_num_model.predict(idx_num_arr)
    labels, index_number = process_predictions(shading_prediction, idx_num_prediction)
    return labels, index_number

def process_predictions(predictions, idx_predictions):
    indices = np.apply_along_axis(tf.argmax, 1, predictions)
    index_numbers = np.apply_along_axis(tf.argmax, 1, idx_predictions)
    index_number = ''.join(map(str, index_numbers))
    labels = np.array(list(map(index_to_label, indices)))
    return labels, index_number

def mark_predictions(prediction: Dict[int, str], master_key: Dict[str, Dict[str, any]]) -> int: 
    total_score = 0
    for key, value in master_key.items():
        converted_key = int(key)
        if value['isBonus']:
            total_score += int(value['correct'])
        elif converted_key in prediction:
            if value['choice'] == prediction[converted_key]:
                total_score += int(value['correct'])
            else:
                total_score -= int(value['incorrect'])
    return total_score

def save_response_to_csv(response_data, course_code, department_code, new_image_dir, marking_scheme, user_id):
    academic_year = set_current_academic_year()
    createdAt = get_current_datetime()
    predictions_csv_file_name = f"{course_code}_{department_code}.csv"

    result_dir = os.path.join(os.path.expanduser("~"), "Documents", "VisioMark", user_id, "result")
    # Create the directory if it doesn't exist
    os.makedirs(result_dir, exist_ok=True)
    
    predictions_csv_file_path = os.path.join(result_dir, predictions_csv_file_name)

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
    metadata_file_path = os.path.join(os.path.expanduser("~"), "Documents", "VisioMark", user_id, "result", metadata_file_name)

    metadata_header = ['file_name', 'academic_year', 'course_code', 'department_code', 'createdAt', 'image_dir', 'marking_scheme']

    metadata_file_exists = os.path.isfile(metadata_file_path)
    
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
