import { test, expect } from '@playwright/test';

test.describe('OpenFlight UI', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
  });

  test('should load the main page and show navigation', async ({ page }) => {
    // Check for navigation buttons
    await expect(page.getByRole('button', { name: 'Live' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Stats' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Shots' })).toBeVisible();
  });

  test('should show simulate shot button in mock mode', async ({ page }) => {
    // Ensure we are in Live view (default)
    await page.getByRole('button', { name: 'Live' }).click();
    
    // Check for "Simulate Shot" button
    await expect(page.getByRole('button', { name: 'Simulate Shot' })).toBeVisible();
  });

  test('should switch views correctly', async ({ page }) => {
    // Click Stats
    await page.getByRole('button', { name: 'Stats' }).click();
    // Check for Stats view content (either empty state or clear button)
    const emptyMsg = page.getByText('No shots recorded yet');
    const clearBtn = page.getByRole('button', { name: 'Clear Session' });
    
    await expect(emptyMsg.or(clearBtn)).toBeVisible();

    // Click Shots
    await page.getByRole('button', { name: 'Shots' }).click();
    // Check for Shots view (ShotList component)
    // Even if empty, it should have the navigation button active
    await expect(page.getByRole('button', { name: 'Shots' })).toHaveClass(/nav__button--active/);
  });
});
