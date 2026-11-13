// Three small enhancements. The page reads fine without any of them.
//  1. The LLM Bench speed estimator (a port of predict.py from esuhail/llm-bench)
//  2. "Updated ..." dates and latest activity, fetched live from the GitHub API
//  3. Highlighting the current section in the sticky nav

"use strict";

/* ---------- 1. Estimator ---------- */

// Reference GPU specs, copied from llm-bench/data/gpus.json.
const GPUS = [{"name":"RTX 5090","bandwidth_gbs":1792,"vram_gb":32},{"name":"RTX 5080","bandwidth_gbs":960,"vram_gb":16},{"name":"RTX 5070 Ti","bandwidth_gbs":896,"vram_gb":16},{"name":"RTX 5070","bandwidth_gbs":672,"vram_gb":12},{"name":"RTX 5060 Ti","bandwidth_gbs":448,"vram_gb":16},{"name":"RTX 4090","bandwidth_gbs":1008,"vram_gb":24},{"name":"RTX 4080 SUPER","bandwidth_gbs":736,"vram_gb":16},{"name":"RTX 4080","bandwidth_gbs":717,"vram_gb":16},{"name":"RTX 4070 Ti","bandwidth_gbs":504,"vram_gb":12},{"name":"RTX 4070","bandwidth_gbs":504,"vram_gb":12},{"name":"RTX 4060 Ti","bandwidth_gbs":288,"vram_gb":8},{"name":"RTX 4060","bandwidth_gbs":272,"vram_gb":8},{"name":"RTX 3090","bandwidth_gbs":936,"vram_gb":24},{"name":"RTX 3080","bandwidth_gbs":760,"vram_gb":10},{"name":"RTX 3070","bandwidth_gbs":448,"vram_gb":8},{"name":"RTX 3060 Ti","bandwidth_gbs":448,"vram_gb":8},{"name":"RTX 3060","bandwidth_gbs":360,"vram_gb":12},{"name":"RTX 2080 Ti","bandwidth_gbs":616,"vram_gb":11},{"name":"RTX 2060","bandwidth_gbs":336,"vram_gb":6},{"name":"RX 7900 XTX","bandwidth_gbs":960,"vram_gb":24},{"name":"RX 7900 XT","bandwidth_gbs":800,"vram_gb":20},{"name":"RX 7800 XT","bandwidth_gbs":624,"vram_gb":16},{"name":"RX 7700 XT","bandwidth_gbs":432,"vram_gb":12},{"name":"RX 7600","bandwidth_gbs":288,"vram_gb":8},{"name":"RX 6950 XT","bandwidth_gbs":576,"vram_gb":16},{"name":"RX 6900 XT","bandwidth_gbs":512,"vram_gb":16},{"name":"RX 6800 XT","bandwidth_gbs":512,"vram_gb":16},{"name":"RX 6800","bandwidth_gbs":512,"vram_gb":16},{"name":"RX 6750 XT","bandwidth_gbs":432,"vram_gb":12},{"name":"RX 6700 XT","bandwidth_gbs":384,"vram_gb":12},{"name":"RX 6600 XT","bandwidth_gbs":256,"vram_gb":8},{"name":"RX 6600","bandwidth_gbs":224,"vram_gb":8},{"name":"Arc A770","bandwidth_gbs":560,"vram_gb":16},{"name":"Arc A750","bandwidth_gbs":512,"vram_gb":8}];

// A spread of dense models from small to large (parameter counts in billions).
const MODELS = [
  { name: "Llama 3.2 3B", params: 3.2 },
  { name: "Llama 3.1 8B", params: 8.0 },
  { name: "Qwen 3 14B", params: 14.8 },
  { name: "Gemma 3 27B", params: 27.4 },
  { name: "Qwen 3 32B", params: 32.8 },
  { name: "Llama 3.3 70B", params: 70.6 },
];

// Constants from predict.py.
const BITS_PER_WEIGHT = 4.85;      // Q4_K_M average
const RUNTIME_GB = 0.5;
const CTX = 8192;
const EFFICIENCY = 0.55;           // default until real benchmarks exist
const SYSTEM_RAM_GBS = 40;         // dual-channel DDR4
const PER_TOKEN_OVERHEAD_S = 0.001;

const weightsGb = (params) => params * BITS_PER_WEIGHT / 8;
const kvCacheGb = (params) => 128 * (params / 8) ** 0.42 * 1024 * CTX / 1e9;

function predict(gpu, model) {
  const w = weightsGb(model.params);
  const kv = kvCacheGb(model.params);
  const need = w + kv + RUNTIME_GB;
  if (need <= gpu.vram_gb) {
    const tps = 1 / (w / (EFFICIENCY * gpu.bandwidth_gbs) + PER_TOKEN_OVERHEAD_S);
    return { need, tps, fits: true };
  }
  // Weights that don't fit in graphics memory are read from system RAM instead.
  const room = Math.max(0, gpu.vram_gb - kv - RUNTIME_GB);
  const onGpu = Math.min(1, room / w);
  const t = (w * onGpu) / (EFFICIENCY * gpu.bandwidth_gbs) +
            (w * (1 - onGpu)) / (EFFICIENCY * SYSTEM_RAM_GBS) + PER_TOKEN_OVERHEAD_S;
  return { need, tps: 1 / t, fits: false };
}

function speedLabel(tps) {
  return tps >= 10 ? `${Math.round(tps)} tokens/s` : `${tps.toFixed(1)} tokens/s`;
}

function initEstimator() {
  const select = document.getElementById("gpu");
  const spec = document.getElementById("gpu-spec");
  const body = document.getElementById("estimates");
  if (!select || !body) return;

  for (const g of GPUS) select.add(new Option(g.name, g.name, false, g.name === "RX 6750 XT"));

  const render = () => {
    const gpu = GPUS.find((g) => g.name === select.value);
    spec.textContent = `${gpu.vram_gb} GB of graphics memory, ${gpu.bandwidth_gbs} GB/s memory speed`;
    body.replaceChildren(...MODELS.map((m) => {
      const p = predict(gpu, m);
      const tr = document.createElement("tr");
      if (!p.fits) tr.className = "rough";
      tr.innerHTML = `
        <td class="model"></td>
        <td>${p.need.toFixed(1)} GB<small>${p.fits ? "fits" : "doesn't fit"}</small></td>
        <td class="speed">${speedLabel(p.tps)}<small>${p.fits ? "&plusmn;20%" : "rough"}</small></td>`;
      tr.querySelector(".model").textContent = m.name;
      return tr;
    }));
  };
  select.addEventListener("change", render);
  render();
}

/* ---------- 2. Live GitHub data ---------- */

const USER = "esuhail";

function timeAgo(iso) {
  const s = (Date.now() - new Date(iso)) / 1000;
  const units = [["year", 31536000], ["month", 2592000], ["week", 604800], ["day", 86400], ["hour", 3600], ["minute", 60]];
  for (const [unit, secs] of units) {
    const n = Math.floor(s / secs);
    if (n >= 1) return `${n} ${unit}${n > 1 ? "s" : ""} ago`;
  }
  return "just now";
}

// Unauthenticated GitHub API calls are limited to 60 an hour per visitor,
// so results are cached for the browser session. Storage can throw in
// private modes, which just means no caching.
async function getJson(url) {
  const key = `gh:${url}`;
  try {
    const hit = sessionStorage.getItem(key);
    if (hit) return JSON.parse(hit);
  } catch {}
  const res = await fetch(url, { headers: { Accept: "application/vnd.github+json" } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  const data = await res.json();
  try { sessionStorage.setItem(key, JSON.stringify(data)); } catch {}
  return data;
}

function initGithub() {
  for (const el of document.querySelectorAll("[data-repo]")) {
    const slot = el.querySelector("[data-updated]");
    if (!slot) continue;
    getJson(`https://api.github.com/repos/${USER}/${el.dataset.repo}`)
      .then((r) => {
        const t = document.createElement("time");
        t.dateTime = r.pushed_at;
        t.title = new Date(r.pushed_at).toLocaleString();
        t.textContent = timeAgo(r.pushed_at);
        slot.append("Last pushed ", t);
      })
      .catch(() => {});
  }

  const latest = document.getElementById("latest");
  getJson(`https://api.github.com/users/${USER}/events/public?per_page=30`)
    .then((events) => {
      const push = events.find((e) => e.type === "PushEvent");
      if (!push) return;
      const repo = push.repo.name.split("/")[1];
      const a = document.createElement("a");
      a.href = `https://github.com/${push.repo.name}`;
      a.textContent = repo;
      latest.append("Last pushed code to ", a, `, ${timeAgo(push.created_at)}.`);
      latest.hidden = false;
    })
    .catch(() => {});
}

/* ---------- 3. Current section in the nav ---------- */

function initToc() {
  const links = [...document.querySelectorAll(".toc a")];
  const byId = new Map(links.map((a) => [a.hash.slice(1), a]));
  const targets = [...byId.keys()].map((id) => document.getElementById(id)).filter(Boolean);
  if (!("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      links.forEach((a) => a.removeAttribute("aria-current"));
      byId.get(e.target.id)?.setAttribute("aria-current", "true");
    }
  }, { rootMargin: "-45% 0px -50% 0px" });
  targets.forEach((t) => io.observe(t));
}

initEstimator();
initGithub();
initToc();
