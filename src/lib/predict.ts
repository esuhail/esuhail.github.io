// A port of predict.py from esuhail/llm-bench, using the default efficiency.
// The live site learns efficiency from real benchmarks; this demo can't.

import type { Gpu } from "./gpus";

export type Model = { name: string; paramsB: number };

export const MODELS: Model[] = [
  { name: "Llama 3.2 3B", paramsB: 3.2 },
  { name: "Llama 3.1 8B", paramsB: 8.0 },
  { name: "Qwen 3 14B", paramsB: 14.8 },
  { name: "Gemma 3 27B", paramsB: 27.4 },
  { name: "Qwen 3 32B", paramsB: 32.8 },
  { name: "Llama 3.3 70B", paramsB: 70.6 },
];

const BITS_PER_WEIGHT = 4.85; // Q4_K_M average
const RUNTIME_GB = 0.5;
const CTX = 8192;
const EFFICIENCY = 0.55;
const SYSTEM_RAM_GBS = 40; // dual-channel DDR4
const PER_TOKEN_OVERHEAD_S = 0.001;

const weightsGb = (p: number) => (p * BITS_PER_WEIGHT) / 8;
const kvCacheGb = (p: number) => (128 * (p / 8) ** 0.42 * 1024 * CTX) / 1e9;

export type Prediction = { needGb: number; tokensPerSec: number; fits: boolean };

export function predict(gpu: Gpu, model: Model): Prediction {
  const w = weightsGb(model.paramsB);
  const kv = kvCacheGb(model.paramsB);
  const needGb = w + kv + RUNTIME_GB;

  if (needGb <= gpu.vramGb) {
    const t = w / (EFFICIENCY * gpu.bandwidthGbs) + PER_TOKEN_OVERHEAD_S;
    return { needGb, tokensPerSec: 1 / t, fits: true };
  }
  // Weights that don't fit in graphics memory are read from system RAM instead.
  const room = Math.max(0, gpu.vramGb - kv - RUNTIME_GB);
  const onGpu = Math.min(1, room / w);
  const t =
    (w * onGpu) / (EFFICIENCY * gpu.bandwidthGbs) +
    (w * (1 - onGpu)) / (EFFICIENCY * SYSTEM_RAM_GBS) +
    PER_TOKEN_OVERHEAD_S;
  return { needGb, tokensPerSec: 1 / t, fits: false };
}
