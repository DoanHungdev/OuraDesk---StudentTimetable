/**
 * ThemeEngine: Centralized Theme Management System
 * Handles real-time theme switching, CSS variables injection, LocalStorage caching, and Event listeners
 */
import { THEMES } from './themes.js';

const STORAGE_THEME_KEY = 'classSchedule.theme';
const DEFAULT_THEME_ID = 'peach';

class ThemeManager {
  constructor() {
    this.themes = THEMES;
    this.currentThemeId = DEFAULT_THEME_ID;
    this.subscribers = new Set();
  }

  init() {
    let savedTheme = null;
    try {
      savedTheme = localStorage.getItem(STORAGE_THEME_KEY);
    } catch (e) {
      console.warn('Failed to read theme from localStorage:', e);
    }

    const initialThemeId = (savedTheme && this.getThemeById(savedTheme)) ? savedTheme : DEFAULT_THEME_ID;
    this.setTheme(initialThemeId, false);
    return this.getCurrentTheme();
  }

  getThemes() {
    return this.themes;
  }

  getThemeById(themeId) {
    return this.themes.find(t => t.id === themeId) || null;
  }

  getCurrentTheme() {
    return this.getThemeById(this.currentThemeId) || this.themes[0];
  }

  setTheme(themeId, persist = true) {
    const theme = this.getThemeById(themeId);
    if (!theme) return;

    this.currentThemeId = theme.id;

    if (persist) {
      try {
        localStorage.setItem(STORAGE_THEME_KEY, theme.id);
      } catch (e) {
        console.warn('Failed to save theme to localStorage:', e);
      }
    }

    this.applyThemeToDOM(theme);
    this.notifySubscribers(theme);
  }

  applyThemeToDOM(theme) {
    const root = document.documentElement;
    const { colors, mode } = theme;

    // 1. Set HTML Attributes
    root.setAttribute('data-theme', theme.id);
    root.setAttribute('data-mode', mode);

    // 2. Inject Dynamic CSS Variables
    root.style.setProperty('--color-background', colors.background);
    root.style.setProperty('--color-background-secondary', colors.backgroundSecondary);
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-primary-hover', colors.primaryHover);
    root.style.setProperty('--color-accent', colors.accent);
    root.style.setProperty('--color-accent-secondary', colors.accentSecondary);
    root.style.setProperty('--color-glass', colors.glass);
    root.style.setProperty('--color-glass-hover', colors.glassHover);
    root.style.setProperty('--color-glass-border', colors.glassBorder);
    root.style.setProperty('--color-text', colors.text);
    root.style.setProperty('--color-text-secondary', colors.textSecondary);
    root.style.setProperty('--color-muted', colors.muted);
    root.style.setProperty('--color-border', colors.border);
    root.style.setProperty('--color-shadow', colors.shadow);
    root.style.setProperty('--color-input-background', colors.inputBackground);
    root.style.setProperty('--color-card-background', colors.cardBackground);

    // RGB conversion for alpha blending
    const hex = colors.primary.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const primaryRgb = `${r}, ${g}, ${b}`;

    root.style.setProperty('--color-primary-rgb', primaryRgb);
    root.style.setProperty('--primary-light', `rgba(${primaryRgb}, 0.14)`);
    root.style.setProperty('--primary-glow', `rgba(${primaryRgb}, 0.28)`);
    root.style.setProperty('--primary-border', `rgba(${primaryRgb}, 0.35)`);

    // Compatibility variables for existing stylesheet mappings
    root.style.setProperty('--bg-peach-1', colors.background);
    root.style.setProperty('--bg-peach-2', colors.background);
    root.style.setProperty('--bg-peach-3', colors.backgroundSecondary);
    root.style.setProperty('--primary', colors.primary);
    root.style.setProperty('--primary-hover', colors.primaryHover);
    root.style.setProperty('--text-main', colors.text);
    root.style.setProperty('--text-secondary', colors.textSecondary);
    root.style.setProperty('--text-muted', colors.muted);
    root.style.setProperty('--glass-bg', colors.glass);
    root.style.setProperty('--glass-bg-hover', colors.glassHover);
    root.style.setProperty('--glass-card', colors.cardBackground);
    root.style.setProperty('--glass-border', colors.glassBorder);
    root.style.setProperty('--glass-sidebar', colors.glass);

    // 3. Update Ambient Orbs
    this.updateAmbientOrbs(theme);
  }

  updateAmbientOrbs(theme) {
    const orbs = document.querySelectorAll('.ambient-orb');
    if (!orbs || orbs.length === 0 || !theme.ambientOrbs) return;

    orbs.forEach((orbEl, index) => {
      const orbConfig = theme.ambientOrbs[index] || theme.ambientOrbs[0];
      if (orbConfig) {
        orbEl.style.background = orbConfig.color;
      }
    });
  }

  subscribe(listener) {
    if (typeof listener === 'function') {
      this.subscribers.add(listener);
      return () => this.subscribers.delete(listener);
    }
    return () => {};
  }

  notifySubscribers(theme) {
    this.subscribers.forEach(listener => {
      try {
        listener(theme);
      } catch (e) {
        console.error('Error in theme listener:', e);
      }
    });
  }
}

export const ThemeEngine = new ThemeManager();
export const useTheme = () => ThemeEngine;
