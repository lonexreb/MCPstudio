
import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  height?: string;
  showLineNumbers?: boolean;
}

interface Token {
  text: string;
  type: 'keyword' | 'string' | 'comment' | 'function' | 'plain';
}

const TOKEN_COLORS: Record<Token['type'], string> = {
  keyword: 'text-mcp-purple-400',
  string: 'text-green-400',
  comment: 'text-muted-foreground/60 italic',
  function: 'text-mcp-blue-400',
  plain: '',
};

const KEYWORDS = new Set([
  'function', 'return', 'const', 'let', 'var', 'if', 'else', 'for',
  'while', 'async', 'await', 'import', 'export', 'from', 'class',
  'new', 'this', 'try', 'catch', 'throw', 'typeof', 'true', 'false', 'null',
]);

function tokenizeLine(line: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < line.length) {
    // Comments
    if (line[i] === '/' && line[i + 1] === '/') {
      tokens.push({ text: line.slice(i), type: 'comment' });
      break;
    }

    // Strings
    if (line[i] === '"' || line[i] === "'" || line[i] === '`') {
      const quote = line[i];
      let j = i + 1;
      while (j < line.length && line[j] !== quote) {
        if (line[j] === '\\') j++;
        j++;
      }
      tokens.push({ text: line.slice(i, j + 1), type: 'string' });
      i = j + 1;
      continue;
    }

    // Words (keywords / function names)
    if (/[a-zA-Z_$]/.test(line[i])) {
      let j = i;
      while (j < line.length && /[a-zA-Z0-9_$]/.test(line[j])) j++;
      const word = line.slice(i, j);
      if (KEYWORDS.has(word)) {
        tokens.push({ text: word, type: 'keyword' });
      } else if (j < line.length && line[j] === '(') {
        tokens.push({ text: word, type: 'function' });
      } else {
        tokens.push({ text: word, type: 'plain' });
      }
      i = j;
      continue;
    }

    // Collect plain characters
    let j = i;
    while (j < line.length && !/[a-zA-Z_$"'`]/.test(line[j]) && !(line[j] === '/' && line[j + 1] === '/')) {
      j++;
    }
    if (j > i) {
      tokens.push({ text: line.slice(i, j), type: 'plain' });
    }
    i = j;
  }

  return tokens;
}

const CodeEditor = ({
  value,
  onChange,
  language = 'javascript',
  height = '300px',
  showLineNumbers = true
}: CodeEditorProps) => {
  const lineNumbers = value.split('\n').map((_, i) => i + 1).join('\n');

  const highlighted = useMemo(() => {
    return value.split('\n').map((line, lineIdx) => {
      const tokens = tokenizeLine(line);
      return (
        <div key={lineIdx}>
          {tokens.length === 0 ? '\n' : tokens.map((token, tokenIdx) => (
            <span key={tokenIdx} className={TOKEN_COLORS[token.type]}>
              {token.text}
            </span>
          ))}
        </div>
      );
    });
  }, [value]);

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
              "absolute inset-0 p-2 font-mono text-sm text-transparent caret-foreground bg-transparent resize-none",
              "focus:outline-none focus:ring-0 focus:border-primary",
              "w-full h-full leading-relaxed"
            )}
            spellCheck={false}
          />
          <pre className={cn("p-2 font-mono text-sm leading-relaxed pointer-events-none", "code-editor")}>
            {highlighted}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
