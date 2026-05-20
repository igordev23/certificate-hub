import { useState, useRef, useEffect, useCallback } from "react";
import { Copy, Check, ChevronDown } from "lucide-react";
import "./color-picker.css";

/* ─── Color conversion utilities ─── */

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const num = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((v) => {
        const hex = Math.round(Math.max(0, Math.min(255, v))).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const rn = r / 255,
    gn = g / 255,
    bn = b / 255;
  const max = Math.max(rn, gn, bn),
    min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, Math.round(l * 100)];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
  else if (max === gn) h = ((bn - rn) / d + 2) / 6;
  else h = ((rn - gn) / d + 4) / 6;
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const sn = s / 100,
    ln = l / 100;
  if (sn === 0) {
    const v = Math.round(ln * 255);
    return [v, v, v];
  }
  const hue2rgb = (p: number, q: number, t: number) => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };
  const q = ln < 0.5 ? ln * (1 + sn) : ln + sn - ln * sn;
  const p = 2 * ln - q;
  const hn = h / 360;
  return [
    Math.round(hue2rgb(p, q, hn + 1 / 3) * 255),
    Math.round(hue2rgb(p, q, hn) * 255),
    Math.round(hue2rgb(p, q, hn - 1 / 3) * 255),
  ];
}

/* ─── Types ─── */

interface ColorPickerProps {
  value: string;
  onChange: (hex: string) => void;
  presets?: { name: string; value: string }[];
  label?: string;
}

type ColorMode = "rgb" | "hsl";

/* ─── Component ─── */

export function ColorPicker({ value, onChange, presets, label }: ColorPickerProps) {
  const [open, setOpen] = useState(false);
  const [initialColor] = useState(value);
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<ColorMode>("rgb");
  const [hexInput, setHexInput] = useState(value);

  // Derived state
  const [r, g, b] = hexToRgb(value);
  const [h, s, l] = rgbToHsl(r, g, b);

  // Refs
  const spectrumRef = useRef<HTMLCanvasElement>(null);
  const hueRef = useRef<HTMLCanvasElement>(null);
  const spectrumDragging = useRef(false);
  const hueDragging = useRef(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Keep hex input in sync when value changes externally
  useEffect(() => {
    setHexInput(value);
  }, [value]);

  /* ─── Draw spectrum (saturation × lightness for current hue) ─── */
  const drawSpectrum = useCallback(() => {
    const canvas = spectrumRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const hh = canvas.height;

    // White → Hue horizontal gradient
    const hueColor = `hsl(${h}, 100%, 50%)`;
    const gradH = ctx.createLinearGradient(0, 0, w, 0);
    gradH.addColorStop(0, "#ffffff");
    gradH.addColorStop(1, hueColor);
    ctx.fillStyle = gradH;
    ctx.fillRect(0, 0, w, hh);

    // Black → transparent vertical gradient
    const gradV = ctx.createLinearGradient(0, 0, 0, hh);
    gradV.addColorStop(0, "rgba(0,0,0,0)");
    gradV.addColorStop(1, "rgba(0,0,0,1)");
    ctx.fillStyle = gradV;
    ctx.fillRect(0, 0, w, hh);
  }, [h]);

  /* ─── Draw hue bar ─── */
  const drawHueBar = useCallback(() => {
    const canvas = hueRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const hh = canvas.height;
    const grad = ctx.createLinearGradient(0, 0, w, 0);
    for (let i = 0; i <= 360; i += 30) {
      grad.addColorStop(i / 360, `hsl(${i}, 100%, 50%)`);
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, hh);
  }, []);

  useEffect(() => {
    drawSpectrum();
  }, [drawSpectrum, open]);

  useEffect(() => {
    drawHueBar();
  }, [drawHueBar, open]);

  /* ─── Spectrum interaction ─── */
  const pickFromSpectrum = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = spectrumRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));

      // x → saturation (0=0%, 1=100%), y → value/brightness (0=100%, 1=0%)
      const sat = x * 100;
      const val = (1 - y) * 100;

      // Convert HSV → HSL
      const sHsv = sat / 100;
      const vHsv = val / 100;
      const lHsl = vHsv * (1 - sHsv / 2);
      const sHsl = lHsl === 0 || lHsl === 1 ? 0 : (vHsv - lHsl) / Math.min(lHsl, 1 - lHsl);

      const rgb = hslToRgb(h, Math.round(sHsl * 100), Math.round(lHsl * 100));
      onChange(rgbToHex(...rgb));
    },
    [h, onChange],
  );

  const onSpectrumDown = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      spectrumDragging.current = true;
      const pt = "touches" in e ? e.touches[0] : e;
      pickFromSpectrum(pt.clientX, pt.clientY);
    },
    [pickFromSpectrum],
  );

  /* ─── Hue bar interaction ─── */
  const pickFromHue = useCallback(
    (clientX: number) => {
      const canvas = hueRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const newHue = Math.round(x * 360);
      const rgb = hslToRgb(newHue, s, l);
      onChange(rgbToHex(...rgb));
    },
    [s, l, onChange],
  );

  const onHueDown = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      hueDragging.current = true;
      const pt = "touches" in e ? e.touches[0] : e;
      pickFromHue(pt.clientX);
    },
    [pickFromHue],
  );

  /* ─── Global mouse/touch move & up ─── */
  useEffect(() => {
    if (!open) return;

    const onMove = (e: MouseEvent | TouchEvent) => {
      const pt = "touches" in e ? e.touches[0] : e;
      if (spectrumDragging.current) {
        e.preventDefault();
        pickFromSpectrum(pt.clientX, pt.clientY);
      }
      if (hueDragging.current) {
        e.preventDefault();
        pickFromHue(pt.clientX);
      }
    };

    const onUp = () => {
      spectrumDragging.current = false;
      hueDragging.current = false;
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [open, pickFromSpectrum, pickFromHue]);

  /* ─── Spectrum cursor position ─── */
  const getSpectrumCursorPos = () => {
    // Convert current HSL → HSV for positioning
    const sHsl = s / 100;
    const lHsl = l / 100;
    const v = lHsl + sHsl * Math.min(lHsl, 1 - lHsl);
    const sHsv = v === 0 ? 0 : 2 * (1 - lHsl / v);

    return {
      left: `${sHsv * 100}%`,
      top: `${(1 - v) * 100}%`,
    };
  };

  /* ─── Handlers ─── */
  const handleHexInput = (val: string) => {
    setHexInput(val);
    const clean = val.replace("#", "");
    if (/^[0-9a-fA-F]{6}$/.test(clean)) {
      onChange("#" + clean);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value.toUpperCase());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const setRgbChannel = (channel: "r" | "g" | "b", val: number) => {
    const clamped = Math.max(0, Math.min(255, val || 0));
    const nr = channel === "r" ? clamped : r;
    const ng = channel === "g" ? clamped : g;
    const nb = channel === "b" ? clamped : b;
    onChange(rgbToHex(nr, ng, nb));
  };

  const setHslChannel = (channel: "h" | "s" | "l", val: number) => {
    const nh = channel === "h" ? Math.max(0, Math.min(360, val || 0)) : h;
    const ns = channel === "s" ? Math.max(0, Math.min(100, val || 0)) : s;
    const nl = channel === "l" ? Math.max(0, Math.min(100, val || 0)) : l;
    const rgb = hslToRgb(nh, ns, nl);
    onChange(rgbToHex(...rgb));
  };

  const cursorPos = getSpectrumCursorPos();

  return (
    <div className="cp-wrapper" ref={wrapperRef}>
      {/* Trigger Button */}
      <button type="button" className="cp-trigger" onClick={() => setOpen(!open)}>
        <div className="cp-trigger-swatch" style={{ backgroundColor: value }} />
        {label && <span className="cp-trigger-label">{label}</span>}
        <span className="cp-trigger-hex">{value.toUpperCase()}</span>
        <ChevronDown
          className="w-3.5 h-3.5 text-muted-foreground transition-transform"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      {/* Backdrop */}
      {open && <div className="cp-backdrop" onClick={() => setOpen(false)} />}

      {/* Popover */}
      {open && (
        <div className="cp-popover">
          {/* Spectrum */}
          <div
            className="cp-spectrum-wrap"
            onMouseDown={onSpectrumDown}
            onTouchStart={onSpectrumDown}
          >
            <canvas ref={spectrumRef} className="cp-spectrum-canvas" width={280} height={160} />
            <div
              className="cp-spectrum-cursor"
              style={{
                left: cursorPos.left,
                top: cursorPos.top,
                backgroundColor: value,
              }}
            />
          </div>

          {/* Hue Bar */}
          <div className="cp-hue-wrap" onMouseDown={onHueDown} onTouchStart={onHueDown}>
            <canvas ref={hueRef} className="cp-hue-canvas" width={280} height={14} />
            <div
              className="cp-hue-thumb"
              style={{
                left: `${(h / 360) * 100}%`,
                backgroundColor: `hsl(${h}, 100%, 50%)`,
              }}
            />
          </div>

          {/* Preview */}
          <div className="cp-preview-row">
            <div
              className="cp-preview-swatch cp-preview-swatch--old"
              style={{ backgroundColor: initialColor }}
              title="Cor anterior"
            />
            <span className="cp-preview-arrow">→</span>
            <div
              className="cp-preview-swatch"
              style={{ backgroundColor: value }}
              title="Cor atual"
            />

            {/* Hex Input */}
            <div className="cp-hex-row" style={{ flex: 1, marginBottom: 0 }}>
              <input
                className="cp-hex-input"
                value={hexInput.toUpperCase()}
                onChange={(e) => handleHexInput(e.target.value)}
                maxLength={7}
                spellCheck={false}
              />
              <button
                type="button"
                className={`cp-copy-btn ${copied ? "cp-copy-btn--copied" : ""}`}
                onClick={handleCopy}
                title="Copiar código"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>

          {/* Mode Tabs */}
          <div className="cp-mode-tabs">
            <button
              type="button"
              className={`cp-mode-tab ${mode === "rgb" ? "cp-mode-tab--active" : ""}`}
              onClick={() => setMode("rgb")}
            >
              RGB
            </button>
            <button
              type="button"
              className={`cp-mode-tab ${mode === "hsl" ? "cp-mode-tab--active" : ""}`}
              onClick={() => setMode("hsl")}
            >
              HSL
            </button>
          </div>

          {/* Channel Sliders */}
          <div className="cp-channels">
            {mode === "rgb" ? (
              <>
                <div className="cp-channel">
                  <span className="cp-channel-label">R</span>
                  <input
                    type="range"
                    min={0}
                    max={255}
                    value={r}
                    onChange={(e) => setRgbChannel("r", Number(e.target.value))}
                    className="cp-channel-slider cp-channel-slider--r"
                  />
                  <input
                    type="number"
                    min={0}
                    max={255}
                    value={r}
                    onChange={(e) => setRgbChannel("r", Number(e.target.value))}
                    className="cp-channel-input"
                  />
                </div>
                <div className="cp-channel">
                  <span className="cp-channel-label">G</span>
                  <input
                    type="range"
                    min={0}
                    max={255}
                    value={g}
                    onChange={(e) => setRgbChannel("g", Number(e.target.value))}
                    className="cp-channel-slider cp-channel-slider--g"
                  />
                  <input
                    type="number"
                    min={0}
                    max={255}
                    value={g}
                    onChange={(e) => setRgbChannel("g", Number(e.target.value))}
                    className="cp-channel-input"
                  />
                </div>
                <div className="cp-channel">
                  <span className="cp-channel-label">B</span>
                  <input
                    type="range"
                    min={0}
                    max={255}
                    value={b}
                    onChange={(e) => setRgbChannel("b", Number(e.target.value))}
                    className="cp-channel-slider cp-channel-slider--b"
                  />
                  <input
                    type="number"
                    min={0}
                    max={255}
                    value={b}
                    onChange={(e) => setRgbChannel("b", Number(e.target.value))}
                    className="cp-channel-input"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="cp-channel">
                  <span className="cp-channel-label">H</span>
                  <input
                    type="range"
                    min={0}
                    max={360}
                    value={h}
                    onChange={(e) => setHslChannel("h", Number(e.target.value))}
                    className="cp-channel-slider cp-channel-slider--h"
                  />
                  <input
                    type="number"
                    min={0}
                    max={360}
                    value={h}
                    onChange={(e) => setHslChannel("h", Number(e.target.value))}
                    className="cp-channel-input"
                  />
                </div>
                <div className="cp-channel">
                  <span className="cp-channel-label">S</span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={s}
                    onChange={(e) => setHslChannel("s", Number(e.target.value))}
                    className="cp-channel-slider cp-channel-slider--s"
                  />
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={s}
                    onChange={(e) => setHslChannel("s", Number(e.target.value))}
                    className="cp-channel-input"
                  />
                </div>
                <div className="cp-channel">
                  <span className="cp-channel-label">L</span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={l}
                    onChange={(e) => setHslChannel("l", Number(e.target.value))}
                    className="cp-channel-slider cp-channel-slider--l"
                  />
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={l}
                    onChange={(e) => setHslChannel("l", Number(e.target.value))}
                    className="cp-channel-input"
                  />
                </div>
              </>
            )}
          </div>

          {/* Presets */}
          {presets && presets.length > 0 && (
            <div>
              <div className="cp-presets-label">Paleta rápida</div>
              <div className="cp-presets-grid">
                {presets.map((p) => (
                  <button
                    type="button"
                    key={p.value}
                    title={p.name}
                    className={`cp-preset-btn ${value.toLowerCase() === p.value.toLowerCase() ? "cp-preset-btn--active" : ""}`}
                    style={{ backgroundColor: p.value }}
                    onClick={() => onChange(p.value)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
