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
    name: "ffuf",
    description: "Fast web fuzzer",
    flags: [
      { value: "-u", description: "Target URL (use FUZZ as placeholder)", requireInput: true, input: "http://example.com/FUZZ" },
      { value: "-w", description: "Wordlist or multiple wordlists (separated by ,)", requireInput: true, input: "/usr/share/wordlists/common.txt" },
      { value: "-t", description: "Threads (concurrency)", requireInput: true, input: "40" },
      { value: "-mc", description: "Match HTTP codes (comma separated)", requireInput: true, input: "200,301" },
      { value: "-fc", description: "Filter by HTTP codes (comma)", requireInput: true, input: "404,403", advanced: true },
      { value: "-fs", description: "Filter by response size (bytes)", requireInput: true, input: "0", advanced: true },
      { value: "-recursion", description: "Enable recursion (depth)", requireInput: true, input: "2", advanced: true },
      { value: "-H", description: "Custom header (use \"Header: Value\")", requireInput: true, input: "Authorization: Bearer TOKEN", advanced: true },
      { value: "-mr", description: "Match regex", requireInput: true, input: "<title>", advanced: true },
      { value: "-o", description: "Output file", requireInput: true, input: "ffuf.json", advanced: true },
    ],
    defaultFlags: ["-u", "-w"],
  },
  {
    name: "dirsearch",
    description: "Simple dir scanner (python)",
    flags: [
      { value: "-u", description: "Target URL", requireInput: true, input: "http://example.com" },
      { value: "-w", description: "Wordlist", requireInput: true, input: "/usr/share/wordlists/common.txt" },
      { value: "-e", description: "Extensions (comma)", requireInput: true, input: "php,html,js", advanced: true },
      { value: "-t", description: "Threads", requireInput: true, input: "10", advanced: true },
      { value: "-o", description: "Output file", requireInput: true, input: "dirsearch.json", advanced: true },
    ],
    defaultFlags: ["-u", "-w"],
  },
  {
    name: "dirbuster",
    description: "Java DirBuster",
    flags: [
      { value: "-u", description: "Target URL", requireInput: true, input: "http://example.com" },
      { value: "-l", description: "List wordlist file", requireInput: true, input: "/usr/share/wordlists/directory-list-lowercase-2.3-medium.txt" },
      { value: "-t", description: "Threads", requireInput: true, input: "10", advanced: true },
      { value: "-r", description: "Recursive", requireInput: false, advanced: true },
      { value: "-o", description: "Output file", requireInput: true, input: "dirbuster.txt", advanced: true },
    ],
    defaultFlags: ["-u", "-l"],
  },
];

export default function Fuzzing() {
  const [command, setCommand] = useState<string>("ffuf");
  const [flags, setFlags] = useState<Flag[]>([]);
  const [fullCommand, setFullCommand] = useState<string>("");
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const cmd = commands.find((c) => c.name === command) as Command;
    if (cmd) {
      // set defaults when command changes
      const defaults = cmd.flags.filter((f) => cmd.defaultFlags?.includes(f.value));
      setFlags(defaults);
    }
  }, [command]);

  useEffect(() => {
    const cmd = commands.find((c) => c.name === command) as Command;
    if (!cmd) return;

    const flagStrings = flags.map((flag) =>
      flag.requireInput
        ? `${flag.value}${flag.noSpace ? "" : " "}${flag.input || ""}`
        : flag.value,
    );

    const parts = [cmd.name, ...flagStrings].filter(Boolean);
    setFullCommand(parts.join(" "));
  }, [command, flags]);

  const allowedFlags = (commands.find((c) => c.name === command)?.flags) || [];

  return (
    <>
      <h1>Fuzzing</h1>

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
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            setCommand("ffuf");
            setFlags([
              { value: "-u", requireInput: true, input: "http://example.com/FUZZ" },
              { value: "-w", requireInput: true, input: "/usr/share/wordlists/common.txt" },
            ]);
          }}
        >
          Quick FFUF
        </button>
      </div>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Presets</legend>
        <div className="flex gap-4">
          <button type="button" className="btn btn-sm btn-primary" onClick={() => { setCommand("ffuf"); setFlags([{ value: "-u", requireInput: true, input: "http://example.com/FUZZ" }, { value: "-w", requireInput: true, input: "/usr/share/wordlists/common.txt" }]); }}>FFUF Default</button>
          <button type="button" className="btn btn-sm btn-primary" onClick={() => { setCommand("dirsearch"); setFlags([{ value: "-u", requireInput: true, input: "http://example.com" }, { value: "-w", requireInput: true, input: "/usr/share/wordlists/common.txt" }]); }}>Dirsearch Default</button>
          <button type="button" className="btn btn-sm btn-primary" onClick={() => { setCommand("dirbuster"); setFlags([{ value: "-u", requireInput: true, input: "http://example.com" }, { value: "-l", requireInput: true, input: "/usr/share/wordlists/directory-list-lowercase-2.3-medium.txt" }]); }}>Dirbuster Default</button>
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
          <legend className="fieldset-legend">Target / URL</legend>
          <input
            type="text"
            className="input"
            placeholder="http://example.com/FUZZ"
            value={flags.find((f) => f.value === "-u")?.input || ""}
            onChange={(e) => setFlags((prev) => prev.map(f => f.value === '-u' ? { ...f, input: e.target.value } : f))}
          />
        </fieldset>
      </div>

      <fieldset className="fieldset mt-4">
        <legend className="fieldset-legend">Flags</legend>
        <div className="flex flex-col gap-2">
          {allowedFlags.filter(f => showMore || !f.advanced).map((flag) => {
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
                        setFlags(prev => [...prev, { ...flag }]);
                      } else {
                        setFlags(prev => prev.filter((f) => f.value !== value));
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
                    placeholder={flag.input || 'value'}
                    value={inputValue}
                    onChange={(e) => {
                      const iv = e.target.value;
                      setFlags(prev => prev.map(f => f.value === flag.value ? { ...f, input: iv } : f));
                    }}
                    disabled={!checked}
                  />
                </div>
              </div>
            );
          })}

          {allowedFlags.some(f => f.advanced) && (
            <button type="button" className="btn btn-ghost btn-sm w-32" onClick={() => setShowMore(s => !s)}>{showMore ? 'Show less' : 'Show more'}</button>
          )}
        </div>
      </fieldset>
    </>
  );
}
