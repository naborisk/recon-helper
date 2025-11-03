"use client";
import { useEffect, useState } from "react";

type Flag = {
  value: string;
  description?: string;
  requireInput: boolean;
  input?: string;
  noSpace?: boolean;
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
      {
        value: "-sC",
        description: "Enable default scripts",
        requireInput: false,
      },
      { value: "-sV", description: "Version detection", requireInput: false },
      { value: "-O", description: "Enable OS detection", requireInput: false },
      {
        value: "-p",
        description: "Specify ports",
        requireInput: true,
        input: "-",
        noSpace: true,
      },
      {
        value: "-T",
        description: "Set timing template",
        requireInput: true,
      },
      {
        value: "--open",
        description: "Show only open ports",
        requireInput: false,
      },
      {
        value: "-A",
        description:
          "Enable OS detection, version detection, script scanning, and traceroute",
        requireInput: false,
      },
      {
        value: "-Pn",
        description: "Skip host discovery",
        requireInput: false,
      },
      {
        value: "-o",
        description: "Output to file",
        requireInput: true,
        input: "output.nmap",
      },
    ],
    defaultFlags: ["-sC", "-sV"],
  },
  {
    name: "masscan",
    description: "Mass port scanner",
    flags: [],
  },
  {
    name: "rustscan",
    description: "Fast port scanner",
    flags: [],
  },
];

export default function PortScan() {
  const [command, setCommand] = useState("nmap");
  const [target, setTarget] = useState("10.10.10.10");
  const [flags, setFlags] = useState<Flag[]>([]);
  const [fullCommand, setFullCommand] = useState("");

  const [allowedFlags, setAllowedFlags] = useState<Flag[]>([]);

  useEffect(() => {
    const flagStrings = flags.map((flag) =>
      flag.requireInput
        ? `${flag.value}${flag.noSpace ? "" : " "}${flag.input || ""}`
        : flag.value,
    );

    // setFullCommand(`${command} ${flagStrings.join(" ")} ${target}`);

    setFullCommand([command, ...flagStrings, target].join(" "));
  }, [command, flags, target]);

  useEffect(() => {
    const cmd = commands.find((c) => c.name === command);
    if (cmd) {
      setAllowedFlags(cmd.flags);
      // Reset flags to default for the selected command
      const defaultFlags: Flag[] = cmd.flags.filter((flag) => {
        return cmd.defaultFlags?.includes(flag.value);
      });
      setFlags(defaultFlags);
    }
  }, [command]);

  return (
    <>
      <h1>Port Scan</h1>
      <div className="mockup-code w-full">
        <pre data-prefix="$">
          <code>{fullCommand}</code>
        </pre>
      </div>
      <button
        type="button"
        onClick={() => {
          navigator.clipboard.writeText(fullCommand);
        }}
        className="btn btn-primary"
      >
        Copy
      </button>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Presets</legend>
        <div className="flex gap-4">
          <button
            type="button"
            className="btn btn-sm"
            onClick={() => {
              setCommand("nmap");
              setFlags([
                { value: "-sC", requireInput: false },
                { value: "-sV", requireInput: false },
              ]);
            }}
          >
            Nmap Default
          </button>
          <button
            type="button"
            className="btn btn-sm"
            onClick={() => {
              setCommand("nmap");
              setFlags([
                { value: "-A", requireInput: false },
                {
                  value: "-p",
                  requireInput: true,
                  input: "1-65535",
                  noSpace: true,
                },
              ]);
            }}
          >
            Nmap Aggressive Full Port Scan
          </button>
        </div>
      </fieldset>

      <div className="flex gap-4">
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Command</legend>
          <select
            defaultValue="nmap"
            className="select"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
          >
            <option>nmap</option>
            <option>masscan</option>
            <option>rustscan</option>
          </select>
        </fieldset>
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Target</legend>
          <input
            type="text"
            className="input"
            placeholder="10.10.10.10"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          />
        </fieldset>
      </div>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">Flags</legend>
        <div className="flex flex-col gap-4">
          {allowedFlags.map((flag) => (
            <div key={flag.value} className="flex h-6 items-center">
              <label className="hover:cursor-pointer">
                <input
                  type="checkbox"
                  className="checkbox mr-2"
                  value={flag.value}
                  checked={flags.some((f) => f.value === flag.value)}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (e.target.checked) {
                      setFlags((prev) => [...prev, flag]);
                    } else {
                      setFlags((prev) => prev.filter((f) => f.value !== value));
                    }
                  }}
                />
                {flag.value}: {flag.description}
                {flag.requireInput ? " (requires input)" : ""}
              </label>
              {flag.requireInput &&
                flags.some((f) => f.value === flag.value) && (
                  <input
                    type="text"
                    className="input ml-2"
                    placeholder="Flag input"
                    value={
                      flags.find((f) => f.value === flag.value)?.input || ""
                    }
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      setFlags((prev) =>
                        prev.map((f) =>
                          f.value === flag.value
                            ? { ...f, input: inputValue }
                            : f,
                        ),
                      );
                    }}
                  />
                )}
            </div>
          ))}
        </div>
      </fieldset>
    </>
  );
}
