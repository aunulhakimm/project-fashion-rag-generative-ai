// UI component helpers for rendering search and generated image results

export function renderItems(items) {
  const container = document.getElementById("results");
  if (!container) return;

  container.innerHTML = `
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      ${items.map((i, idx) => `
        <div class="result-card card-hover animate-pop" style="animation-delay: ${idx * 80}ms;">
          <div class="relative overflow-hidden card-image" style="height: 240px;">
            <img 
              src="http://127.0.0.1:5000/images/${i.image}" 
              class="w-full h-full object-cover"
              alt="${i.display_name || ''}"
            />
          </div>
          <div class="p-4">
            <div class="flex items-start justify-between mb-2">
              <h3 class="font-bold text-base flex-1" style="color: rgb(43, 43, 43);">
                ${i.display_name || 'Untitled'}
              </h3>
              <span class="score-badge ml-2">${(i.score || 0).toFixed(2)}</span>
            </div>
            <p class="text-xs font-semibold mb-2" style="color: rgb(216, 208, 200);">
              ${i.category || 'Unknown'}
            </p>
            <p class="text-sm text-gray-600 leading-relaxed">
              ${i.description || 'No description available'}
            </p>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

export function renderGenerated(data) {
  const container = document.getElementById("results");
  if (!container) return;

  const imgSrc = data.generated_image || data.image || "";
  container.innerHTML = `
    <div class="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
      <div class="text-center">
        <img 
          id="generated-img" 
          src="${imgSrc}" 
          alt="Generated image" 
          class="rounded-xl mb-4 max-w-full h-auto inline-block shadow-lg"
        />
        <div id="img-meta" class="text-sm font-semibold mb-3" style="color: rgb(216, 208, 200);"></div>
        <p class="text-base text-gray-700 font-medium mb-4">
          ${data.prompt || ''}
        </p>
        ${data.recommendation ? `
          <div class="mt-6 p-6 rounded-xl text-left" style="background: rgb(216, 208, 200);">
            <h3 class="font-bold text-lg mb-3" style="color: rgb(43, 43, 43);">
              <svg class="inline w-6 h-6 mr-2 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
              Recommendation
            </h3>
            <p class="text-base leading-relaxed" style="color: rgb(43, 43, 43);">
              ${data.recommendation}
            </p>
          </div>
        ` : ''}
      </div>
    </div>
  `;

  const imgEl = document.getElementById('generated-img');
  if (imgEl) {
    imgEl.onload = function() {
      const meta = document.getElementById('img-meta');
      if (meta) meta.textContent = `📐 ${this.naturalWidth} × ${this.naturalHeight}px`;
    };
  }
}