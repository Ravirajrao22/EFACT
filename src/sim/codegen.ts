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

