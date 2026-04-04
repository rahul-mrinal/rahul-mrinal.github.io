import { test, expect } from '@playwright/test';

const TEST_POST_URL = '/blog/search-fundamentals/what-is-search';

test.describe('Blog Post Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(TEST_POST_URL);
  });

  test('post page loads with title', async ({ page }) => {
    // Post has an h1 title
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
    const text = await heading.textContent();
    expect(text?.length).toBeGreaterThan(0);
  });

  test('back link navigates to blog listing', async ({ page }) => {
    const backLink = page.getByRole('link', { name: /Back to all posts/i });
    await expect(backLink).toBeVisible();

    await backLink.click();
    await expect(page).toHaveURL(/\/blog$/);
  });

  test('series badge and part number visible', async ({ page }) => {
    // Series badge link (e.g., "Search Fundamentals · Part 1")
    const seriesBadge = page.locator('a[href*="series="]');
    await expect(seriesBadge).toBeVisible();
    await expect(seriesBadge).toContainText(/Part \d/);
  });

  test('read time is displayed', async ({ page }) => {
    await expect(page.getByText(/\d+ min/)).toBeVisible();
  });

  test('content sections render with headings', async ({ page }) => {
    // At least one h2 section heading
    const sectionHeadings = page.locator('article h2');
    await expect(sectionHeadings.first()).toBeVisible();
    const count = await sectionHeadings.count();
    expect(count).toBeGreaterThan(0);
  });

  test('tags render below header', async ({ page }) => {
    // Tag pills
    const tags = page.locator('article header span').filter({
      hasText: /.+/,
    });
    await expect(tags.first()).toBeVisible();
    const count = await tags.count();
    expect(count).toBeGreaterThan(0);
  });

  test('series navigation renders at bottom', async ({ page }) => {
    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // Should have "Next" link (this is the first post, so "Next" should exist)
    await expect(page.getByText('Next')).toBeVisible();

    // Progress dots
    const progressDots = page.locator('div.h-1.rounded-full');
    await expect(progressDots.first()).toBeVisible();
    const count = await progressDots.count();
    expect(count).toBeGreaterThan(0);
  });
});
