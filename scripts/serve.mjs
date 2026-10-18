// Zero-dependency static server for dist/, reachable from your phone on the same Wi-Fi.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { networkInterfaces } from 'node:os';

const port = Number(process.env.PORT) || 8080;
const distDir = new URL('../dist/', import.meta.url);
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8' };

createServer(async (req, res) => {
  const path = new URL(req.url, 'http://x').pathname;
  const name = path === '/' ? 'index.html' : path.slice(1);
  if (!/^[\w.-]+$/.test(name)) return res.writeHead(404).end();
  try {
    const body = await readFile(new URL(name, distDir));
    res.writeHead(200, {
      'content-type': types[name.slice(name.lastIndexOf('.'))] ?? 'application/octet-stream',
      'cache-control': 'no-cache',
    });
    res.end(body);
    console.log(`${new Date().toLocaleTimeString()}  ${req.socket.remoteAddress}  GET ${path}`);
  } catch {
    res.writeHead(404).end('Not found');
  }
}).listen(port, '0.0.0.0', () => {
  console.log('The Deadly Lizard is listening:\n');
  console.log(`  http://localhost:${port}`);
  for (const addrs of Object.values(networkInterfaces())) {
    for (const a of addrs ?? []) {
      if (a.family === 'IPv4' && !a.internal) console.log(`  http://${a.address}:${port}   <- open this on your phone`);
    }
  }
  console.log('\nCtrl+C to stop.');
});

