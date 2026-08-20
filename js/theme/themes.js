/**
 * Centralized Themes Specification for Class Schedule / OuraDesk
 * Modern Soft Glassmorphism + Student Productivity App
 * 
 * 6 Themes:
 * 1. Peach Glass (peach - default)
 * 2. Ocean Glass (ocean)
 * 3. Lavender Dream (lavender)
 * 4. Mint Campus (mint)
 * 5. Midnight Glass (midnight - dark)
 * 6. Sakura (sakura)
 */

export const THEMES = [
  {
    id: 'peach',
    name: 'Peach Glass',
    description: 'Ấm áp · thân thiện · soft',
    emoji: '🍑',
    mode: 'light',
    colors: {
      background: '#F8C5B0',
      backgroundSecondary: '#FAD8C8',
      primary: '#F47C63',
      primaryHover: '#EA6851',
      accent: '#FF8A65',
      accentSecondary: '#FDBA9A',
      glass: 'rgba(255, 255, 255, 0.65)',
      glassHover: 'rgba(255, 255, 255, 0.82)',
      glassBorder: 'rgba(255, 255, 255, 0.72)',
      text: '#1F2937',
      textSecondary: '#4B5563',
      muted: '#6B7280',
      border: 'rgba(55, 65, 81, 0.08)',
      shadow: 'rgba(120, 70, 50, 0.12)',
      inputBackground: 'rgba(255, 255, 255, 0.85)',
      cardBackground: 'rgba(255, 255, 255, 0.72)'
    },
    ambientOrbs: [
      { color: 'rgba(255, 255, 255, 0.7)', top: '-10%', left: '-5%', width: '500px', height: '500px' },
      { color: 'rgba(244, 124, 99, 0.35)', top: '55%', left: '70%', width: '450px', height: '450px' },
      { color: 'rgba(175, 200, 245, 0.40)', top: '40%', left: '30%', width: '350px', height: '350px' },
      { color: 'rgba(199, 183, 244, 0.35)', top: '10%', left: '60%', width: '400px', height: '400px' }
    ],
    courseColors: {
      blue: '#AFC8F5',
      purple: '#C7B7F4',
      green: '#A9DED5',
      yellow: '#F7D99A',
      pink: '#F4B5C2',
      orange: '#F5B28D'
    }
  },
  {
    id: 'ocean',
    name: 'Ocean Glass',
    description: 'Mát · sạch · hiện đại',
    emoji: '🌊',
    mode: 'light',
    colors: {
      background: '#BFE3F2',
      backgroundSecondary: '#D7F0F8',
      primary: '#3B82F6',
      primaryHover: '#2563EB',
      accent: '#06B6D4',
      accentSecondary: '#22D3EE',
      glass: 'rgba(255, 255, 255, 0.65)',
      glassHover: 'rgba(255, 255, 255, 0.82)',
      glassBorder: 'rgba(255, 255, 255, 0.72)',
      text: '#1E293B',
      textSecondary: '#475569',
      muted: '#64748B',
      border: 'rgba(38, 54, 74, 0.08)',
      shadow: 'rgba(30, 100, 140, 0.14)',
      inputBackground: 'rgba(255, 255, 255, 0.85)',
      cardBackground: 'rgba(255, 255, 255, 0.72)'
    },
    ambientOrbs: [
      { color: 'rgba(255, 255, 255, 0.75)', top: '-10%', left: '-5%', width: '500px', height: '500px' },
      { color: 'rgba(59, 130, 246, 0.30)', top: '55%', left: '70%', width: '450px', height: '450px' },
      { color: 'rgba(6, 182, 212, 0.35)', top: '40%', left: '30%', width: '350px', height: '350px' },
      { color: 'rgba(147, 197, 253, 0.40)', top: '10%', left: '60%', width: '400px', height: '400px' }
    ],
    courseColors: {
      blue: '#93C5FD',
      purple: '#C4B5FD',
      green: '#6EE7B7',
      yellow: '#FDE68A',
      pink: '#FBCFE8',
      orange: '#FDBA74'
    }
  },
  {
    id: 'lavender',
    name: 'Lavender Dream',
    description: 'Aesthetic · mềm · nhẹ',
    emoji: '💜',
    mode: 'light',
    colors: {
      background: '#DDD3F5',
      backgroundSecondary: '#EEE8FA',
      primary: '#8B6FD8',
      primaryHover: '#795AC8',
      accent: '#A78BFA',
      accentSecondary: '#C4B5FD',
      glass: 'rgba(255, 255, 255, 0.65)',
      glassHover: 'rgba(255, 255, 255, 0.82)',
      glassBorder: 'rgba(255, 255, 255, 0.72)',
      text: '#2E283E',
      textSecondary: '#574E6B',
      muted: '#7C728F',
      border: 'rgba(63, 56, 82, 0.08)',
      shadow: 'rgba(90, 70, 140, 0.14)',
      inputBackground: 'rgba(255, 255, 255, 0.85)',
      cardBackground: 'rgba(255, 255, 255, 0.72)'
    },
    ambientOrbs: [
      { color: 'rgba(255, 255, 255, 0.75)', top: '-10%', left: '-5%', width: '500px', height: '500px' },
      { color: 'rgba(139, 111, 216, 0.32)', top: '55%', left: '70%', width: '450px', height: '450px' },
      { color: 'rgba(196, 181, 253, 0.40)', top: '40%', left: '30%', width: '350px', height: '350px' },
      { color: 'rgba(244, 181, 194, 0.30)', top: '10%', left: '60%', width: '400px', height: '400px' }
    ],
    courseColors: {
      blue: '#B4D2FA',
      purple: '#DDD6FE',
      green: '#A7F3D0',
      yellow: '#FEF08A',
      pink: '#FBCFE8',
      orange: '#FED7AA'
    }
  },
  {
    id: 'mint',
    name: 'Mint Campus',
    description: 'Tươi · thư giãn · học tập',
    emoji: '🌿',
    mode: 'light',
    colors: {
      background: '#CBE9DC',
      backgroundSecondary: '#E2F4EB',
      primary: '#329665',
      primaryHover: '#257D52',
      accent: '#10B981',
      accentSecondary: '#6EE7B7',
      glass: 'rgba(255, 255, 255, 0.65)',
      glassHover: 'rgba(255, 255, 255, 0.82)',
      glassBorder: 'rgba(255, 255, 255, 0.72)',
      text: '#1E3328',
      textSecondary: '#405B4E',
      muted: '#6B8378',
      border: 'rgba(48, 71, 59, 0.08)',
      shadow: 'rgba(40, 120, 80, 0.14)',
      inputBackground: 'rgba(255, 255, 255, 0.85)',
      cardBackground: 'rgba(255, 255, 255, 0.72)'
    },
    ambientOrbs: [
      { color: 'rgba(255, 255, 255, 0.75)', top: '-10%', left: '-5%', width: '500px', height: '500px' },
      { color: 'rgba(73, 168, 120, 0.32)', top: '55%', left: '70%', width: '450px', height: '450px' },
      { color: 'rgba(167, 243, 208, 0.45)', top: '40%', left: '30%', width: '350px', height: '350px' },
      { color: 'rgba(186, 230, 253, 0.35)', top: '10%', left: '60%', width: '400px', height: '400px' }
    ],
    courseColors: {
      blue: '#BAE6FD',
      purple: '#DDD6FE',
      green: '#A7F3D0',
      yellow: '#FEF08A',
      pink: '#FECDD3',
      orange: '#FED7AA'
    }
  },
  {
    id: 'midnight',
    name: 'Midnight Glass',
    description: 'Tối · premium · hiện đại',
    emoji: '🌌',
    mode: 'dark',
    colors: {
      background: '#101827',
      backgroundSecondary: '#172033',
      primary: '#818CF8',
      primaryHover: '#6366F1',
      accent: '#22D3EE',
      accentSecondary: '#67E8F9',
      glass: 'rgba(30, 41, 59, 0.70)',
      glassHover: 'rgba(30, 41, 59, 0.88)',
      glassBorder: 'rgba(255, 255, 255, 0.12)',
      text: '#F8FAFC',
      textSecondary: '#CBD5E1',
      muted: '#94A3B8',
      border: 'rgba(255, 255, 255, 0.10)',
      shadow: 'rgba(0, 0, 0, 0.40)',
      inputBackground: 'rgba(15, 23, 42, 0.75)',
      cardBackground: 'rgba(30, 41, 59, 0.65)'
    },
    ambientOrbs: [
      { color: 'rgba(99, 102, 241, 0.22)', top: '-10%', left: '-5%', width: '500px', height: '500px' },
      { color: 'rgba(34, 211, 238, 0.18)', top: '55%', left: '70%', width: '450px', height: '450px' },
      { color: 'rgba(129, 140, 248, 0.20)', top: '40%', left: '30%', width: '350px', height: '350px' },
      { color: 'rgba(236, 72, 153, 0.15)', top: '10%', left: '60%', width: '400px', height: '400px' }
    ],
    courseColors: {
      blue: '#3B82F6',
      purple: '#8B5CF6',
      green: '#10B981',
      yellow: '#D97706',
      pink: '#EC4899',
      orange: '#F97316'
    }
  },
  {
    id: 'sakura',
    name: 'Sakura',
    description: 'Dễ thương · nhẹ nhàng · trẻ trung',
    emoji: '🌸',
    mode: 'light',
    colors: {
      background: '#F7D9E3',
      backgroundSecondary: '#FBEAF0',
      primary: '#E7799F',
      primaryHover: '#D9658B',
      accent: '#F3A6BE',
      accentSecondary: '#F9CBD9',
      glass: 'rgba(255, 255, 255, 0.65)',
      glassHover: 'rgba(255, 255, 255, 0.82)',
      glassBorder: 'rgba(255, 255, 255, 0.72)',
      text: '#3D2430',
      textSecondary: '#6B4A59',
      muted: '#987681',
      border: 'rgba(84, 58, 70, 0.08)',
      shadow: 'rgba(150, 80, 110, 0.14)',
      inputBackground: 'rgba(255, 255, 255, 0.85)',
      cardBackground: 'rgba(255, 255, 255, 0.72)'
    },
    ambientOrbs: [
      { color: 'rgba(255, 255, 255, 0.75)', top: '-10%', left: '-5%', width: '500px', height: '500px' },
      { color: 'rgba(231, 121, 159, 0.32)', top: '55%', left: '70%', width: '450px', height: '450px' },
      { color: 'rgba(249, 203, 217, 0.45)', top: '40%', left: '30%', width: '350px', height: '350px' },
      { color: 'rgba(253, 230, 138, 0.35)', top: '10%', left: '60%', width: '400px', height: '400px' }
    ],
    courseColors: {
      blue: '#BFDBFE',
      purple: '#DDD6FE',
      green: '#A7F3D0',
      yellow: '#FEF08A',
      pink: '#FBCFE8',
      orange: '#FED7AA'
    }
  }
];
