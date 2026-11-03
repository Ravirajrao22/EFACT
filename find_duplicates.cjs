const ts = require('typescript');
const fs = require('fs');
const path = require('path');

function checkNode(node, sourceFile) {
  if (ts.isObjectLiteralExpression(node)) {
    const seen = new Set();
    for (const prop of node.properties) {
      if (ts.isPropertyAssignment(prop) || ts.isShorthandPropertyAssignment(prop) || ts.isMethodDeclaration(prop)) {
        const name = prop.name ? prop.name.getText(sourceFile) : null;
        if (name) {
          if (seen.has(name)) {
            const { line, character } = sourceFile.getLineAndCharacterOfPosition(prop.getStart(sourceFile));
            console.log(`DUPLICATE FOUND: ${sourceFile.fileName}:${line + 1}:${character + 1} - Property "${name}" is defined multiple times!`);
          }
          seen.add(name);
        }
      }
    }
  }
  ts.forEachChild(node, child => checkNode(child, sourceFile));
}

function scanDir(dir) {
  for (const item of fs.readdirSync(dir)) {
    if (item === 'node_modules' || item === '.bin' || item === 'dist' || item === '.git') continue;
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) scanDir(full);
    else if (full.endsWith('.ts') || full.endsWith('.tsx') || full.endsWith('.json')) {
      try {
        const content = fs.readFileSync(full, 'utf8');
        const sf = ts.createSourceFile(full, content, ts.ScriptTarget.Latest, true);
        checkNode(sf, sf);
      } catch (e) {
        console.error('Error scanning', full, e.message);
      }
    }
  }
}

scanDir('.');
console.log('AST scan completed.');

