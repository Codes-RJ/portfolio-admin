import { test, expect, type Page } from '@playwright/test';

async function login(page: Page) {
  await page.goto('http://127.0.0.1:3001/login');
  await page.getByLabel('Email Address').fill('admin@rohanos.local');
  await page.getByLabel('Password', { exact: true }).fill('rohanos-local-admin');
  await page.getByRole('button', { name: /sign in|authenticate/i }).click();
  await page.goto('http://127.0.0.1:3001/admin/controls');
  await expect(page.getByRole('heading', { name: 'Complete website controls' })).toBeVisible();
}

async function save(page: Page) {
  await page.getByRole('button', { name: 'Save changes', exact: true }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Saved in this browser' })).toBeVisible();
}

test('website controls persist and affect branding, homepage, contact, SEO and CTA', async ({ page }) => {
  await login(page);
  await page.getByLabel('Brand Name', { exact: true }).fill('Custom');
  await page.getByLabel('Brand Suffix', { exact: true }).fill('Studio');
  await page.getByLabel('Footer Description', { exact: true }).fill('A controlled footer description.');
  await page.getByLabel('Favicon Url', { exact: true }).fill('/assets/about-profile.webp');
  await page.getByLabel('Seo Keywords', { exact: true }).fill('custom, engineering, portfolio');
  const sections = page.locator('details').filter({ has: page.locator('summary', { hasText: /^Home Sections/ }) });
  await sections.locator('summary').click();
  await sections.getByRole('button', { name: 'Remove Home Sections item 4' }).click();
  const services = page.locator('details').filter({ has: page.locator('summary', { hasText: /^Contact Services/ }) });
  await services.locator('summary').click();
  await services.getByLabel('Item 1', { exact: true }).fill('Custom engineering');
  const seo = page.locator('details').filter({ has: page.locator('summary', { hasText: /^Seo / }) });
  await seo.locator('summary').click();
  await seo.getByRole('group', { name: '/contact', exact: true }).getByLabel('Title', { exact: true }).fill('Custom contact title');
  const ctas = page.locator('details').filter({ has: page.locator('summary', { hasText: /^Calls To Action/ }) });
  await ctas.locator('summary').click();
  await ctas.getByRole('group', { name: '/about', exact: true }).getByLabel('Title', { exact: true }).fill('A custom collaboration invitation');
  await save(page);
  await page.reload();
  await expect(page.getByLabel('Brand Name', { exact: true })).toHaveValue('Custom');
  await page.goto('http://127.0.0.1:3001/preview/');
  await expect(page.locator('header.portfolio-header')).toContainText('CustomStudio');
  await expect(page.locator('footer')).toContainText('A controlled footer description.');
  await expect(page.getByRole('heading', { name: 'Experience Timeline', exact: true })).toHaveCount(0);
  await page.goto('http://127.0.0.1:3001/preview/contact');
  await expect(page).toHaveTitle('Custom contact title');
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', /about-profile\.webp$/);
  await expect(page.locator('meta[name="keywords"]')).toHaveAttribute('content', 'custom, engineering, portfolio');
  await expect(page.locator('select option').first()).toHaveText('Custom engineering');
  await page.goto('http://127.0.0.1:3001/preview/about');
  await expect(page.getByRole('heading', { name: 'A custom collaboration invitation' })).toBeVisible();
});

test('profile education, FAQs and legal text can be edited and appear publicly', async ({ page }) => {
  await login(page);
  await page.getByLabel('Control area').selectOption('profile');
  await page.getByLabel('Repos', { exact: true }).fill('42');
  const education = page.locator('details').filter({ has: page.locator('summary', { hasText: /^Education/ }) });
  await education.locator('summary').click();
  await education.getByLabel('Degree', { exact: true }).first().fill('Admin Controlled Degree');
  await save(page);
  await page.getByLabel('Control area').selectOption('siteSettings');
  const faqs = page.locator('details').filter({ has: page.locator('summary', { hasText: /^Faqs/ }) });
  await faqs.locator('summary').click();
  await faqs.getByLabel('Question', { exact: true }).first().fill('Can the admin control this FAQ?');
  await faqs.getByLabel('Answer', { exact: true }).first().fill('Yes, this answer is managed in the admin.');
  await save(page);
  await page.getByLabel('Control area').selectOption('copy');
  await page.getByLabel('Page or section').selectOption('PrivacyPage');
  await page.getByLabel(/PrivacyPage: 1. Information We Collect/).fill('Admin controlled privacy principles');
  await save(page);
  await page.goto('http://127.0.0.1:3001/preview/about');
  await expect(page.getByText('Admin Controlled Degree', { exact: true })).toBeVisible();
  await page.goto('http://127.0.0.1:3001/preview/contact');
  await page.getByRole('button', { name: 'Can the admin control this FAQ?' }).click();
  await expect(page.getByText('Yes, this answer is managed in the admin.')).toBeVisible();
  await page.goto('http://127.0.0.1:3001/preview/privacy');
  await expect(page.getByRole('heading', { name: 'Admin controlled privacy principles' })).toBeVisible();
});

test('all control areas load, extra record fields save, and invalid drafts do not publish', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await login(page);
  const areas = await page.getByLabel('Control area').locator('option').evaluateAll(options => options.map(option => (option as HTMLOptionElement).value));
  for (const area of areas) {
    await page.getByLabel('Control area').selectOption(area);
    await expect(page.getByRole('heading', { name: 'Complete website controls' })).toBeVisible();
  }
  await page.getByLabel('Control area').selectOption('researchPapers');
  await page.locator('summary').filter({ hasText: /^Research Papers/ }).click();
  await page.getByLabel('Title', { exact: true }).first().fill('Admin controlled publication');
  await page.getByLabel('Paper Url', { exact: true }).first().fill('https://example.com/paper');
  await save(page);
  await page.getByLabel('Control area').selectOption('gallery');
  await page.locator('summary').filter({ hasText: /^Gallery/ }).click();
  await page.getByLabel('Title', { exact: true }).first().fill('Admin controlled gallery item');
  await save(page);
  await page.getByLabel('Control area').selectOption('blogPosts');
  await page.locator('summary').filter({ hasText: /^Blog Posts/ }).click();
  await page.getByLabel('Featured', { exact: true }).first().uncheck();
  await page.getByLabel('Featured', { exact: true }).last().check();
  await save(page);
  await page.getByLabel('Control area').selectOption('profile');
  const originalName = await page.getByLabel('Name', { exact: true }).inputValue();
  await page.getByLabel('Name', { exact: true }).fill('');
  await page.getByRole('button', { name: 'Save changes', exact: true }).click();
  await expect(page.getByRole('status').filter({ hasText: 'name:' })).toBeVisible();
  await page.getByRole('button', { name: 'Discard draft', exact: true }).click();
  await expect(page.getByLabel('Name', { exact: true })).toHaveValue(originalName);
  await page.goto('http://127.0.0.1:3001/preview/research');
  await expect(page.getByRole('heading', { name: 'Admin controlled publication' })).toBeVisible();
  await page.goto('http://127.0.0.1:3001/preview/gallery');
  await expect(page.getByText('Admin controlled gallery item', { exact: true })).toBeVisible();
  await page.goto('http://127.0.0.1:3001/preview/blog');
  await expect(page.locator('article').first()).toContainText('A Lightweight Workflow for Learning New Tools');
  await expect(page.locator('article').first()).toContainText('Featured');
  expect(errors).toEqual([]);
});
