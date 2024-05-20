import { test, expect } from 'vitest';
import { render } from '@testing-library/vue';
import AuthView from '@/views/AuthView.vue';

test('AuthView renders correctly', async () => {
  const authView = render(AuthView);
  expect(authView).not.toBeNull();
});
