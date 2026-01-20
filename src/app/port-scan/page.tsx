"use client";
import { useEffect, useState } from "react";

type Flag = {
  value: string;
  description?: string;
  requireInput: boolean;
  input?: string;
  noSpace?: boolean;
  advanced?: boolean;
};

type Command = {
  name: string;
  description?: string;
  flags: Flag[];
  defaultFlags?: string[];
};

const commands: Command[] = [
  {
    name: "nmap",
    description: "Network mapper",
    flags: [
      { value: "-sC", description: "Enable default scripts", requireInput: false },
      { value: "-sV", description: "Version detection", requireInput: false },
      { value: "-O", description: "Enable OS detection", requireInput: false, advanced: true },
      { value: "-p", description: "Specify ports (ex: 22,80,1-1024)", requireInput: true, noSpace: true },
      { value: "-T", description: "Set timing template (0-5)", requireInput: true, input: "4" },
      { value: "--open", description: "Show only open ports", requireInput: false },
      { value: "-A", description: "Aggressive scan (OS,version,scripts,traceroute)", requireInput: false, advanced: true },
      { value: "-Pn", description: "Skip host discovery (treat hosts as online)", requireInput: false, advanced: true },
      { value: "-oN", description: "Output normal to file", requireInput: true, input: "output.nmap" , advanced: true},
      { value: "-oX", description: "Output XML to file", requireInput: true, input: "output.xml", advanced: true },
      { value: "-oG", description: "Greppable output to file", requireInput: true, input: "output.gnmap", advanced: true },
      { value: "--reason", description: "Display reason a port is in a particular state", requireInput: false, advanced: true },
    ],
    defaultFlags: ["-sC", "-sV"],
  },
  {
    name: "masscan",
    description: "Mass port scanner",
    flags: [
      { value: "-p", description: "Specify ports (ex: 80,443 or 1-65535)", requireInput: true, noSpace: true },
      { value: "--rate", description: "Packets per second (use carefully)", requireInput: true, input: "1000", advanced: true },
      { value: "-e", description: "Specify interface", requireInput: true, input: "eth0", advanced: true },
      { value: "-oL", description: "Output list to file", requireInput: true, input: "output.txt", advanced: true },
    ],
    defaultFlags: ["-p"],
  },
  {
    name: "rustscan",
    description: "Fast port scanner",
    flags: [
      { value: "-a", description: "Target address", requireInput: true, input: "10.10.10.10", advanced: false },
      { value: "-b", description: "Batch size / threads", requireInput: true, input: "1024", advanced: true },
      { value: "--ulimit", description: "Set ulimit", requireInput: true, input: "4096", advanced: true },
    ],
    defaultFlags: [],
  },
];

import FlagsSelector from "../../components/FlagsSelector";

export default function PortScan() {
  const [command, setCommand] = useState("nmap");
  const [target, setTarget] = useState("10.10.10.10");
  const [flags, setFlags] = useState<Flag[]>([]);
  const [fullCommand, setFullCommand] = useState("");
  const [showMore, setShowMore] = useState(false);

  const [allowedFlags, setAllowedFlags] = useState<Flag[]>([]);

  // load/save from localStorage
  const storageKey = "recon:port-scan";
  const [loaded, setLoaded] = useState(false);

  const [savedPresent, setSavedPresent] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.command) setCommand(parsed.command);
        if (parsed.target) setTarget(parsed.target);
        if (parsed.flags) setFlags(parsed.flags);
        setSavedPresent(!!(parsed && (parsed.flags || parsed.command || parsed.target)));
      }
    } catch (e) {
      // ignore
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify({ command, target, flags }));
    } catch (e) {
      // ignore
    }
  }, [loaded, command, target, flags]);

  useEffect(() => {
    const flagStrings = flags.map((flag) =>
      flag.requireInput
        ? `${flag.value}${flag.noSpace ? "" : " "}${flag.input || ""}`
        : flag.value,
    );

    // Build command without extra empty parts
    const parts = [command, ...flagStrings, target].filter(Boolean);
    setFullCommand(parts.join(" "));
  }, [command, flags, target]);

  useEffect(() => {
    const cmd = commands.find((c) => c.name === command);
    if (cmd) {
      setAllowedFlags(cmd.flags);
      // Only populate defaults when there was no saved data and flags are empty
      if (!savedPresent && flags.length === 0) {
        const defaultFlags: Flag[] = cmd.flags.filter((flag) => {
          return cmd.defaultFlags?.includes(flag.value);
        });
        setFlags(defaultFlags);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [command, loaded]);

  return (
    <>
      <h1>Port Scan</h1>
      <div className="mockup-code w-full">
        <pre data-prefix="$">
          <code>{fullCommand}</code>
        </pre>
      </div>
      <div className="flex gap-2 my-2">
        <button
          type="button"
          onClick={() => navigator.clipboard.writeText(fullCommand)}
          className="btn btn-primary"
        >
          Copy
        </button>
        <a
          className="btn btn-secondary"
          href={command === 'nmap' ? 'https://nmap.org/book/man.html' : command === 'masscan' ? 'https://github.com/robertdavidgraham/masscan' : command === 'rustscan' ? 'https://github.com/RustScan/RustScan' : '#'}
          target="_blank"
          rel="noreferrer"
        >
          Docs
        </a>
        <button type="button" className="btn btn-error" onClick={() => {
          // reset to defaults for current command
          localStorage.removeItem(storageKey);
          const cmd = commands.find(c => c.name === 'nmap');
          setCommand('nmap');
          setTarget('10.10.10.10');
          if (cmd) setFlags(cmd.flags.filter(f => cmd.defaultFlags?.includes(f.value)));
        }}>Reset</button>
      </div>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Presets</legend>
        <div className="flex gap-4">
          <button type="button" className="btn btn-sm btn-primary" onClick={() => { setCommand("nmap"); setFlags([{ value: "-sC", requireInput: false }, { value: "-sV", requireInput: false }]); }}>Nmap Default</button>
          <button type="button" className="btn btn-sm btn-primary" onClick={() => { setCommand("nmap"); setFlags([{ value: "-A", requireInput: false }, { value: "-p", requireInput: true, input: "1-65535", noSpace: true }]); }}>Nmap Aggressive Full Port Scan</button>
          <button type="button" className="btn btn-sm btn-primary" onClick={() => { setCommand("masscan"); setFlags([{ value: "-p", requireInput: true, input: "1-65535", noSpace: true }, { value: "--rate", requireInput: true, input: "1000", advanced: true }]); }}>Masscan Quick</button>
          <button type="button" className="btn btn-sm btn-primary" onClick={() => { setCommand("rustscan"); setFlags([{ value: "-a", requireInput: true, input: "10.10.10.10" }, { value: "-b", requireInput: true, input: "1024" }]); }}>Rustscan Quick</button>
        </div>
      </fieldset>

      <div className="flex gap-4 mt-4">
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Command</legend>
          <select className="select" value={command} onChange={(e) => setCommand(e.target.value)}>
            {commands.map((c) => (
              <option key={c.name}>{c.name}</option>
            ))}
          </select>
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Target</legend>
          <input type="text" className="input" placeholder="10.10.10.10" value={target} onChange={(e) => setTarget(e.target.value)} />
        </fieldset>
      </div>

      {/* Flags selector component */}
      <FlagsSelector allowedFlags={allowedFlags} flags={flags} setFlags={setFlags} />

    </>
  );
}
