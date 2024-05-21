import { test, expect } from 'vitest';
import { render } from '@testing-library/vue';
import AuthView from '@/views/AuthView.vue';

test('Render entire AuthView', () => {
  const authView = render(AuthView);
  expect(authView).not.toBeNull();

  const header = authView.getByRole('banner');
  expect(header).not.toBeNull();

  const homeForm = authView.getByRole('form');
  expect(homeForm).not.toBeNull();

  const footerComponent = authView.getByRole('contentinfo');
  expect(footerComponent).not.toBeNull();
});
