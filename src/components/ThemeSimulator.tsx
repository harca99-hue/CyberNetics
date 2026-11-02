import React, { useState } from 'react';
import { 
  Sparkles, 
  Calendar, 
  RotateCcw, 
  Check, 
  X, 
  Sliders, 
  Info, 
  Palette, 
  Clock, 
  Flame,
  ChevronDown,
  Eye
} from 'lucide-react';
import { useSeasonalTheme } from '../context/ThemeContext';
import { SeasonalThemeId } from '../types';

export const ThemeSimulator: React.FC = () => {
  const {
    themeId,
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
    toggleAmbientEffects,
    allThemes,
  } = useSeasonalTheme();

  const isOpen = isSimulatorOpen;
  const setIsOpen = setIsSimulatorOpen;

  // Format dates for display
  const formattedSimulatedDate = simulatedDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) return;
    const [y, m, d] = e.target.value.split('-').map(Number);
    // Note: month is 0-indexed in Date constructor
    const newDate = new Date(y, m - 1, d);
    setSimulatedDate(newDate);
  };

  const toInputDateFormat = (d: Date) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  // Date jump presets
  const sampleHolidayDates = [
    { label: '🎃 Halloween', dateStr: '2026-10-31', themeName: 'Halloween' },
    { label: '🎄 Christmas', dateStr: '2026-12-25', themeName: 'Holiday Ops' },
    { label: '🎆 4th of July', dateStr: '2026-07-04', themeName: 'Independence' },
    { label: '🌸 Spring Bloom', dateStr: '2026-04-15', themeName: 'Spring' },
    { label: '☀️ Summer Sun', dateStr: '2026-06-25', themeName: 'Summer' },
    { label: '🍂 Fall Harvest', dateStr: '2026-10-05', themeName: 'Fall' },
    { label: '❄️ Winter Glacier', dateStr: '2026-01-20', themeName: 'Winter' },
  ];

  return (
    <>
      {/* Floating Theme Simulator Launcher Pill */}
      <div className="fixed bottom-5 right-5 z-40 flex items-center gap-2">
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-3.5 py-2.5 rounded-full bg-slate-900/95 hover:bg-slate-800 text-slate-200 border shadow-2xl backdrop-blur-md transition-all cursor-pointer hover:scale-105 active:scale-95"
          style={{
            borderColor: themeConfig.primaryColor,
            boxShadow: `0 8px 32px -4px ${themeConfig.accentGlow}`,
          }}
          title="Open Seasonal Theme Engine & Holiday Simulator"
        >
          <span className="relative flex h-3 w-3">
            <span
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ backgroundColor: themeConfig.primaryColor }}
            />
            <span
              className="relative inline-flex rounded-full h-3 w-3"
              style={{ backgroundColor: themeConfig.primaryColor }}
            />
          </span>

          <span className="text-base" role="img" aria-label={themeConfig.name}>
            {themeConfig.icon}
          </span>

          <div className="flex flex-col text-left">
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-slate-400 leading-tight">
              {isAutoMode ? 'Auto-Detect' : 'Manual Override'}
            </span>
            <span className="text-xs font-bold font-mono tracking-tight text-white leading-tight flex items-center gap-1">
              {themeConfig.name}
            </span>
          </div>

          <Sliders className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors ml-1" />
        </button>
      </div>

      {/* Main Theme Simulator Modal / Inspector Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div 
            className="relative w-full max-w-2xl bg-[#090d16] border rounded-2xl shadow-2xl overflow-hidden my-auto"
            style={{
              borderColor: themeConfig.primaryColor,
              boxShadow: `0 0 45px -10px ${themeConfig.accentGlow}`,
            }}
          >
            {/* Top Accent Strip */}
            <div 
              className="h-1.5 w-full transition-colors duration-500"
              style={{
                background: `linear-gradient(90deg, ${themeConfig.primaryColor}, ${themeConfig.secondaryColor})`,
              }}
            />

            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-800 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl border shadow-inner"
                  style={{
                    backgroundColor: themeConfig.badgeBg,
                    borderColor: themeConfig.borderAccent,
                  }}
                >
                  {themeConfig.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-bold text-white font-mono flex items-center gap-2">
                      <span>THEME_ENGINE // DYNAMIC SEASONAL</span>
                    </h2>
                    <span 
                      className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-wider"
                      style={{
                        backgroundColor: themeConfig.badgeBg,
                        color: themeConfig.badgeText,
                        border: `1px solid ${themeConfig.borderAccent}`,
                      }}
                    >
                      {isAutoMode ? '⚡ LIVE AUTO-DETECT' : '🛠️ MANUAL OVERRIDE'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Date-aware seasonal detection with holiday overrides & manual switcher.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Close Theme Simulator"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto terminal-scroll">
              
              {/* Section 1: Live Status & Simulated Calendar Date */}
              <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                    <Calendar className="w-4 h-4 text-cyan-400" />
                    <span>Engine Calendar Date:</span>
                    <strong className="text-white font-bold">{formattedSimulatedDate}</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={resetToLiveDate}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono border border-slate-700 transition-colors cursor-pointer"
                      title="Reset calendar date to current real-time clock and activate Auto-Detect"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Reset to Real Clock</span>
                    </button>
                  </div>
                </div>

                {/* Date Input for fast simulation */}
                <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <label htmlFor="sim-date-picker" className="text-xs font-mono text-slate-400 shrink-0">
                      Simulate Date:
                    </label>
                    <input
                      id="sim-date-picker"
                      type="date"
                      value={toInputDateFormat(simulatedDate)}
                      onChange={handleDateChange}
                      className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <span className="text-xs text-slate-500 hidden sm:inline">or jump to holiday:</span>

                  {/* Holiday Jump Chips */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {sampleHolidayDates.map((h) => (
                      <button
                        key={h.dateStr}
                        onClick={() => {
                          const [y, m, d] = h.dateStr.split('-').map(Number);
                          setSimulatedDate(new Date(y, m - 1, d));
                        }}
                        className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-950/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 transition-colors cursor-pointer"
                        title={`Test date ${h.dateStr} (${h.themeName})`}
                      >
                        {h.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Auto Detection Status Banner */}
                <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>Auto-Detected for this date:</span>
                    <span 
                      className="font-bold px-1.5 py-0.5 rounded text-[11px]"
                      style={{
                        color: themeConfig.primaryColor,
                      }}
                    >
                      {themeConfig.icon} {themeConfig.name}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    {themeConfig.dateRangeDescription}
                  </span>
                </div>
              </div>

              {/* Section 2: One-Click Theme Switcher Grid */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <Palette className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Instant Theme Presets (Manual Force-Switch)</span>
                  </h3>
                  {themeId !== 'default' && (
                    <button
                      onClick={() => setThemeOverride(null)}
                      className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
                    >
                      Revert to Auto-Detect
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {allThemes.map((theme) => {
                    const isSelected = themeId === theme.id;
                    const isAutoMatch = detectedThemeId === theme.id;

                    return (
                      <button
                        key={theme.id}
                        onClick={() => setThemeOverride(theme.id)}
                        className={`text-left p-3 rounded-xl border transition-all cursor-pointer group relative overflow-hidden ${
                          isSelected
                            ? 'bg-slate-850 shadow-lg'
                            : 'bg-slate-900/60 hover:bg-slate-850 border-slate-800 hover:border-slate-700'
                        }`}
                        style={{
                          borderColor: isSelected ? theme.primaryColor : undefined,
                          boxShadow: isSelected ? `0 0 16px -4px ${theme.accentGlow}` : undefined,
                        }}
                      >
                        {/* Selected Indicator */}
                        {isSelected && (
                          <div 
                            className="absolute top-2 right-2 flex items-center gap-1 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded"
                            style={{
                              backgroundColor: theme.badgeBg,
                              color: theme.badgeText,
                              border: `1px solid ${theme.borderAccent}`,
                            }}
                          >
                            <Check className="w-3 h-3" />
                            <span>ACTIVE</span>
                          </div>
                        )}

                        <div className="flex items-start gap-3">
                          {/* Theme Icon & Color Swatch */}
                          <div 
                            className="w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0 border"
                            style={{
                              backgroundColor: theme.badgeBg,
                              borderColor: theme.borderAccent,
                            }}
                          >
                            {theme.icon}
                          </div>

                          <div className="flex-1 min-w-0 pr-12">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-white font-mono truncate">
                                {theme.name}
                              </span>
                              {isAutoMatch && (
                                <span className="text-[9px] font-mono px-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                                  DATE MATCH
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400 truncate mt-0.5">
                              {theme.tagline}
                            </p>
                            <div className="flex items-center gap-2 mt-1.5">
                              {/* Swatch dots */}
                              <div className="flex items-center gap-1">
                                <span 
                                  className="w-2.5 h-2.5 rounded-full inline-block"
                                  style={{ backgroundColor: theme.primaryColor }}
                                  title={`Primary: ${theme.primaryColor}`}
                                />
                                <span 
                                  className="w-2.5 h-2.5 rounded-full inline-block"
                                  style={{ backgroundColor: theme.secondaryColor }}
                                  title={`Secondary: ${theme.secondaryColor}`}
                                />
                              </div>
                              <span className="text-[10px] font-mono text-slate-500 truncate">
                                {theme.dateRangeDescription}
                              </span>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section 3: Ambient Effects & Controls */}
              <div className="bg-slate-900/60 rounded-xl p-3.5 border border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm border"
                    style={{
                      backgroundColor: themeConfig.badgeBg,
                      borderColor: themeConfig.borderAccent,
                    }}
                  >
                    <Sparkles className="w-4 h-4" style={{ color: themeConfig.primaryColor }} />
                  </div>
                  <div>
                    <div className="text-xs font-mono font-bold text-white flex items-center gap-2">
                      <span>Ambient Seasonal Particles</span>
                      <span className="text-[10px] font-mono text-slate-400">
                        ({themeConfig.particleType || 'ambient'})
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Subtle floating motifs matching active season (ghosts, snowflakes, fireworks, leaves).
                    </p>
                  </div>
                </div>

                <button
                  onClick={toggleAmbientEffects}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-colors cursor-pointer shrink-0 ${
                    showAmbientEffects
                      ? 'bg-cyan-950 text-cyan-300 border-cyan-700'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {showAmbientEffects ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              {/* Quote / Greeting Preview */}
              <div 
                className="p-3 rounded-lg border text-xs font-mono flex items-start gap-2.5"
                style={{
                  backgroundColor: themeConfig.badgeBg,
                  borderColor: themeConfig.borderAccent,
                  color: themeConfig.badgeText,
                }}
              >
                <span className="text-base shrink-0">{themeConfig.icon}</span>
                <div>
                  <div className="font-bold uppercase tracking-wider text-[10px] opacity-80">
                    {themeConfig.bannerText}
                  </div>
                  <div className="mt-0.5 italic">
                    "{themeConfig.greetingQuote}"
                  </div>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="px-5 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Simulated: {formattedSimulatedDate}</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs transition-colors cursor-pointer"
                >
                  Close Panel
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
