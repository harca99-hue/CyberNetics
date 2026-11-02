import { SeasonalThemeId, SeasonalThemeConfig } from '../types';

export const SEASONAL_THEMES: Record<SeasonalThemeId, SeasonalThemeConfig> = {
  default: {
    id: 'default',
    name: 'Cyber Netics Core',
    seasonLabel: 'Standard Protocol',
    icon: '⚡',
    bannerText: 'SEC-OPS GRID ONLINE',
    tagline: 'Collegiate Threat Intel & CTF Ops',
    dateRangeDescription: 'Year-round Default Cyber Netics Aesthetic',
    primaryColor: '#06b6d4', // cyan-500
    secondaryColor: '#3b82f6', // blue-500
    accentGlow: 'rgba(6, 182, 212, 0.35)',
    borderAccent: 'rgba(6, 182, 212, 0.4)',
    badgeBg: 'rgba(8, 47, 73, 0.7)',
    badgeText: '#67e8f9',
    particleType: 'sparkles',
    greetingQuote: 'Zero trust architecture, 24/7 telemetry defense.',
  },
  halloween: {
    id: 'halloween',
    name: 'Spooky Haunt & Hack',
    seasonLabel: 'Halloween Protocol',
    icon: '🎃',
    bannerText: '🎃 HALLOWEEN SPECTRAL THREAT OPS ACTIVE',
    tagline: 'Haunting Ciphers, Phantoms & Ghost in the Shell',
    dateRangeDescription: 'Late October — Oct 20 to Nov 3',
    primaryColor: '#f97316', // neon orange
    secondaryColor: '#a855f7', // eerie purple
    accentGlow: 'rgba(249, 115, 22, 0.45)',
    borderAccent: 'rgba(249, 115, 22, 0.5)',
    badgeBg: 'rgba(67, 20, 7, 0.8)',
    badgeText: '#fdba74',
    particleType: 'ghosts',
    greetingQuote: 'Beware the phantom packets and polymorphic ghouls lurking in the wire.',
  },
  christmas: {
    id: 'christmas',
    name: 'Festive Holiday Ops',
    seasonLabel: 'Holiday & New Year Protocol',
    icon: '🎄',
    bannerText: '🎄 HOLIDAY SEC-OPS & NEW YEAR PROTOCOL ACTIVE',
    tagline: 'Warm Fires, Frosty Ciphers & Festive Code',
    dateRangeDescription: 'December to Early January — Dec 1 to Jan 5',
    primaryColor: '#ef4444', // holiday ruby red
    secondaryColor: '#10b981', // pine emerald green
    accentGlow: 'rgba(239, 68, 68, 0.4)',
    borderAccent: 'rgba(239, 68, 68, 0.5)',
    badgeBg: 'rgba(69, 10, 10, 0.8)',
    badgeText: '#fca5a5',
    particleType: 'snow',
    greetingQuote: 'Season’s greetings from Florida Cyber Netics! May your buffers never overflow.',
  },
  fourth_of_july: {
    id: 'fourth_of_july',
    name: 'Independence Cyber Defense',
    seasonLabel: 'Fourth of July Protocol',
    icon: '🎆',
    bannerText: '🎆 INDEPENDENCE DAY CYBER DEFENSE ACTIVE',
    tagline: 'Defending the Digital Homeland in Red, White & Blue',
    dateRangeDescription: 'Early July — July 1 to July 8',
    primaryColor: '#3b82f6', // patriotic cobalt blue
    secondaryColor: '#ef4444', // freedom red
    accentGlow: 'rgba(59, 130, 246, 0.45)',
    borderAccent: 'rgba(59, 130, 246, 0.5)',
    badgeBg: 'rgba(23, 37, 84, 0.8)',
    badgeText: '#93c5fd',
    particleType: 'fireworks',
    greetingQuote: 'Protecting democratic infrastructure and critical digital assets.',
  },
  fall: {
    id: 'fall',
    name: 'Autumn Harvest Cyber',
    seasonLabel: 'Fall Semester Protocol',
    icon: '🍂',
    bannerText: '🍂 AUTUMN INTEL & FALL RECRUITMENT ACTIVE',
    tagline: 'Golden Leaves, Deep Forensics & Harvest CTF Sprint',
    dateRangeDescription: 'September to November (Fall Semester)',
    primaryColor: '#f59e0b', // amber harvest
    secondaryColor: '#ea580c', // russet orange
    accentGlow: 'rgba(245, 158, 11, 0.4)',
    borderAccent: 'rgba(245, 158, 11, 0.45)',
    badgeBg: 'rgba(69, 26, 3, 0.8)',
    badgeText: '#fde68a',
    particleType: 'leaves',
    greetingQuote: 'Fall semester is peak competition season. Sharpen your reverse engineering kits.',
  },
  spring: {
    id: 'spring',
    name: 'Spring Cyber Bloom',
    seasonLabel: 'Spring Semester Protocol',
    icon: '🌸',
    bannerText: '🌸 SPRING BLOSSOM & COLLEGIATE CTF EXPEDITION',
    tagline: 'Fresh Exploits, Vibrant Defenses & New Beginnings',
    dateRangeDescription: 'March to May (Spring Semester)',
    primaryColor: '#ec4899', // sakura pink
    secondaryColor: '#10b981', // fresh emerald
    accentGlow: 'rgba(236, 72, 153, 0.4)',
    borderAccent: 'rgba(236, 72, 153, 0.45)',
    badgeBg: 'rgba(80, 7, 36, 0.8)',
    badgeText: '#fbcfe8',
    particleType: 'petals',
    greetingQuote: 'Spring brings new vulnerabilities and blossoming talent to the grid.',
  },
  summer: {
    id: 'summer',
    name: 'Sunshine Coast Cyber',
    seasonLabel: 'Summer Beach & Sun Protocol',
    icon: '☀️',
    bannerText: '☀️ FLORIDA SUMMER CYBER LABS & SUNSHINE OPS',
    tagline: 'Tropical Waves, Ocean Air & Summer Wargame Camps',
    dateRangeDescription: 'June to August (Summer Semester)',
    primaryColor: '#0ea5e9', // ocean cyan
    secondaryColor: '#eab308', // sunshine gold
    accentGlow: 'rgba(14, 165, 233, 0.4)',
    borderAccent: 'rgba(14, 165, 233, 0.45)',
    badgeBg: 'rgba(12, 74, 110, 0.8)',
    badgeText: '#7dd3fc',
    particleType: 'sparkles',
    greetingQuote: 'Florida sunshine meets hard-hitting cybersecurity research.',
  },
  winter: {
    id: 'winter',
    name: 'Glacier Frost Cyber',
    seasonLabel: 'Winter Term Protocol',
    icon: '❄️',
    bannerText: '❄️ GLACIER WINTER SECURITY & CRYPTO OPS',
    tagline: 'Sub-Zero Logic, Cold Storage Security & Cryo Forensics',
    dateRangeDescription: 'December to February (Winter Semester)',
    primaryColor: '#38bdf8', // ice cyan
    secondaryColor: '#818cf8', // frosty indigo
    accentGlow: 'rgba(56, 189, 248, 0.4)',
    borderAccent: 'rgba(56, 189, 248, 0.45)',
    badgeBg: 'rgba(8, 47, 73, 0.8)',
    badgeText: '#bae6fd',
    particleType: 'snow',
    greetingQuote: 'Hardening cold storage enclaves and immutable ledgers.',
  },
};

/**
 * Automatically inspects a calendar date and returns the matching seasonal/holiday theme.
 * Special holiday overrides take priority over general season rules.
 */
export function detectSeasonalTheme(targetDate: Date = new Date()): SeasonalThemeId {
  const month = targetDate.getMonth(); // 0-indexed: 0 = Jan, 9 = Oct, 11 = Dec
  const day = targetDate.getDate(); // 1-31

  // 1. Halloween Override: Late October to early November (Oct 20 - Nov 3)
  if ((month === 9 && day >= 20) || (month === 10 && day <= 3)) {
    return 'halloween';
  }

  // 2. Christmas & New Year Override: Dec 1 to Jan 5
  if (month === 11 || (month === 0 && day <= 5)) {
    return 'christmas';
  }

  // 3. Fourth of July Override: July 1 to July 8
  if (month === 6 && day >= 1 && day <= 8) {
    return 'fourth_of_july';
  }

  // 4. Spring: March 1 - May 31 (Months 2, 3, 4)
  if (month >= 2 && month <= 4) {
    return 'spring';
  }

  // 5. Summer: June 1 - August 31 (Months 5, 6, 7)
  if (month >= 5 && month <= 7) {
    return 'summer';
  }

  // 6. Fall / Autumn: September 1 - November 30 (Months 8, 9, 10)
  if (month >= 8 && month <= 10) {
    return 'fall';
  }

  // 7. Winter: December, January, February (Months 11, 0, 1)
  if (month === 11 || month === 0 || month === 1) {
    return 'winter';
  }

  return 'default';
}
