import { describe, expect, it } from "vitest";
import { GPUS } from "./gpus";
import { MODELS, predict } from "./predict";

// Expected values come from running predict.py in esuhail/llm-bench
// with efficiency 0.55 on an RX 6750 XT.
const rx6750 = GPUS.find((g) => g.name === "RX 6750 XT")!;
const cases: [string, number, number, boolean][] = [
  ["Llama 3.2 3B", 3.2, 109.1, true],
  ["Llama 3.1 8B", 6.4, 46.7, true],
  ["Qwen 3 14B", 10.9, 25.8, true],
  ["Gemma 3 27B", 18.9, 2.8, false],
  ["Qwen 3 32B", 22.3, 2.0, false],
  ["Llama 3.3 70B", 46.0, 0.6, false],
];

describe("predict matches the Python version", () => {
  it.each(cases)("%s", (name, needGb, tps, fits) => {
    const p = predict(rx6750, MODELS.find((m) => m.name === name)!);
    expect(p.needGb).toBeCloseTo(needGb, 1);
    expect(p.tokensPerSec).toBeCloseTo(tps, 1);
    expect(p.fits).toBe(fits);
  });
});

describe("predict", () => {
  it("never reports a model that needs more memory than the card has as fitting", () => {
    for (const g of GPUS) for (const m of MODELS) {
      const p = predict(g, m);
      expect(p.fits).toBe(p.needGb <= g.vramGb);
    }
  });

  it("is faster on a card with more bandwidth when the model fits on both", () => {
    const slow = GPUS.find((g) => g.name === "RTX 3060")!;
    const fast = GPUS.find((g) => g.name === "RTX 4090")!;
    const m = MODELS[1];
    expect(predict(fast, m).tokensPerSec).toBeGreaterThan(predict(slow, m).tokensPerSec);
  });
});
