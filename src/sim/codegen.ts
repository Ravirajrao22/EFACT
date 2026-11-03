import { BlockItem } from './blocks';

export interface CodeGenResult {
  code: string;
  blockToLines: Record<string, number[]>; // blockId -> array of 1-based line numbers
  lineToBlock: Record<number, string>;    // 1-based line number -> blockId
  totalBlockCount: number;
}

export function generatePython(blocks: BlockItem[]): CodeGenResult {
  const lines: string[] = [
    'from efact import Robot',
    'bot = Robot()',
    '',
  ];
  
  const blockToLines: Record<string, number[]> = {};
  const lineToBlock: Record<number, string> = {};
  let totalBlocks = 0;

  function countBlocks(list: BlockItem[]) {
    for (const b of list) {
      totalBlocks++;
      if (b.children) countBlocks(b.children);
      if (b.elseChildren) countBlocks(b.elseChildren);
    }
  }
  countBlocks(blocks);

  function conditionToPython(cond?: { type: string; operator?: string; left?: string; right?: string | number }): string {
    if (!cond) return 'True';
    switch (cond.type) {
      case 'sense_wall_ahead':
        return 'bot.wall_ahead()';
      case 'not_wall_ahead':
        return 'not bot.wall_ahead()';
      case 'sense_on_line':
        return 'bot.on_line()';
      case 'sense_at_goal':
        return 'bot.at_goal()';
      case 'not_at_goal':
        return 'not bot.at_goal()';
      case 'compare':
        return `${cond.left || 'bot.distance()'} ${cond.operator || '>'} ${cond.right ?? 1}`;
      default:
        return 'True';
    }
  }

  function addLine(blockId: string | null, lineStr: string) {
    lines.push(lineStr);
    const lineNum = lines.length; // 1-based
    if (blockId) {
      if (!blockToLines[blockId]) {
        blockToLines[blockId] = [];
      }
      blockToLines[blockId].push(lineNum);
      lineToBlock[lineNum] = blockId;
    }
  }

  function processBlocks(list: BlockItem[], indentLevel: number) {
    const indent = '    '.repeat(indentLevel);

    for (const b of list) {
      switch (b.type) {
        case 'forward': {
          const count = b.valNumber && b.valNumber > 1 ? b.valNumber : 1;
          addLine(b.id, `${indent}bot.forward(${count})`);
          break;
        }
        case 'backward': {
          const count = b.valNumber && b.valNumber > 1 ? b.valNumber : 1;
          addLine(b.id, `${indent}bot.backward(${count})`);
          break;
        }
        case 'turn_left':
          addLine(b.id, `${indent}bot.turn_left()`);
          break;
        case 'turn_right':
          addLine(b.id, `${indent}bot.turn_right()`);
          break;
        case 'pick_up':
          addLine(b.id, `${indent}bot.pick_up()`);
          break;
        case 'drop':
          addLine(b.id, `${indent}bot.drop()`);
          break;
        case 'say': {
          const msg = b.valText ? JSON.stringify(b.valText) : '""';
          addLine(b.id, `${indent}bot.say(${msg})`);
          break;
        }
        case 'set_var': {
          const vName = b.varName || 'x';
          addLine(b.id, `${indent}${vName} = ${b.valNumber ?? 0}`);
          break;
        }
        case 'change_var': {
          const vName = b.varName || 'x';
          addLine(b.id, `${indent}${vName} += ${b.valNumber ?? 1}`);
          break;
        }
        case 'repeat_times': {
          const times = b.valNumber ?? 4;
          addLine(b.id, `${indent}for i in range(${times}):`);
          if (b.children && b.children.length > 0) {
            processBlocks(b.children, indentLevel + 1);
          } else {
            addLine(null, `${indent}    pass`);
          }
          break;
        }
        case 'while_cond': {
          const condStr = conditionToPython(b.condition);
          addLine(b.id, `${indent}while ${condStr}:`);
          if (b.children && b.children.length > 0) {
            processBlocks(b.children, indentLevel + 1);
          } else {
            addLine(null, `${indent}    pass`);
          }
          break;
        }
        case 'if_then': {
          const condStr = conditionToPython(b.condition);
          addLine(b.id, `${indent}if ${condStr}:`);
          if (b.children && b.children.length > 0) {
            processBlocks(b.children, indentLevel + 1);
          } else {
            addLine(null, `${indent}    pass`);
          }
          break;
        }
        case 'if_then_else': {
          const condStr = conditionToPython(b.condition);
          addLine(b.id, `${indent}if ${condStr}:`);
          if (b.children && b.children.length > 0) {
            processBlocks(b.children, indentLevel + 1);
          } else {
            addLine(null, `${indent}    pass`);
          }
          addLine(b.id, `${indent}else:`);
          if (b.elseChildren && b.elseChildren.length > 0) {
            processBlocks(b.elseChildren, indentLevel + 1);
          } else {
            addLine(null, `${indent}    pass`);
          }
          break;
        }
        default:
          break;
      }
    }
  }

  processBlocks(blocks, 0);

  return {
    code: lines.join('\n'),
    blockToLines,
    lineToBlock,
    totalBlockCount: totalBlocks,
  };
}

// Convert Python code back to blocks (Code to Blocks peek)
export function pythonToBlocks(code: string): { success: true; blocks: BlockItem[] } | { success: false; reason: string } {
  try {
    const rawLines = code.split('\n');
    const lines: { text: string; indent: number; lineNum: number }[] = [];

    for (let i = 0; i < rawLines.length; i++) {
      let raw = rawLines[i];
      const commentIdx = raw.indexOf('#');
      if (commentIdx !== -1) raw = raw.substring(0, commentIdx);
      if (raw.trim().length === 0) continue;

      const match = raw.match(/^[ \t]*/);
      const indent = match ? match[0].replace(/\t/g, '    ').length : 0;
      lines.push({ text: raw.trim(), indent, lineNum: i + 1 });
    }

    // Filter out standard imports
    const filtered = lines.filter(
      (l) => !l.text.startsWith('from efact') && !l.text.startsWith('import ') && l.text !== 'bot = Robot()'
    );

    function parseCondition(condStr: string): any {
      const c = condStr.trim();
      if (c === 'bot.wall_ahead()') return { type: 'sense_wall_ahead' };
      if (c === 'not bot.wall_ahead()' || c === 'not(bot.wall_ahead())') return { type: 'not_wall_ahead' };
      if (c === 'bot.on_line()') return { type: 'sense_on_line' };
      if (c === 'bot.at_goal()') return { type: 'sense_at_goal' };
      if (c === 'not bot.at_goal()' || c === 'not(bot.at_goal())') return { type: 'not_at_goal' };

      const compMatch = c.match(/^(bot\.\w+\(\))\s*(==|!=|<=|>=|<|>)\s*(\d+)$/);
      if (compMatch) {
        return {
          type: 'compare',
          left: compMatch[1],
          operator: compMatch[2],
          right: Number(compMatch[3]),
        };
      }
      return null;
    }

    function parseBlockSlice(startIndex: number, expectedIndent: number): { items: BlockItem[]; nextIndex: number } {
      const items: BlockItem[] = [];
      let idx = startIndex;

      while (idx < filtered.length) {
        const line = filtered[idx];
        if (line.indent < expectedIndent) break;
        if (line.indent > expectedIndent) {
          throw new Error('Indentation mismatch');
        }

        const t = line.text;

        if (t === 'pass') {
          idx++;
          continue;
        }

        // bot.forward(n)
        const fwdMatch = t.match(/^bot\.forward\s*\((.*)\);?$/);
        if (fwdMatch) {
          const num = fwdMatch[1].trim() ? Number(fwdMatch[1].trim()) : 1;
          if (isNaN(num)) throw new Error('Complex forward');
          items.push({
            id: `b_${Math.random().toString(36).substring(2, 9)}`,
            type: 'forward',
            category: 'move',
            valNumber: num,
          });
          idx++;
          continue;
        }

        // bot.backward(n)
        const bwdMatch = t.match(/^bot\.backward\s*\((.*)\);?$/);
        if (bwdMatch) {
          const num = bwdMatch[1].trim() ? Number(bwdMatch[1].trim()) : 1;
          if (isNaN(num)) throw new Error('Complex backward');
          items.push({
            id: `b_${Math.random().toString(36).substring(2, 9)}`,
            type: 'backward',
            category: 'move',
            valNumber: num,
          });
          idx++;
          continue;
        }

        // bot.turn_left()
        if (/^bot\.(turn_left|turnLeft)\(\);?$/.test(t)) {
          items.push({
            id: `b_${Math.random().toString(36).substring(2, 9)}`,
            type: 'turn_left',
            category: 'move',
          });
          idx++;
          continue;
        }

        // bot.turn_right()
        if (/^bot\.(turn_right|turnRight)\(\);?$/.test(t)) {
          items.push({
            id: `b_${Math.random().toString(36).substring(2, 9)}`,
            type: 'turn_right',
            category: 'move',
          });
          idx++;
          continue;
        }

        // bot.pick_up()
        if (/^bot\.(pick_up|pickup|pickUp)\(\);?$/.test(t)) {
          items.push({
            id: `b_${Math.random().toString(36).substring(2, 9)}`,
            type: 'pick_up',
            category: 'action',
          });
          idx++;
          continue;
        }

        // bot.drop()
        if (/^bot\.drop\(\);?$/.test(t)) {
          items.push({
            id: `b_${Math.random().toString(36).substring(2, 9)}`,
            type: 'drop',
            category: 'action',
          });
          idx++;
          continue;
        }

        // bot.say(...)
        const sayMatch = t.match(/^bot\.say\s*\((.*)\);?$/);
        if (sayMatch) {
          const rawText = sayMatch[1].trim().replace(/^["']|["']$/g, '');
          items.push({
            id: `b_${Math.random().toString(36).substring(2, 9)}`,
            type: 'say',
            category: 'action',
            valText: rawText,
          });
          idx++;
          continue;
        }

        // for i in range(n):
        const forMatch = t.match(/^for\s+([a-zA-Z_]\w*)\s+in\s+range\((.*)\):$/);
        if (forMatch) {
          const times = Number(forMatch[2].trim());
          if (isNaN(times)) throw new Error('Complex loop range');
          const childIndent = filtered[idx + 1]?.indent;
          if (childIndent === undefined || childIndent <= expectedIndent) {
            throw new Error('Empty loop');
          }
          const { items: children, nextIndex } = parseBlockSlice(idx + 1, childIndent);
          items.push({
            id: `b_${Math.random().toString(36).substring(2, 9)}`,
            type: 'repeat_times',
            category: 'control',
            valNumber: times,
            children,
          });
          idx = nextIndex;
          continue;
        }

        // while <cond>:
        const whileMatch = t.match(/^while\s+(.*):$/);
        if (whileMatch) {
          const cond = parseCondition(whileMatch[1]);
          if (!cond) throw new Error('Unsupported condition in while');
          const childIndent = filtered[idx + 1]?.indent;
          if (childIndent === undefined || childIndent <= expectedIndent) {
            throw new Error('Empty while');
          }
          const { items: children, nextIndex } = parseBlockSlice(idx + 1, childIndent);
          items.push({
            id: `b_${Math.random().toString(36).substring(2, 9)}`,
            type: 'while_cond',
            category: 'control',
            condition: cond,
            children,
          });
          idx = nextIndex;
          continue;
        }

        // if <cond>: (with optional else:)
        const ifMatch = t.match(/^if\s+(.*):$/);
        if (ifMatch) {
          const cond = parseCondition(ifMatch[1]);
          if (!cond) throw new Error('Unsupported condition in if');
          const childIndent = filtered[idx + 1]?.indent;
          if (childIndent === undefined || childIndent <= expectedIndent) {
            throw new Error('Empty if');
          }
          const { items: thenChildren, nextIndex: nextAfterThen } = parseBlockSlice(idx + 1, childIndent);

          let elseChildren: BlockItem[] | undefined = undefined;
          let curNext = nextAfterThen;

          if (curNext < filtered.length && filtered[curNext].indent === expectedIndent) {
            if (filtered[curNext].text === 'else:') {
              const elseIndent = filtered[curNext + 1]?.indent;
              if (elseIndent === undefined || elseIndent <= expectedIndent) {
                throw new Error('Empty else');
              }
              const elseRes = parseBlockSlice(curNext + 1, elseIndent);
              elseChildren = elseRes.items;
              curNext = elseRes.nextIndex;
            }
          }

          items.push({
            id: `b_${Math.random().toString(36).substring(2, 9)}`,
            type: elseChildren ? 'if_then_else' : 'if_then',
            category: 'control',
            condition: cond,
            children: thenChildren,
            elseChildren,
          });
          idx = curNext;
          continue;
        }

        // Any other unsupported statement
        throw new Error(`Unsupported statement: ${t}`);
      }

      return { items, nextIndex: idx };
    }

    const result = parseBlockSlice(0, 0);
    return { success: true, blocks: result.items };
  } catch (err: any) {
    return {
      success: false,
      reason: "This code goes beyond blocks. That's a good sign.",
    };
  }
}

