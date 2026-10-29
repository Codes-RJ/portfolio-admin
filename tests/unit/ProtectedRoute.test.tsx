import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

const { useAuth } = vi.hoisted(() => ({ useAuth: vi.fn() }));
vi.mock('@/context/AuthContext', () => ({ useAuth }));

function renderGuard() {
  return render(<MemoryRouter initialEntries={['/admin']}><Routes>
    <Route path="/admin" element={<ProtectedRoute><div>Secret Admin Content</div></ProtectedRoute>} />
    <Route path="/login" element={<div>Login Page Form</div>} />
  </Routes></MemoryRouter>);
}

describe('ProtectedRoute', () => {
  it('redirects when no local admin session exists', () => {
    useAuth.mockReturnValue({ loading: false, session: null });
    renderGuard();
    expect(screen.getByText('Login Page Form')).toBeInTheDocument();
  });

  it('renders only for a local admin session', () => {
    useAuth.mockReturnValue({ loading: false, session: { email: 'admin@rohanos.local', mode: 'local', isAdmin: true } });
    renderGuard();
    expect(screen.getByText('Secret Admin Content')).toBeInTheDocument();
  });
});
