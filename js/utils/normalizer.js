/**
 * Subject & Time Normalization Engine
 * Standardizes subject names, aliases, period numbers, and generates confidence scores
 */

const SUBJECT_DICTIONARY = [
  {
    canonical: 'Toán',
    aliases: ['toan', 'toán', 'toán học', 'đại số', 'hình học', 'giai tich', 'math', 'toan 12', 'toan 11', 'toan 10'],
    color: '#AFC8F5',
    category: 'math',
    code: 'TOAN'
  },
  {
    canonical: 'Ngữ văn',
    aliases: ['van', 'văn', 'ngữ văn', 'ngu van', 'tieng viet', 'literature'],
    color: '#F4B5C2',
    category: 'literature',
    code: 'VAN'
  },
  {
    canonical: 'Tiếng Anh',
    aliases: ['anh', 'tiếng anh', 'tieng anh', 'ta', 't.anh', 'english', 'nn', 'ngoai ngu'],
    color: '#A9DED5',
    category: 'language',
    code: 'ANH'
  },
  {
    canonical: 'Vật lý',
    aliases: ['ly', 'lý', 'vật lý', 'vat ly', 'vật lí', 'vat li', 'physics'],
    color: '#AFC8F5',
    category: 'physics',
    code: 'LY'
  },
  {
    canonical: 'Hóa học',
    aliases: ['hoa', 'hóa', 'hóa học', 'hoa hoc', 'chemistry'],
    color: '#F7D99A',
    category: 'chemistry',
    code: 'HOA'
  },
  {
    canonical: 'Sinh học',
    aliases: ['sinh', 'sinh học', 'sinh hoc', 'biology'],
    color: '#A9DED5',
    category: 'biology',
    code: 'SINH'
  },
  {
    canonical: 'Lịch sử',
    aliases: ['su', 'sử', 'lịch sử', 'lich su', 'history'],
    color: '#F5B28D',
    category: 'history',
    code: 'SU'
  },
  {
    canonical: 'Địa lý',
    aliases: ['dia', 'địa', 'địa lý', 'dia ly', 'geography'],
    color: '#C7B7F4',
    category: 'geography',
    code: 'DIA'
  },
  {
    canonical: 'Giáo dục KT & Pháp luật',
    aliases: ['gdkt&pl', 'gdktpl', 'gdcd', 'gd kinh tế & pháp luật', 'kinh tế pháp luật', 'pháp luật', 'civics'],
    color: '#F7D99A',
    category: 'social',
    code: 'GDKTPL'
  },
  {
    canonical: 'Tin học',
    aliases: ['tin', 'tin học', 'tin hoc', 'it', 'computer'],
    color: '#AFC8F5',
    category: 'it',
    code: 'TIN'
  },
  {
    canonical: 'Công nghệ',
    aliases: ['cn', 'công nghệ', 'cong nghe', 'technology'],
    color: '#F5B28D',
    category: 'engineering',
    code: 'CN'
  },
  {
    canonical: 'Giáo dục Thể chất',
    aliases: ['the duc', 'thể dục', 'gdtc', 'gd the chat', 'gd thể chất', 'pe', 'the thao'],
    color: '#A9DED5',
    category: 'pe',
    code: 'GDTC'
  },
  {
    canonical: 'Giáo dục QP & AN',
    aliases: ['gdqp', 'gdqp&an', 'quoc phong', 'quốc phòng', 'gdqp-an'],
    color: '#F7D99A',
    category: 'military',
    code: 'GDQP'
  },
  {
    canonical: 'Hoạt động TN & SHCN',
    aliases: ['shcn', 'chào cờ', 'chao co', 'hdtn', 'hđtn', 'sinh hoạt', 'sinh hoat lop'],
    color: '#C7B7F4',
    category: 'activity',
    code: 'HDTN'
  }
];

export const Normalizer = {
  /**
   * Normalize raw subject text from OCR / Excel / PDF
   */
  normalizeSubject(rawText) {
    if (!rawText) {
      return {
        name: 'Chưa rõ môn',
        canonical: 'Chưa rõ môn',
        code: 'UNKNOWN',
        color: '#AFC8F5',
        category: 'other',
        confidence: 50,
        needsReview: true,
        suggestions: ['Toán', 'Ngữ văn', 'Tiếng Anh']
      };
    }

    const clean = rawText.trim().toLowerCase().replace(/[-_.]/g, ' ');

    // 1. Exact alias match
    for (const item of SUBJECT_DICTIONARY) {
      if (item.aliases.includes(clean) || item.canonical.toLowerCase() === clean) {
        return {
          name: item.canonical,
          canonical: item.canonical,
          code: item.code,
          color: item.color,
          category: item.category,
          confidence: 98,
          needsReview: false,
          suggestions: []
        };
      }
    }

    // 2. Partial / substring match
    for (const item of SUBJECT_DICTIONARY) {
      for (const alias of item.aliases) {
        if (clean.startsWith(alias) || clean.includes(alias)) {
          return {
            name: item.canonical,
            canonical: item.canonical,
            code: item.code,
            color: item.color,
            category: item.category,
            confidence: 88,
            needsReview: false,
            suggestions: [item.canonical]
          };
        }
      }
    }

    // 3. Ambiguous match detection (e.g. "Hóa" vs "Vật lý", "Hoạt động")
    if (clean.includes('h') && clean.includes('a')) {
      return {
        name: 'Hóa học',
        canonical: 'Hóa học',
        code: 'HOA',
        color: '#F7D99A',
        category: 'chemistry',
        confidence: 72,
        needsReview: true,
        suggestions: ['Hóa học', 'Vật lý', 'Toán']
      };
    }

    // Fallback for custom or unknown
    return {
      name: rawText.trim(),
      canonical: rawText.trim(),
      code: 'SUB_' + Math.floor(Math.random() * 1000),
      color: '#AFC8F5',
      category: 'other',
      confidence: 65,
      needsReview: true,
      suggestions: ['Toán', 'Ngữ văn', 'Tiếng Anh', 'Vật lý', 'Hóa học']
    };
  },

  /**
   * Map period text to number and standard time
   */
  normalizePeriod(rawPeriod, isAfternoon = false) {
    let pNum = 1;
    if (typeof rawPeriod === 'number') {
      pNum = rawPeriod;
    } else {
      const match = String(rawPeriod).match(/\d+/);
      pNum = match ? parseInt(match[0], 10) : 1;
    }

    if (isAfternoon && pNum <= 5) {
      pNum += 5; // Afternoon period 1 -> Period 6
    }

    return pNum;
  }
};
