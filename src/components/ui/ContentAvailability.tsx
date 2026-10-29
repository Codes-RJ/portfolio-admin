import { Link } from 'react-router-dom';

export function ContentAvailability({ state, backTo }: { state: 'loading' | 'unavailable'; backTo: string }) {
  return <section className="pt-32 pb-20 max-w-3xl mx-auto px-4" aria-busy={state === 'loading'}>
    <h1 className="text-3xl font-bold">{state === 'loading' ? 'Loading content…' : 'Content temporarily unavailable'}</h1>
    <p className="mt-4" role="status">{state === 'loading' ? 'Checking the published content.' : 'The connection could not be completed. Please try again.'}</p>
    {state === 'unavailable' && <button type="button" onClick={() => window.location.reload()} className="mt-6 mr-6">Retry</button>}
    <Link to={backTo} className="mt-6 inline-flex text-[var(--color-primary)]">Back to collection</Link>
  </section>;
}
