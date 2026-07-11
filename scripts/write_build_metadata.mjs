// Writes dist/build.json: the deployment traceability record consumed by the About
// panel and post_deploy_smoke (OPS005, OPS009, ruling R015).
import { writeFileSync, readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const modelSource = readFileSync('src/simulation/model_version.ts', 'utf8');
const modelMatch = modelSource.match(/SIMULATION_MODEL_VERSION = (\d+)/);
if (!modelMatch) {
  console.error('write_build_metadata: SIMULATION_MODEL_VERSION not found.');
  process.exit(1);
}

const metadata = {
  commit: execSync('git rev-parse HEAD').toString().trim(),
  buildTime: new Date().toISOString(),
  appVersion: pkg.version,
  simulationModelVersion: Number(modelMatch[1]),
};

writeFileSync('dist/build.json', JSON.stringify(metadata, null, 2) + '\n');
console.log('build.json written:', JSON.stringify(metadata));
