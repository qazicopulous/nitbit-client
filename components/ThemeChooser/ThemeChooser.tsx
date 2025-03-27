import React, { useState, useEffect, useRef } from 'react';
import '@/styles/themes.css';
import Cookies from 'js-cookie';
import { useTheme } from '@/components/ContextProvider';
import Icon from '@/components/Icon/Icon';
import styles from './ThemeChooser.module.css';
import sanitizeHtml from 'sanitize-html';
import hljs from 'highlight.js/lib/common';

export enum Theme {
  Default = 'default',
  PitchBlack = 'pitch-black',
  EInk = 'e-ink'
}

const ThemeChooser: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleChange = async (newTheme: Theme) => {
    document.body.classList.remove(theme);
    document.body.classList.add(newTheme);
    setTheme(newTheme);
    Cookies.set('theme', newTheme);

    // Remove any previously applied hljs theme

  };

  return (
    <div className={styles.container} ref={dropdownRef}>
      <div className={styles.icon} onClick={() => setDropdownVisible(!dropdownVisible)}>
        <Icon
          name="paintbrush.svg"
          alt="paintbrush"
        />
      </div>
      <div className={`${styles.dropdown} ${dropdownVisible ? styles.show : ''}`}>
        <div onClick={() => handleChange(Theme.Default)} className={`${styles.option} ${theme === Theme.Default ? styles.selected : ''}`}>Default</div>
        <div onClick={() => handleChange(Theme.PitchBlack)} className={`${styles.option} ${theme === Theme.PitchBlack ? styles.selected : ''}`}>Pitch black</div>
        <div onClick={() => handleChange(Theme.EInk)} className={`${styles.option} ${theme === Theme.EInk ? styles.selected : ''}`}>E-ink</div>
      </div>
    </div>
  );
}

export default ThemeChooser;