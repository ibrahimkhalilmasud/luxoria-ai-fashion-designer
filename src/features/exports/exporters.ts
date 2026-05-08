import type { Garment } from "@/types/garment";
import type { GeneratedPattern } from "@/features/patterns/generator";

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function exportProjectJson(garment: Garment, pattern: GeneratedPattern): void {
  downloadBlob(new Blob([JSON.stringify({ garment, pattern, exportedAt: new Date().toISOString() }, null, 2)], { type: "application/json" }), "luxoria-project.json");
}

export function exportPatternSvg(svgText: string): void {
  downloadBlob(new Blob([svgText], { type: "image/svg+xml" }), "luxoria-pattern.svg");
}

export function exportCanvasPng(svgElement: SVGSVGElement): void {
  const svgData = new XMLSerializer().serializeToString(svgElement);
  const svgUrl = `data:image/svg+xml;base64,${btoa(svgData)}`;
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = svgElement.clientWidth || 320;
    canvas.height = svgElement.clientHeight || 320;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }
    ctx.drawImage(img, 0, 0);
    canvas.toBlob((blob) => blob && downloadBlob(blob, "luxoria-sketch.png"));
  };
  img.src = svgUrl;
}

export function exportTechPackPdfFallback(): void {
  const printWindow = window.open("", "_blank", "width=840,height=1100");
  if (!printWindow) {
    return;
  }
  printWindow.document.write("<html><body style='font-family:Arial;padding:24px;background:#111;color:#fff'><h1>Luxoria Tech Pack</h1><p>Use Print > Save as PDF to export.</p></body></html>");
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}
