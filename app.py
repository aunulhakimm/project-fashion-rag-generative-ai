from flask import Flask, render_template, send_from_directory
from flask_cors import CORS
import os

app = Flask(__name__, 
            template_folder='templates',
            static_folder='static')
CORS(app)

# Get the directory where this script is located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

@app.route("/")
def home():
    """Serve the main HTML page"""
    return render_template("index.html")

@app.route("/static/<path:filename>")
def serve_static(filename):
    """Serve static files (CSS, JS, images, etc.)"""
    return send_from_directory("static", filename)

if __name__ == "__main__":
    print("🚀 Starting Fashion RAG Frontend Server...")
    print("📍 Frontend: http://localhost:8080")
    print("🔗 Backend API: https://chopfallen-nonobstetric-sara.ngrok-free.dev")
    print("\n✅ Server is running! Open http://localhost:8080 in your browser")
    print("⏸️  Press Ctrl+C to stop\n")
    app.run(host="0.0.0.0", port=8080, debug=True)
