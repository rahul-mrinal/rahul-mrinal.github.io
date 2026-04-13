import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page loads with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Rahul Mrinal/);
  });

  test('hero section renders with name and CTAs', async ({ page }) => {
    // Name is visible
    await expect(page.locator('text=Rahul Mrinal').first()).toBeVisible();

    // CTA buttons
    await expect(page.getByRole('link', { name: /Read the Blog/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /LinkedIn/i }).first()).toBeVisible();
  });

  test('about section renders', async ({ page }) => {
    const aboutSection = page.locator('#about');
    await aboutSection.scrollIntoViewIfNeeded();
    await expect(aboutSection).toBeVisible();

    // Section heading
    await expect(aboutSection.getByText('About')).toBeVisible();
    await expect(aboutSection.getByText('Building the future with AI')).toBeVisible();

    // Highlight cards (4 stat boxes)
    const highlightCards = aboutSection.locator('.glass-card');
    await expect(highlightCards).toHaveCount(4);
  });

  test('experience section renders with role cards', async ({ page }) => {
    const section = page.locator('#experience');
    await section.scrollIntoViewIfNeeded();
    await expect(section).toBeVisible();

    await expect(section.getByText('Experience')).toBeVisible();
    await expect(section.getByText('Professional journey')).toBeVisible();

    // At least one glass card with role info
    const cards = section.locator('.glass-card');
    expect(await cards.count()).toBeGreaterThan(0);
  });

  test('projects section renders with project cards', async ({ page }) => {
    const section = page.locator('#projects');
    await section.scrollIntoViewIfNeeded();
    await expect(section).toBeVisible();

    await expect(section.getByRole('heading', { name: 'Projects', exact: true })).toBeVisible();
    await expect(section.getByText('Key AI & architecture projects')).toBeVisible();

    // At least one glass card with project info
    const cards = section.locator('.glass-card');
    expect(await cards.count()).toBeGreaterThan(0);

    // Tech stack chips visible
    const techChips = section.locator('.glass-card').first().locator('span').filter({ hasText: /.+/ });
    expect(await techChips.count()).toBeGreaterThan(0);
  });

  test('skills section renders with skill pills', async ({ page }) => {
    const section = page.locator('#skills');
    await section.scrollIntoViewIfNeeded();
    await expect(section).toBeVisible();

    await expect(section.getByText('Skills')).toBeVisible();
    await expect(section.getByText('Technical expertise')).toBeVisible();

    // Skill pills exist
    const pills = section.locator('span').filter({ hasText: /.+/ });
    expect(await pills.count()).toBeGreaterThan(5);
  });

  test('education section renders with three columns', async ({ page }) => {
    const section = page.locator('#education');
    await section.scrollIntoViewIfNeeded();
    await expect(section).toBeVisible();

    // Sub-headings
    await expect(section.getByText('Education', { exact: true }).first()).toBeVisible();
    await expect(section.getByText('Certifications')).toBeVisible();
    await expect(section.getByText('Awards')).toBeVisible();

    // Cards present
    const cards = section.locator('.glass-card');
    expect(await cards.count()).toBeGreaterThan(0);
  });

  test('featured blog section renders category cards', async ({ page }) => {
    const section = page.locator('#blog-preview');
    await section.scrollIntoViewIfNeeded();
    await expect(section).toBeVisible();

    await expect(section.getByText('Technical Writing')).toBeVisible();

    // 3 category cards
    const categoryCards = section.locator('.glass-card');
    expect(await categoryCards.count()).toBe(3);

    // CTAs
    await expect(section.getByRole('link', { name: /View All Posts/i })).toBeVisible();
    await expect(section.getByRole('link', { name: /Start Reading/i })).toBeVisible();
  });

  test('contact section renders', async ({ page }) => {
    const section = page.locator('#contact');
    await section.scrollIntoViewIfNeeded();
    await expect(section).toBeVisible();

    await expect(section.getByText("Let's build something great")).toBeVisible();
    await expect(section.getByRole('link', { name: /LinkedIn/i })).toBeVisible();
  });

  test('footer renders with copyright and LinkedIn', async ({ page }) => {
    const footer = page.locator('footer');
    await footer.scrollIntoViewIfNeeded();
    await expect(footer).toBeVisible();

    // Copyright text
    await expect(footer.getByText(/© \d{4} Rahul Mrinal/)).toBeVisible();

    // LinkedIn link
    await expect(footer.getByRole('link', { name: /LinkedIn/i })).toBeVisible();
  });
});
