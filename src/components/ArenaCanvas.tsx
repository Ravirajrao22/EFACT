import React, { useEffect, useRef, useState } from 'react';
import { SimEngine } from '../sim/engine';
import { Eye, EyeOff, Trash2, Award } from 'lucide-react';

interface ArenaCanvasProps {
  engine: SimEngine;
  showSensors: boolean;
  onToggleSensors: () => void;
  onClearTrail: () => void;
  onNextMission?: () => void;
  speed: number;
}

export const ArenaCanvas: React.FC<ArenaCanvasProps> = ({
  engine,
  showSensors,
  onToggleSensors,
  onClearTrail,
  onNextMission,
  speed,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Animated visual positions for smooth interpolation
  const visualPos = useRef<{ x: number; y: number; angle: number }>({
    x: engine.state.x,
    y: engine.state.y,
    angle: (engine.state.dir * Math.PI) / 2,
  });

  const [bonkActive, setBonkActive] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const pulseTime = useRef(0);

  // Sync / Snap visualPos on level change or fresh reset
  useEffect(() => {
    visualPos.current = {
      x: engine.state.x,
      y: engine.state.y,
      angle: (engine.state.dir * Math.PI) / 2,
    };
    setShowSuccessModal(false);
  }, [engine.level.id, engine.stats.stepsTaken === 0]);

  // Handle collision bonk animation
  useEffect(() => {
    if (engine.state.status === 'crashed') {
      setBonkActive(true);
      const timer = setTimeout(() => setBonkActive(false), 500);
      return () => clearTimeout(timer);
    }
  }, [engine.state.status, engine.stats.stepsTaken]);

  // Smooth delay for mission completion modal
  useEffect(() => {
    if (engine.state.status === 'completed') {
      const timer = setTimeout(() => {
        setShowSuccessModal(true);
      }, 350);
      return () => clearTimeout(timer);
    } else {
      setShowSuccessModal(false);
    }
  }, [engine.state.status]);

  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      // READ LATEST TARGET POSITION AND ANGLE DIRECTLY FROM ENGINE STATE
      const targetX = engine.state.x;
      const targetY = engine.state.y;
      const targetAngle = (engine.state.dir * Math.PI) / 2;

      // Smooth Lerp position & angle
      const lerpSpeed = Math.min(0.28 * Math.max(speed, 0.5), 0.95);
      visualPos.current.x += (targetX - visualPos.current.x) * lerpSpeed;
      visualPos.current.y += (targetY - visualPos.current.y) * lerpSpeed;

      // Handle angle wrap-around for natural shortest rotation
      let diffAngle = targetAngle - visualPos.current.angle;
      while (diffAngle < -Math.PI) diffAngle += Math.PI * 2;
      while (diffAngle > Math.PI) diffAngle -= Math.PI * 2;
      visualPos.current.angle += diffAngle * lerpSpeed;

      pulseTime.current += 0.05;

      // DPR Scaling for retina sharpness
      const dpr = window.devicePixelRatio || 1;
      const size = 480; // 10 * 48px
      if (canvas.width !== size * dpr || canvas.height !== size * dpr) {
        canvas.width = size * dpr;
        canvas.height = size * dpr;
      }
      ctx.resetTransform();
      ctx.scale(dpr, dpr);

      // Clear canvas with blueprint paper background
      ctx.fillStyle = '#FFF8EC';
      ctx.fillRect(0, 0, size, size);

      const tileSize = 48;

      // 1. Draw Grid Tiles
      for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 10; c++) {
          const tile = engine.grid[r][c];
          const px = c * tileSize;
          const py = r * tileSize;

          // Base Floor
          ctx.fillStyle = '#FFF3DC';
          ctx.fillRect(px, py, tileSize, tileSize);
          ctx.strokeStyle = 'rgba(20, 17, 15, 0.12)';
          ctx.lineWidth = 1;
          ctx.strokeRect(px, py, tileSize, tileSize);

          if (tile === 'wall') {
            // Ink hatched pattern
            ctx.fillStyle = '#14110F';
            ctx.fillRect(px, py, tileSize, tileSize);

            // Hatch lines
            ctx.strokeStyle = 'rgba(255, 248, 236, 0.25)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            for (let i = -tileSize; i < tileSize * 2; i += 10) {
              ctx.moveTo(px + i, py);
              ctx.lineTo(px + i + tileSize, py + tileSize);
            }
            ctx.stroke();

            // Heavy border
            ctx.strokeStyle = '#14110F';
            ctx.lineWidth = 2;
            ctx.strokeRect(px, py, tileSize, tileSize);
          } else if (tile === 'line') {
            // Dark line track
            ctx.fillStyle = '#14110F';
            ctx.fillRect(px + 14, py + 14, 20, 20);

            // Connect lines to neighbors
            if (c > 0 && engine.grid[r][c - 1] === 'line') {
              ctx.fillRect(px, py + 14, 16, 20);
            }
            if (c < 9 && engine.grid[r][c + 1] === 'line') {
              ctx.fillRect(px + 20, py + 14, 28, 20);
            }
            if (r > 0 && engine.grid[r - 1][c] === 'line') {
              ctx.fillRect(px + 14, py, 20, 16);
            }
            if (r < 9 && engine.grid[r + 1][c] === 'line') {
              ctx.fillRect(px + 14, py + 20, 20, 28);
            }
          } else if (tile === 'goal') {
            // Lime Goal Pad with pulse
            const isCompleted = engine.state.status === 'completed';
            const pulse = isCompleted ? Math.sin(pulseTime.current * 3) * 3 : 0;

            ctx.fillStyle = '#B6F23A';
            ctx.fillRect(px + 4 - pulse / 2, py + 4 - pulse / 2, tileSize - 8 + pulse, tileSize - 8 + pulse);
            ctx.strokeStyle = '#14110F';
            ctx.lineWidth = 2.5;
            ctx.strokeRect(px + 4 - pulse / 2, py + 4 - pulse / 2, tileSize - 8 + pulse, tileSize - 8 + pulse);

            // Goal Flag / Target Bullseye
            ctx.fillStyle = '#14110F';
            ctx.beginPath();
            ctx.arc(px + tileSize / 2, py + tileSize / 2, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#B6F23A';
            ctx.beginPath();
            ctx.arc(px + tileSize / 2, py + tileSize / 2, 4, 0, Math.PI * 2);
            ctx.fill();
          } else if (tile === 'start') {
            // Start Pad
            ctx.strokeStyle = '#2F5BFF';
            ctx.lineWidth = 2;
            ctx.strokeRect(px + 4, py + 4, tileSize - 8, tileSize - 8);
            ctx.fillStyle = 'rgba(47, 91, 255, 0.12)';
            ctx.fillRect(px + 4, py + 4, tileSize - 8, tileSize - 8);

            // Small start tag
            ctx.fillStyle = '#2F5BFF';
            ctx.font = 'bold 9px "JetBrains Mono"';
            ctx.fillText('START', px + 10, py + tileSize - 8);
          }
        }
      }

      // 2. Stars Remaining on Floor
      for (const star of engine.state.starsRemaining) {
        const sx = star.x * tileSize + tileSize / 2;
        const sy = star.y * tileSize + tileSize / 2;

        ctx.save();
        ctx.translate(sx, sy);
        ctx.fillStyle = '#FFD23F';
        ctx.strokeStyle = '#14110F';
        ctx.lineWidth = 2;
        ctx.beginPath();
        // 5-point star
        for (let i = 0; i < 5; i++) {
          ctx.lineTo(Math.cos(((18 + i * 72) * Math.PI) / 180) * 12, -Math.sin(((18 + i * 72) * Math.PI) / 180) * 12);
          ctx.lineTo(Math.cos(((54 + i * 72) * Math.PI) / 180) * 5, -Math.sin(((54 + i * 72) * Math.PI) / 180) * 5);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }

      // 3. Faint Dotted Trail
      if (engine.state.trail.length > 1) {
        ctx.strokeStyle = 'rgba(47, 91, 255, 0.45)';
        ctx.lineWidth = 3;
        ctx.setLineDash([4, 6]);
        ctx.beginPath();
        for (let i = 0; i < engine.state.trail.length; i++) {
          const pt = engine.state.trail[i];
          const tx = pt.x * tileSize + tileSize / 2;
          const ty = pt.y * tileSize + tileSize / 2;
          if (i === 0) ctx.moveTo(tx, ty);
          else ctx.lineTo(tx, ty);
        }
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // 4. Sensor Overlay (if toggled)
      if (showSensors) {
        const rx = visualPos.current.x * tileSize + tileSize / 2;
        const ry = visualPos.current.y * tileSize + tileSize / 2;
        const angle = visualPos.current.angle;
        const dist = engine.distance();

        ctx.save();
        ctx.translate(rx, ry);
        ctx.rotate(angle);

        // Ultrasonic cone
        const beamDist = Math.min(dist * tileSize + tileSize / 2, 360);
        const coneGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, beamDist);
        coneGrad.addColorStop(0, 'rgba(255, 122, 198, 0.45)');
        coneGrad.addColorStop(1, 'rgba(255, 122, 198, 0.05)');

        ctx.fillStyle = coneGrad;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, beamDist, -Math.PI / 8, Math.PI / 8);
        ctx.closePath();
        ctx.fill();

        // Distance text marker
        ctx.fillStyle = '#14110F';
        ctx.font = 'bold 11px "JetBrains Mono"';
        ctx.fillText(`${dist} tiles`, 24, -8);

        // Line sensor circle under robot
        const isLine = engine.on_line();
        ctx.fillStyle = isLine ? '#B6F23A' : 'rgba(20, 17, 15, 0.2)';
        ctx.strokeStyle = '#14110F';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, 0, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.restore();
      }

      // 5. Draw Robot at interpolated visualPos
      const rx = visualPos.current.x * tileSize + tileSize / 2;
      const ry = visualPos.current.y * tileSize + tileSize / 2;

      ctx.save();
      ctx.translate(rx, ry);
      ctx.rotate(visualPos.current.angle);

      // Bonk squash
      if (bonkActive) {
        ctx.scale(0.85, 1.25);
      }

      // Wheels on top and bottom of robot
      ctx.fillStyle = '#14110F';
      ctx.fillRect(-14, -18, 12, 5); // Left wheel
      ctx.fillRect(-14, 13, 12, 5);  // Right wheel

      // Body (Orange rounded square with ink border)
      ctx.fillStyle = bonkActive ? '#E5383B' : '#FF6B2C';
      ctx.strokeStyle = '#14110F';
      ctx.lineWidth = 2.5;

      const bw = 30;
      const bh = 28;
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(-bw / 2, -bh / 2, bw, bh, 6);
      } else {
        ctx.rect(-bw / 2, -bh / 2, bw, bh);
      }
      ctx.fill();
      ctx.stroke();

      // Antenna at back
      ctx.beginPath();
      ctx.moveTo(-bw / 4, 0);
      ctx.lineTo(-bw / 2 - 5, 0);
      ctx.strokeStyle = '#14110F';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#FFD23F';
      ctx.beginPath();
      ctx.arc(-bw / 2 - 6, 0, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Eye (Facing forward = East in robot local coord)
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#14110F';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(6, 0, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Pupil
      ctx.fillStyle = '#14110F';
      ctx.beginPath();
      ctx.arc(8, 0, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Pupil reflection highlight
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(9, -1, 1, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // 6. Bonk flash overlay
      if (bonkActive) {
        ctx.fillStyle = 'rgba(229, 56, 59, 0.2)';
        ctx.fillRect(0, 0, size, size);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [engine, showSensors, bonkActive, speed]);

  const beatPar = engine.state.status === 'completed' && engine.stats.blocksUsed <= engine.level.parBlocks;

  return (
    <div className="relative flex flex-col items-center justify-center p-3 bg-paper rounded-xl w-full">
      {/* Control overlay pills */}
      <div className="w-full flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleSensors}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium rounded-full bg-paper border-ink-2 shadow-hard-sm hover:translate-x-[1px] transition-all"
            title="Toggle ultrasonic & line sensors overlay"
          >
            {showSensors ? <Eye className="w-3.5 h-3.5 text-blue" /> : <EyeOff className="w-3.5 h-3.5 text-ink-soft" />}
            <span>Sensors: {showSensors ? 'ON' : 'OFF'}</span>
          </button>
          <button
            onClick={onClearTrail}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono font-medium rounded-full bg-paper border-ink-2 shadow-hard-sm hover:translate-x-[1px] transition-all"
            title="Clear robot breadcrumbs"
          >
            <Trash2 className="w-3.5 h-3.5 text-ink-soft" />
            <span>Clear Trail</span>
          </button>
        </div>

        <div className="text-xs font-mono font-bold text-ink-soft">
          Pos: ({engine.state.x}, {engine.state.y}) | Steps: {engine.stats.stepsTaken}
        </div>
      </div>

      {/* Main Responsive Canvas Container */}
      <div className={`relative border-ink-2 rounded-xl overflow-hidden shadow-hard bg-paper-2 transition-transform w-full max-w-[440px] ${bonkActive ? 'animate-bounce' : ''}`}>
        <canvas
          ref={canvasRef}
          style={{ width: '100%', aspectRatio: '1/1' }}
          className="block"
        />

        {/* Success Modal / Toast with smooth reveal */}
        {showSuccessModal && (
          <div className="absolute inset-0 bg-ink/75 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-paper animate-fadeIn z-20">
            <div className="bg-paper text-ink border-ink-2 p-5 rounded-2xl shadow-hard-lg max-w-xs w-full">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lime border-ink-2 font-mono text-xs font-bold mb-3 shadow-hard-sm">
                MISSION CLEAR
              </div>
              <h3 className="font-heading font-extrabold text-2xl text-ink mb-1">
                Objective Solved!
              </h3>
              <p className="font-mono text-xs text-ink-soft mb-4">
                Robot reached target docking coordinates.
              </p>

              {/* Par & Stats Board */}
              <div className="bg-paper-2 border-ink-2 rounded-xl p-3 mb-4 text-left font-mono text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-ink-soft">Blocks Used:</span>
                  <span className="font-bold">{engine.stats.blocksUsed} (Par: {engine.level.parBlocks})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-soft">Steps Taken:</span>
                  <span className="font-bold">{engine.stats.stepsTaken}</span>
                </div>
                {engine.level.requiredStars > 0 && (
                  <div className="flex justify-between">
                    <span className="text-ink-soft">Stars:</span>
                    <span className="font-bold">{engine.stats.starsCollected}/{engine.level.requiredStars}</span>
                  </div>
                )}
                {beatPar && (
                  <div className="mt-2 pt-2 border-t border-ink/20 flex items-center gap-1.5 text-blue font-bold">
                    <Award className="w-4 h-4 text-orange" />
                    <span>Par Badge Awarded!</span>
                  </div>
                )}
              </div>

              {onNextMission && (
                <button
                  onClick={onNextMission}
                  className="w-full py-2.5 px-4 rounded-full bg-lime text-ink font-heading font-extrabold text-sm border-ink-2 shadow-hard hover:translate-x-[2px] transition-all"
                >
                  Next Mission →
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
