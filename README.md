# Fashion RAG — Multimodal Retrieval-Augmented Generation

Repository for the Fashion RAG Multimodal project: an experimental system that combines vision encoders, retrieval (FAISS), and RAG-style recommendation and image generation flows to enable intelligent fashion search and generative outputs.

---

## Quick links
- Colab training notebook: https://colab.research.google.com/drive/1WwMVobRyyxsA3R1EdH6C-IYwzVWeZy0t?usp=sharing
- Dataset (Kaggle): https://www.kaggle.com/datasets/nirmalsankalana/fashion-product-text-images-dataset

---

## What this repo contains

- `backend/` — Flask backend and model/retriever code
  - `app.py` — HTTP server endpoints used by the frontend
  - `clip_encoder.py`, `retriever.py` — embedding & retrieval helpers
  - `rag/` — RAG client utilities
  - `services/` — external service clients (e.g., `sd_client.py`) used for image generation
  - `data/` — prebuilt FAISS index and metadata used for search (index and images; keep large files out of Git where possible)
- `frontend/` — static UI (HTML, CSS, JS, assets)
  - `index.html` — main UI
  - `css/styles.css`, `js/*.js`, `assets/` — styles, logic, and images
- `colab/` — any helper notebooks or exported notebook assets (optional)

---

## Goals

- Provide a fast prototype for multimodal fashion search (text/image/multimodal). 
- Support retrieval from a local FAISS index and integrate a small RAG flow for recommendations.
- Provide an image-generation flow (via the `services/sd_client.py`) for generated outputs.

---

## Getting started (local)

Prerequisites:

- Python 3.9+ (use a venv)
- Node / browser for static frontend (frontend is static files)

1. Create and activate a virtual environment

```powershell
cd project-fashion-rag-generative-ai/backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

2. Prepare data

- The repo includes a `data/` folder with a FAISS index and `metadata.json` for quick dev. If you want to recreate the index, use the Colab notebook above or implement `backend/retriever.py` steps locally.

3. Run the backend

```powershell
cd ../backend
python app.py
# backend expects to listen on 127.0.0.1:5000 by default
```

4. Open the frontend

```powershell
cd ../frontend
python -m http.server 8000
# open http://localhost:8000
```

---

## Colab training

The Colab notebook linked above contains a training/embeddings generation workflow to build encoders and the FAISS index from the Kaggle dataset. Use the notebook if you need to (re)create the index or experiment with different embedding models.

Notes:
- When using the Kaggle dataset inside Colab, authenticate to Kaggle and follow its directions to download the dataset into the Colab runtime.

---

## Important notes & recommended workflow

- This repo contains some pre-generated binary assets (index, images). Avoid committing large new binary datasets to Git — prefer hosting them externally and adding a small manifest file.
- Before force-pushing changes to `main`, ensure this is the intended workflow and that remote `main` will be replaced. The steps below in this README are suitable for syncing a local workspace to the remote `main` branch.

---

## License & attribution

This project uses third-party datasets and models (see the Colab notebook). Verify licenses on dataset and model usage before any production use.

---

If you want, I can:
- prepare a `.gitattributes`/`.gitignore` to keep large binaries out of the repo,
- create a small `dev` Dockerfile for consistent environment,
- or run the Git force-push now (I can do that if you confirm).
