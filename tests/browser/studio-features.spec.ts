import { test, expect } from '@playwright/test';
import { Buffer } from 'node:buffer';

test('local admin sections, persistence, backups and accessible icon picker', async ({ page }) => {
  test.setTimeout(120_000);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('dialog', dialog => dialog.accept());
  await page.goto('http://127.0.0.1:3001/login');
  await page.getByLabel('Email Address').fill('admin@rohanos.local');
  await page.getByLabel('Password', { exact: true }).fill('rohanos-local-admin');
  await page.getByRole('button', { name: /sign in|authenticate/i }).click();
  await expect(page).toHaveURL(/\/admin$/);
  for (const section of ['overview', 'profile', 'copy', 'theme', 'projects', 'categories', 'skills', 'honors', 'certificates', 'experience', 'blog', 'research', 'gallery', 'inbox']) {
    await page.goto('http://127.0.0.1:3001/admin/' + section);
    await expect(page.locator('main')).toBeVisible();
  }
  await page.goto('http://127.0.0.1:3001/admin/profile');
  const name = page.getByLabel(/full name|display name/i).first();
  await name.fill('Verified Browser Name');
  await page.waitForTimeout(900);
  await page.reload();
  await page.getByRole('button', { name: /Home & identity/i }).first().click();
  await expect(name).toHaveValue('Verified Browser Name');
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Backup JSON', exact: true }).click();
  const file = await download;
  expect(file.suggestedFilename()).toMatch(/\.json$/);
  await page.getByRole('button', { name: /skills/i }).first().click();
  const pickerButton = page.getByRole('button', { name: /icon|logo/i }).first();
  await pickerButton.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute('aria-modal', 'true');
  for (let index = 0; index < 8; index++) {
    await page.keyboard.press('Tab');
    expect(await dialog.evaluate(node => node.contains(document.activeElement))).toBe(true);
  }
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(pickerButton).toBeFocused();
  expect(errors).toEqual([]);
  await page.screenshot({ path: 'test-results/admin.png', fullPage: true });
  await page.close();
});

test('default certificates, experience and awards survive a backup restore and reload', async ({ page }) => {
  page.on('dialog', dialog => dialog.accept());
  await page.goto('http://127.0.0.1:3001/login');
  await page.getByLabel('Email Address').fill('admin@rohanos.local');
  await page.getByLabel('Password', { exact: true }).fill('rohanos-local-admin');
  await page.getByRole('button', { name: /sign in|authenticate/i }).click();
  await expect(page).toHaveURL(/\/admin$/);
  await page.goto('http://127.0.0.1:3001/admin/certificates');
  await page.getByLabel('Certificate Title').fill('Browser Certificate');
  await page.getByLabel('Issuer Organization').fill('Browser Issuer');
  await page.getByRole('button', { name: '+ Add Certificate', exact: true }).click();
  await expect(page.locator('main')).toContainText('Browser Certificate');
  await page.goto('http://127.0.0.1:3001/admin/experience');
  await page.getByLabel('Role Title').fill('Browser Engineer');
  await page.getByLabel('Company / Organization').fill('Browser Company');
  await page.getByRole('button', { name: '+ Add Experience to Timeline', exact: true }).click();
  await expect(page.locator('main')).toContainText('Browser Engineer');
  await page.goto('http://127.0.0.1:3001/admin/honors');
  await page.getByLabel('Award / Honor Title').fill('Browser Award');
  await page.getByLabel('Organization / Issuing Body').fill('Browser Society');
  await page.getByRole('button', { name: /add.*honor|add.*award/i }).click();
  await expect(page.locator('main')).toContainText('Browser Award');
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Backup JSON', exact: true }).click();
  const file = await download;
  const stream = await file.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream!) chunks.push(chunk);
  const backup = Buffer.concat(chunks);
  const parsed = JSON.parse(backup.toString());
  expect(parsed.certificates.find((item: { title: string }) => item.title === 'Browser Certificate').logo).toBe('FaAws');
  expect(parsed.experiences.find((item: { title: string }) => item.title === 'Browser Engineer').logo).toBe('Building2');
  expect(parsed.achievements.find((item: { title: string }) => item.title === 'Browser Award').badge).toBe('cert-trophy');
  await page.goto('http://127.0.0.1:3001/admin/overview');
  await page.locator('input[type="file"][accept*=".json"]').setInputFiles({ name: 'round-trip.json', mimeType: 'application/json', buffer: backup });
  await expect(page.getByRole('heading', { name: 'Restore preview' })).toBeVisible();
  await page.getByRole('button', { name: 'Confirm restore', exact: true }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Content restored.' })).toBeVisible();
  await page.reload();
  for (const [route, text] of [['certificates', 'Browser Certificate'], ['experience', 'Browser Engineer'], ['honors', 'Browser Award']]) {
    await page.goto('http://127.0.0.1:3001/admin/' + route);
    await expect(page.locator('main')).toContainText(text);
  }
});
