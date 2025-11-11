import { ChatMessage } from '../types';

export const WELCOME_MESSAGE: ChatMessage = {
  id: 'initial-welcome',
  role: 'model',
  content: `### Welcome to CC Assistant

I'm your professional C/C++ programming assistant, designed to help you understand concepts, debug code, and improve your programming skills.

### My Capabilities

* **Code Analysis** - Review and explain C/C++ code structure and logic
* **Error Debugging** - Identify and fix compilation errors with detailed explanations  
* **Concept Explanation** - Break down complex topics like pointers, memory management, and OOP
* **Best Practices** - Suggest improvements and coding standards
* **Learning Support** - Guide you through problem-solving with structured explanations

### Getting Started

Share your code, describe your issue, or ask any C/C++ related question. I'll provide clear, structured responses to help you learn and progress.`,
};
