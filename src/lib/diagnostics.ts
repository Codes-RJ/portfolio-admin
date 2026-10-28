export type DiagnosticCode = 'public_page_unavailable' | 'sitemap_unavailable' | 'render_failed' | 'contact_database_failed' | 'contact_notification_failed' | 'contact_rate_limit_failed' | 'contact_configuration_missing' | 'contact_bot_challenge_failed'
  | 'contact_discord_webhook_failed' | 'contact_telegram_webhook_failed'
  | 'content_load_failed' | 'content_save_failed' | 'content_initialize_failed' | 'content_restore_failed' | 'inbox_load_failed' | 'inbox_mutation_failed' | 'cache_write_failed';

// Deliberately exclude exception messages, request bodies, tokens, email
// addresses, database URLs, and full query strings from diagnostic records.
export function reportDiagnostic(code: DiagnosticCode, requestId: string = crypto.randomUUID()) {
  console.error(JSON.stringify({ event: 'portfolio_error', code, requestId, timestamp: new Date().toISOString() }));
  return requestId;
}
