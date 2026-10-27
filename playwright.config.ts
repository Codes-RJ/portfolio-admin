import { defineConfig } from '@playwright/test';
import { existsSync } from 'node:fs';
import process from 'node:process';

const localChrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

export default defineConfig({
  testDir: './tests/browser',
  timeout: 60_000,
  workers: process.env.CI ? 2 : 1,
  use: {
    baseURL: 'http://127.0.0.1:3001',
    browserName: 'chromium',
    launchOptions: {
      executablePath:
        process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ||
        (existsSync(localChrome) ? localChrome : undefined),
    },
    reducedMotion: 'reduce',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'node node_modules/vite/bin/vite.js --port 3001 --strictPort --host 127.0.0.1',
    url: 'http://127.0.0.1:3001',
    timeout: 60_000,
    reuseExistingServer: true,
  },
});
