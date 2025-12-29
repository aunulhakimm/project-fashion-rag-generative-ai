

# 👗 Fashion RAG — Multimodal Retrieval-Augmented Generation for Fashion Recommendation

Fashion RAG adalah sistem rekomendasi fashion cerdas berbasis multimodal Retrieval-Augmented Generation (RAG). Sistem ini menggabungkan pencarian gambar dan teks, rekomendasi berbasis AI, serta pembuatan gambar fashion baru secara otomatis.

---

## ✨ Fitur Utama

- 🔍 **Pencarian Multimodal**: Cari produk fashion menggunakan gambar, teks, atau kombinasi keduanya.
- 🤖 **AI Text Generation**: LLM (RAG) menghasilkan deskripsi dan rekomendasi berbasis hasil pencarian.
- 🎨 **AI Image Generation**: Buat variasi gambar fashion baru dengan Stable Diffusion.
- 💾 **History Pencarian**: Simpan riwayat pencarian dan hasil rekomendasi.
- ⚡ **Pencarian Cepat**: FAISS untuk pencarian vektor embedding yang efisien.
- 🌐 **Web UI Modern**: Antarmuka responsif, mudah digunakan, dan mendukung dark mode.

---

## 🏗️ Arsitektur Sistem

```
┌───────────── Frontend (HTML/CSS/JS) ─────────────┐
│  - User upload gambar/teks, lihat hasil          │
└───────────────┬──────────────────────────────────┘
								│ REST API
┌───────────────▼───────────────┐
│         Backend Flask         │
│ ┌────────────┬─────────────┐ │
│ │ Retriever  │  RAG (LLM)  │ │
│ │  (FAISS)   │             │ │
│ └────────────┴─────┬───────┘ │
│        │           │         │
│   Stable Diffusion │         │
└─────────┬──────────┴─────────┘
					│
	 Data & Storage (FAISS, metadata, images)
```

---

## 🚀 Instalasi & Setup

### Prasyarat
- Python 3.9+
- RAM 8GB+ (rekomendasi)
- GPU (opsional, untuk image generation)

### 1. Clone & Setup Backend
```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
# Backend berjalan di http://127.0.0.1:5000
```

### 2. Setup Frontend
```powershell
cd ../frontend
python -m http.server 8000
# Buka http://localhost:8000 di browser
```

### 3. (Opsional) Generate ulang FAISS index
Gunakan notebook Colab (lihat Lampiran) untuk membuat ulang index/embedding jika dataset berubah.

---

## 💻 Penggunaan

1. Buka frontend di browser, upload gambar atau masukkan teks pencarian.
2. Klik cari, sistem akan menampilkan hasil rekomendasi, deskripsi AI, dan (opsional) gambar baru.
3. Riwayat pencarian otomatis tersimpan.

---

## 📁 Struktur Proyek

```
project-fashion-rag-generative-ai/
├── backend/      # Flask API, encoder, retriever, RAG, image generator
├── frontend/     # Web UI statis (HTML, CSS, JS)
├── colab/        # Notebook training/indexing
└── data/         # FAISS index, metadata, images (besar, tidak di-Git)
```

---

## 🔧 Konfigurasi

- Endpoint Gradio untuk LLM dan Stable Diffusion diatur via environment variable:
	- `LLAMA_URL`, `SD_URL`
- File data besar (gambar, index FAISS) **tidak disarankan** di-Git. Simpan di storage eksternal atau gunakan Git LFS.
- Cek lisensi model dan dataset sebelum digunakan untuk produksi.

---

## 🔗 Lampiran Link Penting

- Notebook Colab (training/index): https://colab.research.google.com/drive/1WwMVobRyyxsA3R1EdH6C-IYwzVWeZy0t?usp=sharing
- Dataset Kaggle: https://www.kaggle.com/datasets/nirmalsankalana/fashion-product-text-images-dataset

---

## 📄 Lisensi & Kredit

Proyek ini menggunakan dataset dan model pihak ketiga. Pastikan memeriksa lisensi sebelum penggunaan komersial.

