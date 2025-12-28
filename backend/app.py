from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import io
import os

from retriever import search
from clip_encoder import encode_text, encode_image
from rag.llama_client import call_llama_rag
from services.sd_client import generate_image_sd
from flask import send_from_directory

app = Flask(__name__)
CORS(app)

# base directory for data folders (absolute paths)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

@app.route("/images/<path:filename>")
def serve_images(filename):
    images_dir = os.path.join(BASE_DIR, "data", "images")
    return send_from_directory(images_dir, filename)

@app.route("/generated/<path:filename>")
def serve_generated_image(filename):
    generated_dir = os.path.join(BASE_DIR, "data", "generated")
    return send_from_directory(generated_dir, filename)

@app.route("/search/text", methods=["POST"])
def search_text():
    query = request.json.get("query", "")
    emb = encode_text(query)
    results = search(emb)
    return jsonify(results)

@app.route("/search/image", methods=["POST"])
def search_image():
    file = request.files.get("image")
    if not file:
        return jsonify({"error": "Image file is required"}), 400

    image = Image.open(io.BytesIO(file.read())).convert("RGB")
    emb = encode_image(image)
    results = search(emb)
    return jsonify(results)

@app.route("/search/multimodal", methods=["POST"])
def search_multimodal():
    query = request.form.get("query", "")
    file = request.files.get("image")

    if not file:
        return jsonify({"error": "Image file is required"}), 400

    image = Image.open(io.BytesIO(file.read())).convert("RGB")
    txt_emb = encode_text(query)
    img_emb = encode_image(image)

    emb = (txt_emb + img_emb) / 2
    results = search(emb)
    return jsonify(results)

# ---------------- RAG ---------------- #

@app.route("/rag/recommend", methods=["POST"])
def rag_recommend():
    """
    RAG hanya memberikan rekomendasi & deskripsi fashion (NLP output)
    """
    data = request.json
    query = data.get("query", "")
    items = data.get("items", [])

    rag_output = call_llama_rag(query, items)

    return jsonify({
        "query": query,
        "recommendation": rag_output
    })

# ---------------- IMAGE GENERATION ---------------- #

@app.route("/generate/image", methods=["POST"])
def generate_image():
    """
    Image generation berdiri sendiri.
    Prompt diisi manual dari frontend.
    """
    data = request.json
    prompt = data.get("prompt", "")

    if not prompt:
        return jsonify({"error": "Prompt is required"}), 400

    image = generate_image_sd(prompt)

    # optionally get a RAG recommendation based on the prompt
    try:
        rag_output = call_llama_rag(prompt, [])
    except Exception:
        rag_output = None

    response = {
        "prompt": prompt,
        "generated_image": image,
        "recommendation": rag_output
    }

    return jsonify(response)

@app.route("/", methods=["GET"])
def home():
    return {
        "status": "OK",
        "message": "Fashion-RAG Backend (Recommendation Focus)"
    }

if __name__ == "__main__":
    app.run(debug=True)
