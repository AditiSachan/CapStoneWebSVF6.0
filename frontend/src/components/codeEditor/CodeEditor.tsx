import React, { useRef, useEffect, useState, useCallback } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import './styles.css';
import FontSizeMenu from '../fontSizeMenu/FontSizeMenu';

interface CodeEditorProps {
  code: string;
  setCode: (code: string) => void;
  lineNumToHighlight: Set<number>;
  lineNumDetails: { [key: string]: { nodeOrllvm: string[]; colour: string } };
  setCurrCodeLineNum: (lineNum: number) => void;
  codeError: string[];
  setPassedPrompt: (prompt: string) => void;
  externalFontSize?: number;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  setCode,
  lineNumToHighlight,
  lineNumDetails,
  setCurrCodeLineNum,
  codeError,
  setPassedPrompt,
  externalFontSize,
}) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [fontSize, setFontSize] = useState(16);
  useState<monaco.editor.IEditorDecorationsCollection | null>(null);
  const decorationsRef = useRef(null);
  const [editorKey, setEditorKey] = useState(0); // State variable for the key

  // This ref is used to ensure that only one Ask codeGPT action appears for quickfix
  // We clear it before adding new quickFix ask codeGPT action
  const codeActionProviderRef = useRef<monaco.IDisposable | null>(null);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    const model = monaco.editor.createModel(code, 'c', monaco.Uri.parse('inmemory://test_script'));
    editor.setModel(model);
    decorationsRef.current = editor.createDecorationsCollection();
    editor.updateOptions({
      fontSize: externalFontSize ?? fontSize,
      renderValidationDecorations: 'on',
    });
    monaco.languages.register({ id: 'c' });

    monaco.languages.setLanguageConfiguration('c', {});

    editor.onDidChangeModelContent(() => {
      const value = editor.getValue();
      setCode(value);
    });

    // Sets the current line number when the cursor position changes
    editor.onDidChangeCursorPosition((event) => {
      const lineNum = event.position.lineNumber;
      setCurrCodeLineNum(lineNum);
    });
    const markers = applyMarkers();
    monaco.editor.setModelMarkers(model, 'c', markers);

    // Register the ask code gpt command
    monaco.editor.registerCommand('askCodeGPTCommand', (_accessor, ...args) => {
      const [uri, range, problemMessage, lineCode] = args;
      askCodeGPT(uri, range, problemMessage, lineCode);
    });

    // Dispose of the previous code action provider if it exists
    // This prevents adding multiple ask codeGPT action into quick fix
    if (codeActionProviderRef.current) {
      codeActionProviderRef.current.dispose();
    }

    codeActionProviderRef.current = monaco.languages.registerCodeActionProvider('c', {
      provideCodeActions: (model, range) => {
        const markers = monaco.editor.getModelMarkers({ resource: model.uri });
        const relevantMarker = markers.find(
          (marker) => marker.startLineNumber === range.startLineNumber
        );

        if (!relevantMarker) {
          return { actions: [], dispose: () => {} };
        }
        const quickFix = {
          title: 'Ask CodeGPT',
          diagnostics: [relevantMarker],
          kind: 'quickfix',
          command: {
            id: 'askCodeGPTCommand',
            title: 'Ask CodeGPT',
            arguments: [
              model.uri,
              range,
              relevantMarker.message,
              model.getLineContent(relevantMarker.startLineNumber),
            ], // Pass message and line code
          },
          isPreferred: true,
        };

        return {
          actions: [quickFix],
          dispose: () => {},
        };
      },
    });
  };

  const askCodeGPT = (
    _uri: monaco.Uri,
    _range: monaco.Range,
    problemMessage: string,
    lineCode: string
  ) => {
    // Additional logic for handling the problem message and code line
    let prompt = '```' + code + '```';
    if (problemMessage.includes('CLANG:')) {
      prompt =
        prompt +
        '\n In my code, I received an error message of "' +
        problemMessage +
        '" for the line of code ```' +
        lineCode +
        ' ```when compiling my code with clang. ';
    } else if (problemMessage.includes('MEMORY LEAK:')) {
      prompt =
        prompt +
        '\n In my code, I received a memory leak error message of "' +
        problemMessage +
        '" for the line of code ```' +
        lineCode +
        '```. ';
    } else if (problemMessage.includes('BUFFER OVERFLOW:')) {
      prompt =
        prompt +
        '\n In my code, I received a buffer overflow message of "' +
        problemMessage +
        '" for the line of code ```' +
        lineCode +
        '```. ';
    } else {
      prompt =
        prompt +
        '\n In my code, I received an error message of "' +
        problemMessage +
        '" for the line of code ``` ' +
        lineCode +
        '```. ';
    }
    prompt = prompt + 'Can you explain why I have this error and how to solve this issue?';
    setPassedPrompt(prompt);
  };
  // Adds the red squigly line on the code editor indicating an error or warning to line of code
  const applyMarkers = useCallback((): monaco.editor.IMarkerData[] => {
    monaco.languages.register({ id: 'c' });

    monaco.languages.setLanguageConfiguration('c', {
      // Ensure C language supports diagnostics markers
    });
    if (editorRef.current && codeError.length !== 0) {
      const model = editorRef.current.getModel();
      // Clear any previous markers
      monaco.editor.setModelMarkers(model, 'c', []);

      const lnRegexcl = /ln:\s*(\d+)\s*cl:\s*(\d+)/;
      const quotedRegex = /"ln":\s*(\d+),\s*"cl":\s*(\d+)/;
      const clangRegex = /example.c:(\d+):(\d+)/;
      const markers: monaco.editor.IMarkerData[] = [];
      codeError.map((error) => {
        let match: string[];
        let lnNum = 0;
        let clNum = 1;
        match = error.match(lnRegexcl);
        if (match) {
          lnNum = parseInt(match[1], 10);
          clNum = parseInt(match[2], 10);
        }

        match = error.match(quotedRegex);
        if (match) {
          lnNum = parseInt(match[1], 10);
          clNum = parseInt(match[2], 10);
        }
        match = error.match(clangRegex);
        if (match) {
          lnNum = parseInt(match[1], 10);
          clNum = parseInt(match[2], 10);
        }

        if (lnNum !== 0 && model) {
          const lineCount = model.getLineCount();
          if (lnNum < 1 || lnNum > lineCount) {
            return; // Skip invalid line numbers
          }
          const lineLength = model.getLineLength(lnNum);
          const safeStartColumn = Math.max(1, Math.min(clNum, lineLength));
          const safeEndColumn = lineLength + 1;
          markers.push({
            code: null,
            source: 'c',
            startLineNumber: lnNum,
            startColumn: safeStartColumn,
            endLineNumber: lnNum,
            endColumn: safeEndColumn,
            message: error,
            severity: monaco.MarkerSeverity.Error,
          });
        }
      });
      return markers;
    }
    return [];
  }, [codeError]);

  useEffect(() => {
    if (editorRef.current) {
      const model = editorRef.current.getModel();
      if (model) {
        const markers = applyMarkers();
        monaco.editor.setModelMarkers(model, 'c', markers);
        setEditorKey((prevKey) => prevKey + 1);
      }
    }
  }, [codeError, applyMarkers]);

  // Used to detect for any changes in code
  // This is needed for when lz string compression calls setcode
  useEffect(() => {
    if (editorRef.current) {
      const model = editorRef.current.getModel();
      if (model && model.getValue() !== code) {
        model.setValue(code);
        setEditorKey((prevKey) => prevKey + 1);
      }
    }
  }, [code]);

  useEffect(() => {
    if (decorationsRef !== null && decorationsRef.current !== null) {
      const model = editorRef.current?.getModel();
      const lineCount = model?.getLineCount() ?? 0;
      const newDecorations = [];

      for (const lineNum in lineNumDetails) {
        const colour = lineNumDetails[lineNum]['colour'].slice(1).toLowerCase();
        let decoration = {};
        const parsedLineNum = parseInt(lineNum);
        if (!Number.isFinite(parsedLineNum) || parsedLineNum < 1 || parsedLineNum > lineCount) {
          continue;
        }
        if (lineNumToHighlight.has(parsedLineNum)) {
          decoration = {
            range: new monaco.Range(parsedLineNum, 1, parsedLineNum, 1),
            options: {
              isWholeLine: true,
              inlineClassName: `line-decoration-text-${colour}`,
            },
          };
          if (editorRef.current) {
            editorRef.current.revealLine(parsedLineNum);
          }
        } else {
          decoration = {
            range: new monaco.Range(parsedLineNum, 1, parsedLineNum, 1),
            options: {
              isWholeLine: true,
              inlineClassName: `line-decoration-${colour}`,
            },
          };
        }

        newDecorations.push(decoration);
      }
      decorationsRef.current.set(newDecorations);
    }
  }, [lineNumToHighlight, lineNumDetails]);

  useEffect(() => {
    if (decorationsRef !== null && decorationsRef.current !== null) {
      const model = editorRef.current?.getModel();
      const lineCount = model?.getLineCount() ?? 0;
      const newDecorations = [];

      for (const lineNum in lineNumDetails) {
        const colour = lineNumDetails[lineNum]['colour'].slice(1).toLowerCase();
        const parsedLineNum = parseInt(lineNum);
        if (!Number.isFinite(parsedLineNum) || parsedLineNum < 1 || parsedLineNum > lineCount) {
          continue;
        }
        const decoration = {
          range: new monaco.Range(parsedLineNum, 1, parsedLineNum, 1),
          options: {
            isWholeLine: true,
            inlineClassName: `line-decoration-${colour}`,
          },
        };
        newDecorations.push(decoration);
      }
      decorationsRef.current.set(newDecorations);
    }
  }, [lineNumDetails]);

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .line-decoration-d9f0e9 { background: #d9f0e9; }
      .line-decoration-ffffe3 { background: #ffffe3; }
      .line-decoration-e9e8f1 { background: #e9e8f1; }
      .line-decoration-ffd6d2 { background: #ffd6d2; }
      .line-decoration-d4e5ee { background: #d4e5ee; }
      .line-decoration-d5e4ef { background: #d5e4ef; }
      .line-decoration-ffe5c9 { background: #ffe5c9; }
      .line-decoration-e5f4cd { background: #e5f4cd; }
      .line-decoration-f2f2f0 { background: #f2f2f0; }
      .line-decoration-e9d6e7 { background: #e9d6e7; }
      .line-decoration-edf8ea { background: #edf8ea; }
      .line-decoration-fff8cf { background: #fff8cf; }
      .text-color { color: red; }
      .line-decoration-text-d9f0e9 { background: #d9f0e9; color: red !important; }
      .line-decoration-text-ffffe3 { background: #ffffe3; color: red !important; }
      .line-decoration-text-e9e8f1 { background: #e9e8f1; color: red !important; }
      .line-decoration-text-ffd6d2 { background: #ffd6d2; color: red !important; }
      .line-decoration-text-d4e5ee { background: #d4e5ee; color: red !important; }
      .line-decoration-text-d5e4ef { background: #d5e4ef; color: red !important; }
      .line-decoration-text-ffe5c9 { background: #ffe5c9; color: red !important; }
      .line-decoration-text-e5f4cd { background: #e5f4cd; color: red !important; }
      .line-decoration-text-f2f2f0 { background: #f2f2f0; color: red !important; }
      .line-decoration-text-e9d6e7 { background: #e9d6e7; color: red !important;}
      .line-decoration-text-edf8ea { background: #edf8ea; color: red !important;}
      .line-decoration-text-fff8cf { background: #fff8cf; color: red !important;}
    `;
    document.head.appendChild(style);
  }, []);

  const [theme, setTheme] = useState<'vs-light' | 'vs-dark'>('vs-light'); // Theme state for Monaco Editor

  // Effect to handle dynamic theme changes based on the `data-theme` attribute
  useEffect(() => {
    const updateTheme = () => {
      const currentTheme =
        document.documentElement.getAttribute('data-theme') === 'dark' ? 'vs-dark' : 'vs-light';
      setTheme(currentTheme);
    };

    // Initial theme setting based on the attribute
    updateTheme();

    // Listen for changes to the data-theme attribute
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect(); // Cleanup observer on unmount
  }, []);

  return (
    <>
      <div>
        <div id="codeEditor-fontSize-container">
          <FontSizeMenu fontSize={externalFontSize ?? fontSize} setFontSize={setFontSize} />
        </div>
        <Editor
          key={editorKey}
          height="90vh"
          language="c"
          theme={theme}
          value={code}
          onMount={handleEditorDidMount}
          options={{ fontSize: externalFontSize ?? fontSize }}
        />
      </div>
    </>
  );
};

export default CodeEditor;
