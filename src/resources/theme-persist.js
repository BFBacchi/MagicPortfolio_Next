// Theme persistence script to prevent color changes during component reloads

(function() {
  'use strict';
  
  // Function to ensure dark theme with gray tones
  function ensureDarkTheme() {
    const root = document.documentElement;
    
    // Force dark theme if not set
    if (!root.getAttribute('data-theme')) {
      root.setAttribute('data-theme', 'dark');
    }
    
    // Ensure gray brand colors are applied
    const grayBrandColors = {
      'brand': 'gray',
      'accent': 'gray',
      'neutral': 'gray'
    };
    
    Object.entries(grayBrandColors).forEach(([key, value]) => {
      if (!root.getAttribute(`data-${key}`) || root.getAttribute(`data-${key}`) === 'cyan') {
        root.setAttribute(`data-${key}`, value);
      }
    });
  }
  
  // Function to override any blue/cyan colors with dark gray
  function overrideBlueColors() {
    const style = document.createElement('style');
    style.textContent = `
      [data-theme="dark"] {
        --page-background: #0a0a0a !important;
        --surface-background: #0a0a0a !important;
        --surface-background-strong: #1a1a1a !important;
        --scheme-brand-600: #6a6a6a !important;
        --scheme-brand-700: #8a8a8a !important;
        --scheme-brand-800: #aaaaaa !important;
        --scheme-accent-600: #4a4a4a !important;
        --scheme-accent-700: #6a6a6a !important;
        --scheme-accent-800: #8a8a8a !important;
      }
    `;
    document.head.appendChild(style);
  }
  
  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      ensureDarkTheme();
      overrideBlueColors();
    });
  } else {
    ensureDarkTheme();
    overrideBlueColors();
  }
  
  // Run on every navigation (for SPA)
  if (typeof window !== 'undefined') {
    let currentUrl = window.location.href;
    
    const observer = new MutationObserver(function() {
      if (window.location.href !== currentUrl) {
        currentUrl = window.location.href;
        setTimeout(() => {
          ensureDarkTheme();
          overrideBlueColors();
        }, 100);
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
})(); 