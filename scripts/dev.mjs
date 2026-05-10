import { spawn } from 'node:child_process';
import process from 'node:process';

const isWindows = process.platform === 'win32';

console.log('Starting development environment...');
console.log('App: http://localhost:8080');
console.log('API: http://localhost:3001');
console.log('');

const children = [];

function start(name, command, args) {
  const child = spawn(command, args, {
    stdio: ['ignore', 'inherit', 'inherit'],
    shell: isWindows,
    env: process.env,
  });

  child.on('exit', (code, signal) => {
    if (shuttingDown) return;
    console.error(`[${name}] exited with code=${code} signal=${signal}`);
    shutdown(code ?? 1);
  });

  children.push({ name, child });
  return child;
}

let shuttingDown = false;
function shutdown(code = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const { child } of children) {
    if (!child.killed) {
      try {
        if (isWindows) {
          spawn('taskkill', ['/pid', String(child.pid), '/f', '/t']);
        } else {
          child.kill('SIGTERM');
        }
      } catch {}
    }
  }
  setTimeout(() => process.exit(code), 200);
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

start('api', 'node', ['dev-server.mjs']);

setTimeout(() => {
  start('vite', 'npx', ['vite', 'dev', '--port', '8080', '--host', '127.0.0.1']);
}, 1500);
