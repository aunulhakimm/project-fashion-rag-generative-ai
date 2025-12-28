import { renderItems, renderGenerated } from './components.js';

const API = "http://127.0.0.1:5000";

function showLoading(on = true) {
  const el = document.getElementById('loading');
  if (!el) return;
  if (on) el.classList.remove('hidden'); else el.classList.add('hidden');
}

async function runEndpoint() {
  const mode = document.getElementById("mode").value;
  const query = document.getElementById("query").value;
  const image = document.getElementById("image").files[0];

  document.getElementById("results").innerHTML = "";
  showLoading(true);

  try {
    let res;

    if (mode === "text") {
      res = await fetch(`${API}/search/text`, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({query})
      });
      const items = await res.json();
      renderItems(items);
    }

    if (mode === "image") {
      const fd = new FormData();
      fd.append("image", image);
      res = await fetch(`${API}/search/image`, {method:"POST", body: fd});
      const items = await res.json();
      renderItems(items);
    }

    if (mode === "multimodal") {
      const fd = new FormData();
      fd.append("query", query);
      fd.append("image", image);
      res = await fetch(`${API}/search/multimodal`, {method:"POST", body: fd});
      const items = await res.json();
      renderItems(items);
    }

    if (mode === "rag") {
      res = await fetch(`${API}/rag/recommend`, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({query, items: []})
      });
      const data = await res.json();
      document.getElementById("results").innerHTML = `
        <div class="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
          <h2 class="font-bold text-2xl mb-4" style="color: rgb(43, 43, 43);">
            <svg class="inline w-8 h-8 mr-2 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
            Recommendation
          </h2>
          <p class="text-base text-gray-700 leading-relaxed">${data.recommendation}</p>
        </div>
      `;
    }

    if (mode === "generate") {
      res = await fetch(`${API}/generate/image`, {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({prompt: query})
      });
      const data = await res.json();
      renderGenerated(data);
    }
  } catch (err) {
    console.error(err);
    document.getElementById('results').innerHTML = `
      <div class="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
        <div class="flex items-center text-red-700">
          <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span class="font-semibold">Error: ${err.message}</span>
        </div>
      </div>
    `;
  } finally {
    showLoading(false);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('run-btn');
  if (btn) btn.addEventListener('click', runEndpoint);
  
  // Header entrance animations (staggered)
  try {
    const logoWrap = document.querySelector('.header-logo');
    const title = document.querySelector('h1');
    const subtitle = document.querySelector('.text-gray-600');
    const controls = document.querySelectorAll('.bg-gray-50');

    setTimeout(() => logoWrap && logoWrap.classList.add('animate-fade-up'), 100);
    setTimeout(() => title && title.classList.add('animate-fade-up'), 220);
    setTimeout(() => subtitle && subtitle.classList.add('animate-fade-up'), 340);

    // animate control blocks slightly staggered
    controls.forEach((c, i) => {
      setTimeout(() => c.classList.add('animate-fade-up'), 420 + i * 80);
    });

    // animate primary button
    if (btn) setTimeout(() => btn.classList.add('animate-pulse'), 720);
  } catch (e) {
    // non-critical; silently ignore
  }
});