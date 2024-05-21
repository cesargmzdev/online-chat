import { test, expect } from 'vitest';

test('POST /signup (not signed up)', async () => {
  let response = await fetch('http://localhost:3000/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'test', password: '123' })
  });

  let data = await response.json();

  try {
    expect(response.status).toBe(200);
    expect(data).toBeDefined();
    expect(data).toMatchObject({
      user: expect.anything(),
      message: 'User registered successfully!'
    });
  } catch (error) {
    // If the first test fails, check if the user is already signed up
    expect(response.status).toBe(409); // Assuming your server responds with 409 Conflict
    expect(data).toMatchObject({
      message: 'User already exists!'
    });
  }
});
