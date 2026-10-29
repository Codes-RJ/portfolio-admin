import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('Supabase contact message mutations', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv('VITE_SUPABASE_URL', 'https://project.supabase.co');
    vi.stubEnv('VITE_SUPABASE_PUBLISHABLE_KEY', 'sb_publishable_test_key');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('exports every page of an inbox larger than the visible page', async () => {
    const rows = Array.from({ length: 125 }, (_, i) => ({ id: `message-${i}`, name: 'Ada', email: 'ada@example.com', message: 'Hello', status: 'unread', created_at: '2026-09-01T00:00:00Z' }));
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify(rows.slice(0, 50))))
      .mockResolvedValueOnce(new Response(JSON.stringify(rows.slice(50, 100))))
      .mockResolvedValueOnce(new Response(JSON.stringify(rows.slice(100))));
    vi.stubGlobal('fetch', fetchMock);
    const { loadAllContactMessages } = await import('@/lib/supabase');
    expect(await loadAllContactMessages('admin-token')).toHaveLength(125);
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(decodeURIComponent(fetchMock.mock.calls[1][0])).toContain('id.lt.message-49');
  });

  it('does not produce an incomplete backup if a later page fails', async () => {
    const rows = Array.from({ length: 50 }, (_, i) => ({ id: `message-${i}`, name: 'Ada', email: 'ada@example.com', message: 'Hello', status: 'unread', created_at: '2026-09-01T00:00:00Z' }));
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce(new Response(JSON.stringify(rows))).mockResolvedValueOnce(new Response('{}', { status: 503 })));
    const { loadAllContactMessages } = await import('@/lib/supabase');
    await expect(loadAllContactMessages('admin-token')).rejects.toThrow('Could not load');
  });

  it('updates only the selected message status', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify([{ id: 'message/1' }]), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    const { updateContactMessageStatus } = await import('@/lib/supabase');

    await updateContactMessageStatus('message/1', 'replied', 'admin-token');

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock).toHaveBeenCalledWith(
      'https://project.supabase.co/rest/v1/contact_messages?id=eq.message%2F1&select=id',
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({ status: 'replied' }),
      }),
    );
  });

  it('deletes only the selected message', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify([{ id: 'message-2' }]), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    const { deleteContactMessage } = await import('@/lib/supabase');

    await deleteContactMessage('message-2', 'admin-token');

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock).toHaveBeenCalledWith(
      'https://project.supabase.co/rest/v1/contact_messages?id=eq.message-2&select=id',
      expect.objectContaining({ method: 'DELETE' }),
    );
    expect(fetchMock.mock.calls[0]?.[0]).not.toContain('id=not.is.null');
  });

  it('uses a stable created-at and id cursor instead of an offset for inbox pagination', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify([]), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    const { loadContactMessages } = await import('@/lib/supabase');

    await loadContactMessages('admin-token', { createdAt: '2026-09-20T12:34:56.000Z', id: 'message-10' });

    const requestUrl = new URL(String(fetchMock.mock.calls[0]?.[0]));
    expect(requestUrl.searchParams.get('offset')).toBeNull();
    expect(requestUrl.searchParams.get('order')).toBe('created_at.desc,id.desc');
    expect(requestUrl.searchParams.get('or')).toBe('(created_at.lt.2026-09-20T12:34:56.000Z,and(created_at.eq.2026-09-20T12:34:56.000Z,id.lt.message-10))');
  });

  it('reports a failed or unauthorized row mutation without issuing a fallback delete', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify([]), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    const { updateContactMessageStatus } = await import('@/lib/supabase');

    await expect(updateContactMessageStatus('missing-message', 'read', 'admin-token'))
      .rejects.toThrow('Could not update the contact message.');

    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it('uses the loaded update timestamp to prevent stale content overwrites', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify([]), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    const { PublishedContentConflictError, savePublishedContent } = await import('@/lib/supabase');

    await expect(savePublishedContent({ schemaVersion: 1 }, 'admin-token', '2026-09-09T10:00:00.000Z'))
      .rejects.toBeInstanceOf(PublishedContentConflictError);

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock.mock.calls[0]?.[0]).toContain('updated_at=eq.2026-09-09T10%3A00%3A00.000Z');
    expect(fetchMock.mock.calls[0]?.[1]).toEqual(expect.objectContaining({ method: 'PATCH' }));
  });

  it('initializes only the fixed portfolio row and returns its version', async () => {
    const updatedAt = '2026-09-10T08:00:00.000Z';
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify([{ updated_at: updatedAt }]), { status: 201 }));
    vi.stubGlobal('fetch', fetchMock);
    const { initializePublishedContent } = await import('@/lib/supabase');

    await expect(initializePublishedContent({ schemaVersion: 1 }, 'admin-token')).resolves.toBe(updatedAt);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://project.supabase.co/rest/v1/site_content?select=updated_at',
      expect.objectContaining({ method: 'POST', body: JSON.stringify({ id: 'portfolio', payload: { schemaVersion: 1 } }) }),
    );
  });
});
