import { createContext, useContext } from 'react';
import type { DataContextType } from './DataContext';

export type EditorActions = Pick<DataContextType, {
  [K in keyof DataContextType]: DataContextType[K] extends (...args: never[]) => unknown ? K : never
}[keyof DataContextType]>;
export type ContentSync = Pick<DataContextType, 'contentSyncState' | 'contentSyncError' | 'lastContentSyncAt' | 'retryContentSync' | 'recoverableDraft' | 'draftStorageError' | 'recoverDraft' | 'discardDraft' | 'exportDraftJSON' | 'draftRecoveryRequired' | 'contentEditingBlocked'>;
export type Inbox = Pick<DataContextType, 'messages' | 'messagesLoading' | 'messagesError' | 'hasMoreMessages' | 'pendingMessageIds' | 'retryMessageMutation' | 'refreshMessages' | 'loadMoreMessages' | 'updateMessageStatus' | 'deleteMessage' | 'markAllMessagesAsRead'>;
export const EditorActionsContext = createContext<EditorActions | null>(null);
export const ContentSyncContext = createContext<ContentSync | null>(null);
export const InboxContext = createContext<Inbox | null>(null);

export function useEditorActions() { const value = useContext(EditorActionsContext); if (!value) throw new Error('Editor actions require a DataProvider.'); return value; }
export function useContentSync() { const value = useContext(ContentSyncContext); if (!value) throw new Error('Content synchronization requires a DataProvider.'); return value; }
export function useInbox() { const value = useContext(InboxContext); if (!value) throw new Error('Inbox requires a DataProvider.'); return value; }
