import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { SeasonalThemeId, SeasonalThemeConfig } from '../types';
import { SEASONAL_THEMES, detectSeasonalTheme } from '../data/themesData';

interface ThemeContextType {
  themeId: SeasonalThemeId;
  themeConfig: SeasonalThemeConfig;
  detectedThemeId: SeasonalThemeId;
  isAutoMode: boolean;
  simulatedDate: Date;
  showAmbientEffects: boolean;
  isSimulatorOpen: boolean;
  setIsSimulatorOpen: (open: boolean) => void;
  setThemeOverride: (themeId: SeasonalThemeId | null) => void;
  setSimulatedDate: (date: Date) => void;
  resetToLiveDate: () => void;
  setShowAmbientEffects: (show: boolean) => void;
  toggleAmbientEffects: () => void;
  allThemes: SeasonalThemeConfig[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Real clock or simulated date
  const [simulatedDate, setSimulatedDateState] = useState<Date>(() => new Date());
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  
  // Stored manual override: null means "Auto"
  const [themeOverride, setThemeOverrideState] = useState<SeasonalThemeId | null>(() => {
    try {
      const saved = localStorage.getItem('cybernetics_theme_override');
      if (saved && saved in SEASONAL_THEMES) {
        return saved as SeasonalThemeId;
      }
    } catch {
      // LocalStorage access fallback
    }
    return null;
  });

  const [showAmbientEffects, setShowAmbientEffectsState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('cybernetics_ambient_fx');
      return saved !== 'false';
    } catch {
      return true;
    }
  });

  // Calculate detected theme based on simulatedDate
  const detectedThemeId = useMemo(() => {
    return detectSeasonalTheme(simulatedDate);
  }, [simulatedDate]);

  // Active theme is either user override or detected by date
  const activeThemeId: SeasonalThemeId = themeOverride || detectedThemeId;
  const isAutoMode = themeOverride === null;
  const themeConfig = SEASONAL_THEMES[activeThemeId] || SEASONAL_THEMES.default;

  // Apply theme attributes and CSS variables to root document
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', activeThemeId);

    // Inject dynamic CSS custom properties for instant styling
    root.style.setProperty('--theme-primary', themeConfig.primaryColor);
    root.style.setProperty('--theme-secondary', themeConfig.secondaryColor);
    root.style.setProperty('--theme-accent-glow', themeConfig.accentGlow);
    root.style.setProperty('--theme-border-accent', themeConfig.borderAccent);
    root.style.setProperty('--theme-badge-bg', themeConfig.badgeBg);
    root.style.setProperty('--theme-badge-text', themeConfig.badgeText);
  }, [activeThemeId, themeConfig]);

  const setThemeOverride = (themeId: SeasonalThemeId | null) => {
    setThemeOverrideState(themeId);
    try {
      if (themeId) {
        localStorage.setItem('cybernetics_theme_override', themeId);
      } else {
        localStorage.removeItem('cybernetics_theme_override');
      }
    } catch {
      // Ignore
    }
  };

  const setSimulatedDate = (date: Date) => {
    setSimulatedDateState(date);
    // When testing date, automatically set mode to Auto so user sees what that date triggers
    setThemeOverride(null);
  };

  const resetToLiveDate = () => {
    setSimulatedDateState(new Date());
    setThemeOverride(null);
  };

  const setShowAmbientEffects = (show: boolean) => {
    setShowAmbientEffectsState(show);
    try {
      localStorage.setItem('cybernetics_ambient_fx', String(show));
    } catch {
      // Ignore
    }
  };

  const toggleAmbientEffects = () => {
    setShowAmbientEffects(!showAmbientEffects);
  };

  const allThemes = useMemo(() => Object.values(SEASONAL_THEMES), []);

  return (
    <ThemeContext.Provider
      value={{
        themeId: activeThemeId,
        themeConfig,
        detectedThemeId,
        isAutoMode,
        simulatedDate,
        showAmbientEffects,
        isSimulatorOpen,
        setIsSimulatorOpen,
        setThemeOverride,
        setSimulatedDate,
        resetToLiveDate,
        setShowAmbientEffects,
        toggleAmbientEffects,
        allThemes,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useSeasonalTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useSeasonalTheme must be used within a ThemeProvider');
  }
  return context;
};
