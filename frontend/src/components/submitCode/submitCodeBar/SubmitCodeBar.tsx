// SubmitCodeBar.tsx
import React, { useState } from 'react';
import './SubmitCodeBar.css';
import CompileOptionsMenu from '../compileOptionsMenu/compileOptionsMenu';
import Button from '@mui/material/Button';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ExecutableOptionsMenu from '../executablesOptionsMenu/executablesOptionsMenu';
import TextIncreaseIcon from '@mui/icons-material/TextIncrease';
import TextDecreaseIcon from '@mui/icons-material/TextDecrease';
import FontSizeMenu from '../../fontSizeMenu/FontSizeMenu';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

interface CompileOption {
  value: string;
  label: string;
}

interface executableOption {
  value: string;
  label: string;
}

interface SubmitCodeBarProps {
  submitEvent: () => void;
  resetCompileOptions: () => void;
  compileOptions: CompileOption[];
  setSelectedCompileOptions: (selectedCompileOptions: CompileOption[]) => void;
  selectedCompileOptions: CompileOption[];
  setSelectedExecutableOptions: (selectedCompileOptions: executableOption[]) => void;
  selectedExecutableOptions: executableOption[];
  executableOptions: executableOption[];
  setPassedPrompt?: (prompt: string) => void; // Added this prop
}

const SubmitCodeBar: React.FC<SubmitCodeBarProps> = ({
  submitEvent,
  resetCompileOptions,
  compileOptions,
  setSelectedCompileOptions,
  selectedCompileOptions,
  setSelectedExecutableOptions,
  selectedExecutableOptions,
  executableOptions,
  setPassedPrompt, // Added this prop
}) => {
  // Add new state variables
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle the submit with validation
  const handleSubmit = () => {
    // Check if executables are selected
    if (!selectedExecutableOptions || selectedExecutableOptions.length === 0) {
      setError('Please select an executable option before running');
      return;
    }

    // Clear any previous errors
    setError(null);

    // Show loading state
    setIsLoading(true);

    // Call the original submit event
    try {
      submitEvent();
    } catch (error) {
      setError('An error occurred while running the code');
    } finally {
      // Hide loading state after a short delay
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

  // Handle error message close
  const handleCloseError = () => {
    setError(null);
  };
  return (
    <>
      <div id="submit-codeBar-container">
        <div id="submit-codeBar-compile-options-container">
          <h5>Enter your compile options: </h5>
          <CompileOptionsMenu
            compileOptions={compileOptions}
            setSelectedCompileOptions={setSelectedCompileOptions}
            selectedCompileOptions={selectedCompileOptions}
            setPassedPrompt={setPassedPrompt} // Pass the prop
          />
          <h5>Select executable options: </h5>
          <ExecutableOptionsMenu
            setSelectedExecutableOptions={setSelectedExecutableOptions}
            selectedExecutableOptions={selectedExecutableOptions}
            executableOptions={executableOptions}
            setPassedPrompt={setPassedPrompt} // Pass the prop
          />
          {/* Show inline error if needed */}
          {error && <div className="error-message">{error}</div>}
        </div>
        <div id="submit-code-bar-button-container">
          <div>
            <Button
              size="medium"
              variant="contained"
              color="secondary"
              onClick={resetCompileOptions}
              startIcon={<RestartAltIcon />}
              className="action-button reset-button"
            >
              Reset
            </Button>
          </div>
          <div>
            <Button
              size="medium"
              variant="contained"
              onClick={handleSubmit}
              disabled={isLoading}
              startIcon={
                isLoading ? <CircularProgress size={20} color="inherit" /> : <PlayArrowIcon />
              }
              className="action-button run-button"
            >
              {isLoading ? 'Running...' : 'Run'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SubmitCodeBar;
