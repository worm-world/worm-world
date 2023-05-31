import 'reflect-metadata';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import matchers from '@testing-library/jest-dom/matchers';
import { clearMocks, mockIPC, mockWindows } from '@tauri-apps/api/mocks';

// extends Vitest's expect method with methods from react-testing-library
expect.extend(matchers);

beforeEach(async () => {
  // attempts to suppress the following warning:
  // Could not find "window.__TAURI_METADATA__". The "appWindow" value will reference the "main" window label.
  // This doesn't seem to work, but the tauri docs say it should.
  // https://tauri.app/v1/guides/testing/mocking/#windows
  // https://github.com/tauri-apps/tauri/discussions/4356
  mockWindows('main');
  expect(window).toHaveProperty('__TAURI_METADATA__');
  mockIPC(async (cmd, args) => {});
});

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  clearMocks();
  cleanup();
});
