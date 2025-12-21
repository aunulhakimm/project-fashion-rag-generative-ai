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

// Clean repetitive text
function cleanRepetitiveText(text) {
    // Remove excessive repetition (more than 3 same words in a row)
    const words = text.split(' ');
    const cleaned = [];
    let repeatCount = 1;
    let lastWord = '';
    
    for (let word of words) {
        if (word.toLowerCase() === lastWord.toLowerCase()) {
            repeatCount++;
            if (repeatCount <= 2) {
                cleaned.push(word);
            }
        } else {
            repeatCount = 1;
            cleaned.push(word);
        }
        lastWord = word;
    }
    
    return cleaned.join(' ').substring(0, 500); // Max 500 chars
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
            <svg width="280" height="280" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#1a1a1a;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#2d2d2d;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <rect width="280" height="280" fill="url(#grad)"/>
                <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
                      font-family="Futura, Arial, sans-serif" font-size="14" fill="white" 
                      letter-spacing="2" style="text-transform:uppercase">
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
            const cleanedDescription = cleanRepetitiveText(data.description);
            document.getElementById('description').textContent = cleanedDescription;
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
            const cleanedDescription = cleanRepetitiveText(data.description);
            document.getElementById('description').textContent = cleanedDescription;
            document.getElementById('descriptionBox').style.display = 'block';
            loadStats();
            
            if (data.retrieval_results) {
                displayProducts(data.retrieval_results);
            } else {
                document.getElementById('productsGrid').innerHTML = '<p style="text-align:center;color:#666;font-family:Futura,sans-serif;letter-spacing:1px;">Pipeline completed successfully!</p>';
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
            document.getElementById("apiStatus").innerHTML = '<i class="fas fa-check-circle"></i> Online';
            
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
            document.getElementById("apiStatus").innerHTML = '<i class="fas fa-times-circle"></i> Offline';
        }
    } catch (e) {
        console.error('Health check error:', e);
        document.getElementById("apiStatus").innerHTML = '<i class="fas fa-times-circle"></i> Offline';
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    loadStats();
});

document.getElementById('apiUrl').addEventListener('blur', loadStats);

document.getElementById('searchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchProducts();
    }
});
