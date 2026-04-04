
import React from 'react';
import { cn } from '@/lib/utils';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  height?: string;
  showLineNumbers?: boolean;
}

const CodeEditor = ({
  value,
  onChange,
  language = 'javascript',
  height = '300px',
  showLineNumbers = true
}: CodeEditorProps) => {
  const lineNumbers = value.split('\n').map((_, i) => i + 1).join('\n');

  return (
    <div className="border rounded-md overflow-hidden" style={{ height }}>
      <div className="flex h-full">
        {showLineNumbers && (
          <div className="bg-muted/50 text-right p-2 text-xs text-muted-foreground font-mono select-none w-12">
            <pre className="leading-relaxed">{lineNumbers}</pre>
          </div>
        )}
        <div className="flex-1 relative">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={cn(
              "absolute inset-0 p-2 font-mono text-sm bg-transparent resize-none",
              "focus:outline-none focus:ring-0 focus:border-primary",
              "w-full h-full leading-relaxed"
            )}
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
