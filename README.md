# Fashion RAG — Multimodal Retrieval‑Augmented Generation

Repositori ini adalah prototipe sistem multimodal untuk pencarian dan rekomendasi fashion yang menggabungkan:
- encoder vision (gambar) untuk membuat embedding,
- retrieval menggunakan FAISS untuk menemukan item serupa di katalog,
- RAG (Retrieval‑Augmented Generation) untuk menyusun konteks dan rekomendasi berbasis hasil retrieval,
- pipeline generatif (Stable Diffusion) untuk menghasilkan variasi gambar.

---

## Tautan cepat
- Notebook Colab (training / buat index): https://colab.research.google.com/drive/1WwMVobRyyxsA3R1EdH6C-IYwzVWeZy0t?usp=sharing
- Dataset (Kaggle): https://www.kaggle.com/datasets/nirmalsankalana/fashion-product-text-images-dataset

---

## Model yang digunakan (catatan penting)
- MODEL_NAME untuk LLM / RAG (contoh): `TinyLlama/TinyLlama-1.1B-Chat-v1.0`
- Model image generation (Stable Diffusion): `runwayml/stable-diffusion-v1-5`

Catatan: nama model di atas dipakai saat eksperimen/training dalam notebook Colab atau pipeline pelatihan. Sesuaikan dengan token/credential serta lisensi model jika diperlukan.

---

## Struktur ringkas repo
- `backend/` — Flask backend, encoder, retriever, dan util RAG
- `backend/data/` — FAISS index, metadata.json, dan koleksi gambar (besar)
- `frontend/` — UI statis (HTML / CSS / JS / assets)
- `colab/` — notebook & helper untuk membuat ulang index/embedding

---

## Menjalankan secara lokal (quickstart)
1. Siapkan lingkungan Python

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

2. Jalankan backend

```powershell
python app.py
# backend default: http://127.0.0.1:5000
```

3. Buka frontend statis

```powershell
cd ../frontend
python -m http.server 8000
# buka http://localhost:8000
```

4. (Opsional) Jika ingin membuat ulang FAISS index gunakan notebook Colab yang terlampir.

---

## Catatan tentang aset besar
Repo ini mengandung file data besar (ratusan atau ribuan gambar dan file index FAISS). Mengelola aset besar secara langsung di Git tidak direkomendasikan karena ukuran dan performa.

Dua pendekatan umum untuk menangani aset besar:

- Gunakan Git LFS jika Anda ingin menyimpan aset pada remote Git (perlu konfigurasi dan kemungkinan migrasi history).
- Simpan aset di hosting eksternal (Kaggle, Google Cloud Storage, S3) dan sediakan skrip/manifest untuk mengunduh dataset saat diperlukan.

---

---

## Konfigurasi endpoint Gradio untuk `llama_client` dan `sd_client`
Beberapa klien di backend (mis. `backend/rag/llama_client.py` dan `backend/services/sd_client.py`) berkomunikasi dengan model/gateway yang dapat dihosting sebagai aplikasi Gradio. Pastikan URL yang dikonfigurasi mengarah ke URL Gradio (share link) atau endpoint publik hasil deploy Gradio.

Contoh cara konfigurasi singkat:

- Gunakan variabel lingkungan di sistem Anda, misalnya `LLAMA_URL` dan `SD_URL`.
- Di `llama_client.py` gunakan `os.environ.get("LLAMA_URL")` untuk membaca base URL Gradio (contoh: `https://xxxxx.gradio.app` atau `http://127.0.0.1:7860` jika lokal).
- Di `sd_client.py` gunakan `os.environ.get("SD_URL")` untuk alamat Gradio yang menjalankan model Stable Diffusion.

Contoh (PowerShell):

```powershell
$env:LLAMA_URL = "https://your-llama-gradio-app.gradio.app"
$env:SD_URL = "https://your-sd-gradio-app.gradio.app"
```

Catatan: pastikan aplikasi Gradio yang Anda gunakan mengekspor endpoint API yang dapat diakses oleh service (beberapa deployment menyediakan route REST seperti `/api/predict/` atau endpoint khusus). Sesuaikan path dan format request pada `llama_client`/`sd_client` sesuai implementasi Gradio Anda.

---

## Keterbatasan GPU di Colab
Perlu dicatat bahwa GPU pada runtime Colab (gratis) memiliki keterbatasan: memori terbatas, kuota waktu eksekusi pendek, dan kemungkinan throttling. Akibatnya:

- Pelatihan model besar atau inference model yang memerlukan memori GPU besar dapat gagal atau sangat lambat di Colab gratis.
- Stable Diffusion dan model LLM besar mungkin memerlukan batch kecil, mixed precision, atau penurunan resolusi untuk berjalan di Colab.

Rekomendasi:

- Untuk eksperimen skala kecil gunakan model lebih kecil (mis. TinyLlama) atau checkpoint yang dioptimalkan.
- Pertimbangkan Colab Pro/Pro+ atau GPU berbayar (provider cloud) untuk kebutuhan training/inference berat.

---

## Lisensi dan atribusi
Proyek ini memanfaatkan dataset dan model pihak ketiga. Periksa lisensi penggunaan dataset dan model (contoh: lisensi model TinyLlama dan model Stable Diffusion) sebelum penggunaan komersial.

---

Jika Anda mau, saya bisa:
- menyiapkan `.gitattributes` + langkah migrasi Git LFS (jika pilih opsi 1),
- atau menghapus aset besar dari repo dan membuat skrip/penjelasan download (opsi 2).

Ketik `1` untuk saya siapkan Git LFS & migrasi, `2` untuk saya hapus file besar dan siapkan skrip unduh, atau beri instruksi lain.
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
