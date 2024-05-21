import { createPinia } from 'pinia';
import { test, expect } from 'vitest';
import { render } from '@testing-library/vue';
import router from './router';
import App from './App.vue';

test('renders the app', async () => {
  const pinia = createPinia();
  const app = render(App, {
    global: {
      plugins: [router, pinia]
    }
  });

  expect(app).toBeDefined();
});
