import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AuthProvider } from '@/context/AuthContext';
import { DataProvider } from '@/context/DataContext';
import { ThemeProvider } from '@/context/ThemeContext';

describe('DataContext startup', () => {
  it('loads the bundled backup and renders its children', () => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: () => ({
        matches: false,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
      }),
    });

    render(
      <ThemeProvider>
        <AuthProvider>
          <DataProvider><div>startup-ready</div></DataProvider>
        </AuthProvider>
      </ThemeProvider>,
    );

    expect(screen.getByText('startup-ready')).toBeInTheDocument();
  });
});
