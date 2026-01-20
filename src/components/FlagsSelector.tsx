"use client";
import React, { useState } from "react";

export type Flag = {
  value: string;
  description?: string;
  requireInput: boolean;
  input?: string;
  noSpace?: boolean;
  advanced?: boolean;
};

export default function FlagsSelector({
  allowedFlags,
  flags,
  setFlags,
}: {
  allowedFlags: Flag[];
  flags: Flag[];
  setFlags: (f: Flag[]) => void;
}) {
  const [showMore, setShowMore] = useState(false);

  return (
    <fieldset className="fieldset mt-4">
      <legend className="fieldset-legend">Flags</legend>
      <div className="flex flex-col gap-2">
        {allowedFlags
          .filter((f) => showMore || !f.advanced)
          .map((flag) => {
            const checked = flags.some((f) => f.value === flag.value);
            const inputValue = flags.find((f) => f.value === flag.value)?.input || "";

            return (
              <div key={flag.value} className="flex items-center gap-2">
                <label className="flex items-center gap-2 w-96">
                  <input
                    type="checkbox"
                    className="checkbox"
                    value={flag.value}
                    checked={checked}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (e.target.checked) {
                        setFlags((prev) => [...prev, { ...flag }]);
                      } else {
                        setFlags((prev) => prev.filter((f) => f.value !== value));
                      }
                    }}
                  />
                  <div className="flex-1 flex items-center gap-2">
                    <span className="font-mono w-20">{flag.value}</span>
                    <span className="text-sm truncate">{flag.description}</span>
                  </div>
                </label>

                <div className="w-64">
                  <input
                    type="text"
                    className="input w-full"
                    placeholder={flag.input || "value"}
                    value={inputValue}
                    onChange={(e) => {
                      const iv = e.target.value;
                      setFlags((prev) => prev.map((f) => (f.value === flag.value ? { ...f, input: iv } : f)));
                    }}
                    disabled={!checked || !flag.requireInput}
                    style={{ visibility: flag.requireInput ? "visible" : "hidden" }}
                  />
                </div>
              </div>
            );
          })}

        {allowedFlags.some((f) => f.advanced) && (
          <button type="button" className="btn btn-ghost btn-sm w-32" onClick={() => setShowMore((s) => !s)}>
            {showMore ? "Show less" : "Show more"}
          </button>
        )}
      </div>
    </fieldset>
  );
}
