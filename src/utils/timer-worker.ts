const start = performance.now();
let last = start;

setInterval(() => {
  const now = performance.now();
  const dt = now - last;
  last = now;
  postMessage(dt);
}, 1000 / 60);
