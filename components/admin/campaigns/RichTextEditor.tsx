"use client";

import { useEffect, useRef } from "react";
import { Bold, Italic, Link2, List, ListOrdered, Slash, Sparkles, Underline } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
}

const TEMPLATE_VARIABLES = ["{{name}}", "{{email}}", "{{orderTotal}}"];

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write your campaign story...",
  className,
  readOnly = false,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const lastValueRef = useRef(value);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    if (value !== lastValueRef.current && editor.innerHTML !== value) {
      editor.innerHTML = value;
      lastValueRef.current = value;
    }
  }, [value]);

  const updateValue = () => {
    const editor = editorRef.current;
    if (!editor) return;
    const nextValue = editor.innerHTML;
    lastValueRef.current = nextValue;
    onChange(nextValue);
  };

  const exec = (command: string, commandValue?: string) => {
    if (readOnly) return;
    document.execCommand(command, false, commandValue);
    updateValue();
  };

  const insertVariable = (variable: string) => {
    if (readOnly) return;
    document.execCommand("insertText", false, variable);
    updateValue();
  };

  const insertLink = () => {
    if (readOnly) return;
    const url = window.prompt("Enter link URL");
    if (!url) return;
    document.execCommand("createLink", false, url);
    updateValue();
  };

  return (
    <div className={cn("space-y-3", className)}>
      {!readOnly ? (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border bg-muted/30 p-2">
          <Button type="button" variant="ghost" size="sm" onClick={() => exec("bold")}>
            <Bold className="mr-2 h-4 w-4" />
            Bold
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => exec("italic")}>
            <Italic className="mr-2 h-4 w-4" />
            Italic
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => exec("underline")}>
            <Underline className="mr-2 h-4 w-4" />
            Underline
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => exec("insertUnorderedList")}>
            <List className="mr-2 h-4 w-4" />
            Bullets
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => exec("insertOrderedList")}>
            <ListOrdered className="mr-2 h-4 w-4" />
            Numbered
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={insertLink}>
            <Link2 className="mr-2 h-4 w-4" />
            Link
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => exec("removeFormat")}>
            <Slash className="mr-2 h-4 w-4" />
            Clear
          </Button>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1 rounded-full border px-2 py-1">
          <Sparkles className="h-3 w-3" />
          Personalization
        </span>
        {TEMPLATE_VARIABLES.map((variable) => (
          <button
            key={variable}
            type="button"
            disabled={readOnly}
            onClick={() => insertVariable(variable)}
            className="rounded-full border border-dashed px-2 py-1 transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            {variable}
          </button>
        ))}
      </div>

      <div
        ref={editorRef}
        className={cn(
          "min-h-[220px] rounded-2xl border bg-background px-4 py-3 text-sm leading-7 shadow-sm outline-none transition-colors focus:border-primary",
          readOnly && "bg-muted/40 text-muted-foreground",
          !readOnly && "[&_*]:max-w-full",
          className
        )}
        contentEditable={!readOnly}
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        data-placeholder={placeholder}
        onInput={updateValue}
        onBlur={updateValue}
        dangerouslySetInnerHTML={{ __html: value || "" }}
      />
      <style jsx>{`
        [contenteditable='true']:empty:before {
          content: attr(data-placeholder);
          color: #94a3b8;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
