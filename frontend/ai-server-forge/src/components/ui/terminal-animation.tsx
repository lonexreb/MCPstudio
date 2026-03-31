import React, { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface TerminalLine {
  text: string;
  type?: 'info' | 'success' | 'error' | 'warning' | 'command';
}

interface TerminalAnimationProps {
  lines: TerminalLine[];
  speed?: number;
  onComplete?: () => void;
  className?: string;
  title?: string;
  autoScroll?: boolean;
}

const lineColors: Record<string, string> = {
  info: 'text-blue-400',
  success: 'text-green-400',
  error: 'text-red-400',
  warning: 'text-yellow-400',
  command: 'text-purple-400',
};

const linePrefix: Record<string, string> = {
  info: '[INFO]',
  success: '[OK]',
  error: '[ERR]',
  warning: '[WARN]',
  command: '$',
};

const TerminalAnimation = ({
  lines,
  speed = 120,
  onComplete,
  className,
  title = 'Terminal',
  autoScroll = true,
}: TerminalAnimationProps) => {
  const [visibleLines, setVisibleLines] = useState<TerminalLine[]>([]);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (lines.length === 0) return;

    let index = 0;
    const interval = setInterval(() => {
      if (index < lines.length) {
        setVisibleLines((prev) => [...prev, lines[index]]);
        index++;
      } else {
        clearInterval(interval);
        setIsComplete(true);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [lines, speed, onComplete]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (autoScroll && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [visibleLines, autoScroll]);

  return (
    <div className={cn('rounded-lg border bg-black overflow-hidden', className)}>
      <div className="flex items-center gap-1.5 px-3 py-2 bg-zinc-900 border-b border-zinc-800">
        <div className="h-3 w-3 rounded-full bg-red-500" />
        <div className="h-3 w-3 rounded-full bg-yellow-500" />
        <div className="h-3 w-3 rounded-full bg-green-500" />
        <span className="ml-2 text-xs text-zinc-500 font-mono">{title}</span>
      </div>
      <div
        ref={containerRef}
        className="p-4 font-mono text-sm max-h-64 overflow-y-auto"
      >
        {visibleLines.map((line, i) => {
          const type = line.type || 'info';
          return (
            <div key={i} className="leading-relaxed">
              <span className={cn('mr-2 opacity-60', lineColors[type])}>
                {linePrefix[type]}
              </span>
              <span className={lineColors[type]}>{line.text}</span>
            </div>
          );
        })}
        {!isComplete && (
          <span
            className={cn(
              'inline-block w-2 h-4 bg-green-400 ml-1 align-middle',
              cursorVisible ? 'opacity-100' : 'opacity-0',
            )}
          />
        )}
      </div>
    </div>
  );
};

export { TerminalAnimation };
export type { TerminalLine, TerminalAnimationProps };
