import React from 'react';
import { reportDiagnostic } from '../lib/diagnostics';

interface State { hasError: boolean }

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  private requestId = crypto.randomUUID();
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch() {
    reportDiagnostic('render_failed', this.requestId);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="min-h-screen grid place-items-center px-6 text-center bg-gray-50 dark:bg-[#090d16]">
          <div className="max-w-md space-y-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">This page could not be displayed.</h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">Refresh the page to retry. Your browser-local content has not been deleted.</p>
            <p className="text-xs font-mono">Error reference: {this.requestId}</p>
            <button type="button" onClick={() => window.location.reload()} className="px-4 py-2 rounded-xl bg-[var(--color-primary)] text-white font-semibold">Reload page</button>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}
