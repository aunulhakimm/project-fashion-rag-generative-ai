# Fashion RAG + Generative AI

A full-stack AI-powered fashion search application combining Retrieval-Augmented Generation (RAG) with Stable Diffusion for intelligent product discovery and image generation.

## Overview

This project implements an advanced fashion search system that leverages multiple AI models to provide:
- **Semantic Search**: CLIP-based vector similarity search across 10,000 fashion products
- **RAG Descriptions**: Natural language product descriptions generated using Flan-T5
- **Image Generation**: Stable Diffusion-powered visualization of fashion concepts
- **Real-time Analytics**: Product statistics and API health monitoring

## Architecture

```
┌─────────────────┐
│   Frontend      │
│   Flask App     │  ← User Interface (port 8080)
│   HTML/CSS/JS   │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│   Backend API   │
│   Google Colab  │  ← AI Processing (ngrok tunnel)
│   GPU-powered   │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌──▼──────┐
│ CLIP  │ │ Flan-T5 │  ← AI Models
│ Index │ │   RAG   │
└───────┘ └──┬──────┘
             │
        ┌────▼────────┐
        │   Stable    │
        │  Diffusion  │
        └─────────────┘
```

## Technology Stack

### Frontend
- **Flask** 3.0.0 - Python web framework
- **HTML/CSS/JavaScript** - Responsive UI with gradient design
- **Fetch API** - Asynchronous backend communication

### Backend
- **PyTorch** 2.0+ - Deep learning framework
- **Transformers** (HuggingFace) - Pre-trained model loading
  - CLIP (openai/clip-vit-base-patch32) - Image-text embeddings
  - Flan-T5 (google/flan-t5-small) - Text generation
  - Stable Diffusion (runwayml/stable-diffusion-v1-5) - Image synthesis
- **FAISS** - Efficient vector similarity search
- **Flask-CORS** - Cross-origin resource sharing
- **Ngrok** - Secure tunneling for Colab backend

### Dataset
- **Source**: Kaggle Fashion Product Dataset
- **Size**: 10,000+ products with images and metadata
- **Format**: CSV with categories, descriptions, and image paths

## Project Structure

```
fashion-fe/
├── app.py                      # Flask frontend server
├── fashion_rag_pipeline.py     # Full training pipeline (Colab)
├── requirements.txt            # Python dependencies
├── .gitignore                  # Git ignore rules
├── README.md                   # Project documentation
├── templates/
│   └── index.html             # Main UI template
└── static/
    ├── css/
    │   └── style.css          # Application styles
    └── js/
        └── app.js             # Client-side logic
```

## Setup Instructions

### Prerequisites
- Python 3.8 or higher
- Google Colab account (for backend)
- Ngrok account (free tier)
- 8GB RAM minimum (for frontend)

### Frontend Setup

1. **Clone the repository**
```bash
git clone https://github.com/aunulhakimm/project-fashion-rag-generative-ai.git
cd project-fashion-rag-generative-ai
```

2. **Install dependencies**
```bash
pip install -r requirements.txt
```

3. **Run the frontend server**
```bash
python app.py
```

4. **Access the application**
```
http://localhost:8080
```

### Backend Setup (Google Colab)

1. **Open Colab notebook**
   - Upload `fashion_rag_pipeline.py` to Colab
   - Ensure GPU runtime is enabled (Runtime > Change runtime type > GPU)

2. **Install ngrok**
```python
!pip install pyngrok
from pyngrok import ngrok
ngrok.set_auth_token("YOUR_NGROK_TOKEN")
```

3. **Run the training pipeline**
```python
%run fashion_rag_pipeline.py
```

4. **Start the backend server**
   - The script will automatically:
     - Download the fashion dataset
     - Generate CLIP embeddings
     - Build FAISS index
     - Load all AI models
     - Create ngrok tunnel
     - Start Flask API server

5. **Copy the ngrok URL**
   - Look for output: `Public URL: https://xxxxx.ngrok-free.dev`
   - Paste this URL into the frontend API configuration

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check and model status |
| `/stats` | GET | Product and category statistics |
| `/search` | POST | CLIP-based semantic search |
| `/rag` | POST | Search + RAG description generation |
| `/generate` | POST | Stable Diffusion image generation |
| `/pipeline` | POST | Full pipeline (search + RAG + generate) |
| `/image/<filename>` | GET | Serve product images |

### Request Examples

**Search**
```json
POST /search
{
  "query": "blue jeans",
  "top_k": 5
}
```

**RAG Search**
```json
POST /rag
{
  "query": "summer dress",
  "top_k": 5
}
```

**Full Pipeline**
```json
POST /pipeline
{
  "query": "vintage leather jacket",
  "top_k": 5,
  "generate_image": true,
  "num_steps": 20
}
```

## Features

### 1. Semantic Search
- CLIP model converts text queries into 512-dimensional embeddings
- FAISS performs efficient nearest-neighbor search
- Returns top-K most similar products with similarity scores

### 2. RAG Description Generation
- Retrieves relevant products using CLIP search
- Constructs context from product metadata
- Flan-T5 generates natural language descriptions
- Provides coherent, contextual fashion recommendations

### 3. Image Generation
- Stable Diffusion v1.5 with 512x512 resolution
- Configurable inference steps (10-50)
- Guidance scale adjustment for prompt adherence
- Base64-encoded image output

### 4. Real-time Analytics
- Total product count
- Category distribution
- API health monitoring
- Response time tracking

## Performance

| Operation | Latency (GPU) | Latency (CPU) |
|-----------|---------------|---------------|
| CLIP Search | ~50ms | ~200ms |
| RAG Generation | ~1s | ~3-5s |
| Image Generation | ~5s | N/A (requires GPU) |
| Full Pipeline | ~6s | N/A |

## Configuration

### Frontend Configuration
Edit `app.py`:
```python
HOST = "0.0.0.0"
PORT = 8080
DEBUG = True
```

### Backend Configuration
Edit `fashion_rag_pipeline.py`:
```python
INDEX_PATH = "fashion_product.index"
METADATA_PATH = "fashion_metadata.pkl"
TOP_K_DEFAULT = 5
NUM_INFERENCE_STEPS = 20
GUIDANCE_SCALE = 7.5
```

## Troubleshooting

### Common Issues

**1. CORS Errors**
- Ensure ngrok bypass header is included: `'ngrok-skip-browser-warning': 'true'`

**2. Model Download Slow**
- Models are cached after first download (~2GB total)
- Use GPU runtime for faster inference

**3. Out of Memory**
- Reduce batch size in CLIP encoding
- Use smaller Flan-T5 variant (flan-t5-small)
- Disable Stable Diffusion for lower memory usage

**4. API Offline**
- Verify ngrok URL is correct and active
- Check Colab runtime hasn't disconnected
- Restart kernel if routes aren't registered

## Development

### Adding New Features

**Custom Models**
```python
from transformers import AutoModel, AutoTokenizer

model = AutoModel.from_pretrained("model-name")
tokenizer = AutoTokenizer.from_pretrained("model-name")
```

**New Endpoints**
```python
@app.route('/custom-endpoint', methods=['POST'])
def custom_function():
    data = request.json
    # Process request
    return jsonify({"result": result})
```

### Testing
```bash
# Frontend
python -m pytest tests/

# Backend
curl -X POST http://localhost:5000/search \
  -H "Content-Type: application/json" \
  -d '{"query": "test", "top_k": 3}'
```

## License

This project is licensed under the MIT License. See LICENSE file for details.

## Acknowledgments

- **Dataset**: Kaggle Fashion Product Dataset by Nirmal Sankalana
- **Models**: HuggingFace Transformers community
- **CLIP**: OpenAI
- **Stable Diffusion**: RunwayML and Stability AI
- **FAISS**: Facebook Research

## Contributing

Contributions are welcome. Please follow these steps:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/improvement`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push to branch (`git push origin feature/improvement`)
5. Open a Pull Request

## Contact

For questions or support, please open an issue on GitHub.

## Citation

If you use this project in research, please cite:
```bibtex
@software{fashion_rag_2025,
  author = {Aunul Hakim},
  title = {Fashion RAG + Generative AI},
  year = {2025},
  url = {https://github.com/aunulhakimm/project-fashion-rag-generative-ai}
}
```
