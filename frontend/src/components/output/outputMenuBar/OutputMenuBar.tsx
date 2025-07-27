import React from 'react';
import styles from './outputMenuBar.module.css';
import type { OutputType } from '../../multiSession/sessionManager'; 

interface OutputMenuBarProps {
  currentOutput: OutputType;
  setCurrentOutput: (outputType: OutputType) => void;
  onDragStartTab: (tab: OutputType) => void;
}

const OutputMenuBar: React.FC<OutputMenuBarProps> = ({
  currentOutput,
  setCurrentOutput,
  onDragStartTab,
}) => {
  return (
    <nav className={styles.navBar}>
      <ul className={styles.navList}>
        <li
          className={`${styles.navItem} ${currentOutput === 'Graph' ? styles.active : ''}`}
          onClick={() => setCurrentOutput('Graph')}
          draggable
          onDragStart={() => onDragStartTab('Graph')}
        >
          Graphs
        </li>
        <li
          className={`${styles.navItem} ${currentOutput === 'Terminal Output' ? styles.active : ''}`}
          onClick={() => setCurrentOutput('Terminal Output')}
          draggable
          onDragStart={() => onDragStartTab('Terminal Output')}
        >
          Terminal Output
        </li>
        <li
          className={`${styles.navItem} ${currentOutput === 'CodeGPT' ? styles.active : ''}`}
          onClick={() => setCurrentOutput('CodeGPT')}
          draggable
          onDragStart={() => onDragStartTab('CodeGPT')}
        >
          CodeGPT
        </li>
        <li
          className={`${styles.navItem} ${currentOutput === 'LLVMIR' ? styles.active : ''}`}
          onClick={() => setCurrentOutput('LLVMIR')}
          draggable
          onDragStart={() => onDragStartTab('LLVMIR')}
        >
          LLVMIR
        </li>
        <li
          className={`${styles.navItem} ${currentOutput === 'Terminal' ? styles.active : ''}`}
          onClick={() => setCurrentOutput('Terminal')}
          draggable
          onDragStart={() => onDragStartTab('Terminal')}
        >
          Terminal
        </li>
      </ul>
    </nav>
  );
};

export default OutputMenuBar;
