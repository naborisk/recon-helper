import type { Command, Preset } from "../types/commands";

export const fuzzingCommands: Command[] = [
  {
    name: "ffuf",
    description: "Fast web fuzzer",
    docsUrl: "https://github.com/ffuf/ffuf",
    flags: [
      // Required
      {
        value: "-u",
        description: "Target URL (use FUZZ as placeholder)",
        requireInput: true,
        input: "http://example.com/FUZZ",
        category: "general",
      },
      {
        value: "-w",
        description: "Wordlist path",
        requireInput: true,
        input: "/usr/share/wordlists/dirb/common.txt",
        category: "general",
      },

      // Performance
      {
        value: "-t",
        description: "Number of concurrent threads",
        requireInput: true,
        input: "40",
        category: "performance",
      },
      {
        value: "-rate",
        description: "Rate limit (requests/sec)",
        requireInput: true,
        input: "100",
        advanced: true,
        category: "performance",
      },

      // Filtering
      {
        value: "-mc",
        description: "Match HTTP status codes",
        requireInput: true,
        input: "200,301,302",
        category: "filter",
      },
      {
        value: "-fc",
        description: "Filter HTTP status codes",
        requireInput: true,
        input: "404",
        advanced: true,
        category: "filter",
      },
      {
        value: "-fs",
        description: "Filter by response size (bytes)",
        requireInput: true,
        advanced: true,
        category: "filter",
      },
      {
        value: "-fw",
        description: "Filter by word count",
        requireInput: true,
        advanced: true,
        category: "filter",
      },
      {
        value: "-fl",
        description: "Filter by line count",
        requireInput: true,
        advanced: true,
        category: "filter",
      },
      {
        value: "-mr",
        description: "Match by regex pattern",
        requireInput: true,
        advanced: true,
        category: "filter",
      },

      // Headers & Auth
      {
        value: "-H",
        description: "Add header (Header: Value)",
        requireInput: true,
        input: "Host: example.com",
        advanced: true,
        category: "general",
      },
      {
        value: "-b",
        description: "Cookie data",
        requireInput: true,
        advanced: true,
        category: "general",
      },

      // Recursion & Output
      {
        value: "-recursion",
        description: "Enable recursive scanning",
        requireInput: false,
        advanced: true,
        category: "general",
      },
      {
        value: "-recursion-depth",
        description: "Maximum recursion depth",
        requireInput: true,
        input: "2",
        advanced: true,
        category: "general",
      },
      {
        value: "-o",
        description: "Output file path",
        requireInput: true,
        input: "ffuf_results.json",
        advanced: true,
        category: "output",
      },
      {
        value: "-of",
        description: "Output format (json,csv,html)",
        requireInput: true,
        input: "json",
        advanced: true,
        category: "output",
      },
    ],
    defaultFlags: ["-u", "-w"],
  },
  {
    name: "gobuster",
    description: "Directory/file brute-forcer",
    docsUrl: "https://github.com/OJ/gobuster",
    flags: [
      {
        value: "dir",
        description: "Directory brute-force mode",
        requireInput: false,
        category: "general",
      },
      {
        value: "-u",
        description: "Target URL",
        requireInput: true,
        input: "http://example.com",
        category: "general",
      },
      {
        value: "-w",
        description: "Wordlist path",
        requireInput: true,
        input: "/usr/share/wordlists/dirb/common.txt",
        category: "general",
      },

      {
        value: "-t",
        description: "Number of threads",
        requireInput: true,
        input: "10",
        category: "performance",
      },

      {
        value: "-x",
        description: "File extensions to search",
        requireInput: true,
        input: "php,html,txt",
        advanced: true,
        category: "filter",
      },
      {
        value: "-s",
        description: "Status codes to include",
        requireInput: true,
        input: "200,204,301,302",
        advanced: true,
        category: "filter",
      },
      {
        value: "-b",
        description: "Status codes to exclude",
        requireInput: true,
        input: "404",
        advanced: true,
        category: "filter",
      },

      {
        value: "-k",
        description: "Skip TLS certificate verification",
        requireInput: false,
        advanced: true,
        category: "general",
      },
      {
        value: "-o",
        description: "Output file path",
        requireInput: true,
        input: "gobuster.txt",
        advanced: true,
        category: "output",
      },
    ],
    defaultFlags: ["dir", "-u", "-w"],
  },
  {
    name: "dirsearch",
    description: "Web path scanner (Python)",
    docsUrl: "https://github.com/maurosoria/dirsearch",
    flags: [
      {
        value: "-u",
        description: "Target URL",
        requireInput: true,
        input: "http://example.com",
        category: "general",
      },
      {
        value: "-w",
        description: "Wordlist path",
        requireInput: true,
        input: "/usr/share/wordlists/dirb/common.txt",
        category: "general",
      },

      {
        value: "-t",
        description: "Number of threads",
        requireInput: true,
        input: "10",
        category: "performance",
      },

      {
        value: "-e",
        description: "Extensions (comma-separated)",
        requireInput: true,
        input: "php,html,js",
        advanced: true,
        category: "filter",
      },
      {
        value: "-i",
        description: "Include status codes",
        requireInput: true,
        input: "200,301",
        advanced: true,
        category: "filter",
      },
      {
        value: "-x",
        description: "Exclude status codes",
        requireInput: true,
        input: "404,403",
        advanced: true,
        category: "filter",
      },

      {
        value: "-r",
        description: "Enable recursive scanning",
        requireInput: false,
        advanced: true,
        category: "general",
      },
      {
        value: "-o",
        description: "Output file path",
        requireInput: true,
        input: "dirsearch.txt",
        advanced: true,
        category: "output",
      },
      {
        value: "--format",
        description: "Output format (plain,json,xml)",
        requireInput: true,
        input: "json",
        advanced: true,
        category: "output",
      },
    ],
    defaultFlags: ["-u", "-w"],
  },
  {
    name: "feroxbuster",
    description: "Fast recursive content discovery",
    docsUrl: "https://github.com/epi052/feroxbuster",
    flags: [
      {
        value: "-u",
        description: "Target URL",
        requireInput: true,
        input: "http://example.com",
        category: "general",
      },
      {
        value: "-w",
        description: "Wordlist path",
        requireInput: true,
        input: "/usr/share/wordlists/dirb/common.txt",
        category: "general",
      },

      {
        value: "-t",
        description: "Number of threads",
        requireInput: true,
        input: "50",
        category: "performance",
      },

      {
        value: "-x",
        description: "Extensions (comma-separated)",
        requireInput: true,
        input: "php,html",
        advanced: true,
        category: "filter",
      },
      {
        value: "-s",
        description: "Status codes to include",
        requireInput: true,
        input: "200,301,302",
        advanced: true,
        category: "filter",
      },
      {
        value: "-C",
        description: "Status codes to exclude",
        requireInput: true,
        input: "404",
        advanced: true,
        category: "filter",
      },

      {
        value: "-d",
        description: "Max recursion depth",
        requireInput: true,
        input: "2",
        advanced: true,
        category: "general",
      },
      {
        value: "-k",
        description: "Skip TLS certificate verification",
        requireInput: false,
        advanced: true,
        category: "general",
      },
      {
        value: "-o",
        description: "Output file path",
        requireInput: true,
        input: "ferox.txt",
        advanced: true,
        category: "output",
      },
    ],
    defaultFlags: ["-u", "-w"],
  },
];

export const fuzzingPresets: Preset[] = [
  {
    label: "FFUF Basic",
    description: "Directory fuzzing with common wordlist",
    command: "ffuf",
    flags: [
      { value: "-u", requireInput: true, input: "http://example.com/FUZZ" },
      {
        value: "-w",
        requireInput: true,
        input: "/usr/share/wordlists/dirb/common.txt",
      },
      { value: "-mc", requireInput: true, input: "200,301,302" },
    ],
  },
  {
    label: "FFUF Fast",
    description: "High-speed fuzzing",
    command: "ffuf",
    flags: [
      { value: "-u", requireInput: true, input: "http://example.com/FUZZ" },
      {
        value: "-w",
        requireInput: true,
        input: "/usr/share/wordlists/dirb/common.txt",
      },
      { value: "-t", requireInput: true, input: "100" },
      { value: "-mc", requireInput: true, input: "200,301,302" },
    ],
  },
  {
    label: "FFUF Vhost",
    description: "Virtual host discovery",
    command: "ffuf",
    flags: [
      { value: "-u", requireInput: true, input: "http://example.com" },
      {
        value: "-w",
        requireInput: true,
        input:
          "/usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt",
      },
      { value: "-H", requireInput: true, input: "Host: FUZZ.example.com" },
    ],
  },
  {
    label: "Gobuster Thorough",
    description: "With common extensions",
    command: "gobuster",
    flags: [
      { value: "dir", requireInput: false },
      { value: "-u", requireInput: true, input: "http://example.com" },
      {
        value: "-w",
        requireInput: true,
        input: "/usr/share/wordlists/dirb/common.txt",
      },
      { value: "-x", requireInput: true, input: "php,html,txt,bak" },
    ],
  },
  {
    label: "Feroxbuster Recursive",
    description: "Deep recursive scan",
    command: "feroxbuster",
    flags: [
      { value: "-u", requireInput: true, input: "http://example.com" },
      {
        value: "-w",
        requireInput: true,
        input: "/usr/share/wordlists/dirb/common.txt",
      },
      { value: "-d", requireInput: true, input: "3" },
      { value: "-x", requireInput: true, input: "php,html" },
    ],
  },
];
