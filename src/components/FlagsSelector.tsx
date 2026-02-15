"use client";
import { useState } from "react";
import type { Flag } from "../types/commands";

const categoryLabels: Record<string, string> = {
  general: "General",
  detection: "Detection",
  performance: "Performance",
  filter: "Filtering",
  output: "Output",
};

const categoryOrder = [
  "general",
  "detection",
  "filter",
  "performance",
  "output",
];

export default function FlagsSelector({
  allowedFlags,
  flags,
  setFlags,
}: {
  allowedFlags: Flag[];
  flags: Flag[];
  setFlags: (f: Flag[] | ((prev: Flag[]) => Flag[])) => void;
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const hasAdvanced = allowedFlags.some((f) => f.advanced);
  const enabledCount = flags.length;

  const visibleFlags = allowedFlags.filter((f) => showAdvanced || !f.advanced);

  // Group flags by category
  const groupedFlags = categoryOrder
    .map((cat) => ({
      category: cat,
      label: categoryLabels[cat] || cat,
      flags: visibleFlags.filter((f) => (f.category || "general") === cat),
    }))
    .filter((g) => g.flags.length > 0);

  // If no categories defined, show flat list
  const hasCategories = allowedFlags.some((f) => f.category);

  const handleToggle = (flag: Flag, checked: boolean) => {
    if (checked) {
      setFlags((prev) => [...prev, { ...flag }]);
    } else {
      setFlags((prev) => prev.filter((f) => f.value !== flag.value));
    }
  };

  const handleInputChange = (flagValue: string, input: string) => {
    setFlags((prev) =>
      prev.map((f) => (f.value === flagValue ? { ...f, input } : f)),
    );
  };

  const clearAll = () => {
    setFlags([]);
  };

  const renderFlag = (flag: Flag) => {
    const checked = flags.some((f) => f.value === flag.value);
    const inputValue =
      flags.find((f) => f.value === flag.value)?.input ?? flag.input ?? "";

    return (
      <div key={flag.value} className="flex items-center gap-2 py-1">
        <label className="flex items-center gap-2 min-w-0 flex-1 md:flex-none md:w-96 cursor-pointer">
          <input
            type="checkbox"
            className="checkbox checkbox-sm"
            checked={checked}
            onChange={(e) => handleToggle(flag, e.target.checked)}
          />
          <code className="text-sm font-bold text-primary whitespace-nowrap">
            {flag.value}
          </code>
          <span className="text-sm text-base-content/70 truncate hidden sm:inline">
            {flag.description}
          </span>
        </label>

        {flag.requireInput && (
          <input
            type="text"
            className="input input-sm input-bordered w-full md:w-64 font-mono"
            placeholder={flag.input || "value"}
            value={inputValue}
            onChange={(e) => handleInputChange(flag.value, e.target.value)}
            disabled={!checked}
          />
        )}

        {/* Mobile description */}
        <span className="text-xs text-base-content/60 sm:hidden flex-1 truncate">
          {flag.description}
        </span>
      </div>
    );
  };

  return (
    <fieldset className="fieldset mt-4">
      <legend className="fieldset-legend flex items-center gap-4">
        <span>Flags</span>
        {enabledCount > 0 && (
          <span className="badge badge-sm badge-primary">
            {enabledCount} selected
          </span>
        )}
      </legend>

      {/* Actions bar */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        {hasAdvanced && (
          <button
            type="button"
            className="btn btn-xs btn-outline"
            onClick={() => setShowAdvanced((s) => !s)}
          >
            {showAdvanced ? "Hide advanced" : "Show advanced"}
          </button>
        )}
        {enabledCount > 0 && (
          <button
            type="button"
            className="btn btn-xs btn-ghost text-error"
            onClick={clearAll}
          >
            Clear all
          </button>
        )}
      </div>

      {/* Flags list */}
      <div className="flex flex-col gap-1">
        {hasCategories
          ? groupedFlags.map((group) => (
              <div key={group.category} className="mb-2">
                <div className="text-xs font-semibold text-base-content/50 uppercase tracking-wide mb-1">
                  {group.label}
                </div>
                {group.flags.map(renderFlag)}
              </div>
            ))
          : visibleFlags.map(renderFlag)}
      </div>
    </fieldset>
  );
}
