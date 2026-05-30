import os
from fastapi import UploadFile
import shutil
import uuid

UPLOAD_DIR = "media"

def save_file(file: UploadFile):
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    file_ext = file.filename.split(".")[-1]
    unique_name = f"{uuid.uuid4()}.{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_name)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return file_path
