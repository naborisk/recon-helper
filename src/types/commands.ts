export type Flag = {
  value: string;
  description?: string;
  requireInput: boolean;
  input?: string;
  noSpace?: boolean;
  advanced?: boolean;
  category?: "output" | "detection" | "performance" | "filter" | "general";
};

export type Command = {
  name: string;
  description?: string;
  docsUrl: string;
  flags: Flag[];
  defaultFlags?: string[];
};

export type Preset = {
  label: string;
  description: string;
  command: string;
  flags: Flag[];
};
