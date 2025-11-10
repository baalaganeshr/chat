
import React from 'react';
import { CodeBlock } from './CodeBlock';
import { Collapsible } from './Collapsible';

interface ChatMessageRendererProps {
  content: string;
}

// A simple inline parser for bold, italic, and inline code
const parseInlineText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('*') && part.endsWith('*')) {
            return <em key={i}>{part.slice(1, -1)}</em>;
        }
        if (part.startsWith('`') && part.endsWith('`')) {
            return <code key={i} className="bg-[#2C2C2C] text-[#FFC107] px-1 py-0.5 rounded text-sm">{part.slice(1, -1)}</code>;
        }
        return part;
    });
};

export const ChatMessageRenderer: React.FC<ChatMessageRendererProps> = ({ content }) => {
  const blocks: React.ReactNode[] = [];
  const lines = content.split('\n');
  let currentBlock: string[] = [];
  let blockType: 'p' | 'ul' | 'code' | 'h3' | 'collapsible' = 'p';
  let codeLang = '';
  let collapsibleTitle = '';

  const pushBlock = () => {
    if (currentBlock.length === 0) return;

    if (blockType === 'code') {
      blocks.push(<CodeBlock key={blocks.length} text={currentBlock.join('\n')} language={codeLang} />);
    } else if (blockType === 'collapsible') {
      blocks.push(
        <Collapsible key={blocks.length} title={collapsibleTitle}>
          <ChatMessageRenderer content={currentBlock.join('\n')} />
        </Collapsible>
      );
    } else if (blockType === 'ul') {
      blocks.push(
        <ul key={blocks.length} className="list-disc list-inside space-y-1 my-2">
          {currentBlock.map((item, i) => (
            <li key={i}>{parseInlineText(item.replace(/^[-*]\s*/, ''))}</li>
          ))}
        </ul>
      );
    } else if (blockType === 'h3') {
       blocks.push(
        <h3 key={blocks.length} className="text-lg font-semibold my-2 text-[#00BCD4]">
          {parseInlineText(currentBlock.join(' ').replace(/^###\s*/, ''))}
        </h3>
       );
    } else {
      // Handle paragraphs with potential error/warning lines
      const paragraphChunks: React.ReactNode[] = [];
      let normalLines: string[] = [];
      const errorRegex = /error:/i;
      const warningRegex = /warning:/i;

      const flushNormalLines = () => {
        if (normalLines.length > 0) {
          paragraphChunks.push(
            <p key={`p-${blocks.length}-${paragraphChunks.length}`} className="my-2">
              {parseInlineText(normalLines.join('\n'))}
            </p>
          );
          normalLines = [];
        }
      };

      currentBlock.forEach((line, index) => {
        if (errorRegex.test(line)) {
          flushNormalLines();
          paragraphChunks.push(
            <div key={`err-${blocks.length}-${index}`} className="flex items-start my-2 p-2 rounded-md bg-[#F44336]/10 text-[#E0E0E0]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0 text-[#F44336]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="flex-1 font-mono text-sm">{parseInlineText(line)}</span>
            </div>
          );
        } else if (warningRegex.test(line)) {
          flushNormalLines();
          paragraphChunks.push(
            <div key={`warn-${blocks.length}-${index}`} className="flex items-start my-2 p-2 rounded-md bg-[#FF9800]/10 text-[#E0E0E0]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0 text-[#FF9800]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="flex-1 font-mono text-sm">{parseInlineText(line)}</span>
            </div>
          );
        } else {
          normalLines.push(line);
        }
      });

      flushNormalLines();
      if (paragraphChunks.length > 0) {
        blocks.push(...paragraphChunks);
      }
    }
    currentBlock = [];
  };

  for (const line of lines) {
    if (line.startsWith('+++ ') && blockType !== 'code' && blockType !== 'collapsible') {
      pushBlock();
      blockType = 'collapsible';
      collapsibleTitle = line.substring(4).trim();
      continue;
    }

    if (line.trim() === '+++' && blockType === 'collapsible') {
      pushBlock();
      blockType = 'p';
      collapsibleTitle = '';
      continue;
    }

    if (blockType === 'collapsible') {
      currentBlock.push(line);
      continue;
    }

    if (line.startsWith('```')) {
      pushBlock();
      if (blockType !== 'code') {
        blockType = 'code';
        codeLang = line.substring(3).trim();
      } else {
        blockType = 'p';
      }
      continue;
    }

    if (blockType === 'code') {
      currentBlock.push(line);
      continue;
    }

    if (line.startsWith('### ')) {
        pushBlock();
        blockType = 'h3';
        currentBlock.push(line);
        pushBlock(); // Headings are single-line blocks
        blockType = 'p';
    } else if (line.startsWith('* ') || line.startsWith('- ')) {
      if (blockType !== 'ul') {
        pushBlock();
        blockType = 'ul';
      }
      currentBlock.push(line);
    } else if (line.trim() === '') {
        pushBlock();
        blockType = 'p';
    } else {
        if (blockType === 'ul') {
            pushBlock(); // End the list if a non-list line appears
            blockType = 'p';
        }
        currentBlock.push(line);
    }
  }

  pushBlock(); // Push any remaining block

  return <div className="text-[#E0E0E0] text-left">{blocks}</div>;
};
