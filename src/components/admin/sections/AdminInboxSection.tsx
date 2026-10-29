import {
CheckCheck,
Clock,
Mail,
MessageSquare,
RefreshCw,
Search,
Trash2,
X
} from 'lucide-react';
import { ContactMessage } from '../../../data/initialData';
import { useState } from 'react';
import { useInbox } from '../../../context/editorSubscriptions';
import { useAuth } from '../../../context/AuthContext';

export function AdminInboxSection() {
  const [inboxFilter, setInboxFilter] = useState<'all' | 'unread' | 'read' | 'replied'>('all');
  const [inboxSearch, setInboxSearch] = useState('');
  const { session } = useAuth();
  const { deleteMessage, hasMoreMessages, loadMoreMessages, markAllMessagesAsRead, messages, messagesError, messagesLoading, pendingMessageIds, refreshMessages, retryMessageMutation, updateMessageStatus } = useInbox();
  return (() => {
          const unreadCount = messages.filter((m) => m.status === 'unread').length;
          const readCount = messages.filter((m) => m.status === 'read').length;
          const repliedCount = messages.filter((m) => m.status === 'replied').length;

          const filteredMessages = messages.filter((msg) => {
            const matchFilter =
              inboxFilter === 'all' ? true : msg.status === inboxFilter;
            const q = inboxSearch.toLowerCase().trim();
            const matchSearch =
              !q ||
              msg.name.toLowerCase().includes(q) ||
              msg.email.toLowerCase().includes(q) ||
              (msg.subject && msg.subject.toLowerCase().includes(q)) ||
              (msg.service && msg.service.toLowerCase().includes(q)) ||
              msg.message.toLowerCase().includes(q);
            return matchFilter && matchSearch;
          });

          return (
            <div className="space-y-6">
              {/* Header & Sync Status */}
              <div className="p-6 sm:p-8 rounded-3xl glass-card border border-gray-200 dark:border-gray-800 space-y-6 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-6">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Inbound Messages</h2>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        {session?.mode === 'supabase' ? 'Hosted Inbox' : 'Local Inbox'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Counts, search and filters apply to loaded messages. Load older messages to include them; refresh to fetch new inquiries. The full inbox export includes every hosted message.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => void refreshMessages()}
                      disabled={messagesLoading || pendingMessageIds.length > 0}
                      className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${messagesLoading ? 'animate-spin' : ''}`} />
                      <span>Refresh</span>
                    </button>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={markAllMessagesAsRead}
                        disabled={pendingMessageIds.length > 0}
                        className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-brand-500/10 text-[var(--color-primary)] dark:text-[var(--color-primary-light)] hover:bg-brand-500/20 border border-brand-500/20 transition-colors"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        <span>Mark inbox as read</span>
                      </button>
                    )}
                  </div>
                </div>

                {messagesError && <div role="alert" className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400">{messagesError} <button type="button" onClick={retryMessageMutation} disabled={pendingMessageIds.length > 0}>Retry inbox action</button></div>}
                {pendingMessageIds.length > 0 && <p role="status">Updating inbox…</p>}

                {/* Metrics Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-2xl bg-gray-50/70 dark:bg-gray-800/40 border border-gray-200/80 dark:border-gray-700/80">
                    <span className="text-[10px] font-mono text-gray-400 uppercase">Loaded Messages</span>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">{messages.length}</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-brand-50/50 dark:bg-brand-950/20 border border-brand-200/60 dark:border-brand-800/40">
                    <span className="text-[10px] font-mono text-brand-600 dark:text-brand-400 uppercase">Loaded Unread</span>
                    <div className="text-xl font-bold text-[var(--color-primary)] dark:text-[var(--color-primary-light)]">{unreadCount}</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-gray-50/70 dark:bg-gray-800/40 border border-gray-200/80 dark:border-gray-700/80">
                    <span className="text-[10px] font-mono text-gray-400 uppercase">Loaded Read</span>
                    <div className="text-xl font-bold text-gray-700 dark:text-gray-300">{readCount}</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40">
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 uppercase">Loaded Replied</span>
                    <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{repliedCount}</div>
                  </div>
                </div>

                {/* Search & Filter Toolbar */}
                <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                  {/* Filter Pills */}
                  <div className="flex items-center gap-1.5 p-1 rounded-xl bg-gray-100 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 w-full sm:w-auto overflow-x-auto">
                    {[
                      { id: 'all', label: `All (${messages.length})` },
                      { id: 'unread', label: `Unread (${unreadCount})` },
                      { id: 'read', label: `Read (${readCount})` },
                      { id: 'replied', label: `Replied (${repliedCount})` }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setInboxFilter(tab.id as typeof inboxFilter)}
                        aria-pressed={inboxFilter === tab.id}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                          inboxFilter === tab.id
                            ? 'bg-[var(--color-primary)] text-white shadow-xs'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Search Input */}
                  <div className="relative w-full sm:w-72">
                    <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search name, email, subject, text..."
                      aria-label="Search loaded messages"
                      value={inboxSearch}
                      onChange={(e) => setInboxSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-[var(--color-primary)]"
                    />
                    {inboxSearch && (
                      <button
                        type="button"
                        onClick={() => setInboxSearch('')}
                        aria-label="Clear inbox search"
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
                {hasMoreMessages && (
                  <div className="flex justify-center pt-4">
                    <button type="button" onClick={() => void loadMoreMessages()} disabled={messagesLoading || pendingMessageIds.length > 0} className="px-4 py-2 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 disabled:opacity-50">
                      {messagesLoading ? 'Loading…' : 'Load older messages'}
                    </button>
                  </div>
                )}
              </div>

              {/* Messages List */}
              {filteredMessages.length === 0 ? (
                <div className="p-16 text-center rounded-3xl glass-card border border-gray-200 dark:border-gray-800 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-[var(--color-primary)] dark:text-[var(--color-primary-light)] mx-auto flex items-center justify-center">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                    {messages.length === 0 ? 'No Messages Received Yet' : 'No Matching Messages Found'}
                  </h4>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    {messages.length === 0
                      ? 'Refresh to fetch new contact submissions. Check the inbox status above if loading failed.'
                      : 'Try another search or filter. Load older messages above to search more of the inbox.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredMessages.map((msg) => {
                    const replyMailto = `mailto:${msg.email}?subject=${encodeURIComponent(
                      'Re: ' + (msg.subject || 'Portfolio Inquiry')
                    )}&body=${encodeURIComponent(
                      `\n\n--- In response to your message (${msg.createdAt || 'Recent'}):\n` +
                      msg.message
                    )}`;

                    return (
                      <div
                        key={msg.id}
                        className={`p-6 rounded-3xl glass-card border transition-all space-y-4 shadow-xs ${
                          msg.status === 'unread'
                            ? 'border-[var(--color-primary)] bg-brand-50/20 dark:bg-brand-950/20 shadow-brand-500/5'
                            : msg.status === 'replied'
                            ? 'border-emerald-500/30 bg-emerald-50/10 dark:bg-emerald-950/10'
                            : 'border-gray-200 dark:border-gray-800'
                        }`}
                      >
                        {/* Message Header Row */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center space-x-3 min-w-0">
                            {/* Avatar Initials Badge */}
                            <div
                              className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-bold shrink-0 ${
                                msg.status === 'unread'
                                  ? 'bg-[var(--color-primary)] text-white shadow-md'
                                  : msg.status === 'replied'
                                  ? 'bg-emerald-600 text-white shadow-md'
                                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                              }`}
                            >
                              {msg.name
                                .split(' ')
                                .map((n) => n[0])
                                .slice(0, 2)
                                .join('')
                                .toUpperCase() || 'U'}
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                  {msg.name}
                                </span>
                                <a
                                  href={`mailto:${msg.email}`}
                                  className="text-xs text-[var(--color-primary)] dark:text-[var(--color-primary-light)] hover:underline font-mono truncate"
                                >
                                  {msg.email}
                                </a>
                              </div>
                              <div className="flex items-center gap-2 text-[11px] text-gray-400 font-mono pt-0.5">
                                {msg.createdAt && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    <span>{msg.createdAt}</span>
                                  </span>
                                )}
                                <span>·</span>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                                  {msg.service || 'General Inquiry'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Status & Actions */}
                          <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                            {/* Status Selector Dropdown */}
                            <select
                              aria-label={`Message status for ${msg.name}`}
                              value={msg.status}
                              onChange={(e) => updateMessageStatus(msg.id, e.target.value as ContactMessage['status'])}
                              disabled={messagesLoading || pendingMessageIds.includes(msg.id) || pendingMessageIds.includes('*')}
                              className={`px-2.5 py-1 text-xs font-semibold rounded-xl border focus:outline-hidden transition-colors ${
                                msg.status === 'unread'
                                  ? 'bg-brand-500/10 text-[var(--color-primary)] border-brand-500/30'
                                  : msg.status === 'replied'
                                  ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700'
                              }`}
                            >
                              <option value="unread">● Unread</option>
                              <option value="read">✓ Read</option>
                              <option value="replied">✓ Replied</option>
                            </select>

                            {/* Reply via Email Button */}
                            <a
                              href={replyMailto}
                              className="inline-flex items-center space-x-1 px-3 py-1 rounded-xl text-xs font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-strong)] transition-colors shadow-xs"
                              title="Send Email Reply"
                            >
                              <Mail className="w-3.5 h-3.5" />
                              <span>Reply</span>
                            </a>

                            {/* Delete Message Button */}
                            <button
                              type="button"
                              disabled={messagesLoading || pendingMessageIds.includes(msg.id) || pendingMessageIds.includes('*')}
                              onClick={() => {
                                if (window.confirm(`Delete message from ${msg.name}?`)) {
                                  deleteMessage(msg.id);
                                }
                              }}
                              className="p-1.5 text-gray-400 hover:text-red-500 rounded-xl hover:bg-red-500/10 transition-colors"
                              title="Delete message"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Subject */}
                        {msg.subject && (
                          <div className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                            <span className="text-gray-400 font-normal">Subject:</span>
                            <span>{msg.subject}</span>
                          </div>
                        )}

                        {/* Message Body */}
                        <div className="p-4 rounded-2xl bg-gray-50/80 dark:bg-gray-800/50 border border-gray-200/60 dark:border-gray-700/60 text-xs text-gray-700 dark:text-gray-300 leading-relaxed font-sans whitespace-pre-wrap">
                          {msg.message}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })();
}
