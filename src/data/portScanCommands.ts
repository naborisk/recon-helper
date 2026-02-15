import type { Command, Preset } from "../types/commands";

export const portScanCommands: Command[] = [
  {
    name: "nmap",
    description: "Network mapper",
    docsUrl: "https://nmap.org/book/man.html",
    flags: [
      // General / Detection
      {
        value: "-sC",
        description: "Enable default scripts",
        requireInput: false,
        category: "detection",
      },
      {
        value: "-sV",
        description: "Version detection",
        requireInput: false,
        category: "detection",
      },
      {
        value: "-O",
        description: "Enable OS detection",
        requireInput: false,
        advanced: true,
        category: "detection",
      },
      {
        value: "-A",
        description: "Aggressive scan (OS, version, scripts, traceroute)",
        requireInput: false,
        advanced: true,
        category: "detection",
      },

      // Port selection
      {
        value: "-p",
        description: "Specify ports (e.g., 22,80,1-1024)",
        requireInput: true,
        noSpace: true,
        category: "general",
      },
      {
        value: "--open",
        description: "Show only open ports",
        requireInput: false,
        category: "filter",
      },

      // Performance
      {
        value: "-T",
        description: "Timing template (0-5, higher=faster)",
        requireInput: true,
        input: "4",
        category: "performance",
      },
      {
        value: "-Pn",
        description: "Skip host discovery (treat as online)",
        requireInput: false,
        advanced: true,
        category: "performance",
      },

      // Output
      {
        value: "-oN",
        description: "Output normal format to file",
        requireInput: true,
        input: "scan.nmap",
        advanced: true,
        category: "output",
      },
      {
        value: "-oX",
        description: "Output XML format to file",
        requireInput: true,
        input: "scan.xml",
        advanced: true,
        category: "output",
      },
      {
        value: "-oG",
        description: "Output grepable format to file",
        requireInput: true,
        input: "scan.gnmap",
        advanced: true,
        category: "output",
      },
      {
        value: "--reason",
        description: "Show reason for port state",
        requireInput: false,
        advanced: true,
        category: "output",
      },
    ],
    defaultFlags: ["-sC", "-sV"],
  },
  {
    name: "masscan",
    description: "Mass IP port scanner (very fast)",
    docsUrl: "https://github.com/robertdavidgraham/masscan",
    flags: [
      {
        value: "-p",
        description: "Specify ports (e.g., 80,443 or 1-65535)",
        requireInput: true,
        noSpace: true,
        category: "general",
      },
      {
        value: "--rate",
        description: "Packets per second (use carefully!)",
        requireInput: true,
        input: "1000",
        advanced: true,
        category: "performance",
      },
      {
        value: "-e",
        description: "Network interface to use",
        requireInput: true,
        input: "eth0",
        advanced: true,
        category: "general",
      },
      {
        value: "-oL",
        description: "Output list format to file",
        requireInput: true,
        input: "scan.txt",
        advanced: true,
        category: "output",
      },
    ],
    defaultFlags: ["-p"],
  },
  {
    name: "rustscan",
    description: "Modern fast port scanner",
    docsUrl: "https://github.com/RustScan/RustScan",
    flags: [
      {
        value: "-a",
        description: "Target address(es)",
        requireInput: true,
        input: "10.10.10.10",
        category: "general",
      },
      {
        value: "-b",
        description: "Batch size (parallel hosts)",
        requireInput: true,
        input: "1024",
        advanced: true,
        category: "performance",
      },
      {
        value: "--ulimit",
        description: "File descriptor limit",
        requireInput: true,
        input: "4096",
        advanced: true,
        category: "performance",
      },
      {
        value: "-g",
        description: "Greppable output",
        requireInput: false,
        advanced: true,
        category: "output",
      },
      {
        value: "--",
        description: "Pass args to nmap (after --)",
        requireInput: true,
        input: "-sC -sV",
        advanced: true,
        category: "general",
      },
    ],
    defaultFlags: ["-a"],
  },
];

export const portScanPresets: Preset[] = [
  {
    label: "Nmap Default",
    description: "Basic service detection",
    command: "nmap",
    flags: [
      { value: "-sC", requireInput: false },
      { value: "-sV", requireInput: false },
    ],
  },
  {
    label: "Nmap Full Aggressive",
    description: "All ports with OS detection",
    command: "nmap",
    flags: [
      { value: "-A", requireInput: false },
      { value: "-p", requireInput: true, input: "1-65535", noSpace: true },
    ],
  },
  {
    label: "Nmap Quick",
    description: "Top 1000 ports, fast timing",
    command: "nmap",
    flags: [
      { value: "-sC", requireInput: false },
      { value: "-sV", requireInput: false },
      { value: "-T", requireInput: true, input: "4" },
    ],
  },
  {
    label: "Masscan Full",
    description: "All ports at 1000 pps",
    command: "masscan",
    flags: [
      { value: "-p", requireInput: true, input: "1-65535", noSpace: true },
      { value: "--rate", requireInput: true, input: "1000" },
    ],
  },
  {
    label: "Rustscan + Nmap",
    description: "Fast discovery, then nmap",
    command: "rustscan",
    flags: [
      { value: "-a", requireInput: true, input: "10.10.10.10" },
      { value: "--", requireInput: true, input: "-sC -sV" },
    ],
  },
];
