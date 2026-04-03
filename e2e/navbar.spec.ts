import { test, expect } from '@playwright/test';

test.describe('Navbar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders logo and brand name', async ({ page }) => {
    const nav = page.locator('nav');
    await expect(nav.getByText('RM')).toBeVisible();
    await expect(nav.getByText('Rahul Mrinal')).toBeVisible();
  });

  test('desktop nav shows Home and Blog links', async ({ page }) => {
    const desktopNav = page.locator('nav .hidden.md\\:flex');
    await expect(desktopNav.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(desktopNav.getByRole('link', { name: 'Blog' })).toBeVisible();
  });

  test('home page shows section nav buttons', async ({ page }) => {
    const desktopNav = page.locator('nav .hidden.md\\:flex');

    // Section buttons visible on home
    await expect(desktopNav.getByRole('button', { name: /about/i })).toBeVisible();
    await expect(desktopNav.getByRole('button', { name: /experience/i })).toBeVisible();
    await expect(desktopNav.getByRole('button', { name: /skills/i })).toBeVisible();
    await expect(desktopNav.getByRole('button', { name: /education/i })).toBeVisible();
  });

  test('clicking Blog navigates to blog page', async ({ page }) => {
    const desktopNav = page.locator('nav .hidden.md\\:flex');

    await desktopNav.getByRole('link', { name: 'Blog' }).click();
    await expect(page).toHaveURL(/\/blog$/);

    // Blog link should now have active styling (bg-white/10)
    const blogLink = desktopNav.getByRole('link', { name: 'Blog' });
    await expect(blogLink).toHaveClass(/bg-white\/10/);
  });

  test('clicking logo navigates back to home', async ({ page }) => {
    // Go to blog first
    await page.goto('/blog');
    await expect(page).toHaveURL(/\/blog$/);

    // Click logo
    await page.locator('nav a').first().click();
    await expect(page).toHaveURL('/');
  });

  test('navbar gains background on scroll', async ({ page }) => {
    const nav = page.locator('nav');

    // Initially transparent
    await expect(nav).not.toHaveClass(/backdrop-blur/);

    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 200));
    await page.waitForTimeout(500);

    // Should now have backdrop blur class
    await expect(nav).toHaveClass(/backdrop-blur/);
  });

  test('mobile menu toggle works', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });

    const nav = page.locator('nav');

    // Desktop nav hidden, hamburger visible
    await expect(nav.locator('.hidden.md\\:flex')).not.toBeVisible();
    const hamburger = nav.locator('button.md\\:hidden');
    await expect(hamburger).toBeVisible();

    // Open mobile menu
    await hamburger.click();

    // Mobile menu should be visible with nav items
    const mobileMenu = nav.locator('.md\\:hidden').last();
    await expect(mobileMenu.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(mobileMenu.getByRole('link', { name: 'Blog' })).toBeVisible();

    // Close mobile menu
    await hamburger.click();
  });

  test('section button scrolls to section', async ({ page }) => {
    const desktopNav = page.locator('nav .hidden.md\\:flex');

    await desktopNav.getByRole('button', { name: /about/i }).click();

    // Wait for scroll
    await page.waitForTimeout(1000);

    // About section should be in viewport
    const aboutSection = page.locator('#about');
    await expect(aboutSection).toBeInViewport();
  });
});
