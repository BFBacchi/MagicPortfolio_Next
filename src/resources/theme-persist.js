// Theme persistence script to prevent color changes during component reloads

(function() {
  'use strict';
  
  // Function to ensure dark theme with green tones
  function ensureDarkTheme() {
    const root = document.documentElement;
    
    // Force dark theme if not set
    if (!root.getAttribute('data-theme')) {
      root.setAttribute('data-theme', 'dark');
    }
    
    // Ensure green brand colors are applied
    const greenBrandColors = {
      'brand': 'green',
      'accent': 'emerald',
      'neutral': 'gray'
    };
    
    Object.entries(greenBrandColors).forEach(([key, value]) => {
      if (!root.getAttribute(`data-${key}`) || root.getAttribute(`data-${key}`) === 'cyan') {
        root.setAttribute(`data-${key}`, value);
      }
    });
  }
  
  // Function to override any blue/cyan colors with dark green
  function overrideBlueColors() {
    const style = document.createElement('style');
    style.textContent = `
      [data-theme="dark"] {
        --page-background: #000000 !important;
        --surface-background: #000000 !important;
        --scheme-brand-600: #008000 !important;
        --scheme-brand-700: #009900 !important;
        --scheme-brand-800: #00b300 !important;
        --scheme-accent-600: #008040 !important;
        --scheme-accent-700: #00994d !important;
        --scheme-accent-800: #00b35a !important;
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