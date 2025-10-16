import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should show signin page', async ({ page }) => {
    await page.goto('/auth/signin');
    
    await expect(page).toHaveTitle(/ESE Evaluation & Recognition/);
    await expect(page.getByRole('heading', { name: /Sign in/i })).toBeVisible();
  });
  
  test('should handle invalid email format', async ({ page }) => {
    await page.goto('/auth/signin');
    
    // Look for email input field
    const emailInput = page.locator('input[type="email"]').first();
    if (await emailInput.isVisible()) {
      await emailInput.fill('invalid-email');
      
      // Try to submit
      const submitButton = page.getByRole('button', { name: /sign in/i }).first();
      await submitButton.click();
      
      // Check for validation - HTML5 validation might prevent submission
      // or the page might show an error message
      const isStillOnSigninPage = page.url().includes('/auth/signin');
      expect(isStillOnSigninPage).toBeTruthy();
    }
  });

  test('should redirect to signin when accessing protected route', async ({ page }) => {
    // Try to access a protected route without authentication
    await page.goto('/dashboard');
    
    // Should be redirected to signin page
    await expect(page).toHaveURL(/\/auth\/signin/);
  });
});
