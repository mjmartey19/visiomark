import numpy as np
import tensorflow as tf
import logging 
from fastapi import HTTPException, status
from typing import Dict
from datetime import datetime
import csv
import os

# Labeled Training Data (Integer Encoding)
def index_to_label(index: int): 
    shading= {
                    0: 'A',
                    1: 'B',
                    2: 'C', 
                    3: 'D', 
                    4: 'E',
                    5: 'Double',
                    6: 'Exception'
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

def save_response_to_csv(response: Dict[str, Dict[int, str]], output_file: str) -> None:
    import csv
    with open(output_file, 'w') as f:
        writer = csv.writer(f)
        writer.writerow(['file_name', 'predictions', 'score'])
        for key in response:
            writer.writerow([key, response[key]['predictions'], response[key]['score']])
            

def a(response_data):
    # Generate a dynamic part for the file name using the current timestamp
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    # # Create the CSV file path with the dynamic part in the file name
    csv_file_name = f"predictions_{timestamp}.csv"
    # csv_file_path = os.path.join(os.path.expanduser("~"), "Documents", csv_file_name)
    os.makedirs('output_csv', exist_ok=True)
    csv_file_path = os.path.join('output_csv', csv_file_name)
    

    # Check if the CSV file already exists
    file_exists = os.path.isfile(csv_file_path)

    # Extract the keys for the CSV header
    header = ['file_name', 'predictions', 'score']

    # Write the response data to the CSV file
    with open(csv_file_path, 'w', newline='') as csv_file:
        writer = csv.DictWriter(csv_file, fieldnames=header)
        if not file_exists:
            writer.writeheader()
        writer.writerows([
        {
            'file_name': item['file_name'],
            'predictions': ', '.join(item['predictions'].values()),
            'score': item['score']
        }
        for item in response_data
    ])

    print(f"CSV file saved at: {csv_file_path}")
        