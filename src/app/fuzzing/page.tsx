"use client";

import { useState } from "react";

export default function Fuzzing() {
  const [fullCommand, setFullCommand] = useState<string>("ffuf");

  return (
    <>
      <h1>Fuzzing</h1>

      <div className="mockup-code w-full">
        <pre data-prefix="$">
          <code>{fullCommand}</code>
        </pre>
      </div>
    </>
  );
}
