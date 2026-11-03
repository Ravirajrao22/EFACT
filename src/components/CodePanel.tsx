import React, { useRef, useState, useEffect } from 'react';
import {
  Terminal,
  Copy,
  Check,
  Sparkles,
  Download,
  Blocks,
  AlertTriangle,
  ChevronDown,
} from 'lucide-react';

export interface SnippetItem {
  title: string;
  code: string;
}

export const STARTER_SNIPPETS: SnippetItem[] = [
  {
    title: '1. Walk to goal',
    code: `# Walk directly toward the mission goal
bot.forward(5)
`,
  },
  {
    title: '2. Square loop',
    code: `# Drive in a complete square pattern
for i in range(4):
    bot.forward(3)
    bot.turn_right()
`,
  },
  {
    title: '3. Wall hugger',
    code: `# Advance until an obstacle is detected
while not bot.wall_ahead():
    bot.forward(1)
`,
  },
  {
    title: '4. Smart turn',
    code: `# Navigate around walls until reaching the goal
while not bot.at_goal():
    if bot.wall_ahead():
        bot.turn_right()
    else:
        bot.forward(1)
`,
  },
  {
    title: '5. Custom move',
    code: `# Define a reusable zigzag movement function
def zigzag():
    bot.forward(1)
    bot.turn_right()
    bot.forward(1)
    bot.turn_left()

for i in range(3):
    zigzag()
`,
  },
];

interface AutocompleteMethod {
  name: string;
  snippet: string;
  desc: string;
}

const BOT_METHODS: AutocompleteMethod[] = [
  { name: 'bot.forward(n)', snippet: 'bot.forward(1)', desc: 'Move forward n tiles (default 1)' },
  { name: 'bot.backward(n)', snippet: 'bot.backward(1)', desc: 'Move backward n tiles (default 1)' },
  { name: 'bot.turn_left()', snippet: 'bot.turn_left()', desc: 'Turn 90° counter-clockwise' },
  { name: 'bot.turn_right()', snippet: 'bot.turn_right()', desc: 'Turn 90° clockwise' },
  { name: 'bot.pick_up()', snippet: 'bot.pick_up()', desc: 'Collect star/item on current tile' },
  { name: 'bot.drop()', snippet: 'bot.drop()', desc: 'Drop carrying star/item' },
  { name: 'bot.say(text)', snippet: 'bot.say("Hello!")', desc: 'Display speech message in terminal' },
  { name: 'bot.wall_ahead()', snippet: 'bot.wall_ahead()', desc: 'Check if obstacle is directly ahead (bool)' },
  { name: 'bot.on_line()', snippet: 'bot.on_line()', desc: 'Check if robot is on line tile (bool)' },
  { name: 'bot.at_goal()', snippet: 'bot.at_goal()', desc: 'Check if robot has completed goal (bool)' },
  { name: 'bot.distance()', snippet: 'bot.distance()', desc: 'Distance to obstacle ahead in tiles' },
  { name: 'bot.steps()', snippet: 'bot.steps()', desc: 'Total steps taken so far (int)' },
  { name: 'bot.stars()', snippet: 'bot.stars()', desc: 'Total stars collected so far (int)' },
  { name: 'bot.facing()', snippet: 'bot.facing()', desc: 'Direction facing ("N", "E", "S", "W")' },
  { name: 'bot.position()', snippet: 'bot.position()', desc: 'Current coordinates (x, y)' },
];

interface CodePanelProps {
  mode: 'blocks' | 'python';
  code: string;
  onChangeCode: (newCode: string) => void;
  onSwitchMode?: (newMode: 'blocks' | 'python') => void;
  hoveredLineNumber: number | null;
  onHoverLine: (lineNum: number | null) => void;
  activeLineNumber?: number;
  highlightedLines?: number[]; // lines corresponding to hovered block
  logs: { msg: string; type: 'info' | 'error' | 'say'; timestamp: string }[];
  onClearLogs: () => void;
  blockCount: number;
  stepsTaken?: number;
  starsCollected?: number;
  onShowAsBlocks?: () => void;
  onSelectSnippet?: (snippetCode: string) => void;
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
  stepsTaken = 0,
  starsCollected = 0,
  onShowAsBlocks,
  onSelectSnippet,
}) => {
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Autocomplete state
  const [acOpen, setAcOpen] = useState(false);
  const [acIndex, setAcIndex] = useState(0);
  const [acFilter, setAcFilter] = useState('');
  const [acReplaceStart, setAcReplaceStart] = useState<number>(0);

  // Parse lines
  const lines = code.split('\n');
  const lineCount = lines.length;

  // Detect latest error line if present
  const errorInfo = React.useMemo(() => {
    const lastErr = [...logs].reverse().find((l) => l.type === 'error');
    if (!lastErr) return null;
    const match = lastErr.msg.match(/Line\s+(\d+)/i);
    const lineNum = match ? Number(match[1]) : null;
    return {
      line: lineNum,
      msg: lastErr.msg,
    };
  }, [logs]);

  // Filter autocomplete methods
  const filteredMethods = React.useMemo(() => {
    if (!acFilter) return BOT_METHODS;
    const q = acFilter.toLowerCase();
    return BOT_METHODS.filter(
      (m) => m.name.toLowerCase().includes(q) || m.desc.toLowerCase().includes(q)
    );
  }, [acFilter]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'robot_mission.py';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSnippetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const idx = Number(e.target.value);
    if (isNaN(idx) || !STARTER_SNIPPETS[idx]) return;
    const snippet = STARTER_SNIPPETS[idx];

    // Confirm if code was modified
    if (code.trim().length > 0 && !code.includes(snippet.title)) {
      const confirmReplace = window.confirm(
        `Load snippet "${snippet.title}"? Your current editor code will be replaced.`
      );
      if (!confirmReplace) {
        e.target.value = '';
        return;
      }
    }

    if (onSelectSnippet) {
      onSelectSnippet(snippet.code);
    } else {
      onChangeCode(snippet.code);
    }
    e.target.value = '';
  };

  // Insert autocomplete suggestion
  const insertAutocomplete = (method: AutocompleteMethod) => {
    if (!textareaRef.current) return;
    const el = textareaRef.current;
    const curPos = el.selectionStart;

    const before = code.substring(0, acReplaceStart);
    const after = code.substring(curPos);
    const inserted = method.snippet;
    const newCode = before + inserted + after;
    onChangeCode(newCode);

    setAcOpen(false);

    // Place cursor inside parentheses if applicable
    const parenIdx = inserted.indexOf('(');
    const newCursor =
      parenIdx !== -1 && !inserted.endsWith('()')
        ? acReplaceStart + parenIdx + 1
        : acReplaceStart + inserted.length;

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.selectionStart = textareaRef.current.selectionEnd = newCursor;
      }
    }, 0);
  };

  // Check for "bot." trigger
  const checkAutocompleteTrigger = (text: string, pos: number) => {
    const beforeCursor = text.substring(0, pos);
    const lastBot = beforeCursor.lastIndexOf('bot.');
    if (lastBot !== -1 && lastBot >= pos - 20) {
      const query = beforeCursor.substring(lastBot + 4);
      // Valid identifier characters for query
      if (/^[a-zA-Z_]*$/.test(query)) {
        setAcReplaceStart(lastBot);
        setAcFilter(query);
        setAcIndex(0);
        setAcOpen(true);
        return;
      }
    }
    setAcOpen(false);
  };

  // Key handling for autocomplete, auto-closing brackets, and indentation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    const start = target.selectionStart;
    const end = target.selectionEnd;

    // Autocomplete navigation
    if (acOpen && filteredMethods.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setAcIndex((prev) => (prev + 1) % filteredMethods.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setAcIndex((prev) => (prev - 1 + filteredMethods.length) % filteredMethods.length);
        return;
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        insertAutocomplete(filteredMethods[acIndex]);
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setAcOpen(false);
        return;
      }
    }

    // Auto-close brackets and quotes
    const autoPairs: Record<string, string> = {
      '(': ')',
      '[': ']',
      '{': '}',
      '"': '"',
      "'": "'",
    };

    if (autoPairs[e.key] && start === end) {
      e.preventDefault();
      const openChar = e.key;
      const closeChar = autoPairs[openChar];
      const newCode = code.substring(0, start) + openChar + closeChar + code.substring(end);
      onChangeCode(newCode);
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 1;
        checkAutocompleteTrigger(newCode, start + 1);
      }, 0);
      return;
    }

    // Tab = 4 spaces, Shift+Tab = outdent
    if (e.key === 'Tab') {
      e.preventDefault();
      if (e.shiftKey) {
        // Outdent line
        const lineStart = code.lastIndexOf('\n', start - 1) + 1;
        const linePrefix = code.substring(lineStart, lineStart + 4);
        const spacesToRemove = linePrefix.match(/^ {1,4}/)?.[0].length || 0;
        if (spacesToRemove > 0) {
          const newCode = code.substring(0, lineStart) + code.substring(lineStart + spacesToRemove);
          onChangeCode(newCode);
          setTimeout(() => {
            target.selectionStart = target.selectionEnd = Math.max(lineStart, start - spacesToRemove);
          }, 0);
        }
      } else {
        // Indent 4 spaces
        const newCode = code.substring(0, start) + '    ' + code.substring(end);
        onChangeCode(newCode);
        setTimeout(() => {
          target.selectionStart = target.selectionEnd = start + 4;
        }, 0);
      }
      return;
    }

    // Dismiss AC on escape
    if (e.key === 'Escape') {
      setAcOpen(false);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    const pos = e.target.selectionStart;
    onChangeCode(val);
    checkAutocompleteTrigger(val, pos);
  };

  return (
    <div className="flex flex-col h-full bg-panel-dark text-panel-text rounded-xl border-ink-2 shadow-hard overflow-hidden font-mono relative">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between px-3 py-2 bg-[#141324] border-b border-[#2D2A4A] text-xs gap-2">
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

        {/* Toolbar Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {mode === 'python' ? (
            <>
              {/* Snippets Dropdown */}
              <div className="relative flex items-center">
                <select
                  value=""
                  onChange={handleSnippetChange}
                  className="bg-[#24213B] text-[#D8CEFF] border border-[#3E3A66] rounded-md px-2 py-1 text-[11px] font-mono font-bold hover:border-lime focus:outline-none cursor-pointer pr-6 appearance-none"
                  aria-label="Starter Code Snippets"
                >
                  <option value="" disabled>
                    Try a snippet
                  </option>
                  {STARTER_SNIPPETS.map((s, idx) => (
                    <option key={idx} value={idx}>
                      {s.title}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3 h-3 text-[#A5A0D6] absolute right-1.5 pointer-events-none" />
              </div>

              {/* Show as Blocks Peek Button */}
              {onShowAsBlocks && (
                <button
                  onClick={onShowAsBlocks}
                  className="inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded bg-[#2E2A4D] hover:bg-[#3E3866] text-[#DDD8FF] border border-[#3E3A66] transition-colors"
                  title="Show read-only blocks corresponding to this Python code"
                >
                  <Blocks className="w-3 h-3 text-yellow" />
                  <span>Show as blocks</span>
                </button>
              )}

              {/* Download .py Button */}
              <button
                onClick={handleDownload}
                className="p-1 rounded hover:bg-white/10 text-[#A5A0D6] hover:text-white transition-colors"
                title="Download .py file"
                aria-label="Download Python File"
              >
                <Download className="w-3.5 h-3.5 text-[#B8B2E8]" />
              </button>
            </>
          ) : (
            <div className="hidden sm:inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-violet/30 border border-violet/50 text-[#D8CEFF]">
              <Sparkles className="w-3 h-3 text-yellow" />
              <span>
                {blockCount} blocks → {lineCount} lines
              </span>
            </div>
          )}

          {/* Copy Code Button */}
          <button
            onClick={handleCopy}
            className="p-1 rounded hover:bg-white/10 text-[#A5A0D6] hover:text-white transition-colors"
            title="Copy Python Code"
            aria-label="Copy Python Code"
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
              const isError = errorInfo?.line === lineNum;

              return (
                <div
                  key={idx}
                  onMouseEnter={() => onHoverLine(lineNum)}
                  onMouseLeave={() => onHoverLine(null)}
                  className={`flex items-start px-2 py-0.5 rounded transition-all ${
                    isActive
                      ? 'bg-violet/30 text-white font-bold shadow-[0_0_12px_rgba(123,92,255,0.7)] border-l-2 border-violet'
                      : isMatchedByBlock
                      ? 'bg-violet/25 text-white font-medium shadow-[0_0_8px_rgba(123,92,255,0.4)]'
                      : isHovered
                      ? 'bg-white/10'
                      : isError
                      ? 'bg-danger/20 border-l-2 border-danger'
                      : ''
                  }`}
                >
                  <span className="w-8 select-none text-[#645F8E] text-right pr-3 text-xs pt-[2px] flex items-center justify-end gap-1">
                    {isActive && <span className="text-violet animate-pulse text-[10px]">▶</span>}
                    {isError && (
                      <span title={errorInfo?.msg}>
                        <AlertTriangle className="w-3 h-3 text-danger" />
                      </span>
                    )}
                    <span>{lineNum}</span>
                  </span>
                  <pre
                    className={`font-mono text-[13px] leading-relaxed whitespace-pre font-normal ${
                      isError
                        ? 'text-danger underline decoration-wavy decoration-danger'
                        : 'text-[#E2DEFF]'
                    }`}
                  >
                    {lineText || ' '}
                  </pre>
                </div>
              );
            })}
          </div>
        ) : (
          // Python Code Mode Editor with live gutter highlight & error squiggles
          <div className="relative flex min-h-full">
            {/* Line Number & Indicator Gutter */}
            <div className="w-10 select-none text-right pr-2 text-xs pt-1.5 space-y-[2px]">
              {lines.map((_, i) => {
                const lineNum = i + 1;
                const isActive = activeLineNumber === lineNum;
                const isError = errorInfo?.line === lineNum;

                return (
                  <div
                    key={i}
                    className={`h-[22px] flex items-center justify-end gap-1 px-1 rounded transition-colors ${
                      isActive
                        ? 'bg-violet text-white font-bold shadow-[0_0_8px_rgba(123,92,255,0.8)]'
                        : isError
                        ? 'bg-danger/30 text-danger font-bold'
                        : 'text-[#645F8E]'
                    }`}
                    title={isError ? errorInfo?.msg : undefined}
                  >
                    {isActive && <span className="text-yellow text-[9px]">▶</span>}
                    {isError && <AlertTriangle className="w-3 h-3 text-danger shrink-0" />}
                    <span>{lineNum}</span>
                  </div>
                );
              })}
            </div>

            {/* Code Textarea */}
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={code}
                onChange={handleTextChange}
                onKeyDown={handleKeyDown}
                onClick={(e) => checkAutocompleteTrigger(code, e.currentTarget.selectionStart)}
                onKeyUp={(e) => checkAutocompleteTrigger(code, e.currentTarget.selectionStart)}
                spellCheck={false}
                className="w-full h-full bg-transparent text-[#EDEAFF] font-mono text-[13px] leading-[22px] resize-none outline-none border-none pl-2 pt-1.5 dark-scrollbar min-h-[220px]"
              />

              {/* Autocomplete Popup */}
              {acOpen && filteredMethods.length > 0 && (
                <div
                  className="absolute z-50 left-2 top-8 w-80 max-h-64 overflow-y-auto bg-[#1C1A30] border-2 border-violet rounded-lg shadow-hard-lg text-xs font-mono dark-scrollbar"
                  role="listbox"
                  aria-label="Robot Methods Autocomplete"
                >
                  <div className="px-2.5 py-1 bg-[#141224] border-b border-[#2D2A4A] text-[10px] uppercase font-bold text-[#A5A0D6] flex justify-between items-center">
                    <span>Robot API Methods</span>
                    <span className="text-[9px] text-[#7872A6]">↑↓ Enter to choose</span>
                  </div>
                  {filteredMethods.map((m, idx) => (
                    <button
                      key={m.name}
                      onClick={() => insertAutocomplete(m)}
                      onMouseEnter={() => setAcIndex(idx)}
                      className={`w-full text-left px-2.5 py-1.5 flex flex-col border-b border-[#282544] transition-colors ${
                        idx === acIndex ? 'bg-violet text-white font-bold' : 'hover:bg-white/10 text-[#DDD8FF]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-yellow">{m.name}</span>
                      </div>
                      <span className={`text-[11px] ${idx === acIndex ? 'text-paper' : 'text-[#8F8ABF]'}`}>
                        {m.desc}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Integrated Console Terminal */}
      <div className="h-[135px] flex flex-col bg-[#11101E] border-t border-[#2D2A4A] text-xs">
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

        {/* Small stats row under console (U5) */}
        <div className="flex items-center justify-between px-3 py-1 bg-[#141324] border-t border-[#24213B] text-[12px] font-mono text-[#9B95CE]">
          <div>
            Lines: <span className="text-white font-bold">{lineCount}</span>
          </div>
          <span className="text-[#363259]">|</span>
          <div>
            Steps taken: <span className="text-lime font-bold">{stepsTaken}</span>
          </div>
          <span className="text-[#363259]">|</span>
          <div>
            Stars: <span className="text-yellow font-bold">{starsCollected}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
