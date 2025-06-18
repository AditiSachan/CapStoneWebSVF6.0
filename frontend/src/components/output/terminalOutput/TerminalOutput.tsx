import React, { useRef, useEffect, useState } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import FontSizeMenu from '../../fontSizeMenu/FontSizeMenu';
import './terminalOutput.css';
interface TerminalOutputProps {
  terminalOutputString: string;
}

const TerminalOutput: React.FC<TerminalOutputProps> = ({ terminalOutputString }) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [decorations, setDecorations] = useState<string[]>([]);
  const [fontSize, setFontSize] = useState(16);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    editor.updateOptions({ readOnly: true });

    editor.onDidChangeModelContent(() => {
      const value = editor.getValue();
    });
  };

  const [theme, setTheme] = useState('vs-light'); // Default to light mode theme

  // Detect theme change based on the "data-theme" attribute
  useEffect(() => {
    const updateTheme = () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      setTheme(currentTheme === 'dark' ? 'vs-dark' : 'vs-light');
    };

    // Initial theme setting
    updateTheme();

    // Listen for theme changes
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div>
        <div id="terminalOutput-fontSize-container">
          <FontSizeMenu fontSize={fontSize} setFontSize={setFontSize} />
        </div>
        <Editor
          height="90vh"
          language="plaintext"
          theme={theme}
          value={terminalOutputString}
          onMount={handleEditorDidMount}
          options={{ fontSize: fontSize }}
        />
      </div>
    </>
  );
};

export default TerminalOutput;
