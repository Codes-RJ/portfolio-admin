import { useRef } from 'react';
import type { EmailPayload } from '../utils/emailService';

// Retries of one payload share a key. An edited draft is a new request.
export function useContactRequest() {
  const previous = useRef({ payload: '', id: '' });
  const requestIdFor = (payload: EmailPayload) => {
    const serialized = JSON.stringify(payload);
    if (serialized !== previous.current.payload) previous.current = { payload: serialized, id: crypto.randomUUID() };
    return previous.current.id;
  };
  const completeRequest = () => { previous.current = { payload: '', id: '' }; };
  return { requestIdFor, completeRequest };
}
