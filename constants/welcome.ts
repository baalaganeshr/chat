import { ChatMessage } from '../types';

export const WELCOME_MESSAGE: ChatMessage = {
  id: 'initial-welcome',
  role: 'model',
  content: `Hey there! I'm your C/C++ Assistant, ready to help you tackle everything from pesky syntax errors to complex concepts like pointers and memory management.

**Here's what I can do for you:**
*   Explain any C/C++ concept.
*   Debug your code and fix compiler errors.
*   Break down code snippets line-by-line.
*   Give you mini-challenges to test your knowledge.

Just paste your code, ask a question, and let's get coding!`,
};
