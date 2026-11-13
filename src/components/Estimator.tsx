import { useId, useMemo, useState, type CSSProperties } from "react";
import { ChevronDown, Gauge } from "lucide-react";
import { GPUS } from "../lib/gpus";
import { MODELS, predict } from "../lib/predict";
import { stagger } from "../lib/reveal";

const fmt = (tps: number) => (tps >= 10 ? Math.round(tps).toString() : tps.toFixed(1));

export default function Estimator() {
  const [gpuName, setGpuName] = useState("RX 6750 XT");
  const selectId = useId();
  const gpu = GPUS.find((g) => g.name === gpuName)!;

  const rows = useMemo(() => MODELS.map((m) => ({ model: m, ...predict(gpu, m) })), [gpu]);
  // Bars are scaled to the fastest model on this card, so the shape of the
  // list is what you compare, not the absolute numbers.
  const max = Math.max(...rows.map((r) => r.tokensPerSec));

  return (
    <div className="estimator">
      <div className="estimator-side">
        <div className="estimator-head">
          <span className="icon-tile" aria-hidden="true">
            <Gauge size={20} strokeWidth={1.5} />
          </span>
          <div>
            <h4>Try the estimator</h4>
            <p>The same formula LLM Bench uses, running in your browser with the default efficiency.</p>
          </div>
        </div>

        <div className="field">
          <label htmlFor={selectId}>Graphics card</label>
          <div className="select">
            <select id={selectId} value={gpuName} onChange={(e) => setGpuName(e.target.value)}>
              {GPUS.map((g) => (
                <option key={g.name} value={g.name}>{g.name}</option>
              ))}
            </select>
            <ChevronDown size={18} strokeWidth={1.75} aria-hidden="true" />
          </div>
          <p className="field-hint">
            {gpu.vramGb} GB of graphics memory, {gpu.bandwidthGbs} GB/s memory speed
          </p>
        </div>
      </div>

      <ul className="estimates" data-reveal="stagger" aria-label={`Estimated speed on ${gpu.name}`}>
        {rows.map((r, i) => (
          <li key={r.model.name} className={r.fits ? "" : "is-rough"} style={stagger(i)}>
            <div className="estimate-top">
              <span className="estimate-model">{r.model.name}</span>
              <span className="estimate-speed">
                {fmt(r.tokensPerSec)} <span>tokens/s</span>
              </span>
            </div>
            <div className="bar" aria-hidden="true">
              <span style={{ "--w": `${Math.max(1.5, (r.tokensPerSec / max) * 100)}%` } as CSSProperties} />
            </div>
            <div className="estimate-meta">
              <span>Needs {r.needGb.toFixed(1)} GB</span>
              <span>{r.fits ? "Fits, ±20%" : "Rough, spills into RAM"}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
