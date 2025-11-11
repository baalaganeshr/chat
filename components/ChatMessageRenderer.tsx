
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
        <ul key={blocks.length} className="list-none space-y-2 my-4 border-l-2 border-[#00BCD4]/30 pl-4">
          {currentBlock.map((item, i) => (
            <li key={i} className="flex items-start">
              <span className="w-1.5 h-1.5 bg-[#00BCD4] rounded-full mt-2.5 mr-3 flex-shrink-0"></span>
              <span className="flex-1">{parseInlineText(item.replace(/^[-*]\s*/, ''))}</span>
            </li>
          ))}
        </ul>
      );
    } else if (blockType === 'h3') {
       blocks.push(
        <div key={blocks.length} className="mt-6 mb-3 first:mt-0">
          <h3 className="text-lg font-semibold text-[#00BCD4] border-b border-[#00BCD4]/30 pb-2">
            {parseInlineText(currentBlock.join(' ').replace(/^###\s*/, ''))}
          </h3>
        </div>
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
            <p key={`p-${blocks.length}-${paragraphChunks.length}`} className="mb-4 leading-relaxed">
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
            <div key={`err-${blocks.length}-${index}`} className="mb-4 p-4 rounded-xl bg-[#F44336]/10 border border-[#F44336]/30 text-[#E0E0E0]">
              <div className="flex items-start">
                <div className="bg-[#F44336] rounded-full p-1 mr-3 mt-0.5 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-[#F44336] font-semibold text-sm mb-1">ERROR</p>
                  <span className="font-mono text-sm">{parseInlineText(line)}</span>
                </div>
              </div>
            </div>
          );
        } else if (warningRegex.test(line)) {
          flushNormalLines();
          paragraphChunks.push(
            <div key={`warn-${blocks.length}-${index}`} className="mb-4 p-4 rounded-xl bg-[#FF9800]/10 border border-[#FF9800]/30 text-[#E0E0E0]">
              <div className="flex items-start">
                <div className="bg-[#FF9800] rounded-full p-1 mr-3 mt-0.5 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-[#FF9800] font-semibold text-sm mb-1">WARNING</p>
                  <span className="font-mono text-sm">{parseInlineText(line)}</span>
                </div>
              </div>
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
