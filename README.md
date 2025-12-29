# Fashion RAG — Sistem Multimodal RAG untuk Rekomendasi Fashion

Repositori ini adalah prototipe sistem multimodal yang dirancang khusus untuk rekomendasi fashion berbasis Retrieval‑Augmented Generation (RAG). Proyek ini menggabungkan beberapa komponen penting:

- Encoder visual (gambar) untuk membuat embedding fitur produk fashion.
- Retrieval menggunakan FAISS untuk menemukan item serupa dalam katalog berbasis embedding.
- Alur RAG (Retrieval‑Augmented Generation) yang menyusun konteks dari hasil retrieval dan menghasilkan teks rekomendasi atau deskripsi yang relevan.
- Pipeline generatif (mis. Stable Diffusion) untuk menghasilkan variasi visual atau mockup produk berdasarkan kebutuhan rekomendasi.

Tujuan utamanya adalah menyediakan prototipe end-to-end: dari query multimodal (teks atau gambar) → pencarian item relevan → menyusun konteks RAG → keluaran rekomendasi teks dan opsi gambar yang dihasilkan.

---

## Tautan cepat

- Notebook Colab (training / pembuatan index): https://colab.research.google.com/drive/1WwMVobRyyxsA3R1EdH6C-IYwzVWeZy0t?usp=sharing
- Dataset (Kaggle): https://www.kaggle.com/datasets/nirmalsankalana/fashion-product-text-images-dataset

---

## Model yang digunakan (catatan penting)

- Contoh model LLM / RAG: TinyLlama/TinyLlama-1.1B-Chat-v1.0 (ubah sesuai kebutuhan dan lisensi).
- Contoh model image generation: runwayml/stable-diffusion-v1-5.

Catatan: Nama model di atas hanya contoh untuk eksperimen. Sesuaikan nama model, kredensial, dan kepatuhan lisensi sebelum digunakan di lingkungan produksi.

---

## Struktur singkat repositori

- `backend/` — Flask backend, encoder, retriever, dan util RAG
  - `app.py` — endpoint HTTP yang digunakan frontend
  - `clip_encoder.py`, `retriever.py` — helper embedding dan retrieval
  - `rag/` — utilitas klien RAG dan integrasi LLM
  - `services/` — klien untuk layanan eksternal (mis. `sd_client.py` untuk Stable Diffusion)
  - `data/` — index FAISS, `metadata.json`, dan koleksi gambar (aset besar disarankan disimpan terpisah)
- `frontend/` — UI statis (HTML / CSS / JS / assets)
- `colab/` — notebook & helper untuk membangun ulang index/embedding

---

## Menjalankan secara lokal (Quickstart)

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

4. (Opsional) Untuk membuat ulang FAISS index gunakan notebook Colab yang terlampir.

---

## Catatan tentang aset besar

Repositori ini mungkin berisi aset besar (ratusan hingga ribuan gambar, file index FAISS). Menyimpan aset besar langsung di Git tidak disarankan.

Pilihan umum:
- Gunakan Git LFS untuk menyimpan aset besar di remote Git (memerlukan konfigurasi dan migrasi history jika sudah ada aset besar).
- Simpan aset di layanan eksternal (Kaggle, Google Cloud Storage, S3) dan sediakan skrip/manifest untuk mengunduh dataset saat diperlukan.

Jika mau, saya dapat membantu menyiapkan `.gitattributes` atau skrip unduh otomatis.

---

## Konfigurasi endpoint Gradio untuk `llama_client` dan `sd_client`

Beberapa klien backend (mis. `backend/rag/llama_client.py` dan `backend/services/sd_client.py`) diasumsikan berkomunikasi dengan gateway model yang dapat dijalankan melalui Gradio. Pastikan variabel lingkungan dan endpoint sesuai.

Contoh singkat (PowerShell):

```powershell
$env:LLAMA_URL = "https://your-llama-gradio-app.gradio.app"
$env:SD_URL = "https://your-sd-gradio-app.gradio.app"
```

Sesuaikan path API dan format request pada klien jika endpoint Gradio Anda menggunakan route khusus (mis. `/api/predict/`).

---

## Keterbatasan GPU di Colab

Perlu diingat runtime GPU di Colab (gratis) memiliki keterbatasan memori dan kuota. Akibatnya:

- Pelatihan atau inference model besar dapat gagal atau berjalan lambat.
- Stable Diffusion dan LLM besar mungkin perlu batch kecil, mixed precision, atau penurunan resolusi.

Rekomendasi: gunakan model lebih kecil untuk eksperimen lokal (mis. TinyLlama), atau gunakan akses GPU berbayar untuk eksperimen lebih besar.

---

## Lisensi dan atribusi

Proyek ini menggunakan dataset dan model pihak ketiga. Pastikan memeriksa lisensi penggunaan untuk dataset dan model sebelum penggunaan komersial.

---

## Opsi bantuan

Jika Anda ingin, saya bisa:
- menyiapkan `.gitattributes` + langkah migrasi Git LFS,
- membuat skrip unduh aset dan memperbarui README dengan panduan pengunduhan,
- membuat Dockerfile dev sederhana untuk lingkungan yang konsisten.

Balas dengan `1` untuk Git LFS, `2` untuk skrip unduh aset, atau beritahu saya instruksi lain.

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
