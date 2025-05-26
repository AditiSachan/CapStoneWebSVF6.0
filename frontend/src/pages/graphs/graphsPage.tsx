import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CodeEditor from '../../components/codeEditor/CodeEditor';
import DotGraphViewer from '../../components/output/dotGraphViewer/DotGraphViewer';
import SubmitCodeBar from '../../components/submitCode/submitCodeBar/SubmitCodeBar';
import OutputMenuBar from '../../components/output/outputMenuBar/OutputMenuBar';
import TerminalOutput from '../../components/output/terminalOutput/TerminalOutput';
import CodeGPT from '../../components/output/codeGPT/CodeGPT';
import LLVMIR from '../../components/output/LLVMIR/LLVMIR';
import submitCodeFetch from '../../api.ts';
import NavBar from '../../components/navBar/Navbar.tsx';
import SettingsModal from '../../components/settingsModal/SettingsModal.tsx';
import './graphsPage.css';
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';
import ShareLZSettingsModal from '../../components/shareLZSettingsModal/shareLZSettingsModal.tsx';
import SessionsSidebar from '../../components/multiSession/sessionsSidebar/sessionsSidebar.tsx';
import SessionManager, { Session}  from '../../components/multiSession/sessionManager.ts';
import { Share } from '@mui/icons-material';

type OutputType = 'Graph' | 'CodeGPT' | 'LLVMIR' | 'Terminal Output';

interface DecompressedSettings {
  code?: string;
  selectedCompileOptions?: compileOption[];
  selectedExecutableOptions?: string[];
  sessionId?: string;
}
interface compileOption {
  value: string;
  label: string;
}


const compileOptions = [
  { value: '-g', label: '-g' },
  { value: '-c', label: '-c' },
  { value: '-S', label: '-S' },
  { value: '-fno-discard-value-names', label: '-fno-discard-value-names' },
  { value: '-emit-llvm', label: '-emit-llvm' },
  // { value: '-pass-exit-codes', label: '-pass-exit-codes' }, // This argument is causing an error in clang
  { value: '-E', label: '-E' },
  { value: '-v', label: '-v' },
  { value: '-pipe', label: '-pipe' },
  { value: '--help', label: '--help' },
  // { value: '-fcanon-prefix-map', label: '-fcanon-prefix-map' }, // This argument is causing an error in clang
];

const executableOptions = [
  { value: 'mta', label: 'mta (Multi-Thread Analysis)' },
  { value: 'saber', label: 'saber (Memory Leak Detector)' },
  { value: 'ae -overflow', label: 'ae (Buffer Overflow Detector)' },
];

function GraphsPage() {
  // Add session management state
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { sessionId: routeSessionId } = useParams();
  const navigate = useNavigate();
  
  // Load the session specified in the URL or default to the first session
  useEffect(() => {
    const loadedSessions = SessionManager.getSessions();
    setSessions(loadedSessions);
    
    let sessionToLoad;
    
    if (routeSessionId) {
      // Try to load the session from the URL parameter
      sessionToLoad = SessionManager.getSession(routeSessionId);
      if (sessionToLoad) {
        setCurrentSessionId(routeSessionId);
        loadSession(sessionToLoad);
      } else {
        // If session doesn't exist, navigate to default route
        navigate('/', { replace: true });
      }
    } else if (loadedSessions.length > 0) {
      // No session ID in URL, load the first session
      sessionToLoad = loadedSessions[0];
      setCurrentSessionId(sessionToLoad.id);
      loadSession(sessionToLoad);
    } else {
      // No sessions exist, create a new one
      const newSession = SessionManager.createSession();
      setSessions([newSession]);
      setCurrentSessionId(newSession.id);
      loadSession(newSession);
    }
  }, [routeSessionId, navigate]);

  const inlineStyles = {
    container: {
      display: 'flex',
    },
  };

  const [isCodeLeft, setIsCodeLeft] = useState(true);
  const [draggedElement, setDraggedElement] = useState<string | null>(null);
  const [draggedTab, setDraggedTab] = useState<OutputType | null>(null);
  
  // Add new state for resizable panes
  const [leftWidth, setLeftWidth] = useState(50); // percentage
  const containerRef = useRef<HTMLDivElement>(null);
  const resizerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef<boolean>(false);
  
  // Handling resize functionality
  const startResize = (e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingRef.current = true;
    
    // Add resizing class to container
    if (containerRef.current) {
      containerRef.current.classList.add('resizing');
    }
    
    // Add active class to resizer
    if (resizerRef.current) {
      resizerRef.current.classList.add('resizing');
    }
    
    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', stopResize);
  };
 
  const resize = (e: MouseEvent) => {
    if (!isDraggingRef.current || !containerRef.current) return;
    
    // Get container dimensions
    const containerRect = containerRef.current.getBoundingClientRect();
    const containerWidth = containerRect.width;
    
    // Calculate percentage with respect to the container
    let newLeftWidth = ((e.clientX - containerRect.left) / containerWidth) * 100;
    
    // Limit the minimum size of either pane to 20%
    newLeftWidth = Math.max(20, Math.min(80, newLeftWidth));
    
    // Set the state for the left container width
    setLeftWidth(newLeftWidth);
    
    // Important: Directly update container widths during drag for smoother experience
    const codeContainer = document.getElementById('graph-page-code-container');
    const outputContainer = document.getElementById('graph-page-output-container');
    
    if (codeContainer && outputContainer) {
      if (isCodeLeft) {
        codeContainer.style.width = `${newLeftWidth}%`;
        outputContainer.style.width = `${100 - newLeftWidth}%`;
      } else {
        codeContainer.style.width = `${100 - newLeftWidth}%`;
        outputContainer.style.width = `${newLeftWidth}%`;
      }
    }
    
    // Update resizer position
    if (resizerRef.current) {
      resizerRef.current.style.left = `calc(${newLeftWidth}% - 4px)`;
    }
  };

  const stopResize = () => {
    isDraggingRef.current = false;
    
    // Remove resizing class from container
    if (containerRef.current) {
      containerRef.current.classList.remove('resizing');
    }
    
    // Remove active class from resizer
    if (resizerRef.current) {
      resizerRef.current.classList.remove('resizing');
    }
    
    document.removeEventListener('mousemove', resize);
    document.removeEventListener('mouseup', stopResize);
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, element: string | OutputType) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("draggedItem", String(element));
    
    if (typeof element === "string") {
        setDraggedElement(element);
    } else {
        setDraggedTab(element);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add("drag-over");
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove("drag-over");
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove("drag-over");

    const target = e.currentTarget.id;
    const draggedItem = e.dataTransfer.getData("draggedItem");

    if (draggedElement && draggedElement !== target) {
        if ((draggedElement === "code" && target === "graph-page-output-container") || 
            (draggedElement === "output" && target === "graph-page-code-container")) {
            setIsCodeLeft(!isCodeLeft);
        }
        setDraggedElement(null);
    } else if (draggedTab) {
        setTabPositions((prev) => ({
            ...prev,
            [draggedTab]: target === 'third-dropzone' ? 'third' : 'main',
        }));
        setDraggedTab(null);
    }
  };

  const [codeError, setCodeError] = useState([]);
  const [currCodeLineNum, setCurrCodeLineNum] = useState(0);
  const [currentOutput, setCurrentOutput] = useState<OutputType>('Graph');
  const [selectedCompileOptions, setSelectedCompileOptions] = useState([compileOptions[0], compileOptions[1], compileOptions[2], compileOptions[3], compileOptions[4]]);
  const [selectedExecutableOptions, setSelectedExecutableOptions] = useState([]);

  const [lineNumDetails, setLineNumDetails] = useState<{ [key: string]: { nodeOrllvm: string[], colour: string } }>({});
  const [code, setCode] = useState('');
  const [lineNumToHighlight, setlineNumToHighlight] = useState<Set<number>>(new Set());
  const [terminalOutputString, setTerminalOutputString] = useState('Run the code to see the terminal output here');
  const [llvmIRString, setllvmIRString] = useState('Run the code to see the LLVM IR of your here');
  const [graphs, setGraphs] = useState({});
  const [savedMessages, setSavedMessages] = useState<{ role: string, content: string }[]>([]);
  const [passedPrompt, setPassedPrompt] = useState('');

  const [tabPositions, setTabPositions] = useState<Record<OutputType, string>>({
    Graph: 'main',
    'Terminal Output': 'main',
    CodeGPT: 'main',
    LLVMIR: 'main',
  });

  // Session Management Functions
  const loadSessions = () => {
    const loadedSessions = SessionManager.getSessions();
    setSessions(loadedSessions);
    
    if (loadedSessions.length > 0) {
      setCurrentSessionId(loadedSessions[0].id);
      loadSession(loadedSessions[0]);
    } else {
      // Create a new session if none exist
      const newSession = SessionManager.createSession();
      setSessions([newSession]);
      setCurrentSessionId(newSession.id);
      loadSession(newSession);
    }
  };

  const loadSession = (session: Session) => {
    setCode(session.code);
    setSelectedCompileOptions(session.selectedCompileOptions);
    setSelectedExecutableOptions(session.selectedExecutableOptions);
    setLineNumDetails(session.lineNumDetails);
    setGraphs(session.graphs);
    setTerminalOutputString(session.terminalOutput);
    setllvmIRString(session.llvmIR);
    setSavedMessages(session.savedMessages || []); // Add this line
    setCurrentOutput(session.currentOutput || 'Graph');
    setlineNumToHighlight(new Set(session.lineNumToHighlight || []));
    setTabPositions(session.tabPositions || {
      Graph: 'main',
      'Terminal Output': 'main',
      CodeGPT: 'main',
      LLVMIR: 'main',
  });
  };

  const handleSaveMessages = (newMessages: { role: string, content: string }[]) => {
    setSavedMessages(newMessages);
    // Optionally save the session immediately to ensure messages are persisted
    if (currentSessionId) {
      SessionManager.updateSession(currentSessionId, {
        savedMessages: newMessages
      });
    }
  };


const handleSessionSelect = (sessionId: string) => {
  // Save current session
  saveCurrentSession();
  
  // Navigate to the new session URL
  navigate(`/session/${sessionId}`, { replace: true });
};


  const handleNewSession = () => {
    // Save current session before creating a new one
    saveCurrentSession();
    
    const newSession = SessionManager.createSession();
    setSessions([newSession, ...sessions]);
    setCurrentSessionId(newSession.id);
    loadSession(newSession);
  };

  const handleRenameSession = (sessionId: string, newTitle: string) => {
    const updatedSession = SessionManager.updateSession(sessionId, { title: newTitle });
    if (updatedSession) {
      setSessions(prevSessions => 
        prevSessions.map(s => s.id === sessionId ? updatedSession : s)
      );
    }
  };

  const handleDeleteSession = (sessionId: string) => {
    if (sessions.length <= 1) {
      // Don't delete the last session
      alert("Cannot delete the last project. Create a new one first.");
      return;
    }
    
    SessionManager.deleteSession(sessionId);
    const updatedSessions = sessions.filter(s => s.id !== sessionId);
    setSessions(updatedSessions);
    
    // If the current session is deleted, load the first available session
    if (sessionId === currentSessionId && updatedSessions.length > 0) {
      setCurrentSessionId(updatedSessions[0].id);
      loadSession(updatedSessions[0]);
    }
  };

  const saveCurrentSession = () => {
    if (currentSessionId) {
      SessionManager.updateSession(currentSessionId, {
        code,
        selectedCompileOptions,
        selectedExecutableOptions,
        lineNumDetails,
        graphs,
        terminalOutput: terminalOutputString,
        llvmIR: llvmIRString,
        savedMessages, // Add this line,
        currentOutput,
        lineNumToHighlight: Array.from(lineNumToHighlight),
        tabPositions,
      });
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Initial load of sessions
  useEffect(() => {
    loadSessions();
    
    // Set up interval to autosave current session
    const intervalId = setInterval(() => {
      saveCurrentSession();
    }, 30000); // Auto-save every 30 seconds
    
    return () => clearInterval(intervalId);
  }, []);

  // Save session when code or options change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveCurrentSession();
    }, 1000);
    
    return () => clearTimeout(timeoutId);
  }, [code, selectedCompileOptions, selectedExecutableOptions]);

  // In your renderComponent function in GraphsPage.tsx
const renderComponent = (tab: OutputType) => {
  switch (currentOutput) {
    case 'Graph':
      return (
        <DotGraphViewer
          key={`graph-${currentSessionId}`} // Add this key
          dotGraphString={graphs['call'] || ''}
          lineNumToHighlight={lineNumToHighlight}
          setlineNumToHighlight={setlineNumToHighlight}
          graphObj={graphs}
          setLineNumDetails={setLineNumDetails}
          lineNumDetails={lineNumDetails}
          currCodeLineNum={currCodeLineNum}
          code={code}
           setPassedPrompt={setPassedPrompt}
        />
      );
    case 'Terminal Output':
      return <TerminalOutput key={`terminal-${currentSessionId}`} terminalOutputString={terminalOutputString} />;
    case 'CodeGPT':
      return (
        <CodeGPT
          key={`codegpt-${currentSessionId}`} // Add this key to force re-render
          code={code}
          graphs={graphs}
          terminalOutput={terminalOutputString}
          llvmIR={llvmIRString}
          savedMessages={savedMessages}
          onSaveMessages={setSavedMessages}
          passedPrompt={passedPrompt}
        />
      );
    case 'LLVMIR':
      return <LLVMIR key={`llvmir-${currentSessionId}`} LLVMIRString={llvmIRString} code={code} lineNumDetails={lineNumDetails} setLineNumDetails={setLineNumDetails}/>;
    default:
      return null;
  }
};

  useEffect(() => {
    if (passedPrompt !== '') {
      setCurrentOutput('CodeGPT');
      renderComponent('CodeGPT');

       // Reset passedPrompt after it's been used
    setTimeout(() => {
      setPassedPrompt('');
    }, 100);
    }
  }, [passedPrompt]);

  const submitCode = async () => {
    const selectedCompileOptionString = selectedCompileOptions.map(option => option.value).join(' ');
    const selectedExecutableOptionsList = selectedExecutableOptions.map(option => option.value);
    console.log('selected execitable options: ', selectedExecutableOptionsList);

    const response = await submitCodeFetch(code, selectedCompileOptionString, selectedExecutableOptionsList);
    console.log('response from submit', response);
    if ('name' in response) {
      if (response.name == 'Resultant Graphs') {
        const respGraphs = response.graphs;
        const graphObj = {};
        respGraphs.forEach(graph => {
          graphObj[graph.name] = graph.graph;
        });
        setGraphs(graphObj);
        setllvmIRString(response.llvm);
        setTerminalOutputString(response.output);
        console.log(response.error);
        setCodeError(formatErrorLogs(response.error));
        
        // Save session after code submission
        saveCurrentSession();
      } else if (response.name == 'Clang Error') {
        setTerminalOutputString(response.error);
        setCodeError(formatClangErrors(response.error));
      }
    }
  };

  // It formats the error messages it receives from clang
  // Function is used if it did not pass clang
  const formatClangErrors = (stdErr: string) => {
    const errorList = stdErr.split('\n');
    console.log('formatClangErrors',errorList);
    let errorMsg = '';
    const regex = /example.c:(\d+):(\d+)/;
    let formattedErrors = [];
    // The last element of the array is sentence on how many errors and warnings were generated
    for (let i = 0; i < errorList.length - 1; i++) {
      let match = errorList[i].match(regex);
      if (match) {
        console.log('match', errorList[i]);
        if (errorMsg !== '') {
          formattedErrors.push(errorMsg);
        }
        errorMsg = 'CLANG:\n' + errorList[i];
      } else {
        errorMsg = errorMsg + '\n' +errorList[i];
      }
    }
    if (errorMsg !== '') {
      formattedErrors.push(errorMsg);
    }
    console.log('formattedErrors', formattedErrors);

    return formattedErrors;
  };

  // It formats the Error messages it receives
  // This is used when the code is compiled by clang
  const formatErrorLogs = (stdErr: string) => {
    console.log('std err is ', stdErr);
    const errorList = stdErr.split('\n');
    console.log('errorList is ', errorList)
    let formattedErrors = [];
     let i = 0;
    let numOverflow = 0;
    while (i < errorList.length) {
      if (errorList[i].includes('NeverFree')) {
        formattedErrors.push('MEMORY LEAK: ' + errorList[i]);
      } else if (errorList[i].includes('######################Buffer Overflow')) {
        numOverflow = parseInt(errorList[i].match(/\d+/)[0], 10);
      } else if (errorList[i].includes("---------------------------------------------") && numOverflow > 0) {
        formattedErrors.push("BUFFER OVERFLOW: " + errorList[i+1] + errorList[i+2]);
        i = i + 2;
        numOverflow--;
      }

      i++;
    }
    return formattedErrors;
  };

  const resetDefault = () => {
    setSelectedCompileOptions([compileOptions[0], compileOptions[1], compileOptions[2], compileOptions[3], compileOptions[4]]);
    setSelectedExecutableOptions([]);
  };

  const [openSettings, setOpenSettings] = React.useState(false);
  const handleOpenSettings = () => setOpenSettings(true);
  const handleCloseSettings = () => setOpenSettings(false);
  const [codeFontSize, setCodeFontSize] = useState(16);
  
  // const createLZStringUrl = () => {
  //   const url = window.location.href;
  //   const currRoute = url.split('?')[0];
  //   const savedSettings = {
  //     code: code,
  //     selectedCompileOptions: selectedCompileOptions,
  //     selectedExecutableOptions: selectedExecutableOptions,
  //   };
  //   const compressed = compressToEncodedURIComponent(JSON.stringify(savedSettings));
  //   return currRoute + '?data=' + compressed;
  // };

  const createLZStringUrl = () => {
    // Get the base URL of your application
    const baseUrl = window.location.origin;
    
    // Create a shareable settings object for the current session only
    const savedSettings: DecompressedSettings = {
      sessionId: currentSessionId // Only include the session ID
    };
    
    // Compress the settings
    const compressed = compressToEncodedURIComponent(JSON.stringify(savedSettings));
    
    // Return a URL that points directly to the session
    return `${baseUrl}/session/${currentSessionId}?data=${compressed}`;
  };


  // Add this to your useEffect that handles URL parameters
useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  let compressedFromURL = urlParams.get('data');
  
  if (compressedFromURL) {
    let decompressedSettings: DecompressedSettings = {};
    
    try {
      if (compressedFromURL.startsWith('${')) {
        compressedFromURL = compressedFromURL.replace('${', '');
      }
      
      const decompressedSettingsString = decompressFromEncodedURIComponent(compressedFromURL);
      decompressedSettings = JSON.parse(decompressedSettingsString);
      
      console.log('Decompressed settings:', decompressedSettings);
      
      // Check if there's a session ID in the URL data
      if (decompressedSettings.sessionId) {
        // Try to load the specified session
        const session = SessionManager.getSession(decompressedSettings.sessionId);
        
        if (session) {
          // If the session exists, load it
          setCurrentSessionId(decompressedSettings.sessionId);
          loadSession(session);
          // Navigate to the session URL to maintain consistent state
          navigate(`/session/${decompressedSettings.sessionId}`, { replace: true });
          return; // Exit early since we've loaded a session
        }
      }
      
      // If no session ID or session not found, update the current session with the URL data
      if (decompressedSettings.code) {
        setCode(decompressedSettings.code);
      }
      
      if (decompressedSettings.selectedCompileOptions) {
        setSelectedCompileOptions(decompressedSettings.selectedCompileOptions);
      }
      
      if (decompressedSettings.selectedExecutableOptions) {
        setSelectedExecutableOptions(decompressedSettings.selectedExecutableOptions);
      }
      
      // Save these changes to the current session
      if (currentSessionId) {
        saveCurrentSession();
      }
    } catch (error) {
      console.error('Error parsing URL data:', error);
    }
  }
}, []);

useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  let compressedFromURL = urlParams.get('data');
  
  if (compressedFromURL) {
    try {
      if (compressedFromURL.startsWith('${')) {
        compressedFromURL = compressedFromURL.replace('${', '');
      }
      
      const decompressedSettingsString = decompressFromEncodedURIComponent(compressedFromURL);
      const decompressedSettings: DecompressedSettings = JSON.parse(decompressedSettingsString);
      
      console.log('Decompressed settings:', decompressedSettings);
      
      // If the URL contains a session ID, load that specific session
      if (decompressedSettings.sessionId) {
        const sessionId = decompressedSettings.sessionId;
        const session = SessionManager.getSession(sessionId);
        
        if (session) {
          // If we found the session, set it as current and load it
          setCurrentSessionId(sessionId);
          loadSession(session);
          
          // Update the URL to point to this session without the query parameter
          const newUrl = `${window.location.origin}/session/${sessionId}`;
          window.history.replaceState({}, '', newUrl);
        } else {
          // Session not found, load the first available session
          const availableSessions = SessionManager.getSessions();
          if (availableSessions.length > 0) {
            setCurrentSessionId(availableSessions[0].id);
            loadSession(availableSessions[0]);
            // Update URL
            const newUrl = `${window.location.origin}/session/${availableSessions[0].id}`;
            window.history.replaceState({}, '', newUrl);
          }
        }
      } else {
        // If no session ID in URL but there are other settings, apply them to current session
        if (decompressedSettings.code || 
            decompressedSettings.selectedCompileOptions || 
            decompressedSettings.selectedExecutableOptions) {
          
          if (decompressedSettings.code) {
            setCode(decompressedSettings.code);
          }
          
          if (decompressedSettings.selectedCompileOptions) {
            setSelectedCompileOptions(decompressedSettings.selectedCompileOptions);
          }
          
          if (decompressedSettings.selectedExecutableOptions) {
            setSelectedExecutableOptions(decompressedSettings.selectedExecutableOptions);
          }
          
          // Save these changes to current session
          if (currentSessionId) {
            saveCurrentSession();
          }
        }
      }
    } catch (error) {
      console.error('Error parsing URL data:', error);
    }
  }
}, []);
  
  const [openShareModal, setOpenShareModal] = React.useState(false);
  const handleOpenShareModal = () => setOpenShareModal(true);
  const handleCloseShareModal = () => setOpenShareModal(false);
  const [shareLink, setShareLink] = useState('');

  useEffect(() => {
    if (openShareModal === true) {
      setShareLink(createLZStringUrl());
    }
  }, [openShareModal]);

  const handleShareSession = (sessionId: string) => {
    // First ensure all sessions are saved
    saveCurrentSession();
    
    // Get the base URL of your application
    const baseUrl = window.location.origin;
    
    // Create a shareable settings object for this specific session
    const shareSettings: DecompressedSettings = {
      sessionId: sessionId // Only include the session ID
    };
    
    // Compress the settings
    const compressed = compressToEncodedURIComponent(JSON.stringify(shareSettings));
    
    // Create a URL that points directly to this session
    setShareLink(`${baseUrl}/session/${sessionId}?data=${compressed}`);
    handleOpenShareModal();
  };

  return (
    <>
      <ShareLZSettingsModal open={openShareModal}
        handleClose={handleCloseShareModal}
        shareLink={shareLink}
      />
      <NavBar 
        openShare={handleOpenShareModal}
      />
      <div className="app-layout">
        {/* Sessions Sidebar */}
        <SessionsSidebar 
          sessions={sessions}
          currentSessionId={currentSessionId}
          onSessionSelect={handleSessionSelect}
          onNewSession={handleNewSession}
          onRenameSession={handleRenameSession}
          onDeleteSession={handleDeleteSession}
          onShareSession={handleShareSession}
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />
        
        <div id='graph-page-container' ref={containerRef} style={inlineStyles.container}>
          <div
            id="graph-page-code-container"
            draggable
            onDragStart={(e) => handleDragStart(e, "code")}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={isCodeLeft ? 'left' : 'right'}
            style={{ width: `${isCodeLeft ? leftWidth : 100 - leftWidth}%` }}

          >
            <SubmitCodeBar
              submitEvent={submitCode}
              resetCompileOptions={resetDefault}
              compileOptions={compileOptions}
              selectedCompileOptions={selectedCompileOptions}
              setSelectedCompileOptions={setSelectedCompileOptions}
              executableOptions={executableOptions}
              selectedExecutableOptions={selectedExecutableOptions}
              setSelectedExecutableOptions={setSelectedExecutableOptions}
              setPassedPrompt={setPassedPrompt}
            />
            <CodeEditor
              code={code}
              setCode={setCode}
              lineNumToHighlight={lineNumToHighlight}
              lineNumDetails={lineNumDetails}
              setCurrCodeLineNum={setCurrCodeLineNum}
              codeError={codeError}
              setPassedPrompt={setPassedPrompt}
            />
          </div>
          {/* Resizer element */}
          <div 
            className="resizer" 
            ref={resizerRef}
            onMouseDown={startResize}
            style={{ 
              left: `calc(${leftWidth}% - 4px)`, /* Position exactly at the border */
            }}
          />
          <div
            id="graph-page-output-container"
            draggable
            onDragStart={(e) => handleDragStart(e, "output")}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={isCodeLeft ? 'right' : 'left'}
            style={{ width: `${isCodeLeft ? 100 - leftWidth : leftWidth}%` }}
            >
            <OutputMenuBar
              currentOutput={currentOutput}
              setCurrentOutput={setCurrentOutput}
              onDragStartTab={(tab) => (e: React.DragEvent<HTMLDivElement>) => handleDragStart(e, tab)}
            />
            <div
              style={{ flexGrow: 1 }}
              onDrop={(e) => handleDrop(e)}
              onDragOver={(e) => e.preventDefault()}
            >
              {renderComponent(currentOutput)}
            </div>

            {/* Third Window (will appear when a tab is dragged into it) */}
            {Object.values(tabPositions).includes('third') && (
              <div
                id="graph-page-output-container"
                draggable
                onDragStart={(e) => handleDragStart(e, "output")}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={isCodeLeft ? 'right' : 'left'}
                style={{ width: '50%', display: 'flex', flexDirection: 'column' }}
              >
                {Object.entries(tabPositions).map(([tab, position]) =>
                  position === 'third' ? (
                    <div key={tab} draggable>
                      {renderComponent(tab as OutputType)}
                    </div>
                  ) : null
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default GraphsPage;