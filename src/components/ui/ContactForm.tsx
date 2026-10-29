import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { AlertCircle, CheckCircle2, Send } from 'lucide-react';
import { useContentSlice } from '../../context/contentSubscriptions';
import { websiteDefaults } from '../../data/websiteDefaults';
import { serviceLabel } from '../../data/contactServiceLabels';
import { useContactRequest } from '../../hooks/useContactRequest';
import { contactPayloadSchema } from '../../lib/validation';
import { sendContactEmail, type EmailPayload } from '../../utils/emailService';
import { checkContactFormThrottling, recordContactFormSubmission } from '../../utils/security';
import { SiteText } from './SiteText';

type ContactField = keyof Required<EmailPayload>;
type ContactDraft = Required<EmailPayload>;
type FieldErrors = Partial<Record<ContactField, string>>;

// Read the same limits used by the relay, including fields with schema defaults.
const maxLengths = {
  name: contactPayloadSchema.shape.name.maxLength ?? undefined,
  email: contactPayloadSchema.shape.email.maxLength ?? undefined,
  subject: contactPayloadSchema.shape.subject.unwrap().unwrap().maxLength ?? undefined,
  message: contactPayloadSchema.shape.message.maxLength ?? undefined,
};
const fieldOrder: ContactField[] = ['name', 'email', 'subject', 'service', 'message'];

/** One delivery and validation flow for the homepage and dedicated contact page. */
export function ContactForm({ variant = 'contact' }: { variant?: 'contact' | 'home' }) {
  const profile = useContentSlice('profile');
  const siteSettings = useContentSlice('siteSettings');
  const configuredServices = siteSettings.website?.contactServices ?? websiteDefaults.contactServices;
  const services = [...new Set(configuredServices.filter(service => service.trim()))];
  if (!services.length) services.push('General inquiry');
  const emptyDraft = (): ContactDraft => ({ name: '', email: '', subject: '', service: services[0], message: '' });
  const [draft, setDraft] = useState<ContactDraft>(emptyDraft);
  const [honeypot, setHoneypot] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState('');
  const [reference, setReference] = useState('');
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [retryAt, setRetryAt] = useState(0);
  const [now, setNow] = useState(Date.now);
  const form = useRef<HTMLFormElement>(null);
  const success = useRef<HTMLDivElement>(null);
  const inFlight = useRef(false);
  const returnToForm = useRef(false);
  const { requestIdFor, completeRequest } = useContactRequest();
  const prefix = variant === 'home' ? 'contact-home' : 'contact-page';
  const remainingSeconds = Math.max(0, Math.ceil((retryAt - now) / 1000));

  useEffect(() => {
    if (!retryAt) return;
    const timer = window.setInterval(() => {
      const current = Date.now();
      setNow(current);
      if (current >= retryAt) setRetryAt(0);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [retryAt]);

  useEffect(() => {
    if (submitted) success.current?.focus();
    else if (returnToForm.current) {
      (form.current?.elements.namedItem('name') as HTMLElement | null)?.focus();
      returnToForm.current = false;
    }
  }, [submitted]);

  const focusFirstError = (errors: FieldErrors) => {
    const field = fieldOrder.find(name => errors[name]);
    if (field) (form.current?.elements.namedItem(field) as HTMLElement | null)?.focus();
  };
  const update = (field: ContactField, value: string) => {
    setDraft(previous => ({ ...previous, [field]: value }));
    setFieldErrors(previous => ({ ...previous, [field]: undefined }));
  };
  const cooldown = (seconds: number) => {
    const current = Date.now();
    setNow(current);
    setRetryAt(current + seconds * 1000);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (inFlight.current || Date.now() < retryAt) return;
    setError('');
    setReference('');
    const parsed = contactPayloadSchema.safeParse({ ...draft, service: services.includes(draft.service) ? draft.service : services[0] });
    if (!parsed.success) {
      const errors: FieldErrors = {};
      parsed.error.issues.forEach(issue => {
        const field = issue.path[0] as ContactField;
        if (fieldOrder.includes(field) && !errors[field]) errors[field] = issue.message;
      });
      setFieldErrors(errors);
      focusFirstError(errors);
      return;
    }
    setFieldErrors({});
    if (honeypot) { setSubmitted(true); return; }
    const throttle = checkContactFormThrottling();
    if (!throttle.allowed) {
      setError('Message limit reached. Your message is still here; please wait before trying again.');
      cooldown(throttle.waitSeconds);
      return;
    }
    inFlight.current = true;
    setSending(true);
    try {
      const result = await sendContactEmail(parsed.data, requestIdFor(parsed.data));
      if (!result.success) {
        setError(result.message);
        setReference(result.requestId || '');
        if (result.retryAfterSeconds) cooldown(result.retryAfterSeconds);
        if (result.fieldErrors) { setFieldErrors(result.fieldErrors); focusFirstError(result.fieldErrors); }
        return;
      }
      completeRequest();
      recordContactFormSubmission();
      setSubmitted(true);
      setDraft(emptyDraft());
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        void import('canvas-confetti').then(({ default: confetti }) => confetti({ disableForReducedMotion: true, particleCount: 60, spread: 60, origin: { y: 0.6 } })).catch(() => undefined);
      }
    } catch {
      setError('Message delivery is unavailable. Your message is still here. Please retry or use email.');
    } finally {
      inFlight.current = false;
      setSending(false);
    }
  };

  const describedBy = (field: ContactField) => fieldErrors[field] ? `${prefix}-${field}-error` : undefined;
  const inputProps = (field: 'name' | 'email' | 'subject') => ({
    id: `${prefix}-${field}`, name: field, value: draft[field], maxLength: maxLengths[field],
    onChange: (event: ChangeEvent<HTMLInputElement>) => update(field, event.target.value),
    'aria-invalid': Boolean(fieldErrors[field]), 'aria-describedby': describedBy(field), className: 'contact-field',
  });
  const fieldError = (field: ContactField) => fieldErrors[field] && <p id={`${prefix}-${field}-error`} className="contact-field-error">{fieldErrors[field]}</p>;

  if (submitted) return <div ref={success} tabIndex={-1} className="py-10 text-center space-y-4" role="status">
    <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
    <h2 className="text-2xl font-bold"><SiteText id={variant === 'home' ? 'ContactSection.957bfa3a47aa' : 'ContactPage.17c769cf0462'}>{'Message received'}</SiteText></h2>
    <p className="text-base text-gray-600 dark:text-gray-300"><SiteText id={variant === 'home' ? 'ContactSection.cf320e9771fc' : 'ContactPage.d30c337c094f'}>{'Thank you for reaching out. Your message has been received.'}</SiteText></p>
    <button type="button" className="min-h-11 rounded-xl border border-gray-300 px-5 py-2 text-sm font-semibold dark:border-gray-600" onClick={() => { returnToForm.current = true; setSubmitted(false); setHoneypot(''); }}><SiteText id="ContactForm.c6ce3f02499c">{"Send another message"}</SiteText></button>
  </div>;

  return <form ref={form} onSubmit={handleSubmit} noValidate className="space-y-5" aria-busy={sending} aria-label="Contact form">
    <input type="text" name="website_hp" value={honeypot} onChange={event => setHoneypot(event.target.value)} tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
    {variant === 'contact' && <div>
      <h2 className="text-xl font-bold"><SiteText id="ContactPage.770d58a0dc81">{'Send Direct Message'}</SiteText></h2>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300"><SiteText id="ContactPage.0366c978785e">{'Fill out this form to start a conversation.'}</SiteText></p>
    </div>}
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div><label htmlFor={`${prefix}-name`} className="mb-1.5 block text-sm font-semibold"><SiteText id={variant === 'home' ? 'ContactSection.fa414f1e7ce0' : 'ContactPage.12e4aee36cce'}>{'Your Name *'}</SiteText></label><input {...inputProps('name')} type="text" required autoComplete="name" placeholder="e.g. Alex Morgan" />{fieldError('name')}</div>
      <div><label htmlFor={`${prefix}-email`} className="mb-1.5 block text-sm font-semibold"><SiteText id={variant === 'home' ? 'ContactSection.1b72562c828c' : 'ContactPage.1b72562c828c'}>{'Email Address *'}</SiteText></label><input {...inputProps('email')} type="email" required autoComplete="email" inputMode="email" placeholder="e.g. alex@company.com" />{fieldError('email')}</div>
    </div>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div><label htmlFor={`${prefix}-subject`} className="mb-1.5 block text-sm font-semibold"><SiteText id="ContactPage.68971283841a">{'Subject (optional)'}</SiteText></label><input {...inputProps('subject')} type="text" placeholder="e.g. Project collaboration" />{fieldError('subject')}</div>
      <div><label htmlFor={`${prefix}-service`} className="mb-1.5 block text-sm font-semibold"><SiteText id="ContactPage.86cc917543e2">{'Inquiry Category'}</SiteText></label><select id={`${prefix}-service`} name="service" value={services.includes(draft.service) ? draft.service : services[0]} onChange={event => update('service', event.target.value)} aria-invalid={Boolean(fieldErrors.service)} aria-describedby={describedBy('service')} className="contact-field">{services.map(service => <option key={service} value={service}>{serviceLabel(service, variant)}</option>)}</select>{fieldError('service')}</div>
    </div>
    <div><label htmlFor={`${prefix}-message`} className="mb-1.5 block text-sm font-semibold"><SiteText id={variant === 'home' ? 'ContactSection.4e89a4049b7b' : 'ContactPage.4e89a4049b7b'}>{'Your Message *'}</SiteText></label><textarea id={`${prefix}-message`} name="message" required rows={5} value={draft.message} onChange={event => update('message', event.target.value)} maxLength={maxLengths.message} aria-invalid={Boolean(fieldErrors.message)} aria-describedby={[describedBy('message'), `${prefix}-message-hint`].filter(Boolean).join(' ')} placeholder="Share your requirements, questions, or timeline..." className="contact-field resize-y" />{fieldError('message')}<p id={`${prefix}-message-hint`} className="mt-1 text-sm text-gray-500 dark:text-gray-400">{draft.message.length.toLocaleString()} / {maxLengths.message?.toLocaleString()}<SiteText id="ContactForm.359563dab100">{" characters"}</SiteText></p></div>
    {error && <div role="alert" className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-200">
      <div className="flex items-start gap-2"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /><p>{error}</p></div>
      {reference && <p className="mt-2 break-all"><SiteText id="ContactForm.66d131947363">{"Reference: "}</SiteText>{reference}</p>}
      {profile.socials.email && <a href={`mailto:${profile.socials.email}`} className="mt-2 inline-flex min-h-11 items-center font-semibold underline"><SiteText id="ContactForm.009557a4da1e">{"Email "}</SiteText>{profile.socials.email}</a>}
    </div>}
    <button type="submit" disabled={sending || remainingSeconds > 0} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-3 text-base font-semibold text-white hover:bg-[var(--color-primary-strong)] disabled:cursor-wait disabled:opacity-65"><span>{sending ? 'Sending…' : remainingSeconds > 0 ? `Try again in ${remainingSeconds}s` : 'Send Message'}</span><Send className="h-4 w-4" aria-hidden="true" /></button>
  </form>;
}
