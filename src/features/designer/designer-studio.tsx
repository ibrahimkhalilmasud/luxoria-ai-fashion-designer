"use client";

import { useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import QRCode from "qrcode";
import { motion } from "framer-motion";
import { closures, fabrics, layers, lengths, necklines, silhouettes, sleeves } from "@/features/designer/options";
import { deriveGarmentFromBrief } from "@/features/designer/assistant";
import { exportCanvasPng, exportPatternSvg, exportProjectJson, exportTechPackPdfFallback } from "@/features/exports/exporters";
import { generatePattern, toFlatPatternSvg } from "@/features/patterns/generator";
import { getSketchPath, getStitchGuidePath } from "@/features/designer/sketch";
import { useDesignerStore } from "@/store/useDesignerStore";
import { getFabricSuggestion, validateFabricUpload } from "@/utils/fabric";

const ThreeViewer = dynamic(() => import("@/components/three-viewer").then((m) => m.ThreeViewer), { ssr: false });

const selectClasses = "w-full rounded border border-zinc-700 bg-zinc-950 px-2 py-1 text-sm text-zinc-200";

export function DesignerStudio() {
  const {
    garment,
    seamAllowanceCm,
    sketchView,
    projectName,
    setProjectName,
    setSketchView,
    setSeamAllowance,
    updateGarment,
    updateMeasurements,
    applyPreset,
    saveProject,
  } = useDesignerStore();

  const [uploadMessage, setUploadMessage] = useState<string>("");
  const [shareQr, setShareQr] = useState<string>("");
  const [designBrief, setDesignBrief] = useState<string>("");
  const [assistantMessage, setAssistantMessage] = useState<string>("");
  const sketchRef = useRef<SVGSVGElement>(null);

  const pattern = useMemo(() => generatePattern(garment, seamAllowanceCm), [garment, seamAllowanceCm]);
  const patternSvg = useMemo(() => toFlatPatternSvg(pattern), [pattern]);

  const fabricSuggestion = getFabricSuggestion(garment.fabric.type);

  async function onFabricUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const result = validateFabricUpload(file);
    if (!result.valid) {
      setUploadMessage(result.reason ?? "Invalid file.");
      return;
    }
    const url = URL.createObjectURL(file);
    updateGarment("fabric", { ...garment.fabric, textureUrl: url });
    setUploadMessage("Fabric uploaded successfully.");
  }

  async function generateShareLink() {
    const payload = encodeURIComponent(
      btoa(unescape(encodeURIComponent(JSON.stringify({ garment, seamAllowanceCm, sketchView })))),
    );
    const shareUrl = `${window.location.origin}/?project=${payload}`;
    setShareQr(await QRCode.toDataURL(shareUrl));
    await navigator.clipboard.writeText(shareUrl);
  }

  function applyAssistantBrief() {
    if (!designBrief.trim()) {
      setAssistantMessage("Enter a client brief to auto-configure the design.");
      return;
    }
    const { nextGarment, matchedRules } = deriveGarmentFromBrief(designBrief, garment);
    if (matchedRules.length === 0) {
      setAssistantMessage("No strong style cues found. Add details like silhouette, sleeves, fabric, or mood.");
      return;
    }
    updateGarment("silhouette", nextGarment.silhouette);
    updateGarment("sleeves", nextGarment.sleeves);
    updateGarment("neckline", nextGarment.neckline);
    updateGarment("length", nextGarment.length);
    updateGarment("closure", nextGarment.closure);
    updateGarment("layers", nextGarment.layers);
    updateGarment("fabric", nextGarment.fabric);
    setAssistantMessage(`Applied ${matchedRules.length} AI style rules: ${matchedRules.join(" • ")}`);
  }

  return (
    <div className="grid min-h-screen grid-cols-1 gap-4 bg-zinc-950 p-4 text-zinc-100 lg:grid-cols-[310px_1fr_350px]">
      <aside className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
        <h2 className="mb-3 text-lg font-semibold text-amber-300">Design Studio</h2>
        <div className="space-y-3">
          <div className="rounded border border-zinc-700 bg-zinc-950/80 p-2">
            <p className="mb-1 text-xs font-semibold text-amber-300">AI Client Brief Assistant</p>
            <textarea
              className="h-24 w-full rounded border border-zinc-700 bg-zinc-950 px-2 py-1 text-sm text-zinc-200"
              placeholder="Describe the desired dress style, event, coverage, and mood..."
              value={designBrief}
              onChange={(event) => setDesignBrief(event.target.value)}
            />
            <button className="mt-2 w-full rounded bg-amber-500 px-2 py-1 text-sm font-semibold text-black" onClick={applyAssistantBrief}>
              Apply AI Brief
            </button>
            {assistantMessage && <p className="mt-2 text-[11px] text-zinc-300">{assistantMessage}</p>}
          </div>
          <input
            className={selectClasses}
            value={projectName}
            onChange={(event) => setProjectName(event.target.value)}
            aria-label="Project name"
          />
          <select className={selectClasses} value={garment.silhouette} onChange={(event) => updateGarment("silhouette", event.target.value as (typeof silhouettes)[number])}>{silhouettes.map((s) => <option key={s}>{s}</option>)}</select>
          <select className={selectClasses} value={garment.sleeves} onChange={(event) => updateGarment("sleeves", event.target.value as (typeof sleeves)[number])}>{sleeves.map((s) => <option key={s}>{s}</option>)}</select>
          <select className={selectClasses} value={garment.neckline} onChange={(event) => updateGarment("neckline", event.target.value as (typeof necklines)[number])}>{necklines.map((n) => <option key={n}>{n}</option>)}</select>
          <select className={selectClasses} value={garment.length} onChange={(event) => updateGarment("length", event.target.value as (typeof lengths)[number])}>{lengths.map((l) => <option key={l}>{l}</option>)}</select>
          <select className={selectClasses} value={garment.closure} onChange={(event) => updateGarment("closure", event.target.value as (typeof closures)[number])}>{closures.map((c) => <option key={c}>{c}</option>)}</select>
          <select className={selectClasses} value={garment.fabric.type} onChange={(event) => updateGarment("fabric", { ...garment.fabric, type: event.target.value as (typeof fabrics)[number] })}>{fabrics.map((f) => <option key={f}>{f}</option>)}</select>
          <label className="text-xs text-zinc-400">Fabric opacity: {garment.fabric.opacity.toFixed(2)}
            <input className="mt-1 block w-full" type="range" min="0.3" max="1" step="0.05" value={garment.fabric.opacity} onChange={(event) => updateGarment("fabric", { ...garment.fabric, opacity: Number(event.target.value) })} />
          </label>
          <label className="text-xs text-zinc-400">Fabric shine: {garment.fabric.shininess.toFixed(2)}
            <input className="mt-1 block w-full" type="range" min="0" max="1" step="0.05" value={garment.fabric.shininess} onChange={(event) => updateGarment("fabric", { ...garment.fabric, shininess: Number(event.target.value) })} />
          </label>
          <label className="text-xs text-zinc-400">Fabric stretch: {garment.fabric.stretch.toFixed(2)}
            <input className="mt-1 block w-full" type="range" min="0" max="1" step="0.05" value={garment.fabric.stretch} onChange={(event) => updateGarment("fabric", { ...garment.fabric, stretch: Number(event.target.value) })} />
          </label>
          <label className="block text-xs text-zinc-400">Fabric upload (JPG/PNG/WEBP ≤ 5MB)</label>
          <input className="text-sm" type="file" accept="image/jpeg,image/png,image/webp" onChange={onFabricUpload} />
          {uploadMessage && <p className="text-xs text-amber-300">{uploadMessage}</p>}
          <p className="text-xs text-zinc-400">AI suggestion: {fabricSuggestion}</p>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          {layers.map((layer) => (
            <button
              key={layer}
              className={`rounded border px-2 py-1 ${garment.layers.includes(layer) ? "border-amber-400 bg-amber-400/10" : "border-zinc-700"}`}
              onClick={() => {
                const layerList = garment.layers.includes(layer)
                  ? garment.layers.filter((entry) => entry !== layer)
                  : [...garment.layers, layer];
                updateGarment("layers", layerList);
              }}
            >
              {layer}
            </button>
          ))}
        </div>
      </aside>

      <main className="space-y-4">
        <header className="flex flex-wrap items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/80 p-3">
          <button className="rounded bg-amber-500 px-3 py-2 text-sm font-semibold text-black" onClick={() => saveProject()}>Save Local</button>
          <button className="rounded border border-zinc-700 px-3 py-2 text-sm" onClick={() => exportProjectJson(garment, pattern)}>Export JSON</button>
          <button className="rounded border border-zinc-700 px-3 py-2 text-sm" onClick={() => sketchRef.current && exportCanvasPng(sketchRef.current)}>Export PNG</button>
          <button className="rounded border border-zinc-700 px-3 py-2 text-sm" onClick={() => exportPatternSvg(patternSvg)}>Export SVG</button>
          <button className="rounded border border-zinc-700 px-3 py-2 text-sm" onClick={() => exportTechPackPdfFallback()}>Export PDF</button>
          <button className="rounded border border-zinc-700 px-3 py-2 text-sm" onClick={generateShareLink}>Copy Share Link + QR</button>
          <select className="rounded border border-zinc-700 bg-zinc-950 px-2 py-2 text-sm" value={garment.sizePreset} onChange={(event) => applyPreset(event.target.value as "XS" | "S" | "M" | "L" | "XL" | "Custom") }>
            <option>XS</option><option>S</option><option>M</option><option>L</option><option>XL</option><option>Custom</option>
          </select>
          <label className="ml-auto text-xs text-zinc-400">Seam allowance {seamAllowanceCm.toFixed(1)}cm
            <input className="block w-40" type="range" min="0.5" max="3" step="0.1" value={seamAllowanceCm} onChange={(event) => setSeamAllowance(Number(event.target.value))} />
          </label>
        </header>

        <motion.section layout className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
            <div className="mb-2 flex gap-2 text-xs">{(["front", "back", "side"] as const).map((view) => <button key={view} className={`rounded px-2 py-1 ${sketchView === view ? "bg-amber-500 text-black" : "border border-zinc-700"}`} onClick={() => setSketchView(view)}>{view}</button>)}</div>
            <svg ref={sketchRef} viewBox="0 0 180 300" className="mx-auto h-[300px] w-full max-w-[260px] rounded bg-zinc-950">
              <defs><pattern id="fabricPattern" patternUnits="userSpaceOnUse" width="30" height="30"><image href={garment.fabric.textureUrl} x="0" y="0" width="30" height="30" preserveAspectRatio="xMidYMid slice"/></pattern></defs>
              <path d={getSketchPath(garment, sketchView)} fill="url(#fabricPattern)" fillOpacity={garment.fabric.opacity} stroke="#d4af37" strokeWidth="2" />
              <path d={getStitchGuidePath()} stroke="#fff" strokeDasharray="4 4" strokeOpacity="0.6" />
            </svg>
            <p className="mt-2 text-xs text-zinc-400">Front/back/side sketch, stitch guides, and measurement-ready outline.</p>
          </div>
          <ThreeViewer />
        </motion.section>

        {shareQr && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-3">
            <Image src={shareQr} alt="Share QR" width={128} height={128} unoptimized />
          </div>
        )}
      </main>

      <aside className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
        <h2 className="mb-3 text-lg font-semibold text-amber-300">Technical Pattern Panel</h2>
        <div className="mb-3 grid grid-cols-2 gap-2 text-xs">
          {Object.entries(garment.measurements).map(([key, value]) => (
            <label key={key} className="block">
              <span className="capitalize text-zinc-400">{key}</span>
              <input
                className="mt-1 w-full rounded border border-zinc-700 bg-zinc-950 px-2 py-1"
                type="number"
                min={20}
                value={value}
                onChange={(event) => updateMeasurements({ ...garment.measurements, [key]: Number(event.target.value) })}
              />
            </label>
          ))}
        </div>
        <ul className="space-y-1 text-xs text-zinc-300">{pattern.panels.map((panel) => <li key={panel.name}>{panel.name}: {panel.widthCm}×{panel.heightCm}cm (SA {panel.seamAllowanceCm}cm)</li>)}</ul>
        <p className="mt-3 text-xs text-zinc-400">Est. fabric: {pattern.estimatedFabricMeters}m • A4 pages: {pattern.printableA4Pages} • DXF-ready panel metadata included in JSON export.</p>
        <div className="mt-3 rounded border border-zinc-700 bg-zinc-950 p-2 text-xs">
          <p className="text-zinc-300">Build intelligence:</p>
          <p className="mt-1 text-zinc-400">Difficulty: <span className="text-amber-300">{pattern.difficulty}</span> • Complexity score: {pattern.complexityScore}/100 • Fit ease: {pattern.fitEaseCm}cm</p>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-zinc-400">
            {pattern.cuttingNotes.map((note) => <li key={note}>{note}</li>)}
          </ul>
        </div>
        <div className="mt-3 rounded border border-zinc-700 bg-zinc-950 p-2">
          <Image
            src={`data:image/svg+xml;base64,${btoa(patternSvg)}`}
            alt="Flat pattern"
            width={320}
            height={280}
            className="h-auto w-full"
            unoptimized
          />
        </div>
      </aside>
    </div>
  );
}
