"use client";

import { useState, useRef, useCallback, useEffect as useEffect2 } from "react";

type CropModalProps = {
  file: File;
  onCrop: (blob: Blob) => void;
  onCancel: () => void;
};

export default function CropModal({ file, onCrop, onCancel }: CropModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const CROP_SIZE = 280; // px of the crop square in the UI

  useEffect2(() => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      // Initial scale to fit the crop area
      const s = Math.max(CROP_SIZE / img.width, CROP_SIZE / img.height);
      setScale(s);
      setPos({ x: 0, y: 0 });
      setImgLoaded(true);
    };
    img.src = url;
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setDragStart({ x: e.clientX - pos.x, y: e.clientY - pos.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    setPos({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => setDragging(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setDragging(true);
      setDragStart({ x: e.touches[0].clientX - pos.x, y: e.touches[0].clientY - pos.y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragging || e.touches.length !== 1) return;
    setPos({ x: e.touches[0].clientX - dragStart.x, y: e.touches[0].clientY - dragStart.y });
  };

  const handleTouchEnd = () => setDragging(false);

  const doCrop = useCallback(() => {
    const img = imgRef.current;
    if (!img) return;
    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext("2d")!;

    // Calculate source rect to extract a 1:1 region centered on the crop area
    const cropCenterX = CROP_SIZE / 2 - pos.x;
    const cropCenterY = CROP_SIZE / 2 - pos.y;
    const srcSize = CROP_SIZE / scale;
    const srcX = (cropCenterX / scale) - srcSize / 2;
    const srcY = (cropCenterY / scale) - srcSize / 2;

    ctx.fillStyle = "#0a0a1e";
    ctx.fillRect(0, 0, 400, 400);
    ctx.drawImage(img, srcX, srcY, srcSize, srcSize, 0, 0, 400, 400);

    canvas.toBlob((blob) => {
      if (blob) onCrop(blob);
    }, "image/jpeg", 0.9);
  }, [pos, scale]);

  if (!imgLoaded) {
    return (
      <div onClick={onCancel} style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div onClick={e => e.stopPropagation()} style={{ color: "#8a87a0", fontSize: 14 }}>加载中...</div>
      </div>
    );
  }

  const img = imgRef.current!;
  const displayW = img.width * scale;
  const displayH = img.height * scale;

  return (
    <div onClick={onCancel} style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.85)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, maxWidth: "100vw" }}>
        {/* Crop area */}
        <div ref={containerRef} style={{
          width: CROP_SIZE, height: CROP_SIZE, borderRadius: 16, overflow: "hidden",
          position: "relative", background: "#0a0a1e",
          boxShadow: "0 0 0 2px rgba(143,124,255,0.5), 0 0 80px rgba(0,0,0,0.5)",
          cursor: dragging ? "grabbing" : "grab"
        }}
          onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}
        >
          <img
            src={URL.createObjectURL(file)}
            alt=""
            draggable={false}
            style={{
              position: "absolute",
              left: pos.x, top: pos.y,
              width: displayW, height: displayH,
              pointerEvents: "none", userSelect: "none"
            }}
          />
          {/* Crop overlay grid */}
          <div style={{ position: "absolute", inset: 0, border: "2px solid rgba(255,255,255,0.3)", borderRadius: 16, pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1, background: "rgba(255,255,255,0.1)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: "rgba(255,255,255,0.1)", pointerEvents: "none" }} />
        </div>

        {/* Zoom slider */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, width: CROP_SIZE }}>
          <span style={{ color: "#8a87a0", fontSize: 12 }}>缩放</span>
          <input
            type="range" min={0.3} max={3} step={0.01} value={scale}
            onChange={e => setScale(parseFloat(e.target.value))}
            style={{ flex: 1, accentColor: "#8f7cff" }}
          />
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onCancel} style={{ padding: "12px 24px", borderRadius: 14, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "#8a87a0", fontSize: 14, fontWeight: 600 }}>取消</button>
          <button onClick={doCrop} style={{ padding: "12px 28px", borderRadius: 14, background: "linear-gradient(135deg,#8f7cff,#ff8ec7)", color: "#fff", fontSize: 14, fontWeight: 700 }}>确认裁剪</button>
        </div>
      </div>
    </div>
  );
}
