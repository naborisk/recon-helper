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
  storageKey,
}: {
  allowedFlags: Flag[];
  flags: Flag[];
  setFlags: (f: Flag[] | ((prev: Flag[]) => Flag[])) => void;
  storageKey?: string;
}) {
  const [showMore, setShowMore] = useState(false);

  // wrapper to ensure when flags change via this component, external storage can react
  const updateFlags = (updater: Flag[] | ((prev: Flag[]) => Flag[])) => {
    if (typeof updater === "function") {
      setFlags((prev: Flag[]) => (updater as (prev: Flag[]) => Flag[])(prev));
    } else {
      setFlags(updater);
    }
  };

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
                        updateFlags((prev) => {
                          const next = [...prev, { ...flag }];
                          return next;
                        });
                      } else {
                        updateFlags((prev) => {
                          const next = prev.filter((f) => f.value !== value);
                          return next;
                        });
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
                      updateFlags((prev) => {
                        const next = prev.map((f) => (f.value === flag.value ? { ...f, input: iv } : f));
                        return next;
                      });
                    }}
                    disabled={!checked || !flag.requireInput}
                    style={{ visibility: flag.requireInput ? "visible" : "hidden" }}
                  />
                </div>
              </div>
            );
          })}

        {allowedFlags.some((f) => f.advanced) && (
          <button type="button" className="btn btn-sm w-32 btn-outline" onClick={() => setShowMore((s) => !s)}>
            {showMore ? "Show less" : "Show more"}
          </button>
        )}
      </div>
    </fieldset>
  );
}
