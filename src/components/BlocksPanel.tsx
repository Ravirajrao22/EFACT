import React, { useState } from 'react';
import {
  BlockCategory,
  BlockDefinition,
  BlockItem,
  BlockType,
  BLOCK_DEFINITIONS,
} from '../sim/blocks';
import { Trash2, Undo2, Redo2, Plus, CornerDownRight, GripVertical, ChevronDown } from 'lucide-react';

interface BlocksPanelProps {
  blocks: BlockItem[];
  onChangeBlocks: (blocks: BlockItem[]) => void;
  hoveredBlockId: string | null;
  onHoverBlock: (id: string | null) => void;
  activeBlockId?: string;
  unlockedCategories?: BlockCategory[];
}

export const BlocksPanel: React.FC<BlocksPanelProps> = ({
  blocks,
  onChangeBlocks,
  hoveredBlockId,
  onHoverBlock,
  activeBlockId,
  unlockedCategories,
}) => {
  const [activeCategory, setActiveCategory] = useState<BlockCategory>('move');
  const [history, setHistory] = useState<BlockItem[][]>([]);
  const [redoStack, setRedoStack] = useState<BlockItem[][]>([]);
  const [openSelectorForParent, setOpenSelectorForParent] = useState<{ parentId: string; isElse: boolean } | null>(null);

  // Drag and drop state
  const [draggedPaletteType, setDraggedPaletteType] = useState<BlockType | null>(null);
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);
  const [dragOverTrash, setDragOverTrash] = useState(false);

  // Push history on changes
  const updateBlocksWithHistory = (newBlocks: BlockItem[]) => {
    setHistory((prev) => [...prev, blocks]);
    setRedoStack([]);
    onChangeBlocks(newBlocks);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setRedoStack((prev) => [blocks, ...prev]);
    setHistory((prev) => prev.slice(0, prev.length - 1));
    onChangeBlocks(previous);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[0];
    setHistory((prev) => [...prev, blocks]);
    setRedoStack((prev) => prev.slice(1));
    onChangeBlocks(next);
  };

  // Add block to root workspace
  const handleAddBlock = (def: BlockDefinition) => {
    const newItem = def.defaultItem();
    updateBlocksWithHistory([...blocks, newItem]);
  };

  // Remove block by id recursively
  const handleRemoveBlock = (id: string) => {
    const filterRec = (list: BlockItem[]): BlockItem[] => {
      return list
        .filter((b) => b.id !== id)
        .map((b) => ({
          ...b,
          children: b.children ? filterRec(b.children) : undefined,
          elseChildren: b.elseChildren ? filterRec(b.elseChildren) : undefined,
        }));
    };
    updateBlocksWithHistory(filterRec(blocks));
  };

  // Move block up or down
  const handleMoveBlock = (id: string, direction: 'up' | 'down') => {
    const moveInList = (list: BlockItem[]): BlockItem[] => {
      const idx = list.findIndex((b) => b.id === id);
      if (idx !== -1) {
        const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
        if (targetIdx >= 0 && targetIdx < list.length) {
          const clone = [...list];
          const [moved] = clone.splice(idx, 1);
          clone.splice(targetIdx, 0, moved);
          return clone;
        }
        return list;
      }
      return list.map((b) => ({
        ...b,
        children: b.children ? moveInList(b.children) : undefined,
        elseChildren: b.elseChildren ? moveInList(b.elseChildren) : undefined,
      }));
    };
    updateBlocksWithHistory(moveInList(blocks));
  };

  // Update block fields (e.g. number input, text input, condition)
  const handleUpdateBlock = (id: string, updates: Partial<BlockItem>) => {
    const updateRec = (list: BlockItem[]): BlockItem[] => {
      return list.map((b) => {
        if (b.id === id) {
          return { ...b, ...updates };
        }
        return {
          ...b,
          children: b.children ? updateRec(b.children) : undefined,
          elseChildren: b.elseChildren ? updateRec(b.elseChildren) : undefined,
        };
      });
    };
    updateBlocksWithHistory(updateRec(blocks));
  };

  // Add child to a container block with user-selected type
  const handleAddChildOfType = (parentId: string, type: BlockType, isElse: boolean = false) => {
    const def = BLOCK_DEFINITIONS[type] || BLOCK_DEFINITIONS.forward;
    const childItem = def.defaultItem();
    const addRec = (list: BlockItem[]): BlockItem[] => {
      return list.map((b) => {
        if (b.id === parentId) {
          if (isElse) {
            return { ...b, elseChildren: [...(b.elseChildren || []), childItem] };
          }
          return { ...b, children: [...(b.children || []), childItem] };
        }
        return {
          ...b,
          children: b.children ? addRec(b.children) : undefined,
          elseChildren: b.elseChildren ? addRec(b.elseChildren) : undefined,
        };
      });
    };
    updateBlocksWithHistory(addRec(blocks));
    setOpenSelectorForParent(null);
  };

  // HTML5 Drag and drop handlers
  const handleWorkspaceDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedPaletteType) {
      const def = BLOCK_DEFINITIONS[draggedPaletteType];
      if (def) {
        handleAddBlock(def);
      }
      setDraggedPaletteType(null);
    }
  };

  const categories: { id: BlockCategory; label: string; color: string }[] = [
    { id: 'move', label: 'Move', color: 'bg-blue text-white' },
    { id: 'sense', label: 'Sense', color: 'bg-pink text-ink' },
    { id: 'control', label: 'Control', color: 'bg-yellow text-ink' },
    { id: 'action', label: 'Actions', color: 'bg-lime text-ink' },
    { id: 'logic', label: 'Logic', color: 'bg-violet text-white' },
    { id: 'variable', label: 'Variables', color: 'bg-orange text-white' },
  ];

  const filteredCategories = unlockedCategories
    ? categories.filter((c) => unlockedCategories.includes(c.id))
    : categories;

  const paletteDefinitions = Object.values(BLOCK_DEFINITIONS).filter(
    (def) => def.category === activeCategory
  );

  // Render individual puzzle block
  const renderBlock = (b: BlockItem, depth: number = 0) => {
    const def = BLOCK_DEFINITIONS[b.type] || BLOCK_DEFINITIONS.forward;
    const isHovered = hoveredBlockId === b.id;
    const isActive = activeBlockId === b.id;

    return (
      <div
        key={b.id}
        draggable
        onDragStart={() => setDraggedBlockId(b.id)}
        onDragEnd={() => setDraggedBlockId(null)}
        onMouseEnter={() => onHoverBlock(b.id)}
        onMouseLeave={() => onHoverBlock(null)}
        className={`relative my-1.5 transition-all select-none ${
          isHovered ? 'ring-2 ring-violet ring-offset-2 scale-[1.01]' : ''
        } ${isActive ? 'ring-2 ring-lime ring-offset-2 animate-pulse' : ''}`}
      >
        <div
          style={{ backgroundColor: def.color, color: def.textColor }}
          className="border-ink-2 shadow-hard-sm rounded-lg px-2.5 py-1.5 flex flex-wrap items-center justify-between gap-2 text-xs font-mono font-bold"
        >
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="cursor-grab hover:text-black/60 p-0.5" title="Drag block">
              <GripVertical className="w-3.5 h-3.5" />
            </span>
            <span>{def.label}</span>

            {/* Value Inputs */}
            {b.valNumber !== undefined && (
              <input
                type="number"
                min={1}
                max={20}
                value={b.valNumber}
                onChange={(e) =>
                  handleUpdateBlock(b.id, { valNumber: Math.max(1, parseInt(e.target.value) || 1) })
                }
                className="w-12 h-6 px-1 rounded border-ink-2 bg-white text-ink text-center font-mono font-bold text-xs shadow-inner"
                onClick={(e) => e.stopPropagation()}
              />
            )}

            {b.valText !== undefined && (
              <input
                type="text"
                value={b.valText}
                onChange={(e) => handleUpdateBlock(b.id, { valText: e.target.value })}
                className="w-24 h-6 px-1 rounded border-ink-2 bg-white text-ink text-xs font-mono shadow-inner"
                onClick={(e) => e.stopPropagation()}
              />
            )}

            {/* Condition Dropdown for while/if */}
            {b.condition && (
              <select
                value={b.condition.type}
                onChange={(e) =>
                  handleUpdateBlock(b.id, {
                    condition: { ...b.condition, type: e.target.value as any },
                  })
                }
                className="h-6 px-1 rounded border-ink-2 bg-white text-ink text-xs font-mono font-bold"
                onClick={(e) => e.stopPropagation()}
              >
                <option value="not_at_goal">not bot.at_goal()</option>
                <option value="sense_wall_ahead">bot.wall_ahead()</option>
                <option value="not_wall_ahead">not bot.wall_ahead()</option>
                <option value="sense_on_line">bot.on_line()</option>
                <option value="sense_at_goal">bot.at_goal()</option>
              </select>
            )}
          </div>

          {/* Quick controls: Up, Down, Delete */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleMoveBlock(b.id, 'up')}
              className="px-1 text-[11px] hover:bg-black/10 rounded font-bold"
              title="Move up"
            >
              ▲
            </button>
            <button
              onClick={() => handleMoveBlock(b.id, 'down')}
              className="px-1 text-[11px] hover:bg-black/10 rounded font-bold"
              title="Move down"
            >
              ▼
            </button>
            <button
              onClick={() => handleRemoveBlock(b.id)}
              className="p-1 text-ink/70 hover:text-danger rounded hover:bg-black/10 transition-colors ml-0.5"
              title="Delete block"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Container children for repeat / while / if */}
        {(b.children !== undefined || b.elseChildren !== undefined) && (
          <div className="pl-4 ml-3 border-l-2 border-dashed border-ink/40 mt-1 space-y-1">
            {b.children && b.children.length > 0 ? (
              b.children.map((child) => renderBlock(child, depth + 1))
            ) : (
              <div className="text-[11px] font-mono text-ink-soft py-1 italic">
                (empty block body)
              </div>
            )}

            {/* Add Block to container with picker */}
            <div className="relative pt-0.5">
              <button
                onClick={() =>
                  setOpenSelectorForParent(
                    openSelectorForParent?.parentId === b.id && !openSelectorForParent.isElse
                      ? null
                      : { parentId: b.id, isElse: false }
                  )
                }
                className="flex items-center gap-1 text-[11px] font-mono font-bold text-ink-soft hover:text-blue py-0.5"
              >
                <Plus className="w-3 h-3" />
                <span>Add nested block</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {openSelectorForParent?.parentId === b.id && !openSelectorForParent.isElse && (
                <div className="absolute left-0 top-6 z-30 bg-paper border-ink-2 shadow-hard rounded-lg p-2 flex flex-wrap gap-1 max-w-xs">
                  {['forward', 'backward', 'turn_left', 'turn_right', 'pick_up', 'say'].map((t) => {
                    const d = BLOCK_DEFINITIONS[t as BlockType];
                    return (
                      <button
                        key={t}
                        onClick={() => handleAddChildOfType(b.id, t as BlockType, false)}
                        style={{ backgroundColor: d.color, color: d.textColor }}
                        className="px-2 py-0.5 rounded border border-ink text-[10px] font-mono font-bold hover:scale-105"
                      >
                        {d.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Else branch for if_then_else */}
            {b.elseChildren !== undefined && (
              <div className="mt-2 pt-1 border-t border-ink/20">
                <div className="text-xs font-mono font-bold text-ink mb-1">else:</div>
                {b.elseChildren.length > 0 ? (
                  b.elseChildren.map((child) => renderBlock(child, depth + 1))
                ) : (
                  <div className="text-[11px] font-mono text-ink-soft py-1 italic">
                    (empty else body)
                  </div>
                )}
                
                <div className="relative pt-0.5">
                  <button
                    onClick={() =>
                      setOpenSelectorForParent(
                        openSelectorForParent?.parentId === b.id && openSelectorForParent.isElse
                          ? null
                          : { parentId: b.id, isElse: true }
                      )
                    }
                    className="flex items-center gap-1 text-[11px] font-mono font-bold text-ink-soft hover:text-blue py-0.5"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add else block</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>

                  {openSelectorForParent?.parentId === b.id && openSelectorForParent.isElse && (
                    <div className="absolute left-0 top-6 z-30 bg-paper border-ink-2 shadow-hard rounded-lg p-2 flex flex-wrap gap-1 max-w-xs">
                      {['forward', 'backward', 'turn_left', 'turn_right', 'pick_up', 'say'].map((t) => {
                        const d = BLOCK_DEFINITIONS[t as BlockType];
                        return (
                          <button
                            key={t}
                            onClick={() => handleAddChildOfType(b.id, t as BlockType, true)}
                            style={{ backgroundColor: d.color, color: d.textColor }}
                            className="px-2 py-0.5 rounded border border-ink text-[10px] font-mono font-bold hover:scale-105"
                          >
                            {d.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-paper rounded-xl p-3 border-ink-2 shadow-hard overflow-hidden">
      {/* Category Pills Header */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-ink/15">
        {filteredCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-2.5 py-1 text-xs font-mono font-bold rounded-full border-ink-2 whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? `${cat.color} shadow-hard-sm -translate-y-0.5`
                : 'bg-paper text-ink opacity-70 hover:opacity-100'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Palette Block Picker (Click or Drag) */}
      <div className="my-2 p-2 bg-paper-2 rounded-lg border-ink-2">
        <div className="text-[11px] font-mono text-ink-soft uppercase tracking-wider mb-1.5 flex justify-between">
          <span>Click or drag to add:</span>
          <span>{paletteDefinitions.length} options</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {paletteDefinitions.map((def) => (
            <button
              key={def.type}
              draggable
              onDragStart={() => setDraggedPaletteType(def.type)}
              onDragEnd={() => setDraggedPaletteType(null)}
              onClick={() => handleAddBlock(def)}
              style={{ backgroundColor: def.color, color: def.textColor }}
              className="px-2.5 py-1 rounded-lg border-ink-2 text-xs font-mono font-bold shadow-hard-sm hover:translate-x-[1px] hover:-translate-y-[1px] active:translate-y-[1px] transition-all flex items-center gap-1.5 cursor-grab"
            >
              <Plus className="w-3 h-3" />
              <span>{def.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Workspace Header with Undo / Redo / Trash Zone */}
      <div className="flex items-center justify-between py-1 mb-1 border-b border-ink/10 text-xs font-mono font-bold text-ink">
        <span>Workspace ({blocks.length} blocks)</span>
        <div className="flex items-center gap-1">
          <button
            onClick={handleUndo}
            disabled={history.length === 0}
            className="p-1 rounded hover:bg-black/10 disabled:opacity-30 transition-opacity"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleRedo}
            disabled={redoStack.length === 0}
            className="p-1 rounded hover:bg-black/10 disabled:opacity-30 transition-opacity"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>

          {/* Trash Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOverTrash(true);
            }}
            onDragLeave={() => setDragOverTrash(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOverTrash(false);
              if (draggedBlockId) {
                handleRemoveBlock(draggedBlockId);
                setDraggedBlockId(null);
              }
            }}
            className={`p-1 rounded transition-colors ${
              dragOverTrash ? 'bg-danger text-white scale-110' : 'text-danger hover:bg-black/10'
            }`}
            title="Drag here or click to clear"
          >
            <button
              onClick={() => updateBlocksWithHistory([])}
              disabled={blocks.length === 0}
              className="disabled:opacity-30 flex items-center"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Droppable Workspace Tree */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleWorkspaceDrop}
        className="flex-1 overflow-y-auto pr-1 dark-scrollbar min-h-[220px]"
      >
        {blocks.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-ink/20 rounded-lg p-6 text-center text-ink-soft">
            <CornerDownRight className="w-6 h-6 mb-2 opacity-40 text-blue" />
            <p className="font-heading font-bold text-sm text-ink mb-1">
              Your program workspace is empty
            </p>
            <p className="font-mono text-xs">
              Click or drag any block above to assemble your robot program.
            </p>
          </div>
        ) : (
          blocks.map((b) => renderBlock(b))
        )}
      </div>
    </div>
  );
};
