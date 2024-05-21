import { test, expect } from 'vitest';
import { exec } from 'child_process';

test('server starts without errors', async () => {
  const server = exec('pnpm dev');

  let res;
  const maxAttempts = 20;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      res = await fetch('http://localhost:3000');
      break;
    } catch (error) {
      // Wait for 1 second before the next attempt
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  expect(res).not.toBe(undefined);
  server.kill();
});
