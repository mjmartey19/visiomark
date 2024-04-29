import os
import logging
from typing import List
from fastapi import HTTPException

def image_dir_to_array(image_dir: str)-> List[str]:
    """ Return a list of all names of images in folder path
    
    Returns:
        list: list of all names of images in folder path
    """
    if (os.path.isdir(image_dir)):
        for root, dirs, files in os.walk(image_dir):
            return files
    else:
        logging.error("Path does not exist")
        raise HTTPException(status_code=400, detail="Path does not exist")
    