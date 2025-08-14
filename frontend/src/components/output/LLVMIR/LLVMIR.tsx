/* eslint-disable react-refresh/only-export-components */
import React, { useRef, useEffect, useState } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import { llvmIRLanguage } from './llvmIRLanguage';
import FontSizeMenu from '../../fontSizeMenu/FontSizeMenu';
import './llvmir.css';

interface LLVMIRProps {
  LLVMIRString: string;
  externalFontSize?: number;
}

const LLVMIR: React.FC<LLVMIRProps> = ({ LLVMIRString, externalFontSize }) => {
  const [fontSize, setFontSize] = useState(16);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    editor.updateOptions({ readOnly: true });
    monaco.languages.register({ id: 'llvm-ir' });
    monaco.languages.setMonarchTokensProvider('llvm-ir', llvmIRLanguage);
  };

  const [theme, setTheme] = useState('vs-light'); // Default to light theme
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
        <div id="llvmir-fontSize-container">
          <FontSizeMenu fontSize={fontSize} setFontSize={setFontSize} />
        </div>
        <Editor
          height="90vh"
          language="llvm-ir"
          theme={theme}
          value={LLVMIRString}
          onMount={handleEditorDidMount}
          options={{ fontSize: externalFontSize ?? fontSize }}
        />
      </div>
    </>
  );
};

export default LLVMIR;
