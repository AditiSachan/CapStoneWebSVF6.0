import React, { useState, useEffect, useRef } from 'react';
import ShareIcon from '@mui/icons-material/Share';
import SettingsIcon from '@mui/icons-material/Settings';
import './navbar.css';
import { ImportExport, Publish } from '@mui/icons-material';
import readFile from '../importExport/importExport';

function Navbar({
  openShare,
  setCode,
  code,
  openSettings,
}: {
  openShare: () => void;
  setCode: (code: string) => void;
  code: string;
  openSettings: () => void;
}) {
  const [theme, setTheme] = useState('light');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const userConfirmed = window.confirm(
      `Are you sure you want to import "${file.name}"? This will replace the current code.`
    );

    if (!userConfirmed) {
      event.target.value = '';
      return;
    }

    try {
      const contents = await readFile(file);
      setCode(contents);
    } catch (error) {
      console.error('Failed to import file:', error);
    } finally {
      event.target.value = '';
    }
  };

  const handleExportClick = async () => {
    if ('showSaveFilePicker' in window) {
      try {
        const opts = {
          types: [
            {
              description: 'C Source Files',
              accept: { 'text/plain': ['.c'] },
            },
          ],
        };

        type FileWriter = { write: (data: string) => Promise<void>; close: () => Promise<void> };
        type FileHandle = { createWritable: () => Promise<FileWriter> };
        type SaveFilePicker = {
          showSaveFilePicker: (o: {
            types: Array<{ description: string; accept: Record<string, string[]> }>;
          }) => Promise<FileHandle>;
        };

        const handle = await (window as unknown as SaveFilePicker).showSaveFilePicker(opts);
        const writable = await handle.createWritable();
        await writable.write(code);
        await writable.close();
        return;
      } catch (err) {
        console.error('File save canceled or failed', err);
      }
      return;
    }

    // Fallback for unsupported browsers
    const defaultFilename = 'exported_code.c';
    const fileName = window.prompt('Enter filename to save as:', defaultFilename);
    if (!fileName) return;

    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = fileName.endsWith('.c') ? fileName : `${fileName}.c`;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div id="navbar">
      <img src="/svfLogo.png" alt="svf-logo" id="svf-logo" />
      <div>
        <div className="icon-container">
          <Publish id="import-export-icon" onClick={handleExportClick} />
          <span className="tooltip">Export Code</span>
        </div>

        <div className="icon-container">
          <ImportExport id="import-export-icon" onClick={handleImportClick} />
          <span className="tooltip">Import Code</span>
        </div>

        <ShareIcon onClick={openShare} id="share-icon" />

        <div className="icon-container">
          <SettingsIcon id="import-export-icon" onClick={openSettings} />
          <span className="tooltip">Settings</span>
        </div>

        <label className="theme-toggle">
          <input type="checkbox" checked={theme === 'dark'} onChange={toggleTheme} />
          <span className="theme-slider"></span>
        </label>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          accept=".c"
        />
      </div>
    </div>
  );
}

export default Navbar;
