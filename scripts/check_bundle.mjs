// Bundle budget check (NFR004, docs/TEST_PLAN.md 7.1, ruling R024).
// Draft ceilings run in WARN mode until calibration at G7 (PENDING P004).
// Set BUNDLE_BUDGET_ENFORCE=1 to make an overage a failing exit, the G7 promotion.
import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join, extname } from 'node:path';
import { gzipSync } from 'node:zlib';

const DIST = 'dist';

// Draft ceilings per ruling R024, gzip bytes. Calibrate and promote at G7.
const INITIAL_ROUTE_JS_CEILING = 300 * 1024;
const CHUNK_CEILING = 180 * 1024;
const ASSET_CEILING = 512 * 1024;

const enforce = process.env.BUNDLE_BUDGET_ENFORCE === '1';

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

let files;
try {
  files = walk(DIST);
} catch {
  console.error('check_bundle: dist/ not found. Run the build first.');
  process.exit(1);
}

let failures = 0;
let initialJsTotal = 0;
const rows = [];

for (const path of files) {
  const raw = statSync(path).size;
  const gz = gzipSync(readFileSync(path)).length;
  const ext = extname(path);
  let ceiling = ASSET_CEILING;
  if (ext === '.js') {
    ceiling = CHUNK_CEILING;
    initialJsTotal += gz;
  }
  const over = gz > ceiling;
  if (over) failures += 1;
  rows.push(`${over ? 'OVER ' : 'ok   '} ${path}  raw ${raw}  gzip ${gz}  ceiling ${ceiling}`);
}

rows.forEach((r) => console.log(r));
console.log(`initial JS total gzip: ${initialJsTotal} (ceiling ${INITIAL_ROUTE_JS_CEILING})`);
if (initialJsTotal > INITIAL_ROUTE_JS_CEILING) failures += 1;

if (failures > 0) {
  const mode = enforce ? 'BLOCK (calibrated, R024 promoted)' : 'WARN (draft ceilings, R024 pre G7)';
  console.log(`check_bundle: ${failures} ceiling overage(s). Mode: ${mode}`);
  process.exit(enforce ? 1 : 0);
}
console.log('check_bundle: all ceilings met.');
