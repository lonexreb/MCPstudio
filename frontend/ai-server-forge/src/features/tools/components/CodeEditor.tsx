
import React from 'react';
import { cn } from '@/lib/utils';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  height?: string;
  showLineNumbers?: boolean;
}

// This is a simple code editor component. In a real implementation,
// you might use Monaco Editor, CodeMirror, or another full-featured editor.
const CodeEditor = ({ 
  value, 
  onChange, 
  language = 'javascript', 
  height = '300px',
  showLineNumbers = true 
}: CodeEditorProps) => {
  // Simple syntax highlighting function for JavaScript
  const highlightSyntax = (code: string): string => {
    // This is a very basic implementation
    return code
      .replace(/\/\/.*/g, '<span class="code-token-comment">$&</span>')
      .replace(/(".*?"|'.*?'|`.*?`)/g, '<span class="code-token-string">$&</span>')
      .replace(/\b(function|return|const|let|var|if|else|for|while|async|await)\b/g, '<span class="code-token-keyword">$&</span>')
      .replace(/\b([A-Za-z]+)(?=\()/g, '<span class="code-token-property">$&</span>');
  };
  
  // Generate line numbers
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
              "absolute inset-0 p-2 font-mono text-transparent caret-foreground bg-transparent resize-none",
              "focus:outline-none focus:ring-0 focus:border-primary",
              "w-full h-full"
            )}
            spellCheck={false}
          />
          <pre 
            className={cn("p-2 font-mono text-sm leading-relaxed pointer-events-none", "code-editor")}
            dangerouslySetInnerHTML={{ __html: highlightSyntax(value) }}
          />
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
