import os
from fastapi import UploadFile
import shutil
import uuid
from dotenv import load_dotenv

load_dotenv()

UPLOAD_DIR = "media"
USE_CLOUDINARY = os.getenv("CLOUDINARY_CLOUD_NAME") is not None

# Configure Cloudinary if credentials are available
if USE_CLOUDINARY:
    import cloudinary
    import cloudinary.uploader
    
    cloudinary.config(
        cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
        api_key=os.getenv("CLOUDINARY_API_KEY"),
        api_secret=os.getenv("CLOUDINARY_API_SECRET")
    )

async def save_file(file: UploadFile):
    """
    Save file to Cloudinary (production) or local storage (development).
    Returns the URL/path of the saved file.
    """
    if USE_CLOUDINARY:
        try:
            # Upload to Cloudinary
            result = cloudinary.uploader.upload(file.file, resource_type="auto")
            return result["secure_url"]
        except Exception as e:
            print(f"Error uploading to Cloudinary: {e}")
            raise
    else:
        # Fallback to local storage for development
        os.makedirs(UPLOAD_DIR, exist_ok=True)
        file_ext = file.filename.split(".")[-1]
        unique_name = f"{uuid.uuid4()}.{file_ext}"
        file_path = os.path.join(UPLOAD_DIR, unique_name)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        return file_path
