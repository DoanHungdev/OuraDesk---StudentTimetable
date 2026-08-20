/**
 * AcademicCalendar: Vietnamese Academic & Holiday Calendar Engine
 * Manages holidays, excluded dates, semester breaks, exam weeks, and makeup dates.
 * Used by ScheduleEngine to accurately calculate class occurrences and true end dates.
 */

export const ACADEMIC_HOLIDAYS_2026_2027 = [
  // 2026 Holidays
  { date: '2026-01-01', name: 'Tết Dương lịch 2026', type: 'national' },
  { startDate: '2026-02-14', endDate: '2026-02-23', name: 'Nghỉ Tết Nguyên Đán Bính Ngọ 2026', type: 'lunar_tet' },
  { date: '2026-04-26', name: 'Giỗ Tổ Hùng Vương (10/3 ÂL)', type: 'national' },
  { date: '2026-04-30', name: 'Ngày Giải phóng miền Nam 30/4', type: 'national' },
  { date: '2026-05-01', name: 'Ngày Quốc tế Lao động 1/5', type: 'national' },
  { date: '2026-05-02', name: 'Nghỉ bù Quốc tế Lao động', type: 'national' },
  { startDate: '2026-09-01', endDate: '2026-09-03', name: 'Nghỉ Lễ Quốc Khánh 2/9', type: 'national' },
  { startDate: '2026-12-28', endDate: '2027-01-03', name: 'Tuần nghỉ giữa kỳ / Dự trữ', type: 'academic_break' },

  // 2027 Holidays
  { date: '2027-01-01', name: 'Tết Dương lịch 2027', type: 'national' },
  { startDate: '2027-02-05', endDate: '2027-02-16', name: 'Nghỉ Tết Nguyên Đán Đinh Mùi 2027', type: 'lunar_tet' },
  { date: '2027-04-16', name: 'Giỗ Tổ Hùng Vương (10/3 ÂL)', type: 'national' },
  { date: '2027-04-30', name: 'Ngày Giải phóng miền Nam 30/4', type: 'national' },
  { date: '2027-05-01', name: 'Ngày Quốc tế Lao động 1/5', type: 'national' },
  { startDate: '2027-09-01', endDate: '2027-09-03', name: 'Nghỉ Lễ Quốc Khánh 2/9', type: 'national' }
];

export const AcademicCalendar = {
  holidays: [...ACADEMIC_HOLIDAYS_2026_2027],
  customExcludedDates: new Set(),
  makeupDates: new Map(), // '2026-09-05' => '2026-09-02'

  /**
   * Format date to YYYY-MM-DD
   */
  formatDateKey(date) {
    if (!date) return '';
    const d = typeof date === 'string' ? this.parseDate(date) : date;
    if (!d || isNaN(d.getTime())) return '';
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  },

  /**
   * Parse date from DD/MM/YYYY or YYYY-MM-DD
   */
  parseDate(str) {
    if (!str) return new Date();
    if (str instanceof Date) return str;
    if (str.includes('/')) {
      const parts = str.split('/');
      if (parts.length === 3) {
        return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
      }
    }
    return new Date(str);
  },

  /**
   * Format to display date DD/MM/YYYY
   */
  formatDisplayDate(date) {
    if (!date) return '';
    const d = typeof date === 'string' ? this.parseDate(date) : date;
    if (isNaN(d.getTime())) return '';
    const day = String(d.getDate()).padStart(2, '0');
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const y = d.getFullYear();
    return `${day}/${m}/${y}`;
  },

  /**
   * Check if a specific date is a national holiday or scheduled break
   */
  isHoliday(date) {
    const key = this.formatDateKey(date);
    for (const h of this.holidays) {
      if (h.date && h.date === key) {
        return { isHoliday: true, name: h.name, type: h.type };
      }
      if (h.startDate && h.endDate) {
        if (key >= h.startDate && key <= h.endDate) {
          return { isHoliday: true, name: h.name, type: h.type };
        }
      }
    }
    return { isHoliday: false };
  },

  /**
   * Check if date is excluded from regular class schedules
   */
  isExcludedDate(date) {
    const key = this.formatDateKey(date);
    if (this.customExcludedDates.has(key)) {
      return { isExcluded: true, reason: 'Ngày nghỉ do người dùng tùy chỉnh' };
    }
    const holidayCheck = this.isHoliday(date);
    if (holidayCheck.isHoliday) {
      return { isExcluded: true, reason: holidayCheck.name };
    }
    return { isExcluded: false };
  },

  /**
   * Add custom holiday / day off
   */
  addExcludedDate(dateStr, reason = 'Ngày nghỉ') {
    const key = this.formatDateKey(this.parseDate(dateStr));
    this.customExcludedDates.add(key);
    this.holidays.push({ date: key, name: reason, type: 'custom' });
  },

  /**
   * Add custom holiday range
   */
  addHolidayRange(startDateStr, endDateStr, name = 'Tuần nghỉ') {
    const startKey = this.formatDateKey(this.parseDate(startDateStr));
    const endKey = this.formatDateKey(this.parseDate(endDateStr));
    this.holidays.push({ startDate: startKey, endDate: endKey, name, type: 'custom_range' });
  }
};
