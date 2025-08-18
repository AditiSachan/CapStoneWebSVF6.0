import React, { useState, useRef, useEffect } from 'react';
import { doOpenAICall } from '../../services/openAIService';
import styles from './codeGPT.module.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coy as syntaxStyle } from 'react-syntax-highlighter/dist/esm/styles/prism';
import RefreshIcon from '@mui/icons-material/Refresh';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';

const CodeGPT = ({
  code,
  graphs = {},
  terminalOutput,
  llvmIR,
  savedMessages,
  onSaveMessages,
  passedPrompt,
}: {
  code: string;
  graphs: any;
  terminalOutput: string;
  llvmIR: string;
  savedMessages: any;
  onSaveMessages: any;
  passedPrompt: string;
}) => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [gptInputQuery, setGptInputQuery] = useState('');
  const [suggestionCategory, setSuggestionCategory] = useState('code');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const responseContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  // Load messages from props
  useEffect(() => {
    setMessages(savedMessages || []);
  }, [savedMessages]);

  // Scroll to bottom function
  const scrollToBottom = () => {
    if (responseContainerRef.current) {
      responseContainerRef.current.scrollTop = responseContainerRef.current.scrollHeight;
    }
  };

  // Check scroll position and show/hide scroll button
  const handleScroll = () => {
    if (responseContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = responseContainerRef.current;
      // Show button if not at bottom (with some margin)
      const isNotAtBottom = scrollHeight - scrollTop - clientHeight > 50;
      setShowScrollToBottom(isNotAtBottom);
    }
  };

  // Always scroll to bottom when component mounts or becomes visible
  useEffect(() => {
    // Scroll to bottom when component mounts
    scrollToBottom();

    // Set up resize observer to handle layout changes
    const resizeObserver = new ResizeObserver(() => {
      scrollToBottom();
    });

    if (responseContainerRef.current) {
      resizeObserver.observe(responseContainerRef.current);
      responseContainerRef.current.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (responseContainerRef.current) {
        resizeObserver.unobserve(responseContainerRef.current);
        responseContainerRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  // Scroll to bottom whenever tab becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Small delay to ensure DOM is rendered
        setTimeout(scrollToBottom, 50);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    // When messages change, scroll to bottom
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async () => {
    callChatGPT(gptInputQuery);
  };

  const callChatGPT = async (prompt: string) => {
    if (!prompt.trim()) return;

    const newMessage = { role: 'user', content: prompt };
    const updatedMessages = [
      ...messages,
      newMessage,
      { role: 'assistant', content: 'Loading response...' },
    ];

    // Update local state
    setMessages(updatedMessages);

    // Immediately notify parent component
    onSaveMessages(updatedMessages);

    setGptInputQuery('');

    try {
      const response = await doOpenAICall([{ role: 'user', content: prompt }]);
      const assistantMessage = { role: 'assistant', content: response.choices[0].message.content };
      const finalMessages = [...updatedMessages.slice(0, -1), assistantMessage];

      // Update local state
      setMessages(finalMessages);

      // Immediately notify parent component
      onSaveMessages(finalMessages);
    } catch (error) {
      const errorMessage = { role: 'assistant', content: 'Error: ' + error.message };
      const errorMessages = [...updatedMessages.slice(0, -1), errorMessage];

      // Update local state
      setMessages(errorMessages);

      // Immediately notify parent component
      onSaveMessages(errorMessages);
    }

    // Scroll to bottom after new message
    setTimeout(scrollToBottom, 100);
  };

  useEffect(() => {
    if (passedPrompt !== '') {
      callChatGPT(passedPrompt);
    }
  }, [passedPrompt]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [gptInputQuery]);

  const wrapInBackticks = (content: string) => {
    return `\`\`\`\n${content}\n\`\`\``;
  };

  const handleSuggestionClick = (suggestion: string, suggestionGroup: string) => {
    setGptInputQuery(suggestion);
  };

  const handleReset = () => {
    setMessages([]);
    onSaveMessages([]);
  };

  const renderMessageContent = (content: string, role: string) => {
    const codeBlockRegex = /```([\s\S]*?)```/g;
    const parts = content.split(codeBlockRegex);

    return (
      <div className={styles[role === 'user' ? 'userMessage' : 'assistantMessage']}>
        {parts.map((part, index) => {
          if (index % 2 === 1) {
            // Code block
            return (
              <SyntaxHighlighter
                key={index}
                language="c"
                style={syntaxStyle}
                className={styles.syntaxHighlighter}
              >
                {part.trim()}
              </SyntaxHighlighter>
            );
          }
          return (
            <span key={index} style={{ whiteSpace: 'pre-wrap' }}>
              {part}
            </span>
          ); // Regular text with role-based styling
        })}
      </div>
    );
  };

  // Existing renderSuggestions function (no changes)
  const renderSuggestions = () => {
    switch (suggestionCategory) {
      case 'code':
        return (
          <>
            {code && (
              <button
                onClick={() =>
                  handleSuggestionClick(
                    `Explain the following code:\n\n${wrapInBackticks(code)}`,
                    'code'
                  )
                }
                className={styles.suggestionButton}
              >
                Explain the code
              </button>
            )}
            {code && (
              <button
                onClick={() =>
                  handleSuggestionClick(
                    `What are some improvements that can be made to the following code:\n\n${wrapInBackticks(code)}`,
                    'code'
                  )
                }
                className={styles.suggestionButton}
              >
                Suggest improvements
              </button>
            )}
            {code && (
              <button
                onClick={() =>
                  handleSuggestionClick(
                    `Are there any bugs in the following code:\n\n${wrapInBackticks(code)}`,
                    'code'
                  )
                }
                className={styles.suggestionButton}
              >
                Find bugs
              </button>
            )}
          </>
        );
      case 'graphs':
        return (
          <>
            {Object.keys(graphs).map(graph => (
              <button
                key={graph}
                onClick={() =>
                  handleSuggestionClick(
                    `Explain the following graph (${graph}):\n\n${wrapInBackticks(graphs[graph])}`,
                    'graph'
                  )
                }
                className={styles.suggestionButton}
              >
                Explain {graph}
              </button>
            ))}
            {code && (
              <button
                onClick={() =>
                  handleSuggestionClick(
                    `Looking at the graphs, can I make any improvements to the code?\n\n${wrapInBackticks(code)}`,
                    'graph'
                  )
                }
                className={styles.suggestionButton}
              >
                Improvements from graphs
              </button>
            )}
            {code && (
              <button
                onClick={() =>
                  handleSuggestionClick(
                    `Are there any dead functions in my code?\n\n${wrapInBackticks(code)}`,
                    'graph'
                  )
                }
                className={styles.suggestionButton}
              >
                Find dead functions
              </button>
            )}
          </>
        );
      case 'terminal':
        return (
          <>
            {terminalOutput !== 'Run the code to see the terminal output here' && (
              <button
                onClick={() =>
                  handleSuggestionClick(
                    `Explain the following terminal output:\n\n${wrapInBackticks(terminalOutput)}`,
                    'terminal'
                  )
                }
                className={styles.suggestionButton}
              >
                Explain terminal output
              </button>
            )}
          </>
        );
      case 'llvm':
        return (
          <>
            {llvmIR !== 'Run the code to see the LLVM IR of your here' && (
              <button
                onClick={() =>
                  handleSuggestionClick(
                    `Explain the following LLVM IR:\n\n${wrapInBackticks(llvmIR)}`,
                    'llvm'
                  )
                }
                className={styles.suggestionButton}
              >
                Explain LLVM IR
              </button>
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.codegptContainer}>
      <div className={styles.stickyHeader}>
        <button onClick={handleReset} className={styles.resetButton}>
          <RefreshIcon />
        </button>
      </div>
      <div className={styles.codegptResponse} ref={responseContainerRef} onScroll={handleScroll}>
        {messages.map((message, index) => (
          <div key={index} className={`${styles.message} ${styles[message.role]}`}>
            {message.role === 'assistant' && <div className={styles.assistantLabel}>CodeGPT</div>}
            {renderMessageContent(message.content, message.role)}
          </div>
        ))}
      </div>

      {/* Scroll to bottom button */}
      {showScrollToBottom && (
        <button
          className={styles.scrollToBottomButton}
          onClick={scrollToBottom}
          title="Jump to bottom"
        >
          <KeyboardDoubleArrowDownIcon />
        </button>
      )}

      <div className={styles.stickyContainer}>
        <div className={styles.suggestionCategory}>
          <button
            onClick={() => setSuggestionCategory('code')}
            className={`${styles.suggestionCategoryButton} ${suggestionCategory === 'code' ? styles.active : ''}`}
          >
            Code
          </button>
          <button
            onClick={() => setSuggestionCategory('graphs')}
            className={`${styles.suggestionCategoryButton} ${suggestionCategory === 'graphs' ? styles.active : ''}`}
          >
            Graphs
          </button>
          <button
            onClick={() => setSuggestionCategory('terminal')}
            className={`${styles.suggestionCategoryButton} ${suggestionCategory === 'terminal' ? styles.active : ''}`}
          >
            Terminal Output
          </button>
          <button
            onClick={() => setSuggestionCategory('llvm')}
            className={`${styles.suggestionCategoryButton} ${suggestionCategory === 'llvm' ? styles.active : ''}`}
          >
            LLVM IR
          </button>
        </div>
        <div className={styles.suggestions}>{renderSuggestions()}</div>
        <div className={styles.codegptInputContainer}>
          <textarea
            ref={textareaRef}
            rows={1}
            placeholder="Enter your query here..."
            value={gptInputQuery}
            onChange={e => setGptInputQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className={styles.codegptTextarea}
          />
          <button
            onClick={handleSubmit}
            className={styles.codegptButton}
            ref={buttonRef}
            title="Submit"
          >
            Enter
          </button>
        </div>
      </div>
    </div>
  );
};

export default CodeGPT;
