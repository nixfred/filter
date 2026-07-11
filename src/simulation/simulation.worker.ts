// Web Worker entry (FR018, docs/ARCHITECTURE.md section 3). A thin shell:
// all protocol behavior lives in worker_host.ts where tests can drive it.
// self.addEventListener is used rather than a bare onmessage assignment so
// both real browser workers and the test shim observe the handler.
import { createWorkerHost, type WorkerInMessage } from './worker_host';

const handle = createWorkerHost((message) => {
  self.postMessage(message);
});

self.addEventListener('message', (event) => {
  handle((event as MessageEvent<WorkerInMessage>).data);
});

self.postMessage({ type: 'READY' });
