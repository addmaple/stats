import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd(), 'test');

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) files.push(...walk(full));
    else files.push(full);
  }
  return files;
}

function rewriteFile(filePath) {
  const original = fs.readFileSync(filePath, 'utf8');
  let s = original;

  // 1) Whole-suite placeholders for unimplemented modules
  //    it('not yet implemented', () => { assert.ok(true, 'reason'); });
  s = s.replace(
    /it\(\s*'not yet implemented'\s*,\s*\(\)\s*=>\s*\{\s*assert\.ok\(\s*true\s*,\s*'([^']*)'\s*\)\s*;\s*\}\s*\)\s*;?/g,
    "it.skip('$1', () => {});"
  );

  // 2) Placeholder "manual conversion needed" / "matrix operations" inside tests
  //    Convert the entire `it(...)` block to an `it.skip(...)`.
  s = s.replace(
    /it\(\s*'([^']*)'\s*,\s*async\s*\(\)\s*=>\s*\{([\s\S]*?)\n\s*\}\s*\)\s*;?/g,
    (full, title, body) => {
      const reasons = [];
      if (body.includes("Matrix operations not yet implemented")) {
        reasons.push('matrix operations not implemented');
      }
      if (body.includes("Test needs manual conversion")) {
        reasons.push('test needs manual conversion');
      }

      // If this isn't a placeholder test, leave untouched.
      if (reasons.length === 0) return full;

      const reason = [...new Set(reasons)].join(', ');
      // Preserve title but make the skip reason visible in TAP output.
      return `it.skip('${title} (skipped: ${reason})', async () => {});`;
    }
  );

  if (s !== original) {
    fs.writeFileSync(filePath, s, 'utf8');
    return true;
  }
  return false;
}

const files = walk(ROOT).filter((p) => p.endsWith('.test.js'));
let changed = 0;
for (const f of files) {
  if (rewriteFile(f)) changed++;
}

console.log(`Updated ${changed} test file(s).`);





