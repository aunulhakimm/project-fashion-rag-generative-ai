// Get API URL from input
function getApiUrl() {
    const url = document.getElementById('apiUrl').value.trim();
    if (!url) {
        showError('Please enter your ngrok API URL first!');
        return null;
    }
    return url;
}

// Show error
function showError(message) {
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = message;
    errorDiv.classList.add('active');
    setTimeout(() => errorDiv.classList.remove('active'), 5000);
}

// Show loading
function showLoading() {
    document.getElementById('loading').classList.add('active');
    document.getElementById('results').classList.remove('active');
    document.getElementById('error').classList.remove('active');
}

// Hide loading
function hideLoading() {
    document.getElementById('loading').classList.remove('active');
    document.getElementById('results').classList.add('active');
}

// Display products
function displayProducts(results) {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';
    
    const apiUrl = document.getElementById('apiUrl').value.trim();

    results.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        const displayName = (product.name && product.name !== 'N/A') 
            ? product.name 
            : (product.description ? product.description.substring(0, 100) + '...' : 'No description');
        
        const svgPlaceholder = `data:image/svg+xml,${encodeURIComponent(`
            <svg width="250" height="250" xmlns="http://www.w3.org/2000/svg">
                <rect width="250" height="250" fill="#667eea"/>
                <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
                      font-family="Arial, sans-serif" font-size="16" fill="white">
                    ${product.category}
                </text>
            </svg>
        `)}`;
        
        let imageUrl = svgPlaceholder;
        if (product.image_path && apiUrl) {
            const filename = product.image_path.split('/').pop();
            imageUrl = `${apiUrl}/image/${filename}`;
        }
        
        card.innerHTML = `
            <img src="${imageUrl}" alt="${displayName}" onerror="this.src='${svgPlaceholder}'">
            <div class="product-info">
                <div class="product-name">${displayName}</div>
                <div class="product-category">${product.category}</div>
                <span class="product-score">Score: ${product.score.toFixed(3)}</span>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Simple search
async function searchProducts() {
    const apiUrl = getApiUrl();
    if (!apiUrl) return;

    const query = document.getElementById('searchInput').value;
    const topK = parseInt(document.getElementById('topK').value);

    showLoading();

    try {
        const response = await fetch(`${apiUrl}/search`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true'
            },
            body: JSON.stringify({ query, top_k: topK })
        });

        const data = await response.json();

        if (response.ok) {
            document.getElementById('descriptionBox').style.display = 'none';
            document.getElementById('generatedImage').style.display = 'none';
            displayProducts(data.results);
            loadStats();
            hideLoading();
        } else {
            throw new Error(data.error || 'Search failed');
        }
    } catch (error) {
        hideLoading();
        showError('Error: ' + error.message);
    }
}

// RAG search
async function searchWithRAG() {
    const apiUrl = getApiUrl();
    if (!apiUrl) return;

    const query = document.getElementById('searchInput').value;
    const topK = parseInt(document.getElementById('topK').value);

    showLoading();

    try {
        const response = await fetch(`${apiUrl}/rag`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true'
            },
            body: JSON.stringify({ query, top_k: topK })
        });

        const data = await response.json();

        if (response.ok) {
            document.getElementById('description').textContent = data.description;
            document.getElementById('descriptionBox').style.display = 'block';
            document.getElementById('generatedImage').style.display = 'none';
            displayProducts(data.results);
            loadStats();
            hideLoading();
        } else {
            throw new Error(data.error || 'RAG search failed');
        }
    } catch (error) {
        hideLoading();
        showError('Error: ' + error.message);
    }
}

// Full pipeline
async function fullPipeline() {
    const apiUrl = getApiUrl();
    if (!apiUrl) return;

    const query = document.getElementById('searchInput').value;
    const topK = parseInt(document.getElementById('topK').value);
    const numSteps = parseInt(document.getElementById('sdSteps').value);

    showLoading();

    try {
        const response = await fetch(`${apiUrl}/pipeline`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': 'true'
            },
            body: JSON.stringify({
                query,
                top_k: topK,
                generate_image: true,
                num_steps: numSteps
            })
        });

        const data = await response.json();

        if (response.ok) {
            document.getElementById('description').textContent = data.description;
            document.getElementById('descriptionBox').style.display = 'block';
            loadStats();
            
            if (data.retrieval_results) {
                displayProducts(data.retrieval_results);
            } else {
                document.getElementById('productsGrid').innerHTML = '<p style="text-align:center;color:#666;">Pipeline completed successfully!</p>';
            }
            
            if (data.generated_image) {
                document.getElementById('generatedImg').src = 'data:image/png;base64,' + data.generated_image;
                document.getElementById('generatedImage').style.display = 'block';
            }
            
            hideLoading();
        } else {
            throw new Error(data.error || 'Pipeline failed');
        }
    } catch (error) {
        hideLoading();
        showError('Error: ' + error.message);
    }
}

// Load stats
async function loadStats() {
    const apiUrl = document.getElementById('apiUrl').value.trim();
    if (!apiUrl) return;

    try {
        const healthRes = await fetch(`${apiUrl}/health`, {
            headers: { 'ngrok-skip-browser-warning': 'true' }
        });
        const healthData = await healthRes.json();

        if (healthRes.ok && healthData.status === "healthy") {
            document.getElementById("apiStatus").textContent = "Online";
            
            try {
                const statsRes = await fetch(`${apiUrl}/stats`, {
                    headers: { 'ngrok-skip-browser-warning': 'true' }
                });
                const statsData = await statsRes.json();
                
                if (statsRes.ok) {
                    document.getElementById("totalProducts").textContent = statsData.total_products || '-';
                    document.getElementById("totalCategories").textContent = statsData.total_categories || '-';
                }
            } catch (e) {
                console.error('Stats error:', e);
            }
        } else {
            document.getElementById("apiStatus").textContent = "Offline";
        }
    } catch (e) {
        console.error('Health check error:', e);
        document.getElementById("apiStatus").textContent = "Offline";
    }
}

// Event listeners
document.getElementById('apiUrl').addEventListener('blur', loadStats);

document.getElementById('searchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchProducts();
    }
});
