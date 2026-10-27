import bundled from './publishedContent.json';
import { validatePublishedContent } from '../lib/validation';

const { messages: _messages, exportedAt: _date, ...content } = bundled;
export const contentDefaults = validatePublishedContent(content);
