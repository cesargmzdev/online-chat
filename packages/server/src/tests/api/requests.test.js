import { test, expect } from 'vitest';

test('POST /signup', async () => {
  const response = await fetch('http://localhost:3000/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'test', password: '123' })
  });
  const data = await response.json();
  expect(data.message, 'User registered successfully!');
});
