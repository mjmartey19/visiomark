import time
import os
import multiprocessing
from image_marker import ImageMarker
import asyncio

def process_image(name, ipm):
    image_path = os.path.join(ipm.image_dir, name)
    image_marker = ImageMarker(
        image_path=image_path, no_of_questions=ipm.no_of_questions, master_key={}
    )
    start_time = time.time()
    predictions = image_marker.predict_selections()
    end_time = time.time()

    print(f"time taken to predict {name}: {end_time - start_time}")

    return name, predictions

# Using multiprocessing to speed up the process
def multiprocessing_predictions(ipm, image_file_names):
    """This function utilizes multiprocessing to speed up the process of predicting the selections

    Args:
        ipm (ImageProcessing): The image processing model
        image_file_names (list[str] | None): The list of image file names

    Returns:
        dict: A dictionary of the response
    """    
    response = {}

    with multiprocessing.Pool() as pool:
        # Map image processing tasks to the pool of worker processes
        results = pool.starmap(process_image, [(name, ipm) for name in image_file_names])

        # Process the results
        for name, predictions in results:
            response[name] = predictions
            
    return response

def serial_predictions(ipm, image_file_names):
    """This function runs the predictions in serially on the images

    Args:
        ipm (ImageProcessing): The image processing model
        image_file_names (list[str] | None): The list of image file names

    Returns:
        dict: A dictionary of the response
    """    
    results = []

    for name in image_file_names:
        image_path = os.path.join(ipm.image_dir, name)
        image_marker = ImageMarker(
            image_path=image_path, no_of_questions=ipm.no_of_questions, master_key=ipm.master_key
        )

        start_timee = time.time()
        predictions = image_marker.predict_selections()
        end_time = time.time()

        print(f"time taken to predict {name}: {end_time - start_timee}")
        
        results.append(predictions)

    return results


# using asyncio to speed up the process
def asyncio_predictions(ipm, image_file_names):

    response = {}

    async def process_image(name):
        image_path = os.path.join(ipm.image_dir, name)
        image_marker = ImageMarker(
            image_path=image_path, no_of_questions=ipm.no_of_questions, master_key={}
        )

        start_timee = time.time()
        predictions = await asyncio.to_thread(image_marker.predict_selections)
        end_time = time.time()

        print(f"time taken to predict {name}: {end_time - start_timee}")

        response[name] = predictions

    asyncio.gather(*[process_image(name) for name in image_file_names])

    return response