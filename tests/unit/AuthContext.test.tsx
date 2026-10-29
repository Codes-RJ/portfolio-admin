import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from '@/context/AuthContext';

function AuthHarness() {
  const { session, signIn, signOut } = useAuth();
  const [result, setResult] = useState('');

  return (
    <>
      <output data-testid="session">{session?.email ?? 'signed out'}</output>
      <output data-testid="result">{result}</output>
      <button type="button" onClick={async () => setResult((await signIn('admin@rohanos.local', 'rohanos-local-admin')).error ?? 'signed in')}>
        Sign in
      </button>
      <button type="button" onClick={() => void signOut()}>Sign out</button>
    </>
  );
}

describe('AuthContext', () => {
  it('creates and clears an admin session with the configured credentials', async () => {
    const user = userEvent.setup();
    render(<AuthProvider><AuthHarness /></AuthProvider>);

    await user.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(screen.getByTestId('result')).toHaveTextContent('signed in');
    expect(screen.getByTestId('session')).toHaveTextContent('admin@rohanos.local');
    expect(localStorage.getItem('rohanos_local_admin_session')).toContain('admin@rohanos.local');

    await user.click(screen.getByRole('button', { name: 'Sign out' }));
    expect(screen.getByTestId('session')).toHaveTextContent('signed out');
    expect(localStorage.getItem('rohanos_local_admin_session')).toBeNull();
  });
});
