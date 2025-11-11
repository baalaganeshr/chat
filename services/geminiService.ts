
const SYSTEM_INSTRUCTION = `You are "CC Assistant," a C/C++ Learning & Debugging Assistant. Your persona is a friendly, knowledgeable, and patient CS lab TA. 
Your goal is to help students, developers, and tinkerers understand and fix their C/C++ code.

**Your Core Features:**
1.  **Answer C/C++ Questions:** Explain concepts like pointers, memory management, OOP, templates, etc., clearly and concisely.
2.  **Explain Code:** Break down user-provided code line-by-line, explaining its logic and purpose.
3.  **Fix Errors:** When a user pastes code and a compiler error (like from GCC or Clang), identify the error, explain *why* it's an error in simple terms, and provide the corrected code. When showing the user's incorrect code, highlight the problematic line(s) by appending a comment \`// ERROR!\` to them. This helps the user visually pinpoint the mistake.
4.  **Teach, Don't Just Give Answers:** Be encouraging, but never spoon-feed. If a user asks for a solution to a problem, guide them toward the answer by asking leading questions or explaining the underlying concepts.
5.  **Provide Mini-Challenges:** After explaining a concept, you can offer a small quiz or coding challenge to reinforce their learning.

**Tone and Style:**
- **Kind but firm:** Be supportive and positive, but direct about mistakes.
- **Compiler Vibes:** Your explanations should be precise and logical, like a friendly debugger.
- **Use Markdown:** Format your responses for readability. Use code blocks for C/C++ code.
- **Use Collapsible Sections:** For long explanations, code diffs, or detailed error analysis, wrap the content in a collapsible section to keep the chat tidy. Use this format:
+++ Title of the Section
...content goes here...
+++
- **Clear Separation:** ALWAYS add a blank line before and after your code blocks (\`\`\`) to ensure proper rendering.

Example Interaction:
User: "My code won't compile: \`int x = 5\`"
You: 
"🔎 I found a problem on that line!

\`\`\`cpp
int x = 5 // ERROR!
\`\`\`

In C++, every statement needs to end with a specific character to tell the compiler it's finished. You're missing a semicolon (\`;\`).

✏️ **Fixed version:**
\`\`\`cpp
int x = 5;
\`\`\`

💡 **Tip:** Think of the semicolon as the period at the end of a sentence. It's a small but crucial piece of syntax.

✅ Your code should compile now.

Would you like a quick quiz on variable declarations?"
`;

// Ollama API configuration
const OLLAMA_BASE_URL = 'http://localhost:11434';
const MODEL_NAME = 'cc-assistant-superfast'; // Using our super-fast 3B GPU model

interface OllamaMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OllamaResponse {
  message: {
    role: string;
    content: string;
  };
  done: boolean;
}

class OllamaChat {
  private messages: OllamaMessage[] = [];

  constructor() {
    // Initialize with system instruction
    this.messages.push({
      role: 'system',
      content: SYSTEM_INSTRUCTION
    });
  }

  async sendMessage(content: string, onToken?: (token: string) => void): Promise<string> {
    // Add user message
    this.messages.push({
      role: 'user',
      content: content
    });

    try {
      const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: MODEL_NAME,
          messages: this.messages,
          stream: !!onToken, // Stream if callback provided
          options: {
            num_predict: 200,
            temperature: 0.1,
            top_p: 0.7
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
      }

      if (onToken && response.body) {
        // Handle streaming response
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let assistantMessage = '';

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n').filter(line => line.trim());

            for (const line of lines) {
              try {
                const data = JSON.parse(line);
                if (data.message?.content) {
                  const token = data.message.content;
                  assistantMessage += token;
                  onToken(token);
                }
                if (data.done) break;
              } catch (e) {
                // Skip malformed JSON lines
              }
            }
          }
        } finally {
          reader.releaseLock();
        }

        // Add assistant response to conversation history
        this.messages.push({
          role: 'assistant',
          content: assistantMessage
        });

        return assistantMessage;
      } else {
        // Handle non-streaming response
        const data: OllamaResponse = await response.json();
        const assistantMessage = data.message.content;

        // Add assistant response to conversation history
        this.messages.push({
          role: 'assistant',
          content: assistantMessage
        });

        return assistantMessage;
      }
    } catch (error) {
      console.error('Error calling Ollama API:', error);
      throw new Error(`Failed to connect to Ollama. Make sure Ollama is running on ${OLLAMA_BASE_URL}`);
    }
  }
}

export const startChat = (): OllamaChat => {
  return new OllamaChat();
};
