import { test, expect } from '@playwright/test';

test('run gremlins.js', async ({ page }) => {
  await page.addInitScript({
      path: './node_modules/gremlins.js/dist/gremlins.min.js',
  });
  await page.goto('http://localhost:5173/test/webapp/index.html');
  await page.evaluate(() => sap.ui.getCore());
  await page.waitForSelector('#container');

  const code = await page.locator('#container').locator('code');
  await expect(code).toContainText(['type']);
  test.slow();
  const attack = await page.evaluate(() => gremlins.createHorde().unleash());
});
