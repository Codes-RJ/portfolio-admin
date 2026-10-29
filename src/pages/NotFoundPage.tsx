import { SiteText } from '../components/ui/SiteText';
import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <section className="min-h-[65vh] grid place-items-center px-4 pt-24 pb-12">
      <div className="glass-card glass-card-hover max-w-lg rounded-3xl p-8 text-center shadow-2xl">
        <p className="font-mono text-sm font-bold text-[var(--color-primary)]"><SiteText id="NotFoundPage.3e6f36f15057">{"404 / route not found"}</SiteText></p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white"><SiteText id="NotFoundPage.6dee76d8302a">{"This page drifted out of orbit."}</SiteText></h1>
        <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300"><SiteText id="NotFoundPage.099aca8276a0">{"The link may be old, or the page has moved. Return to the portfolio home to continue exploring."}</SiteText></p>
        <Link to="/" className="mt-6 inline-flex rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-brand-500/25 transition hover:-translate-y-0.5 hover:bg-[var(--color-primary-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-primary)]"><SiteText id="NotFoundPage.49f1436be661">{"Back home"}</SiteText></Link>
      </div>
    </section>
  );
}
