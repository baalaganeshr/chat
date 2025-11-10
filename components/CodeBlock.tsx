import React, { useState, useEffect } from 'react';

interface CodeBlockProps {
  text: string;
  language?: string;
}

const cppKeywords = new Set([
  'auto', 'break', 'case', 'char', 'const', 'continue', 'default', 'do',
  'double', 'else', 'enum', 'extern', 'float', 'for', 'goto', 'if',
  'int', 'long', 'register', 'return', 'short', 'signed', 'sizeof', 'static',
  'struct', 'switch', 'typedef', 'union', 'unsigned', 'void', 'volatile', 'while',
  'class', 'private', 'protected', 'public', 'new', 'delete', 'this', 'friend',
  'virtual', 'inline', 'operator', 'template', 'typename', 'try', 'catch', 'throw',
  'namespace', 'using', 'std', 'cout', 'cin', 'endl', 'string', 'vector', 'map'
]);

const cppPreprocessor = new Set([
    '#include', '#define', '#ifndef', '#endif', '#if', '#else', '#elif'
]);

const jsKeywords = new Set([
    'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger', 'default', 'delete', 'do', 'else', 'export', 'extends', 'finally', 'for', 'function', 'if', 'import', 'in', 'instanceof', 'new', 'return', 'super', 'switch', 'this', 'throw', 'try', 'typeof', 'var', 'void', 'while', 'with', 'yield', 'let', 'static', 'async', 'await', 'of', 'true', 'false', 'null', 'undefined'
]);

const pyKeywords = new Set([
    'False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await', 'break', 'class', 'continue', 'def', 'del', 'elif', 'else', 'except', 'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return', 'try', 'while', 'with', 'yield'
]);


const highlightSyntax = (line: string, language: string) => {
    let keywords: Set<string> = new Set();
    let preprocessor: Set<string> = new Set();
    let commentChar = '//';

    switch (language.toLowerCase()) {
        case 'javascript':
        case 'js':
            keywords = jsKeywords;
            commentChar = '//';
            break;
        case 'python':
        case 'py':
            keywords = pyKeywords;
            commentChar = '#';
            break;
        case 'cpp':
        case 'c++':
        case 'c':
            keywords = cppKeywords;
            preprocessor = cppPreprocessor;
            commentChar = '//';
            break;
        default:
            // Plain text, no highlighting
            return <span>{line}</span>;
    }

    const commentIndex = line.indexOf(commentChar);
    const codeToHighlight = commentIndex !== -1 ? line.substring(0, commentIndex) : line;
    const comment = commentIndex !== -1 ? line.substring(commentIndex) : '';

    const tokens = codeToHighlight.split(/(\s+|[();,{}[\]<>!=+\-/*&|%^~?:])/g).filter(Boolean);

    const highlightedTokens = tokens.map((token, i) => {
        if (keywords.has(token)) {
            return <span key={i} className="text-[#FFC107]">{token}</span>;
        }
        if (preprocessor.has(token)) {
            return <span key={i} className="text-[#B0B0B0]">{token}</span>;
        }
        if ((token.startsWith('"') && token.endsWith('"')) || (token.startsWith("'") && token.endsWith("'"))) {
            return <span key={i} className="text-[#03A9F4]">{token}</span>;
        }
        if (!isNaN(Number(token)) && token.trim().length > 0) {
            return <span key={i} className="text-[#03A9F4]">{token}</span>;
        }
        return <span key={i}>{token}</span>;
    });
    
    return (
        <>
            {highlightedTokens}
            {comment && <span className="text-[#4CAF50]">{comment}</span>}
        </>
    );
};

const CopyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

const normalizeLanguage = (lang?: string): string => {
    const langStr = (lang || 'cpp').toLowerCase();
    if (['c', 'c++'].includes(langStr)) return 'cpp';
    if (['js'].includes(langStr)) return 'javascript';
    if (['py'].includes(langStr)) return 'python';
    return langStr;
};


export const CodeBlock: React.FC<CodeBlockProps> = ({ text, language: initialLanguage }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(normalizeLanguage(initialLanguage));

  useEffect(() => {
    setSelectedLanguage(normalizeLanguage(initialLanguage));
  }, [initialLanguage]);


  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };
  
  const lines = text.split('\n');
  if (lines[lines.length - 1] === '') {
    lines.pop();
  }

  return (
    <div className="bg-black/30 rounded-xl my-4 overflow-hidden relative border border-white/5">
      <div className="flex justify-between items-center px-4 py-2 bg-black/20">
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="bg-transparent text-xs text-[#B0B0B0] uppercase select-none appearance-none cursor-pointer focus:outline-none p-1 rounded-md hover:bg-white/10 transition-colors"
          aria-label="Select code language"
        >
          <option value="cpp">C++</option>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="text">Text</option>
        </select>
        <button
          onClick={handleCopy}
          className={`p-2 rounded-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black/20 focus:ring-[#00BCD4] text-xs flex items-center gap-2 ${
            isCopied
              ? 'bg-[#4CAF50]/20 text-[#4CAF50]'
              : 'bg-transparent text-[#B0B0B0] hover:bg-white/10 hover:text-white'
          }`}
          aria-label={isCopied ? 'Copied' : 'Copy code'}
        >
          {isCopied ? <CheckIcon /> : <CopyIcon />}
          <span>{isCopied ? 'Copied!' : 'Copy'}</span>
      </button>
      </div>


      <div className="overflow-x-auto text-left text-sm">
        <table className="font-mono text-[#E0E0E0] w-full border-collapse">
            <tbody>
                {lines.map((line, i) => {
                    const hasError = line.includes('// ERROR!') || line.includes('# ERROR!');
                    const cleanLine = line.replace(/\s*(\/\/|#)\s*ERROR!/, '').trimEnd();
                    const rowClasses = hasError ? 'bg-[#F44336]/15' : '';

                    return (
                        <tr key={i} className={rowClasses}>
                            <td className="w-10 select-none text-right px-3 py-0.5 text-[#B0B0B0]/40" aria-hidden="true">
                                {i + 1}
                            </td>
                            <td className="pr-4 py-0.5 pl-2">
                                <code className="whitespace-pre-wrap break-words">
                                    {cleanLine.length > 0 ? highlightSyntax(cleanLine, selectedLanguage) : <span>&nbsp;</span>}
                                </code>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
      </div>
    </div>
  );
};