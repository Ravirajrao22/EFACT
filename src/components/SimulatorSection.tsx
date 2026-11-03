import React, { useState, useEffect, useRef } from 'react';
import { SimEngine } from '../sim/engine';
import { LEVELS, LevelData } from '../sim/levels';
import { generatePython } from '../sim/codegen';
import { PythonInterpreter, ExecStep } from '../sim/interpreter';
import { ArenaCanvas } from './ArenaCanvas';
import { BlocksPanel } from './BlocksPanel';
import { CodePanel } from './CodePanel';
import { BlockItem } from '../sim/blocks';
import {
  Play,
  Pause,
  StepForward,
  RotateCcw,
  Share2,
  Volume2,
  VolumeX,
  Lightbulb,
  CheckCircle2,
} from 'lucide-react';

interface SimulatorSectionProps {
  currentLevelId: number;
  onSelectLevel: (lvlId: number) => void;
  onMissionCompleted: (lvlId: number, blocks: number, steps: number) => void;
}

export const SimulatorSection: React.FC<SimulatorSectionProps> = ({
  currentLevelId,
  onSelectLevel,
  onMissionCompleted,
}) => {
  const level = LEVELS.find((l) => l.id === currentLevelId) || LEVELS[0];

  // Editor mode: Blocks vs Python
  const [mode, setMode] = useState<'blocks' | 'python'>('blocks');

  // Blocks state
  const [blocks, setBlocks] = useState<BlockItem[]>(level.starterBlocks || []);

  // Python code state
  const [pythonCode, setPythonCode] = useState<string>('');

  // Mobile / Tablet Tab Switcher
  const [mobileTab, setMobileTab] = useState<'blocks' | 'arena' | 'python'>('arena');

  // Simulator controls
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState<number>(1);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [showSensors, setShowSensors] = useState(true);

  // Highlighting synchronization
  const [hoveredBlockId, setHoveredBlockId] = useState<string | null>(null);
  const [hoveredLineNumber, setHoveredLineNumber] = useState<number | null>(null);
  const [activeLine, setActiveLine] = useState<number | undefined>(undefined);
  const [activeBlock, setActiveBlock] = useState<string | undefined>(undefined);

  // Console Logs
  const [logs, setLogs] = useState<{ msg: string; type: 'info' | 'error' | 'say'; timestamp: string }[]>([]);

  // Failed run counter for progressive hint reveal
  const [failedRuns, setFailedRuns] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [shareToast, setShareToast] = useState<string | null>(null);

  // Engine & Generator references
  const engineRef = useRef<SimEngine>(new SimEngine(level, blocks.length));
  const [engineTick, setEngineTick] = useState(0); // force component refresh when engine mutates
  const stepGeneratorRef = useRef<AsyncGenerator<ExecStep, void, void> | null>(null);
  const runTimerRef = useRef<any>(null);

  // Initialize engine on level change
  useEffect(() => {
    const starter = level.starterBlocks && level.starterBlocks.length > 0 ? level.starterBlocks : [];
    setBlocks(starter);
    engineRef.current = new SimEngine(level, starter.length);
    attachEngineLogger(engineRef.current);
    setFailedRuns(0);
    setShowHint(false);
    setIsRunning(false);
    setIsPaused(false);
    setActiveLine(undefined);
    setActiveBlock(undefined);
    setEngineTick((t) => t + 1);
  }, [level.id]);

  // Handle URL Hash loading on mount
  useEffect(() => {
    try {
      if (window.location.hash.startsWith('#code=')) {
        const decoded = decodeURIComponent(window.location.hash.replace('#code=', ''));
        const parsed = JSON.parse(decoded);
        if (parsed.lvl && LEVELS.some((l) => l.id === parsed.lvl)) {
          onSelectLevel(parsed.lvl);
        }
        if (parsed.blocks && Array.isArray(parsed.blocks)) {
          setBlocks(parsed.blocks);
        }
      }
    } catch (e) {
      // Ignore hash parse errors
    }
  }, []);

  // Update codegen when blocks change (in blocks mode)
  const codegenResult = React.useMemo(() => {
    return generatePython(blocks);
  }, [blocks]);

  useEffect(() => {
    if (mode === 'blocks') {
      setPythonCode(codegenResult.code);
    }
  }, [codegenResult.code, mode]);

  // Bidirectional hover mapping
  const highlightedLines = React.useMemo(() => {
    if (hoveredBlockId && codegenResult.blockToLines[hoveredBlockId]) {
      return codegenResult.blockToLines[hoveredBlockId];
    }
    return [];
  }, [hoveredBlockId, codegenResult.blockToLines]);

  useEffect(() => {
    if (hoveredLineNumber && codegenResult.lineToBlock[hoveredLineNumber]) {
      setHoveredBlockId(codegenResult.lineToBlock[hoveredLineNumber]);
    }
  }, [hoveredLineNumber, codegenResult.lineToBlock]);

  // Audio helper (Web Audio API synthetic beeps)
  const playTone = (freq: number, type: OscillatorType = 'sine', duration: number = 0.1) => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Web Audio fallback
    }
  };

  const logMessage = (msg: string, type: 'info' | 'error' | 'say' = 'info') => {
    const time = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs((prev) => [...prev, { msg, type, timestamp: time }]);
  };

  const attachEngineLogger = (eng: SimEngine) => {
    eng.onLogMessage = (msg, type) => {
      logMessage(msg, type);
      if (type === 'error') {
        playTone(180, 'sawtooth', 0.25);
        setFailedRuns((f) => {
          const next = f + 1;
          if (next >= 2) setShowHint(true);
          return next;
        });
      }
    };
  };

  // Reset simulator
  const handleReset = () => {
    if (runTimerRef.current) clearTimeout(runTimerRef.current);
    setIsRunning(false);
    setIsPaused(false);
    setActiveLine(undefined);
    setActiveBlock(undefined);
    stepGeneratorRef.current = null;
    engineRef.current.reset(mode === 'blocks' ? codegenResult.totalBlockCount : 1);
    setEngineTick((t) => t + 1);
    playTone(330, 'triangle', 0.08);
  };

  // Prepare interpreter generator
  const prepareGenerator = () => {
    const engine = engineRef.current;
    if (engine.state.status === 'crashed' || engine.state.status === 'completed') {
      engine.reset(mode === 'blocks' ? codegenResult.totalBlockCount : 1);
    }

    const codeToRun = mode === 'blocks' ? codegenResult.code : pythonCode;
    const lineToBlockMap = mode === 'blocks' ? codegenResult.lineToBlock : {};

    const interpreter = new PythonInterpreter(engine, lineToBlockMap);
    const { nodes, error } = interpreter.parse(codeToRun);

    if (error) {
      logMessage(`Syntax Error: ${error}`, 'error');
      playTone(180, 'sawtooth', 0.2);
      return null;
    }

    return interpreter.runGenerator(nodes);
  };

  // Step button: execute single statement
  const handleStep = async () => {
    if (!stepGeneratorRef.current) {
      stepGeneratorRef.current = prepareGenerator();
      if (!stepGeneratorRef.current) return;
    }

    playTone(480, 'sine', 0.05);
    const step = await stepGeneratorRef.current.next();

    const val = step.value as ExecStep | undefined;
    if (step.done || !val || val.isDone) {
      stepGeneratorRef.current = null;
      setIsRunning(false);
      setIsPaused(false);
      setActiveLine(undefined);
      setActiveBlock(undefined);
    } else {
      setActiveLine(val.line);
      setActiveBlock(val.blockId);
    }
    setEngineTick((t) => t + 1);

    // Check completion
    checkEngineOutcome();
  };

  // Run / Pause loop
  const handleRun = () => {
    if (isRunning && !isPaused) {
      // Pause
      setIsPaused(true);
      if (runTimerRef.current) clearTimeout(runTimerRef.current);
      return;
    }

    if (isPaused) {
      // Resume
      setIsPaused(false);
      runLoop();
      return;
    }

    // Fresh run
    handleReset();
    stepGeneratorRef.current = prepareGenerator();
    if (!stepGeneratorRef.current) return;

    setIsRunning(true);
    setIsPaused(false);
    playTone(520, 'sine', 0.1);
    runLoop();
  };

  const runLoop = () => {
    const delay = Math.max(80, Math.floor(400 / speed));

    const executeNext = async () => {
      if (!stepGeneratorRef.current) return;

      const step = await stepGeneratorRef.current.next();
      setEngineTick((t) => t + 1);

      const val = step.value as ExecStep | undefined;
      if (step.done || !val || val.isDone) {
        stepGeneratorRef.current = null;
        setIsRunning(false);
        setIsPaused(false);
        setActiveLine(undefined);
        setActiveBlock(undefined);
        checkEngineOutcome();
        return;
      }

      setActiveLine(val.line);
      setActiveBlock(val.blockId);

      const status = engineRef.current.state.status;
      if (status === 'crashed' || status === 'completed') {
        stepGeneratorRef.current = null;
        setIsRunning(false);
        setIsPaused(false);
        checkEngineOutcome();
        return;
      }

      runTimerRef.current = setTimeout(executeNext, delay);
    };

    runTimerRef.current = setTimeout(executeNext, 50);
  };

  const checkEngineOutcome = () => {
    const engine = engineRef.current;
    if (engine.state.status === 'completed') {
      playTone(660, 'sine', 0.25);
      onMissionCompleted(level.id, engine.stats.blocksUsed, engine.stats.stepsTaken);
    }
  };

  // Share link
  const handleShare = () => {
    const payload = {
      lvl: level.id,
      blocks: mode === 'blocks' ? blocks : [],
    };
    const hash = `#code=${encodeURIComponent(JSON.stringify(payload))}`;
    window.location.hash = hash;
    navigator.clipboard.writeText(window.location.href);
    setShareToast('Direct program URL copied to clipboard!');
    setTimeout(() => setShareToast(null), 3000);
  };

  return (
    <section id="playground" className="py-12 md:py-16 px-4 md:px-8 max-w-[1320px] mx-auto">
      {/* Section Header */}
      <div className="mb-8 text-center md:text-left">
        <div className="inline-block px-3 py-1 rounded-full bg-yellow text-ink border-ink-2 font-mono text-xs font-bold shadow-hard-sm mb-3 -rotate-1">
          EFACT Studio Simulator
        </div>
        <h2 className="font-heading font-extrabold text-3xl md:text-5xl text-ink tracking-tight mb-2">
          The Playground
        </h2>
        <p className="font-body text-ink-soft text-base md:text-lg max-w-2xl">
          Pick a mission. Build the program. Hit run. Break it. Fix it. Real robotics engineering right in your browser.
        </p>
      </div>

      {/* Main Big Simulator Card */}
      <div className="border-ink-2 rounded-2xl bg-[#1B1A2E] shadow-hard-lg overflow-hidden text-paper flex flex-col">
        {/* Dark Top Toolbar */}
        <div className="bg-[#141324] px-4 py-3 border-b-2 border-ink flex flex-wrap items-center justify-between gap-3 text-sm font-mono">
          {/* Level Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-[#8E89B8] text-xs font-bold uppercase hidden sm:inline">Mission:</span>
            <select
              value={currentLevelId}
              onChange={(e) => onSelectLevel(Number(e.target.value))}
              className="bg-[#24213B] text-paper border-ink-2 rounded-lg px-2.5 py-1 text-xs font-mono font-bold hover:border-lime focus:outline-none transition-colors"
            >
              {LEVELS.map((lvl) => (
                <option key={lvl.id} value={lvl.id}>
                  {lvl.id}. {lvl.title}
                </option>
              ))}
            </select>
          </div>

          {/* Mode Switcher: Blocks vs Python */}
          <div className="inline-flex rounded-full p-1 bg-[#24213B] border-ink-2">
            <button
              onClick={() => setMode('blocks')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                mode === 'blocks'
                  ? 'bg-blue text-white shadow-hard-sm'
                  : 'text-[#A09BBF] hover:text-white'
              }`}
            >
              Blocks Mode
            </button>
            <button
              onClick={() => setMode('python')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                mode === 'python'
                  ? 'bg-violet text-white shadow-hard-sm'
                  : 'text-[#A09BBF] hover:text-white'
              }`}
            >
              Python Mode
            </button>
          </div>

          {/* Action Buttons: Run, Pause, Step, Reset */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={handleRun}
              className={`px-3 py-1.5 rounded-full font-mono text-xs font-bold flex items-center gap-1.5 border-ink-2 shadow-hard-sm hover:translate-x-[1px] transition-all ${
                isRunning && !isPaused
                  ? 'bg-yellow text-ink'
                  : 'bg-lime text-ink'
              }`}
              title={isRunning && !isPaused ? 'Pause Execution' : 'Run Program'}
            >
              {isRunning && !isPaused ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isRunning && !isPaused ? 'Pause' : 'Run'}</span>
            </button>

            <button
              onClick={handleStep}
              disabled={isRunning && !isPaused}
              className="px-2.5 py-1.5 rounded-full bg-[#2E2A4D] hover:bg-[#3D3866] text-white font-mono text-xs font-bold flex items-center gap-1 border-ink-2 shadow-hard-sm disabled:opacity-40 transition-all"
              title="Step forward one instruction"
            >
              <StepForward className="w-3.5 h-3.5 text-yellow" />
              <span className="hidden sm:inline">Step</span>
            </button>

            <button
              onClick={handleReset}
              className="px-2.5 py-1.5 rounded-full bg-orange text-white font-mono text-xs font-bold flex items-center gap-1 border-ink-2 shadow-hard-sm hover:translate-x-[1px] transition-all"
              title="Reset robot to starting position"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>

            {/* Speed Selector */}
            <div className="flex items-center gap-1 bg-[#24213B] px-2 py-1 rounded-full border-ink-2 text-xs">
              <span className="text-[#7A75A0] text-[10px] hidden sm:inline">Speed:</span>
              {[0.5, 1, 2, 4].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                    speed === s ? 'bg-lime text-ink' : 'text-[#A09BBF] hover:text-white'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>

            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 rounded-full bg-[#24213B] text-[#A09BBF] hover:text-white border-ink-2 transition-colors"
              title="Toggle sound effects"
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-lime" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="p-1.5 rounded-full bg-[#24213B] text-[#A09BBF] hover:text-white border-ink-2 transition-colors"
              title="Share this code solution"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Share notification toast */}
        {shareToast && (
          <div className="bg-lime text-ink font-mono text-xs py-1.5 px-4 text-center font-bold border-b border-ink">
            {shareToast}
          </div>
        )}

        {/* Level Brief & Hint Bar */}
        <div className="bg-[#24223E] px-4 py-2 border-b border-[#36325C] flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-yellow font-bold">Goal:</span>
            <span className="text-[#DDD8FF]">{level.subtitle}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#8E88BC] italic hidden md:inline">
              "{level.whyItMatters}"
            </span>
            <button
              onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-yellow/20 text-yellow border border-yellow/40 hover:bg-yellow hover:text-ink transition-colors"
            >
              <Lightbulb className="w-3 h-3" />
              <span>Hint {failedRuns > 0 && `(${failedRuns} fails)`}</span>
            </button>
          </div>
        </div>

        {/* Collapsible Hint Drawer */}
        {showHint && (
          <div className="bg-yellow/15 border-b border-yellow/40 p-3 text-xs font-mono text-paper flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-yellow shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-yellow mr-1.5">Engineering Hint:</span>
              <span>{level.hint}</span>
            </div>
          </div>
        )}

        {/* Mobile View Tab Switcher (< 1100px) */}
        <div className="xl:hidden flex border-b border-[#2D2A4A] bg-[#171629]">
          <button
            onClick={() => setMobileTab('blocks')}
            className={`flex-1 py-2 text-xs font-mono font-bold text-center border-r border-[#2D2A4A] ${
              mobileTab === 'blocks' ? 'bg-blue text-white' : 'text-[#8E88BC]'
            }`}
          >
            Blocks Workspace
          </button>
          <button
            onClick={() => setMobileTab('arena')}
            className={`flex-1 py-2 text-xs font-mono font-bold text-center border-r border-[#2D2A4A] ${
              mobileTab === 'arena' ? 'bg-lime text-ink' : 'text-[#8E88BC]'
            }`}
          >
            Robot Arena
          </button>
          <button
            onClick={() => setMobileTab('python')}
            className={`flex-1 py-2 text-xs font-mono font-bold text-center ${
              mobileTab === 'python' ? 'bg-violet text-white' : 'text-[#8E88BC]'
            }`}
          >
            Python & Logs
          </button>
        </div>

        {/* 3-Column Simulator Layout (Desktop: Col A 28%, Col B 44%, Col C 28%) */}
        <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-3 p-3 bg-[#17162B]">
          {/* Column A: Blocks Palette + Workspace */}
          <div
            className={`xl:col-span-4 xl:block ${
              mobileTab === 'blocks' ? 'block' : 'hidden'
            } min-h-[480px] flex flex-col`}
          >
            <BlocksPanel
              blocks={blocks}
              onChangeBlocks={setBlocks}
              hoveredBlockId={hoveredBlockId}
              onHoverBlock={setHoveredBlockId}
              activeBlockId={activeBlock}
              unlockedCategories={level.unlockedCategories}
            />
          </div>

          {/* Column B: Arena Canvas + Live Robot Visual */}
          <div
            className={`xl:col-span-4 xl:block ${
              mobileTab === 'arena' ? 'block' : 'hidden'
            } flex flex-col items-center justify-center`}
          >
            <ArenaCanvas
              engine={engineRef.current}
              showSensors={showSensors}
              onToggleSensors={() => setShowSensors(!showSensors)}
              onClearTrail={() => {
                engineRef.current.clearTrail();
                setEngineTick((t) => t + 1);
              }}
              onNextMission={() => {
                if (currentLevelId < LEVELS.length) {
                  onSelectLevel(currentLevelId + 1);
                }
              }}
              speed={speed}
            />
          </div>

          {/* Column C: Live Python Bridge + Terminal Console */}
          <div
            className={`xl:col-span-4 xl:block ${
              mobileTab === 'python' ? 'block' : 'hidden'
            } min-h-[480px] flex flex-col`}
          >
            <CodePanel
              mode={mode}
              code={pythonCode}
              onChangeCode={setPythonCode}
              hoveredLineNumber={hoveredLineNumber}
              onHoverLine={setHoveredLineNumber}
              activeLineNumber={activeLine}
              highlightedLines={highlightedLines}
              logs={logs}
              onClearLogs={() => setLogs([])}
              blockCount={codegenResult.totalBlockCount}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

