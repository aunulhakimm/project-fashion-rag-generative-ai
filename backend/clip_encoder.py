import torch
from transformers import CLIPProcessor, CLIPModel
from PIL import Image

device = "cuda" if torch.cuda.is_available() else "cpu"

model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32").to(device)
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

def encode_text(text):
    inputs = processor(text=text, return_tensors="pt", truncation=True).to(device)
    with torch.no_grad():
        return model.get_text_features(**inputs).cpu().numpy()

def encode_image(image: Image.Image):
    inputs = processor(images=image, return_tensors="pt").to(device)
    with torch.no_grad():
        return model.get_image_features(**inputs).cpu().numpy()
