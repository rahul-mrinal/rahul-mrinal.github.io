import { test, expect } from '@playwright/test';

test.describe('Blog Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/blog');
  });

  test('page loads with Blog heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Blog', level: 1 })).toBeVisible();
    await expect(
      page.getByText(/Deep-dive technical writing/)
    ).toBeVisible();
  });

  test('category filter tabs render', async ({ page }) => {
    // "All Topics" button
    await expect(page.getByRole('button', { name: /All Topics/i })).toBeVisible();

    // 3 category buttons
    await expect(page.getByRole('button', { name: /Search Engineering/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Agentic AI/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /AI Dev Tools/i })).toBeVisible();
  });

  test('category filtering works', async ({ page }) => {
    // Wait for blog cards to render
    const allCards = page.locator('a[href^="/blog/"]').filter({ has: page.locator('h3') });
    await expect(allCards.first()).toBeVisible();
    const initialCount = await allCards.count();
    expect(initialCount).toBeGreaterThan(0);

    // Click Search Engineering
    await page.getByRole('button', { name: /Search Engineering/i }).click();

    // URL should update
    await expect(page).toHaveURL(/category=search-engineering/);

    // Posts should still be present (Search Engineering has content)
    const filteredCards = page.locator('a[href^="/blog/"]').filter({ has: page.locator('h3') });
    await expect(filteredCards.first()).toBeVisible();
    expect(await filteredCards.count()).toBeGreaterThan(0);
  });

  test('series filter pills appear when category selected', async ({ page }) => {
    // Click Search Engineering
    await page.getByRole('button', { name: /Search Engineering/i }).click();

    // Series pills should appear (e.g., "All Series", "Fundamentals")
    await expect(page.getByRole('button', { name: /All Series/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Fundamentals/i })).toBeVisible();
  });

  test('blog cards render with expected content', async ({ page }) => {
    // Wait for blog cards to appear
    const firstCard = page.locator('a[href^="/blog/"]').filter({ has: page.locator('h3') }).first();
    await expect(firstCard).toBeVisible();

    // Card should have a title (h3)
    await expect(firstCard.locator('h3')).toBeVisible();

    // Card should have read time (format: "X min")
    await expect(firstCard.getByText(/\d+ min/)).toBeVisible();
  });

  test('"Start from beginning" CTA visible by default', async ({ page }) => {
    const cta = page.getByRole('link', {
      name: /Search Fundamentals: What is Search/i,
    });
    await expect(cta).toBeVisible();
  });

  test('clicking a blog card navigates to post', async ({ page }) => {
    const firstCard = page.locator('a[href^="/blog/"]').filter({ has: page.locator('h3') }).first();
    await expect(firstCard).toBeVisible();
    const href = await firstCard.getAttribute('href');
    expect(href).toBeTruthy();

    await firstCard.click();
    await expect(page).toHaveURL(href!);
  });
});
