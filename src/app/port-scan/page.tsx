"use client";
import { useEffect, useState } from "react";

type Flag = {
  value: string;
  description?: string;
  requireInput: boolean;
  input?: string;
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
      flag.requireInput ? `${flag.value}${flag.input || ""}` : flag.value,
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
      <div className="flex gap-4">
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Command</legend>
          <select
            defaultValue="nmap"
            className="select"
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
            <label key={flag.value} className="hover:cursor-pointer">
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
              {flag.requireInput &&
                flags.some((f) => f.value === flag.value) && (
                  <input
                    type="text"
                    className="input ml-2"
                    placeholder="input"
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
            </label>
          ))}
        </div>
      </fieldset>
    </>
  );
}
