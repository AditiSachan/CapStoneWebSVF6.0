import React, { useState, useEffect } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import ShareIcon from '@mui/icons-material/Share';
import './navbar.css';

function Navbar({ openShare }: { openShare: () => void }) {
  const [theme, setTheme] = useState('light');

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

  return (
    <div id="navbar">
      <img src="/svfLogo.png" alt="svf-logo" id="svf-logo" />
      <div>
        <ShareIcon onClick={openShare} id="share-icon" />
        {/* <SettingsIcon id="settings-icon" /> */}

        {/* Theme Toggle Switch */}
        <label className="theme-toggle">
          <input type="checkbox" checked={theme === 'dark'} onChange={toggleTheme} />
          <span className="theme-slider"></span>
        </label>
      </div>
    </div>
  );
}

export default Navbar;
