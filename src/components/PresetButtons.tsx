"use client";

type Preset = {
  label: string;
  description: string;
  onClick: () => void;
};

export default function PresetButtons({ presets }: { presets: Preset[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {presets.map((p) => (
        <button
          key={p.label}
          type="button"
          className="btn btn-sm btn-outline tooltip tooltip-bottom"
          data-tip={p.description}
          onClick={p.onClick}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
