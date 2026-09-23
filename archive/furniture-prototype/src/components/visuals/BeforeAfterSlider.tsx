"use client";

import { useCallback, useRef, useState } from "react";

export function BeforeAfterSlider({
  before,
  after,
  beforeLabel = "Before",
  afterLabel = "After",
  className = "",
}: {
  before: React.ReactNode;
  after: React.ReactNode;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    updateFromClientX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    updateFromClientX(e.clientX);
  };
  const onPointerUp = () => {
    dragging.current = false;
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") setPosition((p) => Math.max(0, p - 5));
    if (e.key === "ArrowRight") setPosition((p) => Math.min(100, p + 5));
    if (e.key === "Home") setPosition(0);
    if (e.key === "End") setPosition(100);
  };

  return (
    <div
      ref={containerRef}
      className={`relative aspect-[4/3] w-full select-none overflow-hidden rounded-2xl bg-stone touch-none ${className}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      <div className="absolute inset-0">{after}</div>
      <div className="absolute right-3 top-3 z-10 rounded-full bg-charcoal/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-paper backdrop-blur-sm">
        {afterLabel}
      </div>

      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        {before}
        <div className="absolute left-3 top-3 z-10 rounded-full bg-charcoal/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-paper backdrop-blur-sm">
          {beforeLabel}
        </div>
      </div>

      <div
        className="absolute inset-y-0 z-20 flex w-0 items-center justify-center"
        style={{ left: `${position}%` }}
      >
        <div className="absolute inset-y-0 w-0.5 bg-paper shadow-[0_0_0_1px_rgba(0,0,0,0.15)]" />
        <div
          role="slider"
          tabIndex={0}
          aria-label="Before and after reveal"
          aria-valuenow={Math.round(position)}
          aria-valuemin={0}
          aria-valuemax={100}
          onKeyDown={onKeyDown}
          className="relative flex h-10 w-10 cursor-ew-resize items-center justify-center rounded-full bg-paper text-charcoal shadow-lg ring-1 ring-charcoal/10 focus:outline-none focus:ring-2 focus:ring-ember"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M5 3 L1.5 8 L5 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M11 3 L14.5 8 L11 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}
