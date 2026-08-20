/**
 * ScheduleEngine: Centralized Scheduling & Academic Progression Engine
 * 
 * Single Source of Truth for:
 * 1. Exact Period & Time Mapping (Time Profile -> ScheduleProfile -> Period)
 * 2. True Occurrence Simulation (Day-by-day calendar simulation, skipping holidays)
 * 3. Exact Calculated End Date (Auto-computed based on total periods & weekly schedule blocks)
 * 4. Multi-session Per Week (e.g. Mon 2 periods + Thu 3 periods = 5 periods/week)
 * 5. Remainder & Partial Occurrence Handling (e.g. 40 periods @ 3/week = 13 weeks x 3 + 1 session x 1)
 * 6. Progress Tracking (Completed vs Remaining periods, percent completed)
 */
import { AcademicCalendar } from '../data/academicCalendar.js';
import { ProfileEngine } from './profileEngine.js';
import { HIGH_SCHOOL_TIME_PROFILE } from '../data/highSchoolData.js';

export const ScheduleEngine = {
  /**
   * Calculate all metadata, occurrences, and exact end date for a course schedule
   * 
   * @param {Object} params
   * @param {string|Date} params.startDate - e.g. "2026-08-18" or "18/08/2026"
   * @param {number} params.totalPeriods - e.g. 45 or 40
   * @param {Array} params.schedules - array of weekly slots: [{ day: 2, startPeriod: 1, endPeriod: 3, ... }]
   * @param {string} params.mode - 'university' | 'high_school'
   * @param {string} params.profileId - (optional) university profile ID
   * @returns {Object} Calculated schedule summary
   */
  calculateScheduleMeta({
    startDate = '2026-08-18',
    totalPeriods = 45,
    schedules = [],
    mode = 'university',
    profileId = null
  }) {
    const isTHPT = mode === 'high_school';
    const parsedStart = AcademicCalendar.parseDate(startDate);
    const validTotalPeriods = Math.max(1, Number(totalPeriods) || 45);

    // Normalize schedules
    const normalizedSchedules = (schedules || []).map(s => {
      const dayNum = Number(s.day ?? s.dayOfWeek ?? 1);
      const startP = Number(s.startPeriod || 1);
      const endP = Number(s.endPeriod || startP);
      const sessions = Math.max(1, endP - startP + 1);

      // Auto resolve exact times from Profile Engine
      let timeRange;
      if (isTHPT) {
        const p1 = HIGH_SCHOOL_TIME_PROFILE.periods.find(p => p.number === startP) || HIGH_SCHOOL_TIME_PROFILE.periods[0];
        const p2 = HIGH_SCHOOL_TIME_PROFILE.periods.find(p => p.number === endP) || p1;
        timeRange = { startTime: p1.startTime, endTime: p2.endTime };
      } else {
        const activeProfileId = profileId || ProfileEngine.getActiveProfileState().profileId;
        timeRange = ProfileEngine.calculateTimeRangeFromPeriods(activeProfileId, startP, endP);
      }

      return {
        ...s,
        day: dayNum,
        dayOfWeek: dayNum,
        startPeriod: startP,
        endPeriod: endP,
        sessions,
        startTime: timeRange.startTime || s.startTime || '07:00',
        endTime: timeRange.endTime || s.endTime || '09:40',
        room: s.room || (isTHPT ? 'Phòng 11A2' : 'Phòng A203'),
        teacher: s.teacher || ''
      };
    });

    // Total weekly periods
    const periodsPerWeek = normalizedSchedules.reduce((sum, s) => sum + s.sessions, 0);

    if (periodsPerWeek === 0 || normalizedSchedules.length === 0) {
      return {
        startDateFormatted: AcademicCalendar.formatDisplayDate(parsedStart),
        startDateIso: AcademicCalendar.formatDateKey(parsedStart),
        calculatedEndDate: AcademicCalendar.formatDisplayDate(parsedStart),
        calculatedEndDateIso: AcademicCalendar.formatDateKey(parsedStart),
        periodsPerWeek: 0,
        totalSessions: 0,
        totalWeeks: 0,
        totalPeriods: validTotalPeriods,
        occurrences: [],
        schedules: normalizedSchedules,
        isOddRemainder: false
      };
    }

    // Sort schedule slots by day (1=Mon ... 6=Sat, 0=Sun)
    const sortedSchedules = [...normalizedSchedules].sort((a, b) => {
      const dayA = a.day === 0 ? 7 : a.day;
      const dayB = b.day === 0 ? 7 : b.day;
      return dayA - dayB;
    });

    // Occurrence simulation
    let currentDate = new Date(parsedStart);
    let remainingPeriods = validTotalPeriods;
    const occurrences = [];
    let loopGuard = 0;
    const MAX_DAYS = 400; // Limit to prevent infinite loop

    while (remainingPeriods > 0 && loopGuard < MAX_DAYS) {
      const currentDayOfWeek = currentDate.getDay(); // 0=Sun, 1=Mon, 2=Tue...

      // Check if current day matches any schedule slot
      const matchingSlots = sortedSchedules.filter(s => s.day === currentDayOfWeek);

      for (const slot of matchingSlots) {
        if (remainingPeriods <= 0) break;

        // Check if date is a holiday or excluded day
        const exclusion = AcademicCalendar.isExcludedDate(currentDate);
        if (exclusion.isExcluded) {
          // Log skipped holiday occurrence
          continue;
        }

        const slotPeriods = slot.sessions;
        const periodsToDeduct = Math.min(remainingPeriods, slotPeriods);
        const isPartial = periodsToDeduct < slotPeriods;

        remainingPeriods -= periodsToDeduct;

        occurrences.push({
          sessionNumber: occurrences.length + 1,
          date: new Date(currentDate),
          dateFormatted: AcademicCalendar.formatDisplayDate(currentDate),
          dateIso: AcademicCalendar.formatDateKey(currentDate),
          dayOfWeek: currentDayOfWeek,
          startPeriod: slot.startPeriod,
          endPeriod: isPartial ? (slot.startPeriod + periodsToDeduct - 1) : slot.endPeriod,
          startTime: slot.startTime,
          endTime: slot.endTime,
          periodsConsumed: periodsToDeduct,
          isPartial,
          room: slot.room,
          teacher: slot.teacher
        });
      }

      currentDate.setDate(currentDate.getDate() + 1);
      loopGuard++;
    }

    const lastOccurrence = occurrences[occurrences.length - 1] || {
      date: parsedStart,
      dateFormatted: AcademicCalendar.formatDisplayDate(parsedStart),
      dateIso: AcademicCalendar.formatDateKey(parsedStart)
    };

    // Calculate elapsed calendar weeks from start to end
    const startMs = parsedStart.getTime();
    const endMs = lastOccurrence.date.getTime();
    const diffDays = Math.max(0, Math.round((endMs - startMs) / (1000 * 60 * 60 * 24)));
    const totalWeeks = Math.max(1, Math.ceil((diffDays + 1) / 7));

    const isOddRemainder = occurrences.some(o => o.isPartial);

    return {
      startDateFormatted: AcademicCalendar.formatDisplayDate(parsedStart),
      startDateIso: AcademicCalendar.formatDateKey(parsedStart),
      calculatedEndDate: lastOccurrence.dateFormatted,
      calculatedEndDateIso: lastOccurrence.dateIso,
      periodsPerWeek,
      totalSessions: occurrences.length,
      totalWeeks,
      totalPeriods: validTotalPeriods,
      occurrences,
      schedules: normalizedSchedules,
      isOddRemainder,
      remainderPeriods: isOddRemainder ? (validTotalPeriods % periodsPerWeek) : 0
    };
  },

  /**
   * Calculate actual occurrences, total sessions and total periods between startDate and a manual endDate
   */
  calculateOccurrencesBetweenDates({
    startDate,
    endDate,
    schedules = [],
    totalTargetPeriods = 45,
    mode = 'university',
    profileId = null
  }) {
    const parsedStart = AcademicCalendar.parseDate(startDate);
    const parsedEnd = AcademicCalendar.parseDate(endDate);
    const target = Math.max(1, Number(totalTargetPeriods) || 45);

    if (!parsedStart || !parsedEnd || parsedEnd < parsedStart) {
      return {
        isValidRange: false,
        actualSessions: 0,
        actualPeriods: 0,
        targetPeriods: target,
        deficitPeriods: target,
        surplusPeriods: 0,
        isSufficient: false,
        totalWeeks: 0,
        occurrences: [],
        startDateFormatted: parsedStart ? AcademicCalendar.formatDisplayDate(parsedStart) : '',
        endDateFormatted: parsedEnd ? AcademicCalendar.formatDisplayDate(parsedEnd) : ''
      };
    }

    const isTHPT = mode === 'high_school';
    const normalizedSchedules = (schedules || []).map(s => {
      const dayNum = Number(s.day ?? s.dayOfWeek ?? 1);
      const startP = Number(s.startPeriod || 1);
      const endP = Number(s.endPeriod || startP);
      const sessions = Math.max(1, endP - startP + 1);
      return { ...s, day: dayNum, startPeriod: startP, endPeriod: endP, sessions };
    });

    const sortedSchedules = [...normalizedSchedules].sort((a, b) => {
      const dayA = a.day === 0 ? 7 : a.day;
      const dayB = b.day === 0 ? 7 : b.day;
      return dayA - dayB;
    });

    let currentDate = new Date(parsedStart);
    const occurrences = [];
    let loopGuard = 0;
    const MAX_DAYS = 500;

    while (currentDate.getTime() <= parsedEnd.getTime() && loopGuard < MAX_DAYS) {
      const currentDayOfWeek = currentDate.getDay();
      const matchingSlots = sortedSchedules.filter(s => s.day === currentDayOfWeek);

      for (const slot of matchingSlots) {
        const exclusion = AcademicCalendar.isExcludedDate(currentDate);
        if (exclusion.isExcluded) continue;

        occurrences.push({
          sessionNumber: occurrences.length + 1,
          date: new Date(currentDate),
          dateFormatted: AcademicCalendar.formatDisplayDate(currentDate),
          dateIso: AcademicCalendar.formatDateKey(currentDate),
          dayOfWeek: currentDayOfWeek,
          periodsConsumed: slot.sessions,
          room: slot.room,
          teacher: slot.teacher
        });
      }

      currentDate.setDate(currentDate.getDate() + 1);
      loopGuard++;
    }

    const actualPeriods = occurrences.reduce((sum, o) => sum + o.periodsConsumed, 0);
    const isSufficient = actualPeriods >= target;
    const deficitPeriods = Math.max(0, target - actualPeriods);
    const surplusPeriods = Math.max(0, actualPeriods - target);

    const diffDays = Math.max(0, Math.round((parsedEnd.getTime() - parsedStart.getTime()) / (1000 * 60 * 60 * 24)));
    const totalWeeks = Math.max(1, Math.ceil((diffDays + 1) / 7));

    return {
      isValidRange: true,
      actualSessions: occurrences.length,
      actualPeriods,
      targetPeriods: target,
      deficitPeriods,
      surplusPeriods,
      isSufficient,
      totalWeeks,
      occurrences,
      startDateFormatted: AcademicCalendar.formatDisplayDate(parsedStart),
      endDateFormatted: AcademicCalendar.formatDisplayDate(parsedEnd)
    };
  },

  /**
   * Check if a course is active on a specific date (dateKey YYYY-MM-DD)
   */
  isCourseActiveOnDate(course, date) {
    if (!course) return false;
    const curDate = typeof date === 'string' ? AcademicCalendar.parseDate(date) : date;
    const dateKey = AcademicCalendar.formatDateKey(curDate);
    if (!dateKey) return false;

    const startKey = AcademicCalendar.formatDateKey(course.startDate) || '2026-08-03';
    const endRaw = course.endDateMode === 'manual' && course.customEndDate
      ? course.customEndDate
      : (course.calculatedEndDateIso || course.calculatedEndDate || course.endDate || '2026-12-31');
    const endKey = AcademicCalendar.formatDateKey(endRaw) || '2026-12-31';

    return dateKey >= startKey && dateKey <= endKey;
  },

  /**
   * Get all active schedule occurrences for a specific week (Monday to Sunday)
   * Strictly filters by date range: course.startDate <= dayDate <= course.endDate
   * Matches day of week and resolves exact time/period blocks
   */
  getScheduleForWeek(courses = [], weekMonday, weekSunday) {
    const monday = new Date(weekMonday);
    monday.setHours(0, 0, 0, 0);

    const occurrences = [];

    // Loop through 7 days of the week (Monday = 1 ... Saturday = 6, Sunday = 0)
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const curDate = new Date(monday);
      curDate.setDate(monday.getDate() + dayOffset);
      const dateKey = AcademicCalendar.formatDateKey(curDate);
      const dayOfWeek = curDate.getDay();

      const holidayInfo = AcademicCalendar.isHoliday(curDate);

      for (const course of (courses || [])) {
        if (!this.isCourseActiveOnDate(course, curDate)) {
          continue; // Out of date range
        }

        for (const sch of (course.schedules || [])) {
          const schDay = Number(sch.day ?? sch.dayOfWeek ?? 1);
          if (schDay === dayOfWeek) {
            occurrences.push({
              ...sch,
              id: `${sch.id || 'sch'}-${dateKey}`,
              scheduleId: sch.id,
              courseId: course.id,
              courseName: course.name,
              courseCode: course.code || 'MÔN',
              courseColor: course.color || '#AFC8F5',
              category: course.category || course.courseGroupId,
              credits: course.credits || 3,
              type: sch.type || course.type || 'theory',
              day: dayOfWeek,
              dateKey,
              dateFormatted: AcademicCalendar.formatDisplayDate(curDate),
              startPeriod: sch.startPeriod,
              endPeriod: sch.endPeriod,
              startTime: sch.startTime,
              endTime: sch.endTime,
              sessions: sch.sessions || (sch.endPeriod && sch.startPeriod ? sch.endPeriod - sch.startPeriod + 1 : 2),
              room: sch.room || course.room || 'A203',
              teacher: sch.teacher || course.teacher || '',
              isHoliday: holidayInfo.isHoliday,
              holidayName: holidayInfo.name || ''
            });
          }
        }
      }
    }

    return occurrences;
  },

  /**
   * Get active occurrences on a single specific date
   */
  getOccurrencesForDate(courses = [], date = new Date()) {
    const curDate = typeof date === 'string' ? AcademicCalendar.parseDate(date) : date;
    const dateKey = AcademicCalendar.formatDateKey(curDate);
    const dayOfWeek = curDate.getDay();

    const occurrences = [];
    for (const course of (courses || [])) {
      if (!this.isCourseActiveOnDate(course, curDate)) {
        continue;
      }

      for (const sch of (course.schedules || [])) {
        const schDay = Number(sch.day ?? sch.dayOfWeek ?? 1);
        if (schDay === dayOfWeek) {
          occurrences.push({
            ...sch,
            id: `${sch.id || 'sch'}-${dateKey}`,
            scheduleId: sch.id,
            courseId: course.id,
            courseName: course.name,
            courseCode: course.code || 'MÔN',
            courseColor: course.color || '#AFC8F5',
            category: course.category || course.courseGroupId,
            credits: course.credits || 3,
            type: sch.type || course.type || 'theory',
            day: dayOfWeek,
            dateKey,
            dateFormatted: AcademicCalendar.formatDisplayDate(curDate),
            startPeriod: sch.startPeriod,
            endPeriod: sch.endPeriod,
            startTime: sch.startTime,
            endTime: sch.endTime,
            sessions: sch.sessions || (sch.endPeriod && sch.startPeriod ? sch.endPeriod - sch.startPeriod + 1 : 2),
            room: sch.room || course.room || 'A203',
            teacher: sch.teacher || course.teacher || ''
          });
        }
      }
    }

    return occurrences;
  },

  /**
   * Calculate progress for a course as of today or specified date
   */
  calculateCourseProgress(course, asOfDate = new Date()) {
    const meta = this.calculateScheduleMeta({
      startDate: course.startDate || '2026-08-18',
      totalPeriods: course.totalHours || course.totalPeriods || (course.credits * 15) || 45,
      schedules: course.schedules || [],
      mode: course.credits > 0 ? 'university' : 'high_school',
      profileId: course.profileId
    });

    const asOfTime = asOfDate instanceof Date ? asOfDate.getTime() : new Date(asOfDate).getTime();
    const completedOccurrences = meta.occurrences.filter(o => o.date.getTime() <= asOfTime);
    const completedPeriods = completedOccurrences.reduce((sum, o) => sum + o.periodsConsumed, 0);
    const remainingPeriods = Math.max(0, meta.totalPeriods - completedPeriods);
    const progressPercent = Math.min(100, Math.round((completedPeriods / meta.totalPeriods) * 100));

    return {
      totalPeriods: meta.totalPeriods,
      completedPeriods,
      remainingPeriods,
      completedSessions: completedOccurrences.length,
      totalSessions: meta.totalSessions,
      progressPercent,
      isCompleted: completedPeriods >= meta.totalPeriods,
      startDateFormatted: meta.startDateFormatted,
      calculatedEndDate: meta.calculatedEndDate,
      totalWeeks: meta.totalWeeks,
      periodsPerWeek: meta.periodsPerWeek
    };
  }
};
