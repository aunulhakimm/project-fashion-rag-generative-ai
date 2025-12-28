import os
import shutil
import uuid
from gradio_client import Client

SD_URL = "https://373ce93d6c00d0a116.gradio.live"
sd_client = Client(SD_URL)

# Ensure OUTPUT_DIR is absolute and located relative to this file
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", "data", "generated"))
os.makedirs(OUTPUT_DIR, exist_ok=True)

def generate_image_sd(prompt: str):
    result = sd_client.predict(prompt, api_name="/predict")

    if isinstance(result, list):
        result = result[0]

    # copy image dari temp gradio
    filename = f"{uuid.uuid4().hex}.webp"
    target_path = os.path.join(OUTPUT_DIR, filename)

    shutil.copy(result, target_path)

    # return URL, BUKAN path lokal
    return f"http://127.0.0.1:5000/generated/{filename}"
