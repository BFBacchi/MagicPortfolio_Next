'use client';

import React, { useEffect, useState } from 'react';
import { Row, ToggleButton, useTheme } from '@once-ui-system/core';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('dark');

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('data-theme');
    const themeFromDOM = document.documentElement.getAttribute('data-theme');
    const resolvedTheme = savedTheme || themeFromDOM || 'dark';
    setCurrentTheme(resolvedTheme);
  }, []);

  useEffect(() => {
    const themeFromDOM = document.documentElement.getAttribute('data-theme');
    if (themeFromDOM) {
      setCurrentTheme(themeFromDOM);
    }
  }, [theme]);

  const icon = currentTheme === 'dark' ? 'light' : 'dark';
  const nextTheme = currentTheme === 'light' ? 'dark' : 'light';

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <ToggleButton
      prefixIcon={icon}
      onClick={() => setTheme(nextTheme)}
      aria-label={`Switch to ${nextTheme} mode`}
    />
  );
};
