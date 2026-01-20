"use client";
import React from "react";

type Preset = {
  label: string;
  onClick: () => void;
};

export default function PresetButtons({ presets }: { presets: Preset[] }) {
  return (
    <div className="flex gap-4">
      {presets.map((p) => (
        <button key={p.label} type="button" className="btn btn-sm btn-primary" onClick={p.onClick}>
          {p.label}
        </button>
      ))}
    </div>
  );
}
