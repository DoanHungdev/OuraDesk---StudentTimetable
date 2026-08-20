/**
 * CalendarEngine: Centralized Calendar, Week Navigation & Date Synchronizer
 * Single Source of Truth for:
 * - selectedDate (currently viewed or selected date)
 * - displayedWeek (Monday to Sunday of the active week)
 * - academicWeekNumber (computed dynamically from Semester Start Date)
 * - Synchronizing Mini Calendar, Weekly Timetable Grid, and Companion Widgets
 */
import { AcademicCalendar } from '../data/academicCalendar.js';
import { DAY_NAMES } from '../data/mockData.js';

export const CalendarEngine = {
  // Semester 1, 2026-2027 start date (Week 01)
  SEMESTER_START_DATE: '2026-08-03',

  // Current user selected date (default: today)
  selectedDate: new Date(),

  // Current calendar month displayed in Mini Calendar
  calendarMonthDate: new Date(),

  /**
   * Safe comparison of whether two dates represent the same calendar day
   */
  isSameDay(d1, d2) {
    if (!d1 || !d2) return false;
    const date1 = typeof d1 === 'string' ? AcademicCalendar.parseDate(d1) : d1;
    const date2 = typeof d2 === 'string' ? AcademicCalendar.parseDate(d2) : d2;
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  },

  /**
   * Get Monday 00:00:00 of the week containing date
   */
  getMonday(date = this.selectedDate) {
    const d = new Date(date);
    const day = d.getDay(); // 0 = Sun, 1 = Mon ... 6 = Sat
    const diff = (day === 0 ? -6 : 1) - day;
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
  },

  /**
   * Get Sunday 23:59:59 of the week containing monday
   */
  getSunday(monday) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + 6);
    d.setHours(23, 59, 59, 999);
    return d;
  },

  /**
   * Calculate full academic week details for a given date
   */
  getWeekInfo(date = this.selectedDate) {
    const today = new Date();
    const monday = this.getMonday(date);
    const sunday = this.getSunday(monday);

    // Calculate dynamic academic week number from SEMESTER_START_DATE
    const semesterMonday = this.getMonday(AcademicCalendar.parseDate(this.SEMESTER_START_DATE));
    const diffMs = monday.getTime() - semesterMonday.getTime();
    const diffWeeks = Math.round(diffMs / (7 * 24 * 60 * 60 * 1000));
    const weekNumber = diffWeeks + 1;

    let weekLabel = `Tuần ${String(Math.max(1, weekNumber)).padStart(2, '0')}`;
    if (weekNumber <= 0) {
      weekLabel = 'Trước kỳ học';
    } else if (weekNumber >= 20) {
      weekLabel = 'Tuần thi cử';
    }

    const pad = (n) => String(n).padStart(2, '0');
    const startFormatted = `${monday.getDate()} Th${pad(monday.getMonth() + 1)}`;
    const endFormatted = `${sunday.getDate()} Th${pad(sunday.getMonth() + 1)}`;
    const weekDateRange = `${startFormatted} – ${endFormatted}`;

    const isCurrentWeek = this.isSameDay(this.getMonday(today), monday);

    // Generate 7 days metadata for week columns
    const days = [];
    for (let i = 0; i < 7; i++) {
      const curDate = new Date(monday);
      curDate.setDate(monday.getDate() + i);
      const dayNum = curDate.getDay(); // 1=Mon ... 6=Sat, 0=Sun
      const dayInfo = DAY_NAMES.find(d => d.day === dayNum) || { name: `Thứ ${dayNum + 1}`, shortName: `T${dayNum + 1}` };

      days.push({
        dayNum,
        dayName: dayInfo.name,
        shortName: dayInfo.shortName,
        date: curDate,
        dateKey: AcademicCalendar.formatDateKey(curDate),
        dateFormatted: AcademicCalendar.formatDisplayDate(curDate),
        dayOfMonth: curDate.getDate(),
        month: curDate.getMonth() + 1,
        year: curDate.getFullYear(),
        isToday: this.isSameDay(today, curDate),
        isSelected: this.isSameDay(this.selectedDate, curDate)
      });
    }

    return {
      monday,
      sunday,
      weekNumber,
      weekLabel,
      weekDateRange,
      startFormatted,
      endFormatted,
      isCurrentWeek,
      days
    };
  },

  /**
   * Set user selected date and sync displayed month if needed
   */
  selectDate(newDate) {
    const parsed = typeof newDate === 'string' ? AcademicCalendar.parseDate(newDate) : new Date(newDate);
    this.selectedDate = parsed;
    this.calendarMonthDate = new Date(parsed.getFullYear(), parsed.getMonth(), 1);
    return this.getWeekInfo(parsed);
  },

  /**
   * Jump to next week (+7 days, preserving day of week)
   */
  nextWeek() {
    const nextDate = new Date(this.selectedDate);
    nextDate.setDate(nextDate.getDate() + 7);
    return this.selectDate(nextDate);
  },

  /**
   * Jump to previous week (-7 days, preserving day of week)
   */
  prevWeek() {
    const prevDate = new Date(this.selectedDate);
    prevDate.setDate(prevDate.getDate() - 7);
    return this.selectDate(prevDate);
  },

  /**
   * Jump straight back to real today
   */
  goToToday() {
    return this.selectDate(new Date());
  },

  /**
   * Jump directly to a specific academic week number
   */
  selectWeekByNumber(targetWeekNum) {
    const semesterMonday = this.getMonday(AcademicCalendar.parseDate(this.SEMESTER_START_DATE));
    const targetMonday = new Date(semesterMonday);
    targetMonday.setDate(semesterMonday.getDate() + (targetWeekNum - 1) * 7);

    // Keep current selected weekday if possible
    const curDayOfWeek = this.selectedDate.getDay();
    const offset = curDayOfWeek === 0 ? 6 : curDayOfWeek - 1;
    targetMonday.setDate(targetMonday.getDate() + offset);

    return this.selectDate(targetMonday);
  }
};
