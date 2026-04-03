import { test, expect } from '@playwright/test';

test.describe('404 Not Found Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/this-page-does-not-exist');
  });

  test('shows 404 heading', async ({ page }) => {
    await expect(page.getByText('404')).toBeVisible();
    await expect(page.getByText('Page not found')).toBeVisible();
  });

  test('Home button navigates to home', async ({ page }) => {
    // Scope to main content to avoid matching navbar's "Home" link
    await page.getByRole('main').getByRole('link', { name: /Home/i }).click();
    await expect(page).toHaveURL('/');
  });

  test('Blog button navigates to blog', async ({ page }) => {
    // Scope to main content to avoid matching navbar's "Blog" link
    await page.getByRole('main').getByRole('link', { name: /Blog/i }).click();
    await expect(page).toHaveURL(/\/blog$/);
  });
});
