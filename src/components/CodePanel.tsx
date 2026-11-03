import React, { useRef } from 'react';
import { Terminal, Copy, Check, Sparkles } from 'lucide-react';

interface CodePanelProps {
  mode: 'blocks' | 'python';
  code: string;
  onChangeCode: (newCode: string) => void;
  hoveredLineNumber: number | null;
  onHoverLine: (lineNum: number | null) => void;
  activeLineNumber?: number;
  highlightedLines?: number[]; // lines corresponding to hovered block
  logs: { msg: string; type: 'info' | 'error' | 'say'; timestamp: string }[];
  onClearLogs: () => void;
  blockCount: number;
}

export const CodePanel: React.FC<CodePanelProps> = ({
  mode,
  code,
  onChangeCode,
  hoveredLineNumber,
  onHoverLine,
  activeLineNumber,
  highlightedLines = [],
  logs,
  onClearLogs,
  blockCount,
}) => {
  const [copied, setCopied] = React.useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const lines = code.split('\n');
  const lineCount = lines.length;

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Custom key handling for Tab in Python mode
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;

      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      onChangeCode(newCode);

      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 4;
      }, 0);
    }
  };

  return (
    <div className="flex flex-col h-full bg-panel-dark text-panel-text rounded-xl border-ink-2 shadow-hard overflow-hidden font-mono">
      {/* Top Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#141324] border-b border-[#2D2A4A] text-xs">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-danger"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-yellow"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-lime"></span>
          </div>
          <span className="font-bold text-[#A5A0D6]">
            {mode === 'blocks' ? 'main.py (Live Preview)' : 'main.py (Python Mode)'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {mode === 'blocks' && (
            <div className="hidden sm:inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-violet/30 border border-violet/50 text-[#D8CEFF]">
              <Sparkles className="w-3 h-3 text-yellow" />
              <span>{blockCount} blocks → {lineCount} lines</span>
            </div>
          )}

          <button
            onClick={handleCopy}
            className="p-1 rounded hover:bg-white/10 text-[#A5A0D6] hover:text-white transition-colors"
            title="Copy Python Code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-lime" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Editor / Live Viewer Area */}
      <div className="flex-1 overflow-auto dark-scrollbar p-2 text-sm relative min-h-[220px]">
        {mode === 'blocks' ? (
          // Read-only synchronized line viewer
          <div className="flex flex-col">
            {lines.map((lineText, idx) => {
              const lineNum = idx + 1;
              const isHovered = hoveredLineNumber === lineNum;
              const isMatchedByBlock = highlightedLines.includes(lineNum);
              const isActive = activeLineNumber === lineNum;

              return (
                <div
                  key={idx}
                  onMouseEnter={() => onHoverLine(lineNum)}
                  onMouseLeave={() => onHoverLine(null)}
                  className={`flex items-start px-2 py-0.5 rounded transition-colors ${
                    isActive
                      ? 'bg-lime/25 text-lime font-bold'
                      : isMatchedByBlock
                      ? 'bg-violet/35 text-white font-medium shadow-[0_0_8px_rgba(123,92,255,0.4)]'
                      : isHovered
                      ? 'bg-white/10'
                      : ''
                  }`}
                >
                  <span className="w-8 select-none text-[#645F8E] text-right pr-3 text-xs pt-[2px]">
                    {lineNum}
                  </span>
                  <pre className="font-mono text-[13px] leading-relaxed whitespace-pre font-normal text-[#E2DEFF]">
                    {lineText || ' '}
                  </pre>
                </div>
              );
            })}
          </div>
        ) : (
          // Python Code Mode Editor
          <div className="relative flex min-h-full">
            <div className="w-8 select-none text-[#645F8E] text-right pr-2 text-xs pt-2 space-y-[2px]">
              {lines.map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => onChangeCode(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              className="flex-1 bg-transparent text-[#EDEAFF] font-mono text-[13px] leading-relaxed resize-none outline-none border-none pl-2 pt-1.5 dark-scrollbar min-h-[220px]"
            />
          </div>
        )}
      </div>

      {/* Integrated Console Terminal (Bottom 120px) */}
      <div className="h-[125px] flex flex-col bg-[#11101E] border-t border-[#2D2A4A] text-xs">
        <div className="flex items-center justify-between px-3 py-1 bg-[#181729] border-b border-[#282544] text-[#8F8ABF]">
          <div className="flex items-center gap-1.5 font-bold">
            <Terminal className="w-3.5 h-3.5 text-lime" />
            <span>Terminal Output</span>
          </div>
          <button
            onClick={onClearLogs}
            className="text-[11px] text-[#736E9B] hover:text-[#EDEAFF] transition-colors"
          >
            Clear
          </button>
        </div>

        <div
          role="region"
          aria-live="polite"
          className="flex-1 overflow-y-auto p-2.5 font-mono space-y-1 dark-scrollbar select-text"
        >
          {logs.length === 0 ? (
            <div className="text-[#55507E] italic">No run logs yet. Hit Run or Step to execute.</div>
          ) : (
            logs.map((log, index) => (
              <div
                key={index}
                className={`leading-tight flex items-start gap-1.5 ${
                  log.type === 'error'
                    ? 'text-danger font-bold'
                    : log.type === 'info'
                    ? 'text-lime'
                    : 'text-[#FFD23F]'
                }`}
              >
                <span className="text-[#4E4A77] select-none">[{log.timestamp}]</span>
                <span>{log.msg}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

