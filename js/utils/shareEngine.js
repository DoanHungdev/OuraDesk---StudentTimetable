/**
 * Community TKB & Class Share Code Engine
 * Generate Share Code & QR Code for Instant 1-Tap Timetable Import
 */
import { MOCK_COMMUNITY_CODES } from '../data/mockImportTemplates.js';
import { OCREngine } from './ocrEngine.js';

export const ShareEngine = {
  /**
   * Generate a unique Share Code for a Class Timetable
   * e.g. "TL-12A3-W03"
   */
  generateClassCode(schoolShort = 'THPT', className = '12A3', week = 'W03') {
    const cleanSchool = schoolShort.replace(/[^a-zA-Z0-9]/g, '').substring(0, 3).toUpperCase() || 'SCH';
    const cleanClass = className.replace(/[^a-zA-Z0-9]/g, '').toUpperCase() || '12A1';
    return `${cleanSchool}-${cleanClass}-${week}`;
  },

  /**
   * Import timetable by class code
   */
  async loadByClassCode(code) {
    await new Promise(r => setTimeout(r, 400));
    const upper = (code || '').trim().toUpperCase();

    // Check preset community database
    if (MOCK_COMMUNITY_CODES[upper] || upper.includes('12A3') || upper.includes('12A1') || upper.includes('11A1')) {
      const className = upper.includes('12A1') ? '12A1' : (upper.includes('11A1') ? '11A1' : '12A3');
      const ocrResult = OCREngine.parseMultiClassMatrix(className);
      return {
        success: true,
        code: upper,
        className,
        school: MOCK_COMMUNITY_CODES[upper]?.school || 'Trường THPT',
        author: MOCK_COMMUNITY_CODES[upper]?.author || 'Lớp trưởng',
        week: MOCK_COMMUNITY_CODES[upper]?.week || 'Tuần 03',
        courses: OCREngine.convertItemsToCourses(ocrResult.items, className)
      };
    }

    return {
      success: false,
      error: `Không tìm thấy thời khóa biểu cho mã "${code}". Vui lòng kiểm tra lại.`
    };
  }
};
