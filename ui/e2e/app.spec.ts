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

  test('should simulate shot and update all views', async ({ page }) => {
    // 1. Live View - Initial State
    await page.getByRole('button', { name: 'Live' }).click();
    await expect(page.getByText('Ready for your shot')).toBeVisible();

    // 2. Simulate Shot
    await page.getByRole('button', { name: 'Simulate Shot' }).click();

    // 3. Live View - Updated State
    // "Ready for your shot" should disappear, and speed gauge should show a value
    await expect(page.getByText('Ready for your shot')).not.toBeVisible();
    await expect(page.locator('.speed-gauge__value')).toBeVisible();

    // 4. Stats View - Validation
    await page.getByRole('button', { name: 'Stats' }).click();
    // Should show 1 shot
    await expect(page.locator('.stat-card__value').first()).toHaveText('1');
    await expect(page.getByRole('button', { name: 'Clear Session' })).toBeVisible();

    // 5. Shots View - Validation
    await page.getByRole('button', { name: 'Shots' }).click();
    // Should show shot row #1
    await expect(page.locator('.shot-row__number')).toHaveText('#1');

    // 6. Simulate another shot and check increments
    await page.getByRole('button', { name: 'Live' }).click();
    await page.getByRole('button', { name: 'Simulate Shot' }).click();
    
    await page.getByRole('button', { name: 'Stats' }).click();
    await expect(page.locator('.stat-card__value').first()).toHaveText('2');

    await page.getByRole('button', { name: 'Shots' }).click();
    // Most recent shot is at the top in reversed list
    await expect(page.locator('.shot-row__number').first()).toHaveText('#2');
  });
});
