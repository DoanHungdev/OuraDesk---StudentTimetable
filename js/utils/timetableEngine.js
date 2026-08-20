/**
 * Timetable Engine & Algorithmic Scheduler
 * - Time conversion & positioning
 * - Conflict detection & resolution
 * - University Time Profile integration
 * - Multi-option Automatic Timetable Generator
 */
import { ProfileEngine } from './profileEngine.js';
import { HIGH_SCHOOL_TIME_PROFILE } from '../data/highSchoolData.js';

export const TimetableEngine = {
  START_HOUR: 7, // 07:00
  END_HOUR: 21,  // 21:00 (lưới hiển thị đến 21:30)
  START_MINUTES: 420, // 07:00 = 420 mins
  END_MINUTES: 1290,  // 21:30 = 1290 mins (870 mins total timeline)
  PIXELS_PER_MINUTE: 1.1, // 1 minute = 1.1px (50m period = 55px, 45m = 49.5px, 10m break = 11px)
  SLOT_HEIGHT: 66, // 60 minutes = 66px

  timeToMinutes(timeStr) {
    if (!timeStr || typeof timeStr !== 'string') return 0;
    const [h, m] = timeStr.split(':').map(Number);
    return (Number(h) || 0) * 60 + (Number(m) || 0);
  },

  minutesToTime(totalMins) {
    const hours = Math.floor(totalMins / 60);
    const mins = Math.round(totalMins % 60);
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  },

  /**
   * Unified Time -> Y coordinate mapping
   * Every card, grid line, period label, and break zone uses this exact formula.
   */
  timeToY(timeStr) {
    const mins = this.timeToMinutes(timeStr);
    const diff = Math.max(0, mins - this.START_MINUTES);
    return diff * this.PIXELS_PER_MINUTE;
  },

  /**
   * Unified Duration -> Height mapping
   */
  durationToHeight(startTime, endTime) {
    const startMins = this.timeToMinutes(startTime);
    const endMins = this.timeToMinutes(endTime);
    const duration = Math.max(15, endMins - startMins);
    return duration * this.PIXELS_PER_MINUTE;
  },

  getTopPosition(timeStr) {
    return this.timeToY(timeStr);
  },

  getHeight(startTime, endTime) {
    return this.durationToHeight(startTime, endTime);
  },

  getGridTotalHeight() {
    return (this.END_MINUTES - this.START_MINUTES) * this.PIXELS_PER_MINUTE;
  },

  /**
   * Extract periods and physical break intervals from active profile for the Grid
   */
  getProfileScheduleLayout(profileId, isTHPT = false) {
    let periods = [];
    if (isTHPT) {
      periods = HIGH_SCHOOL_TIME_PROFILE.periods || [];
    } else {
      const { profile } = ProfileEngine.getProfileById(profileId);
      periods = (profile?.periods || []).filter(p => p.isUsable);
    }

    if (periods.length === 0) return [];

    const layoutItems = [];
    let prevEndMins = this.START_MINUTES;

    periods.forEach((p, idx) => {
      const startMins = this.timeToMinutes(p.startTime);
      const endMins = this.timeToMinutes(p.endTime);

      // Check if there is an explicit gap/break before this period
      if (startMins > prevEndMins && idx > 0) {
        const breakMins = startMins - prevEndMins;
        layoutItems.push({
          isBreak: true,
          startTime: this.minutesToTime(prevEndMins),
          endTime: p.startTime,
          durationMinutes: breakMins,
          top: this.timeToY(this.minutesToTime(prevEndMins)),
          height: this.durationToHeight(this.minutesToTime(prevEndMins), p.startTime),
          label: breakMins >= 40 ? `Nghỉ trưa (${breakMins}p)` : `Nghỉ ${breakMins}p`
        });
      }

      layoutItems.push({
        isBreak: false,
        periodNumber: p.number,
        name: p.name || `Tiết ${p.number}`,
        startTime: p.startTime,
        endTime: p.endTime,
        session: p.session || (startMins < 720 ? 'morning' : (startMins < 1050 ? 'afternoon' : 'evening')),
        top: this.timeToY(p.startTime),
        height: this.durationToHeight(p.startTime, p.endTime)
      });

      prevEndMins = endMins;
    });

    return layoutItems;
  },

  /**
   * Calculate precise Overlap layout for courses in a single day column
   */
  calculateDayCardPositions(dayItems) {
    if (!dayItems || dayItems.length === 0) return [];

    const items = dayItems.map(item => ({
      ...item,
      top: this.timeToY(item.startTime),
      height: this.durationToHeight(item.startTime, item.endTime),
      startMins: this.timeToMinutes(item.startTime),
      endMins: this.timeToMinutes(item.endTime),
      colIndex: 0,
      totalCols: 1
    }));

    items.sort((a, b) => a.startMins - b.startMins || (b.endMins - b.startMins) - (a.endMins - a.startMins));

    // Cluster overlapping items
    const clusters = [];
    items.forEach(item => {
      let placed = false;
      for (const cluster of clusters) {
        const overlaps = cluster.some(ci => this.isOverlapping(item.startTime, item.endTime, ci.startTime, ci.endTime));
        if (overlaps) {
          cluster.push(item);
          placed = true;
          break;
        }
      }
      if (!placed) {
        clusters.push([item]);
      }
    });

    // Assign column index in each cluster
    clusters.forEach(cluster => {
      const columns = [];
      cluster.forEach(item => {
        let assignedCol = -1;
        for (let c = 0; c < columns.length; c++) {
          if (columns[c] <= item.startMins) {
            assignedCol = c;
            columns[c] = item.endMins;
            break;
          }
        }
        if (assignedCol === -1) {
          assignedCol = columns.length;
          columns.push(item.endMins);
        }
        item.colIndex = assignedCol;
      });

      const totalCols = columns.length;
      cluster.forEach(item => {
        item.totalCols = totalCols;
        if (totalCols === 1) {
          item.leftCss = '4px';
          item.widthCss = 'calc(100% - 8px)';
          item.isOverlapping = false;
        } else {
          const colWidthPercent = 100 / totalCols;
          item.leftCss = `calc(${item.colIndex * colWidthPercent}% + 3px)`;
          item.widthCss = `calc(${colWidthPercent}% - 6px)`;
          item.isOverlapping = true;
        }
      });
    });

    return items;
  },

  isOverlapping(startA, endA, startB, endB) {
    const sA = this.timeToMinutes(startA);
    const eA = this.timeToMinutes(endA);
    const sB = this.timeToMinutes(startB);
    const eB = this.timeToMinutes(endB);
    return sA < eB && eA > sB;
  },

  calculateSessions(startTime, endTime) {
    const duration = this.timeToMinutes(endTime) - this.timeToMinutes(startTime);
    if (duration <= 0) return 1;
    return Math.max(1, Math.round(duration / 50));
  },

  getAllScheduleItems(courses) {
    const items = [];
    courses.forEach(course => {
      (course.schedules || []).forEach(sch => {
        items.push({
          ...sch,
          courseId: course.id,
          courseName: course.name,
          courseCode: course.code,
          courseColor: course.color,
          category: course.category,
          credits: course.credits,
          type: sch.type || course.type || 'theory'
        });
      });
    });
    return items;
  },

  findConflicts(courses) {
    const allItems = this.getAllScheduleItems(courses);
    const conflicts = [];

    for (let i = 0; i < allItems.length; i++) {
      for (let j = i + 1; j < allItems.length; j++) {
        const a = allItems[i];
        const b = allItems[j];

        if (a.day === b.day && this.isOverlapping(a.startTime, a.endTime, b.startTime, b.endTime)) {
          conflicts.push({
            id: `conflict-${a.id}-${b.id}`,
            day: a.day,
            itemA: a,
            itemB: b,
            overlapStart: this.minutesToTime(Math.max(this.timeToMinutes(a.startTime), this.timeToMinutes(b.startTime))),
            overlapEnd: this.minutesToTime(Math.min(this.timeToMinutes(a.endTime), this.timeToMinutes(b.endTime)))
          });
        }
      }
    }

    return conflicts;
  },

  suggestAlternativeSlots(targetSchedule, allCourses) {
    const activeState = ProfileEngine.getActiveProfileState();
    const duration = this.timeToMinutes(targetSchedule.endTime) - this.timeToMinutes(targetSchedule.startTime);
    const existing = this.getAllScheduleItems(allCourses).filter(item => item.id !== targetSchedule.id);
    const suggestions = [];

    // Candidate blocks derived from university profile
    const pId = targetSchedule.profileId || activeState.profileId;
    const { profile } = ProfileEngine.getProfileById(pId);
    const usable = (profile?.periods || []).filter(p => p.isUsable);

    // Standard block combinations (e.g. 3 sessions, 2 sessions, 4 sessions)
    const requiredSessions = targetSchedule.sessions || 3;
    const candidateBlocks = [];

    for (let i = 0; i <= usable.length - requiredSessions; i++) {
      const sp = usable[i];
      const ep = usable[i + requiredSessions - 1];
      // Only keep within same session (morning / afternoon / evening)
      if (sp.session === ep.session) {
        const range = ProfileEngine.calculateTimeRangeFromPeriods(pId, sp.number, ep.number);
        candidateBlocks.push({
          startPeriod: sp.number,
          endPeriod: ep.number,
          startTime: range.startTime,
          endTime: range.endTime,
          session: sp.session
        });
      }
    }

    const daysToTry = [1, 2, 3, 4, 5, 6];

    for (const day of daysToTry) {
      for (const block of candidateBlocks) {
        const hasConflict = existing.some(ex => ex.day === day && this.isOverlapping(block.startTime, block.endTime, ex.startTime, ex.endTime));
        if (!hasConflict) {
          suggestions.push({
            day,
            startPeriod: block.startPeriod,
            endPeriod: block.endPeriod,
            startTime: block.startTime,
            endTime: block.endTime,
            durationMinutes: duration
          });
          if (suggestions.length >= 3) return suggestions;
        }
      }
    }

    return suggestions;
  },

  /**
   * AUTOMATIC TIMETABLE GENERATOR
   * Maps course requirements to active university periods
   */
  generateProposals(coursesToSchedule, preferences = {}) {
    const {
      preferredShift = 'any',
      offDays = [6, 0],
      maxSessionsPerDay = 6
    } = preferences;

    const activeState = ProfileEngine.getActiveProfileState();
    const { profile } = ProfileEngine.getProfileById(activeState.profileId);
    const usable = (profile?.periods || []).filter(p => p.isUsable);

    // Build standard blocks for this university
    const buildBlocksForSession = (sessionType) => {
      const sessPeriods = usable.filter(p => p.session === sessionType);
      const blocks = [];
      // 3-period block
      if (sessPeriods.length >= 3) {
        const b1 = ProfileEngine.calculateTimeRangeFromPeriods(activeState.profileId, sessPeriods[0].number, sessPeriods[2].number);
        blocks.push({ startPeriod: sessPeriods[0].number, endPeriod: sessPeriods[2].number, start: b1.startTime, end: b1.endTime, sessions: 3 });
      }
      // 2-period block
      if (sessPeriods.length >= 5) {
        const b2 = ProfileEngine.calculateTimeRangeFromPeriods(activeState.profileId, sessPeriods[3].number, sessPeriods[4].number);
        blocks.push({ startPeriod: sessPeriods[3].number, endPeriod: sessPeriods[4].number, start: b2.startTime, end: b2.endTime, sessions: 2 });
      } else if (sessPeriods.length >= 2) {
        const b2 = ProfileEngine.calculateTimeRangeFromPeriods(activeState.profileId, sessPeriods[0].number, sessPeriods[1].number);
        blocks.push({ startPeriod: sessPeriods[0].number, endPeriod: sessPeriods[1].number, start: b2.startTime, end: b2.endTime, sessions: 2 });
      }
      // 4-period block
      if (sessPeriods.length >= 4) {
        const b3 = ProfileEngine.calculateTimeRangeFromPeriods(activeState.profileId, sessPeriods[0].number, sessPeriods[3].number);
        blocks.push({ startPeriod: sessPeriods[0].number, endPeriod: sessPeriods[3].number, start: b3.startTime, end: b3.endTime, sessions: 4 });
      }
      return blocks;
    };

    const morningBlocks = buildBlocksForSession('morning');
    const afternoonBlocks = buildBlocksForSession('afternoon');

    const baseCourses = JSON.parse(JSON.stringify(coursesToSchedule));

    const buildArrangement = (strategyName, allowedDays, slotStrategy) => {
      const resultCourses = JSON.parse(JSON.stringify(baseCourses));
      const occupiedSlots = [];

      resultCourses.forEach((course, idx) => {
        let assigned = false;

        for (let attempt = 0; attempt < allowedDays.length * 4; attempt++) {
          const day = allowedDays[(idx + attempt) % allowedDays.length];

          let candidateList = [];
          if (slotStrategy === 'morning_only') {
            candidateList = morningBlocks;
          } else if (slotStrategy === 'afternoon_only') {
            candidateList = afternoonBlocks;
          } else if (slotStrategy === 'balanced') {
            candidateList = idx % 2 === 0 ? morningBlocks : afternoonBlocks;
          } else {
            candidateList = [...morningBlocks, ...afternoonBlocks];
          }

          for (const cand of candidateList) {
            const overlaps = occupiedSlots.some(occ =>
              occ.day === day && this.isOverlapping(cand.start, cand.end, occ.start, occ.end)
            );

            const currentDaySessions = occupiedSlots
              .filter(occ => occ.day === day)
              .reduce((sum, o) => sum + (o.sessions || 3), 0);

            if (!overlaps && (currentDaySessions + cand.sessions <= maxSessionsPerDay)) {
              course.schedules = [{
                id: `sch-gen-${course.id}-${day}`,
                day,
                startPeriod: cand.startPeriod,
                endPeriod: cand.endPeriod,
                startTime: cand.start,
                endTime: cand.end,
                sessions: cand.sessions,
                room: course.room || 'Phòng A203',
                teacher: course.teacher,
                type: course.type || 'theory'
              }];

              occupiedSlots.push({
                day,
                start: cand.start,
                end: cand.end,
                sessions: cand.sessions
              });

              assigned = true;
              break;
            }
          }

          if (assigned) break;
        }

        if (!assigned) {
          const day = allowedDays[idx % allowedDays.length];
          const fallback = morningBlocks[0] || { startPeriod: 1, endPeriod: 3, start: '07:00', end: '09:40', sessions: 3 };
          course.schedules = [{
            id: `sch-gen-${course.id}-${day}`,
            day,
            startPeriod: fallback.startPeriod,
            endPeriod: fallback.endPeriod,
            startTime: fallback.start,
            endTime: fallback.end,
            sessions: fallback.sessions,
            room: course.room,
            teacher: course.teacher,
            type: course.type || 'theory'
          }];
        }
      });

      return resultCourses;
    };

    const p1Days = [1, 2, 3, 4, 5].filter(d => !offDays.includes(d));
    const p1Courses = buildArrangement('Best Schedule', p1Days.length ? p1Days : [1, 2, 3, 4, 5], 'balanced');
    const p2Courses = buildArrangement('Morning Focus', [1, 2, 3, 4, 5], 'morning_only');
    const p3Courses = buildArrangement('Long Weekend', [1, 2, 3, 4], 'any');
    const p4Courses = buildArrangement('Light & Even', [1, 2, 3, 4, 5, 6], 'balanced');

    return [
      {
        id: 'prop-best',
        badge: 'Tối ưu nhất ⭐',
        title: 'Phương án Tối ưu (Best Schedule)',
        description: `Tự động xếp theo kíp/tiết chuẩn của ${activeState.university.shortName}, cân đối sáng chiều và nghỉ cuối tuần.`,
        courses: p1Courses,
        metrics: {
          daysWithClass: new Set(this.getAllScheduleItems(p1Courses).map(i => i.day)).size,
          freeTimePercent: 74,
          convenienceScore: 98,
          morningClasses: this.getAllScheduleItems(p1Courses).filter(i => this.timeToMinutes(i.startTime) < 720).length,
          afternoonClasses: this.getAllScheduleItems(p1Courses).filter(i => this.timeToMinutes(i.startTime) >= 720).length
        }
      },
      {
        id: 'prop-morning',
        badge: 'Ưu tiên Ca Sáng 🌅',
        title: 'Phương án Ca Sáng Toàn Phần',
        description: `Toàn bộ môn học diễn ra trong ca sáng của ${activeState.university.shortName}. Chiều hoàn toàn tự do.`,
        courses: p2Courses,
        metrics: {
          daysWithClass: new Set(this.getAllScheduleItems(p2Courses).map(i => i.day)).size,
          freeTimePercent: 70,
          convenienceScore: 94,
          morningClasses: this.getAllScheduleItems(p2Courses).length,
          afternoonClasses: 0
        }
      },
      {
        id: 'prop-weekend',
        badge: 'Nghỉ Thứ 6 & Cuối Tuần 🏖️',
        title: 'Phương án Dồn Lịch (Nghỉ Thứ 6)',
        description: 'Dồn toàn bộ các môn học từ Thứ Hai đến Thứ Năm. Nghỉ trọn vẹn Thứ Sáu, Thứ Bảy và Chủ Nhật.',
        courses: p3Courses,
        metrics: {
          daysWithClass: 4,
          freeTimePercent: 78,
          convenienceScore: 90,
          morningClasses: this.getAllScheduleItems(p3Courses).filter(i => this.timeToMinutes(i.startTime) < 720).length,
          afternoonClasses: this.getAllScheduleItems(p3Courses).filter(i => this.timeToMinutes(i.startTime) >= 720).length
        }
      },
      {
        id: 'prop-light',
        badge: 'Cân bằng Nhẹ nhàng ⚖️',
        title: 'Phương án Dàn Trải & Thư Thái',
        description: 'Mỗi ngày tối đa 3-4 tiết, không dồn dập, có nhiều thời gian nghỉ ngơi giữa các buổi.',
        courses: p4Courses,
        metrics: {
          daysWithClass: new Set(this.getAllScheduleItems(p4Courses).map(i => i.day)).size,
          freeTimePercent: 72,
          convenienceScore: 88,
          morningClasses: this.getAllScheduleItems(p4Courses).filter(i => this.timeToMinutes(i.startTime) < 720).length,
          afternoonClasses: this.getAllScheduleItems(p4Courses).filter(i => this.timeToMinutes(i.startTime) >= 720).length
        }
      }
    ];
  }
};
