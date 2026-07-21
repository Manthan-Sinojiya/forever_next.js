"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

export default function RichTextEditor({ value, onChange }: { value: string; onChange: (content: string) => void }) {
  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: "Write your description here...",
      height: 350,
      buttons: [
        "bold", "italic", "underline", "strikethrough", "|",
        "ul", "ol", "|",
        "font", "fontsize", "brush", "paragraph", "|",
        "image", "video", "table", "link", "|",
        "align", "undo", "redo", "hr", "eraser", "source"
      ]
    }),
    []
  );

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-slate-200">
      <JoditEditor
        value={value}
        config={config}
        onBlur={(newContent) => onChange(newContent)} // prefer onBlur for performance
      />
    </div>
  );
}
