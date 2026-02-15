"use client";
import { useEffect, useState } from "react";
import CommandPreview from "../../components/CommandPreview";
import FlagsSelector from "../../components/FlagsSelector";
import PresetButtons from "../../components/PresetButtons";
import { fuzzingCommands, fuzzingPresets } from "../../data/fuzzingCommands";
import type { Flag } from "../../types/commands";

const STORAGE_KEY = "recon:fuzzing";

export default function Fuzzing() {
  const [command, setCommand] = useState("ffuf");
  const [flags, setFlags] = useState<Flag[]>([]);
  const [fullCommand, setFullCommand] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [savedPresent, setSavedPresent] = useState(false);

  const currentCmd = fuzzingCommands.find((c) => c.name === command);
  const allowedFlags = currentCmd?.flags || [];

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.command) setCommand(parsed.command);
        if (parsed.flags) {
          // Merge stored flags with command definitions to restore full properties
          const cmd = fuzzingCommands.find(
            (c) => c.name === (parsed.command || "ffuf"),
          );
          const mergedFlags = parsed.flags.map((stored: Flag) => {
            const def = cmd?.flags.find((f) => f.value === stored.value);
            return def ? { ...def, ...stored } : stored;
          });
          setFlags(mergedFlags);
        }
        setSavedPresent(!!(parsed.flags || parsed.command));
      }
    } catch {
      // ignore
    } finally {
      setLoaded(true);
    }
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ command, flags }));
    } catch {
      // ignore
    }
  }, [loaded, command, flags]);

  // Build command string
  useEffect(() => {
    const flagStrings = flags.map((flag) =>
      flag.requireInput
        ? `${flag.value}${flag.noSpace ? "" : " "}${flag.input || ""}`
        : flag.value,
    );
    const parts = [command, ...flagStrings].filter(Boolean);
    setFullCommand(parts.join(" "));
  }, [command, flags]);

  // Set defaults when command changes (only if no saved data)
  useEffect(() => {
    if (!loaded) return;
    const cmd = fuzzingCommands.find((c) => c.name === command);
    if (cmd && !savedPresent && flags.length === 0) {
      const defaultFlags = cmd.flags.filter((f) =>
        cmd.defaultFlags?.includes(f.value),
      );
      setFlags(defaultFlags);
    }
  }, [loaded, command, savedPresent, flags.length]);

  const handleReset = () => {
    localStorage.removeItem(STORAGE_KEY);
    setCommand("ffuf");
    const cmd = fuzzingCommands.find((c) => c.name === "ffuf");
    if (cmd) {
      setFlags(cmd.flags.filter((f) => cmd.defaultFlags?.includes(f.value)));
    }
    setSavedPresent(false);
  };

  const handleCommandChange = (newCommand: string) => {
    setCommand(newCommand);
    // Load defaults for new command
    const cmd = fuzzingCommands.find((c) => c.name === newCommand);
    if (cmd) {
      const defaultFlags = cmd.flags.filter((f) =>
        cmd.defaultFlags?.includes(f.value),
      );
      setFlags(defaultFlags);
    }
  };

  const presetButtons = fuzzingPresets.map((preset) => ({
    label: preset.label,
    description: preset.description,
    onClick: () => {
      setCommand(preset.command);
      setFlags(preset.flags);
    },
  }));

  // Get the URL flag for quick access
  const urlFlag = flags.find((f) => f.value === "-u");
  const urlValue = urlFlag?.input || "";

  const handleUrlChange = (newUrl: string) => {
    setFlags((prev) => {
      const hasUrl = prev.some((f) => f.value === "-u");
      if (hasUrl) {
        return prev.map((f) =>
          f.value === "-u" ? { ...f, input: newUrl } : f,
        );
      }
      // Add -u flag if not present
      const urlFlagDef = allowedFlags.find((f) => f.value === "-u");
      if (urlFlagDef) {
        return [...prev, { ...urlFlagDef, input: newUrl }];
      }
      return prev;
    });
  };

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-4">Web Fuzzing</h1>

      {/* Command preview */}
      <CommandPreview
        command={fullCommand}
        docsUrl={currentCmd?.docsUrl || "#"}
        onReset={handleReset}
      />

      {/* Presets */}
      <fieldset className="fieldset mt-6">
        <legend className="fieldset-legend">Quick Presets</legend>
        <PresetButtons presets={presetButtons} />
      </fieldset>

      {/* Command & URL selection */}
      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        <fieldset className="fieldset sm:w-64">
          <legend className="fieldset-legend">Tool</legend>
          <select
            className="select select-bordered w-full"
            value={command}
            onChange={(e) => handleCommandChange(e.target.value)}
          >
            {fuzzingCommands.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name} - {c.description}
              </option>
            ))}
          </select>
        </fieldset>

        <fieldset className="fieldset flex-1">
          <legend className="fieldset-legend">Target URL</legend>
          <input
            type="text"
            className="input input-bordered w-full font-mono"
            placeholder="http://example.com/FUZZ"
            value={urlValue}
            onChange={(e) => handleUrlChange(e.target.value)}
          />
          <p className="text-xs text-base-content/60 mt-1">
            Use FUZZ as placeholder for wordlist substitution
          </p>
        </fieldset>
      </div>

      {/* Flags */}
      <FlagsSelector
        allowedFlags={allowedFlags}
        flags={flags}
        setFlags={setFlags}
      />
    </div>
  );
}
