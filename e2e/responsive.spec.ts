import { test, expect } from '@playwright/test';

test.describe('Responsive Layout', () => {
  test('mobile viewport (375px): hamburger visible, desktop nav hidden', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');

    // Desktop nav hidden
    await expect(page.locator('nav .hidden.md\\:flex')).not.toBeVisible();

    // Hamburger button visible
    await expect(page.locator('nav button.md\\:hidden')).toBeVisible();

    // Hero heading still visible (contains "Hi, I'm" which is always shown)
    await expect(page.getByText("Hi, I'm")).toBeVisible();
  });

  test('tablet viewport (768px): layout adjusts', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/blog');

    // Blog heading visible
    await expect(
      page.getByRole('heading', { name: 'Blog', level: 1 })
    ).toBeVisible();

    // Blog cards should be present (use link with h3 pattern)
    const cards = page.locator('a[href^="/blog/"]').filter({ has: page.locator('h3') });
    await expect(cards.first()).toBeVisible();
    expect(await cards.count()).toBeGreaterThan(0);
  });

  test('desktop viewport (1280px): full nav visible, 3-col blog grid', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');

    // Full desktop nav
    const desktopNav = page.locator('nav .hidden.md\\:flex');
    await expect(desktopNav).toBeVisible();
    await expect(desktopNav.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(desktopNav.getByRole('link', { name: 'Blog' })).toBeVisible();

    // Navigate to blog and check grid
    await page.goto('/blog');
    const gridContainer = page.locator('.grid.sm\\:grid-cols-2.lg\\:grid-cols-3');
    await expect(gridContainer).toBeVisible();
  });
});
