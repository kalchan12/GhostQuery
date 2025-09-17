// GhostQuery Color Palette - Improved readability with hacker aesthetic
export const colors = {
  // Primary greens - high contrast, readable
  primary: {
    bright: '#00ff41',      // Bright matrix green - main accent
    standard: '#00cc33',    // Standard green - readable text
    glow: '#00ff88',        // Soft glow green - hover states
  },
  
  // Secondary greens - supporting text
  secondary: {
    medium: '#66cc66',      // Medium green - better contrast than old #008000
    light: '#99dd99',       // Light green - subtle text
    dim: '#4d994d',         // Dim green - very subtle elements
  },
  
  // Status colors
  status: {
    success: '#00ff41',     // Success operations
    warning: '#ffaa00',     // Warning states
    error: '#ff4444',       // Error states
    info: '#44aaff',        // Info messages
  },
  
  // Background variants
  background: {
    primary: '#000000',     // Main black background
    overlay: 'rgba(0, 255, 65, 0.05)', // Subtle green overlay
    card: 'rgba(0, 255, 65, 0.08)',    // Card backgrounds
    hover: 'rgba(0, 255, 65, 0.12)',   // Hover states
  },
  
  // Border variants
  border: {
    subtle: 'rgba(0, 255, 65, 0.2)',   // Subtle borders
    standard: 'rgba(0, 255, 65, 0.3)',  // Standard borders
    bright: 'rgba(0, 255, 65, 0.5)',    // Bright borders
  },
  
  // Text hierarchy
  text: {
    primary: '#00ff41',     // Main headings, important text
    secondary: '#99dd99',   // Body text, readable secondary content
    tertiary: '#66cc66',    // Small text, metadata
    muted: '#4d994d',       // Very subtle text, hints
  },
  
  // Special effects
  effects: {
    glow: '0 0 10px rgba(0, 255, 65, 0.5)',
    glowBright: '0 0 20px rgba(0, 255, 65, 0.7)',
    shadow: '0 0 15px rgba(0, 255, 65, 0.3)',
  }
};

// Utility functions for consistent styling
export const getTextColor = (level: 'primary' | 'secondary' | 'tertiary' | 'muted') => {
  return colors.text[level];
};

export const getBorderColor = (intensity: 'subtle' | 'standard' | 'bright') => {
  return colors.border[intensity];
};

export const getBackgroundColor = (type: 'primary' | 'overlay' | 'card' | 'hover') => {
  return colors.background[type];
};
