"use client";
import { useEffect, useState } from "react";
import CommandPreview from "../../components/CommandPreview";
import FlagsSelector from "../../components/FlagsSelector";
import PresetButtons from "../../components/PresetButtons";
import {
  subdomainCommands,
  subdomainPresets,
} from "../../data/subdomainCommands";
import type { Flag } from "../../types/commands";

const STORAGE_KEY = "recon:subdomain";

export default function Subdomain() {
  const [command, setCommand] = useState("subfinder");
  const [target, setTarget] = useState("example.com");
  const [flags, setFlags] = useState<Flag[]>([]);
  const [fullCommand, setFullCommand] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [savedPresent, setSavedPresent] = useState(false);

  const currentCmd = subdomainCommands.find((c) => c.name === command);
  const allowedFlags = currentCmd?.flags || [];

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.command) setCommand(parsed.command);
        if (parsed.target) setTarget(parsed.target);
        if (parsed.flags) {
          const cmd = subdomainCommands.find(
            (c) => c.name === (parsed.command || "subfinder"),
          );
          const mergedFlags = parsed.flags.map((stored: Flag) => {
            const def = cmd?.flags.find((f) => f.value === stored.value);
            return def ? { ...def, ...stored } : stored;
          });
          setFlags(mergedFlags);
        }
        setSavedPresent(!!(parsed.flags || parsed.command || parsed.target));
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
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ command, target, flags }),
      );
    } catch {
      // ignore
    }
  }, [loaded, command, target, flags]);

  // Build command string
  useEffect(() => {
    const flagStrings = flags.map((flag) =>
      flag.requireInput
        ? `${flag.value}${flag.noSpace ? "" : " "}${flag.input || ""}`
        : flag.value,
    );
    // assetfinder takes domain as positional arg, others use -d flag
    const parts =
      command === "assetfinder"
        ? [command, ...flagStrings, target]
        : [command, ...flagStrings];
    setFullCommand(parts.filter(Boolean).join(" "));
  }, [command, flags, target]);

  // Set defaults when command changes (only if no saved data)
  useEffect(() => {
    const cmd = subdomainCommands.find((c) => c.name === command);
    if (cmd && !savedPresent && flags.length === 0) {
      const defaultFlags = cmd.flags.filter((f) =>
        cmd.defaultFlags?.includes(f.value),
      );
      setFlags(defaultFlags);
    }
  }, [command, savedPresent, flags.length]);

  const handleReset = () => {
    localStorage.removeItem(STORAGE_KEY);
    setCommand("subfinder");
    setTarget("example.com");
    const cmd = subdomainCommands.find((c) => c.name === "subfinder");
    if (cmd) {
      setFlags(cmd.flags.filter((f) => cmd.defaultFlags?.includes(f.value)));
    }
    setSavedPresent(false);
  };

  const handleCommandChange = (newCommand: string) => {
    setCommand(newCommand);
    const cmd = subdomainCommands.find((c) => c.name === newCommand);
    if (cmd) {
      const defaultFlags = cmd.flags.filter((f) =>
        cmd.defaultFlags?.includes(f.value),
      );
      setFlags(defaultFlags);
    }
  };

  const presetButtons = subdomainPresets.map((preset) => ({
    label: preset.label,
    description: preset.description,
    onClick: () => {
      setCommand(preset.command);
      setFlags(preset.flags);
    },
  }));

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-4">Subdomain Enumeration</h1>

      <CommandPreview
        command={fullCommand}
        docsUrl={currentCmd?.docsUrl || "#"}
        onReset={handleReset}
      />

      <fieldset className="fieldset mt-6">
        <legend className="fieldset-legend">Quick Presets</legend>
        <PresetButtons presets={presetButtons} />
      </fieldset>

      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        <fieldset className="fieldset flex-1">
          <legend className="fieldset-legend">Tool</legend>
          <select
            className="select select-bordered w-full"
            value={command}
            onChange={(e) => handleCommandChange(e.target.value)}
          >
            {subdomainCommands.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name} - {c.description}
              </option>
            ))}
          </select>
        </fieldset>

        <fieldset className="fieldset flex-1">
          <legend className="fieldset-legend">Target Domain</legend>
          <input
            type="text"
            className="input input-bordered w-full font-mono"
            placeholder="example.com"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          />
        </fieldset>
      </div>

      <FlagsSelector
        allowedFlags={allowedFlags}
        flags={flags}
        setFlags={setFlags}
      />
    </div>
  );
}
