import { SimEngine } from './engine';

export interface ExecStep {
  line: number;
  blockId?: string;
  isDone?: boolean;
  error?: string;
  actionDesc?: string;
}

interface ASTNode {
  type: string;
  line: number;
  [key: string]: any;
}

export class PythonInterpreter {
  private engine: SimEngine;
  private lineToBlock: Record<number, string>;
  private stepCount: number = 0;
  private maxSteps: number = 5000;
  private variables: Map<string, any> = new Map();
  private functions: Map<string, { params: string[]; body: ASTNode[] }> = new Map();

  constructor(engine: SimEngine, lineToBlock: Record<number, string> = {}) {
    this.engine = engine;
    this.lineToBlock = lineToBlock;
  }

  public setLineToBlock(map: Record<number, string>) {
    this.lineToBlock = map;
  }

  // Parses Python source code into a list of AST nodes
  public parse(source: string): { nodes: ASTNode[]; error?: string } {
    try {
      const rawLines = source.split('\n');
      const lines: { text: string; indent: number; lineNum: number }[] = [];

      for (let i = 0; i < rawLines.length; i++) {
        let raw = rawLines[i];
        // Strip trailing comments
        const commentIdx = raw.indexOf('#');
        if (commentIdx !== -1) {
          raw = raw.substring(0, commentIdx);
        }
        if (raw.trim().length === 0) continue; // Skip blank lines

        // Count indent (4 spaces or 1 tab = 1 level)
        const match = raw.match(/^[ \t]*/);
        const indentStr = match ? match[0] : '';
        const indent = indentStr.replace(/\t/g, '    ').length;
        lines.push({ text: raw.trim(), indent, lineNum: i + 1 });
      }

      const { nodes } = this.parseBlock(lines, 0, 0);
      return { nodes };
    } catch (e: any) {
      return { nodes: [], error: e.message || 'Syntax error' };
    }
  }

  private parseBlock(
    lines: { text: string; indent: number; lineNum: number }[],
    startIndex: number,
    expectedIndent: number
  ): { nodes: ASTNode[]; nextIndex: number } {
    const nodes: ASTNode[] = [];
    let i = startIndex;

    while (i < lines.length) {
      const current = lines[i];
      if (current.indent < expectedIndent) {
        break; // End of current block
      }
      if (current.indent > expectedIndent) {
        throw new Error(`Unexpected indentation at line ${current.lineNum}: "${current.text}"`);
      }

      const text = current.text;
      const lineNum = current.lineNum;

      // Ignore standard imports/setup boilerplate
      if (
        text.startsWith('from efact') ||
        text.startsWith('import ') ||
        text === 'bot = Robot()'
      ) {
        i++;
        continue;
      }

      // 1. for loop: for <var> in range(<expr>):
      const forMatch = text.match(/^for\s+([a-zA-Z_]\w*)\s+in\s+range\((.*)\):$/);
      if (forMatch) {
        const loopVar = forMatch[1];
        const rangeExpr = forMatch[2];
        const childIndent = lines[i + 1]?.indent;
        if (childIndent === undefined || childIndent <= current.indent) {
          throw new Error(`Expected indented block after for loop at line ${lineNum}`);
        }
        const { nodes: body, nextIndex } = this.parseBlock(lines, i + 1, childIndent);
        nodes.push({
          type: 'For',
          line: lineNum,
          loopVar,
          rangeExpr,
          body,
        });
        i = nextIndex;
        continue;
      }

      // 2. while loop: while <cond>:
      const whileMatch = text.match(/^while\s+(.*):$/);
      if (whileMatch) {
        const condExpr = whileMatch[1];
        const childIndent = lines[i + 1]?.indent;
        if (childIndent === undefined || childIndent <= current.indent) {
          throw new Error(`Expected indented block after while loop at line ${lineNum}`);
        }
        const { nodes: body, nextIndex } = this.parseBlock(lines, i + 1, childIndent);
        nodes.push({
          type: 'While',
          line: lineNum,
          condExpr,
          body,
        });
        i = nextIndex;
        continue;
      }

      // 3. if / elif / else
      const ifMatch = text.match(/^if\s+(.*):$/);
      if (ifMatch) {
        const condExpr = ifMatch[1];
        const childIndent = lines[i + 1]?.indent;
        if (childIndent === undefined || childIndent <= current.indent) {
          throw new Error(`Expected indented block after if statement at line ${lineNum}`);
        }
        const { nodes: thenBody, nextIndex: nextAfterThen } = this.parseBlock(lines, i + 1, childIndent);
        let elseBody: ASTNode[] = [];
        let curNext = nextAfterThen;

        if (curNext < lines.length && lines[curNext].indent === expectedIndent) {
          if (lines[curNext].text === 'else:') {
            const elseIndent = lines[curNext + 1]?.indent;
            if (elseIndent === undefined || elseIndent <= expectedIndent) {
              throw new Error(`Expected indented block after else at line ${lines[curNext].lineNum}`);
            }
            const elseRes = this.parseBlock(lines, curNext + 1, elseIndent);
            elseBody = elseRes.nodes;
            curNext = elseRes.nextIndex;
          }
        }

        nodes.push({
          type: 'If',
          line: lineNum,
          condExpr,
          thenBody,
          elseBody,
        });
        i = curNext;
        continue;
      }

      // 4. Function definition: def name(args):
      const defMatch = text.match(/^def\s+([a-zA-Z_]\w*)\s*\((.*)\):$/);
      if (defMatch) {
        const fnName = defMatch[1];
        const params = defMatch[2]
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
        const childIndent = lines[i + 1]?.indent;
        if (childIndent === undefined || childIndent <= current.indent) {
          throw new Error(`Expected indented block after def ${fnName} at line ${lineNum}`);
        }
        const { nodes: body, nextIndex } = this.parseBlock(lines, i + 1, childIndent);
        nodes.push({
          type: 'FunctionDef',
          line: lineNum,
          name: fnName,
          params,
          body,
        });
        i = nextIndex;
        continue;
      }

      // 5. pass / break / continue / return
      if (text === 'pass') {
        nodes.push({ type: 'Pass', line: lineNum });
        i++;
        continue;
      }
      if (text === 'break') {
        nodes.push({ type: 'Break', line: lineNum });
        i++;
        continue;
      }
      if (text === 'continue') {
        nodes.push({ type: 'Continue', line: lineNum });
        i++;
        continue;
      }
      if (text.startsWith('return')) {
        nodes.push({ type: 'Return', line: lineNum, expr: text.substring(6).trim() });
        i++;
        continue;
      }

      // 6. Assignment: x += 1, x -= 1, x = expr
      const assignMatch = text.match(/^([a-zA-Z_]\w*)\s*(\+=|-=|=)\s*(.*)$/);
      if (assignMatch && !text.startsWith('bot.') && !text.startsWith('print(')) {
        nodes.push({
          type: 'Assign',
          line: lineNum,
          varName: assignMatch[1],
          op: assignMatch[2],
          expr: assignMatch[3],
        });
        i++;
        continue;
      }

      // 7. Robot call or print call
      nodes.push({
        type: 'CallStmt',
        line: lineNum,
        expr: text,
      });
      i++;
    }

    return { nodes, nextIndex: i };
  }

  // Robust Expression Evaluator with proper precedence
  private evalExpr(expr: string): any {
    const trimmed = expr.trim();
    if (!trimmed) return null;

    // 1. Parentheses unwrapping: (expr)
    if (trimmed.startsWith('(') && trimmed.endsWith(')')) {
      let depth = 0;
      let canUnwrap = true;
      for (let idx = 0; idx < trimmed.length - 1; idx++) {
        if (trimmed[idx] === '(') depth++;
        else if (trimmed[idx] === ')') depth--;
        if (depth === 0) {
          canUnwrap = false;
          break;
        }
      }
      if (canUnwrap) {
        return this.evalExpr(trimmed.slice(1, -1));
      }
    }

    // 2. Logical 'or' (lowest precedence)
    const orIdx = this.findOperatorIndex(trimmed, 'or');
    if (orIdx !== -1) {
      const left = this.evalExpr(trimmed.substring(0, orIdx));
      const right = this.evalExpr(trimmed.substring(orIdx + 2));
      return Boolean(left || right);
    }

    // 3. Logical 'and'
    const andIdx = this.findOperatorIndex(trimmed, 'and');
    if (andIdx !== -1) {
      const left = this.evalExpr(trimmed.substring(0, andIdx));
      const right = this.evalExpr(trimmed.substring(andIdx + 3));
      return Boolean(left && right);
    }

    // 4. Logical 'not'
    if (trimmed.startsWith('not ') || trimmed.startsWith('not(')) {
      const inner = trimmed.startsWith('not ') ? trimmed.substring(4) : trimmed.substring(3);
      return !this.evalExpr(inner);
    }

    // 5. Comparisons: ==, !=, <=, >=, <, >
    const compOperators = ['==', '!=', '<=', '>=', '<', '>'];
    for (const op of compOperators) {
      const opIdx = this.findOperatorIndex(trimmed, op);
      if (opIdx !== -1) {
        const left = this.evalExpr(trimmed.substring(0, opIdx));
        const right = this.evalExpr(trimmed.substring(opIdx + op.length));
        switch (op) {
          case '==': return left === right;
          case '!=': return left !== right;
          case '<': return left < right;
          case '<=': return left <= right;
          case '>': return left > right;
          case '>=': return left >= right;
        }
      }
    }

    // 6. Arithmetic operators: +, -, *, /
    for (const op of ['+', '-', '*', '/']) {
      const opIdx = this.findOperatorIndex(trimmed, op);
      if (opIdx !== -1) {
        const left = Number(this.evalExpr(trimmed.substring(0, opIdx)));
        const right = Number(this.evalExpr(trimmed.substring(opIdx + 1)));
        switch (op) {
          case '+': return left + right;
          case '-': return left - right;
          case '*': return left * right;
          case '/': return right !== 0 ? left / right : 0;
        }
      }
    }

    // 7. Base Literals and Identifiers
    if (trimmed === 'True') return true;
    if (trimmed === 'False') return false;
    if (trimmed === 'None') return null;

    // Number literal
    if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
      return Number(trimmed);
    }

    // String literal
    if (
      (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
      (trimmed.startsWith("'") && trimmed.endsWith("'"))
    ) {
      return trimmed.slice(1, -1);
    }

    // Exact Robot API queries
    if (trimmed === 'bot.wall_ahead()' || trimmed === 'bot.wall_ahead') {
      return this.engine.wall_ahead();
    }
    if (trimmed === 'bot.on_line()' || trimmed === 'bot.on_line') {
      return this.engine.on_line();
    }
    if (trimmed === 'bot.at_goal()' || trimmed === 'bot.at_goal') {
      return this.engine.at_goal();
    }
    if (trimmed === 'bot.distance()' || trimmed === 'bot.distance') {
      return this.engine.distance();
    }

    // Variable lookup
    if (this.variables.has(trimmed)) {
      return this.variables.get(trimmed);
    }

    return trimmed;
  }

  // Helper to find top-level operators not enclosed in parentheses
  private findOperatorIndex(str: string, op: string): number {
    let depth = 0;
    const isWord = op === 'and' || op === 'or';

    for (let i = 0; i <= str.length - op.length; i++) {
      const ch = str[i];
      if (ch === '(') depth++;
      else if (ch === ')') depth--;
      else if (depth === 0) {
        if (str.substring(i, i + op.length) === op) {
          if (isWord) {
            const before = i > 0 ? str[i - 1] : ' ';
            const after = i + op.length < str.length ? str[i + op.length] : ' ';
            if (/\s/.test(before) && /\s/.test(after)) {
              return i;
            }
          } else {
            return i;
          }
        }
      }
    }
    return -1;
  }

  // Generator for step-by-step execution
  public async *runGenerator(ast: ASTNode[]): AsyncGenerator<ExecStep, void, void> {
    this.stepCount = 0;
    this.variables.clear();
    this.functions.clear();

    for (const node of ast) {
      yield* this.executeNode(node);
      if (this.engine.state.status === 'crashed' || this.engine.state.status === 'completed') {
        break;
      }
    }

    yield {
      line: 0,
      isDone: true,
      actionDesc: 'Execution finished.',
    };
  }

  private async *executeNode(
    node: ASTNode
  ): AsyncGenerator<ExecStep, { signal?: 'break' | 'continue' | 'return'; val?: any }, void> {
    this.stepCount++;
    if (this.stepCount > this.maxSteps) {
      const errMsg = 'Your loop never ended. Add a condition that can become False.';
      this.engine.state.lastError = errMsg;
      this.engine.onLogMessage?.(errMsg, 'error');
      yield {
        line: node.line,
        blockId: this.lineToBlock[node.line],
        error: errMsg,
      };
      return {};
    }

    switch (node.type) {
      case 'Pass':
        yield { line: node.line, blockId: this.lineToBlock[node.line] };
        return {};

      case 'Break':
        yield { line: node.line, blockId: this.lineToBlock[node.line] };
        return { signal: 'break' };

      case 'Continue':
        yield { line: node.line, blockId: this.lineToBlock[node.line] };
        return { signal: 'continue' };

      case 'Return': {
        const val = node.expr ? this.evalExpr(node.expr) : undefined;
        yield { line: node.line, blockId: this.lineToBlock[node.line] };
        return { signal: 'return', val };
      }

      case 'Assign': {
        const rVal = this.evalExpr(node.expr);
        const cur = this.variables.get(node.varName) ?? 0;
        if (node.op === '=') {
          this.variables.set(node.varName, rVal);
        } else if (node.op === '+=') {
          this.variables.set(node.varName, cur + rVal);
        } else if (node.op === '-=') {
          this.variables.set(node.varName, cur - rVal);
        }
        yield {
          line: node.line,
          blockId: this.lineToBlock[node.line],
          actionDesc: `${node.varName} = ${this.variables.get(node.varName)}`,
        };
        return {};
      }

      case 'FunctionDef': {
        this.functions.set(node.name, {
          params: node.params,
          body: node.body,
        });
        return {};
      }

      case 'CallStmt': {
        const text = node.expr.trim();

        // bot.forward(n=1)
        const fwdMatch = text.match(/^bot\.forward\s*\((.*)\)$/);
        if (fwdMatch) {
          const arg = fwdMatch[1].trim();
          const count = arg ? Math.max(1, Number(this.evalExpr(arg)) || 1) : 1;
          for (let s = 0; s < count; s++) {
            const ok = this.engine.stepForward();
            yield {
              line: node.line,
              blockId: this.lineToBlock[node.line],
              actionDesc: `bot.forward (${s + 1}/${count})`,
            };
            if (!ok || this.engine.state.status === 'crashed' || this.engine.state.status === 'completed') {
              break;
            }
          }
          return {};
        }

        // bot.backward(n=1)
        const bwdMatch = text.match(/^bot\.backward\s*\((.*)\)$/);
        if (bwdMatch) {
          const arg = bwdMatch[1].trim();
          const count = arg ? Math.max(1, Number(this.evalExpr(arg)) || 1) : 1;
          for (let s = 0; s < count; s++) {
            const ok = this.engine.stepBackward();
            yield {
              line: node.line,
              blockId: this.lineToBlock[node.line],
              actionDesc: `bot.backward (${s + 1}/${count})`,
            };
            if (!ok || this.engine.state.status === 'crashed' || this.engine.state.status === 'completed') {
              break;
            }
          }
          return {};
        }

        // bot.turn_left()
        if (/^bot\.(turn_left|turnLeft)(\s*\(\s*\))?;?$/.test(text)) {
          this.engine.turnLeft();
          yield {
            line: node.line,
            blockId: this.lineToBlock[node.line],
            actionDesc: 'bot.turn_left()',
          };
          return {};
        }

        // bot.turn_right()
        if (/^bot\.(turn_right|turnRight)(\s*\(\s*\))?;?$/.test(text)) {
          this.engine.turnRight();
          yield {
            line: node.line,
            blockId: this.lineToBlock[node.line],
            actionDesc: 'bot.turn_right()',
          };
          return {};
        }

        // bot.pick_up()
        if (/^bot\.(pick_up|pickup|pickUp)(\s*\(\s*\))?;?$/.test(text)) {
          this.engine.pickUp();
          yield {
            line: node.line,
            blockId: this.lineToBlock[node.line],
            actionDesc: 'bot.pick_up()',
          };
          return {};
        }

        // bot.drop()
        if (/^bot\.drop(\s*\(\s*\))?;?$/.test(text)) {
          this.engine.drop();
          yield {
            line: node.line,
            blockId: this.lineToBlock[node.line],
            actionDesc: 'bot.drop()',
          };
          return {};
        }

        // bot.say(text)
        const sayMatch = text.match(/^bot\.say\s*\((.*)\)$/);
        if (sayMatch) {
          const msg = this.evalExpr(sayMatch[1]);
          this.engine.say(String(msg));
          yield {
            line: node.line,
            blockId: this.lineToBlock[node.line],
            actionDesc: `bot.say: ${msg}`,
          };
          return {};
        }

        // print(...)
        const printMatch = text.match(/^print\s*\((.*)\)$/);
        if (printMatch) {
          const msg = this.evalExpr(printMatch[1]);
          this.engine.say(String(msg));
          yield {
            line: node.line,
            blockId: this.lineToBlock[node.line],
            actionDesc: `print: ${msg}`,
          };
          return {};
        }

        // User defined function call
        const fnCallMatch = text.match(/^([a-zA-Z_]\w*)\s*\((.*)\)$/);
        if (fnCallMatch) {
          const fnName = fnCallMatch[1];
          if (this.functions.has(fnName)) {
            const fn = this.functions.get(fnName)!;
            for (const child of fn.body) {
              const res = yield* this.executeNode(child);
              if (res?.signal === 'return') break;
            }
            return {};
          }
        }

        return {};
      }

      case 'For': {
        const parts = String(node.rangeExpr || '').split(',');
        let start = 0;
        let limit = 0;
        if (parts.length === 1) {
          const val = Number(this.evalExpr(parts[0]));
          limit = isNaN(val) ? 0 : Math.max(0, Math.floor(val));
        } else if (parts.length >= 2) {
          const sVal = Number(this.evalExpr(parts[0]));
          const eVal = Number(this.evalExpr(parts[1]));
          start = isNaN(sVal) ? 0 : Math.floor(sVal);
          limit = isNaN(eVal) ? 0 : Math.floor(eVal);
        }

        for (let idx = start; idx < limit; idx++) {
          this.variables.set(node.loopVar, idx);
          let breakLoop = false;

          yield {
            line: node.line,
            blockId: this.lineToBlock[node.line],
            actionDesc: `for ${node.loopVar} = ${idx}`,
          };

          for (const child of node.body) {
            const res = yield* this.executeNode(child);
            if (res?.signal === 'break') {
              breakLoop = true;
              break;
            }
            if (res?.signal === 'continue') {
              break;
            }
            if (res?.signal === 'return') {
              return res;
            }
            if (this.engine.state.status === 'crashed' || this.engine.state.status === 'completed') {
              return {};
            }
          }
          if (breakLoop) break;
        }
        return {};
      }

      case 'While': {
        while (Boolean(this.evalExpr(node.condExpr))) {
          let breakLoop = false;

          yield {
            line: node.line,
            blockId: this.lineToBlock[node.line],
            actionDesc: `while ${node.condExpr} is True`,
          };

          for (const child of node.body) {
            const res = yield* this.executeNode(child);
            if (res?.signal === 'break') {
              breakLoop = true;
              break;
            }
            if (res?.signal === 'continue') {
              break;
            }
            if (res?.signal === 'return') {
              return res;
            }
            if (this.engine.state.status === 'crashed' || this.engine.state.status === 'completed') {
              return {};
            }
          }
          if (breakLoop) break;
        }
        return {};
      }

      case 'If': {
        const cond = Boolean(this.evalExpr(node.condExpr));
        yield {
          line: node.line,
          blockId: this.lineToBlock[node.line],
          actionDesc: `if ${node.condExpr} -> ${cond}`,
        };

        const bodyToExec = cond ? node.thenBody : node.elseBody;
        if (bodyToExec && bodyToExec.length > 0) {
          for (const child of bodyToExec) {
            const res = yield* this.executeNode(child);
            if (res?.signal) {
              return res;
            }
            if (this.engine.state.status === 'crashed' || this.engine.state.status === 'completed') {
              return {};
            }
          }
        }
        return {};
      }

      default:
        return {};
    }
  }
}
