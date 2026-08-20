/**
 * Smart OCR & Timetable Import Pipeline Engine
 * "Chụp TKB. Phần còn lại để app lo."
 * Handles Multi-Class Matrix Extraction, Confidence Scoring, and Normalization
 */
import { Normalizer } from './normalizer.js';
import { MOCK_MULTI_CLASS_MATRIX } from '../data/mockImportTemplates.js';
import { HIGH_SCHOOL_TIME_PROFILE } from '../data/highSchoolData.js';

export const OCREngine = {
  /**
   * Parse multi-class table matrix by user's chosen class (e.g. "12A3")
   */
  parseMultiClassMatrix(className = '12A3', matrixData = MOCK_MULTI_CLASS_MATRIX) {
    const rawMatrix = matrixData.scheduleMatrix || [];
    const parsedItems = [];

    const getPeriodTime = (pNum) => {
      const p = HIGH_SCHOOL_TIME_PROFILE.periods.find(item => item.number === pNum);
      return p ? { startTime: p.startTime, endTime: p.endTime } : { startTime: '07:00', endTime: '07:45' };
    };

    rawMatrix.forEach((row, idx) => {
      const rawSubject = row[className];
      if (rawSubject && rawSubject !== '---') {
        const norm = Normalizer.normalizeSubject(rawSubject);
        const { startTime, endTime } = getPeriodTime(row.period);

        // Inject simulated ambiguity for demonstration if row.period === 3 && row.day === 4
        const isSimulatedAmbiguous = row.day === 4 && row.period === 2; // Sinh học vs Hóa học
        const confidence = isSimulatedAmbiguous ? 72 : norm.confidence;
        const needsReview = isSimulatedAmbiguous || norm.needsReview;
        const suggestions = isSimulatedAmbiguous ? ['Sinh học', 'Hóa học', 'Vật lý'] : norm.suggestions;

        parsedItems.push({
          id: `ocr-item-${idx}`,
          day: row.day,
          period: row.period,
          startPeriod: row.period,
          endPeriod: row.period,
          rawText: rawSubject,
          subjectName: norm.name,
          code: norm.code,
          color: norm.color,
          category: norm.category,
          startTime,
          endTime,
          room: `Phòng ${className}`,
          teacher: '',
          confidence,
          needsReview,
          suggestions
        });
      }
    });

    // Group adjacent periods of same subject on same day into multi-period blocks
    const groupedItems = this.groupAdjacentPeriods(parsedItems, className);

    const highCount = groupedItems.filter(i => !i.needsReview && i.confidence >= 90).length;
    const lowCount = groupedItems.length - highCount;

    return {
      success: true,
      source: 'matrix',
      className,
      schoolName: 'Trường THPT',
      totalPeriods: parsedItems.length,
      groupedCourseCount: groupedItems.length,
      highConfidenceCount: highCount,
      lowConfidenceCount: lowCount,
      items: groupedItems
    };
  },

  /**
   * Group consecutive periods of the same subject on the same day into single block
   */
  groupAdjacentPeriods(flatItems, className) {
    const grouped = [];
    const sorted = [...flatItems].sort((a, b) => a.day !== b.day ? a.day - b.day : a.period - b.period);

    let current = null;

    sorted.forEach(item => {
      if (
        current &&
        current.day === item.day &&
        current.subjectName === item.subjectName &&
        item.period === current.endPeriod + 1
      ) {
        current.endPeriod = item.period;
        current.endTime = item.endTime;
        current.sessions = (current.sessions || 1) + 1;
        current.confidence = Math.min(current.confidence, item.confidence);
        if (item.needsReview) current.needsReview = true;
      } else {
        if (current) grouped.push(current);
        current = {
          ...item,
          sessions: 1,
          room: `Phòng ${className}`
        };
      }
    });

    if (current) grouped.push(current);
    return grouped;
  },

  /**
   * Simulate reading image / photo / screenshot
   */
  async processImageUpload(fileOrDataUrl, targetClass = '12A3') {
    // Simulate smart AI OCR processing time (600ms)
    await new Promise(r => setTimeout(r, 600));
    return this.parseMultiClassMatrix(targetClass);
  },

  /**
   * Simulate PDF parser
   */
  async processPDFUpload(fileOrDataUrl, targetClass = '12A3') {
    await new Promise(r => setTimeout(r, 700));
    return this.parseMultiClassMatrix(targetClass);
  },

  /**
   * Simulate Excel / CSV parser
   */
  async processExcelUpload(fileOrDataUrl, targetClass = '12A3') {
    await new Promise(r => setTimeout(r, 500));
    return this.parseMultiClassMatrix(targetClass);
  },

  /**
   * Simulate Public Link Fetcher
   */
  async processLinkFetch(url, targetClass = '12A3') {
    await new Promise(r => setTimeout(r, 800));
    if (!url || !url.startsWith('http')) {
      return { success: false, error: 'Liên kết không hợp lệ.' };
    }
    return this.parseMultiClassMatrix(targetClass);
  },

  /**
   * Convert verified OCR items into persistent courses format
   */
  convertItemsToCourses(verifiedItems, className = '12A3', schoolName = 'Trường THPT Thăng Long') {
    const courseMap = new Map();

    verifiedItems.forEach(item => {
      const key = item.subjectName;
      if (!courseMap.has(key)) {
        courseMap.set(key, {
          id: 'thpt-crs-' + Math.random().toString(36).substr(2, 9),
          name: item.subjectName,
          code: item.code || 'SUB',
          color: item.color || '#AFC8F5',
          category: item.category || 'general',
          teacher: item.teacher || (item.subjectName === 'Toán' ? 'Thầy Nguyễn Văn An' : (item.subjectName === 'Ngữ văn' ? 'Cô Trần Thu Hà' : 'Giáo viên bộ môn')),
          room: item.room || `Phòng ${className}`,
          periodsPerWeek: 0,
          type: item.type || 'theory',
          schedules: [],
          notes: `TKB nhập từ OCR cho lớp ${className}`
        });
      }

      const course = courseMap.get(key);
      course.periodsPerWeek += (item.sessions || 1);
      course.schedules.push({
        id: 'sch-' + Math.random().toString(36).substr(2, 9),
        day: item.day,
        startPeriod: item.startPeriod || item.period,
        endPeriod: item.endPeriod || item.period,
        startTime: item.startTime,
        endTime: item.endTime,
        sessions: item.sessions || 1,
        room: item.room || `Phòng ${className}`,
        teacher: course.teacher,
        type: 'theory'
      });
    });

    return Array.from(courseMap.values());
  }
};
