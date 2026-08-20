/**
 * TimetableView: Weekly Timetable Centerpiece
 * 
 * Key Features:
 * 1. Single Source of Truth via CalendarEngine & ScheduleEngine
 * 2. Strict Date Range & Recurrence filtering (Only renders active course occurrences)
 * 3. Dynamic Week Switching (<, >, [Hôm nay], Week select dropdown)
 * 4. Day column dates derived dynamically from active week Monday
 * 5. Period-based Time Axis matching University / High School Time Profile
 * 6. Conflict detection & visual overlap layout (50%-50%)
 */
import { TimetableEngine } from '../utils/timetableEngine.js';
import { ProfileEngine } from '../utils/profileEngine.js';
import { Storage } from '../utils/storage.js';
import { CalendarEngine } from '../utils/calendarEngine.js';
import { ScheduleEngine } from '../utils/scheduleEngine.js';
import { DAY_NAMES } from '../data/mockData.js';
import { HIGH_SCHOOL_TIME_PROFILE } from '../data/highSchoolData.js';

export const TimetableView = {
  onReRender: null,
  hoveredSlot: null,

  render(courses = [], onSelectCourse, onSlotClick, onMoveSchedule, onResolveConflict, onSwitchUniversity, onOpenAddMenu, onExportWallpaper, onShareClass, onCopySchedule, onDeleteSchedule) {
    const mode = Storage.getMode();
    const isTHPT = mode === 'high_school';
    const activeState = ProfileEngine.getActiveProfileState();

    // 1. Get central academic week information from CalendarEngine
    const weekInfo = CalendarEngine.getWeekInfo();
    const { monday, sunday, weekNumber, weekLabel, weekDateRange, days, isCurrentWeek } = weekInfo;

    // 2. Query only schedule occurrences active within this exact week (Monday to Sunday)
    const weekOccurrences = ScheduleEngine.getScheduleForWeek(courses, monday, sunday);
    const conflicts = TimetableEngine.findConflicts(weekOccurrences);

    // 3. Resolve profile schedule layout for time axis & grid rows
    let scheduleLayout = [];
    if (typeof TimetableEngine.getProfileScheduleLayout === 'function') {
      scheduleLayout = TimetableEngine.getProfileScheduleLayout(activeState.profileId, isTHPT);
    } else {
      const periods = isTHPT 
        ? (HIGH_SCHOOL_TIME_PROFILE?.periods || [])
        : (activeState.profile?.periods || []).filter(p => p.isUsable);
      scheduleLayout = (periods || []).map(p => ({
        isBreak: false,
        periodNumber: p.number,
        name: p.name || `Tiết ${p.number}`,
        startTime: p.startTime,
        endTime: p.endTime,
        top: TimetableEngine.timeToY ? TimetableEngine.timeToY(p.startTime) : 0,
        height: TimetableEngine.durationToHeight ? TimetableEngine.durationToHeight(p.startTime, p.endTime) : 55
      }));
    }

    const totalGridHeight = (typeof TimetableEngine.getGridTotalHeight === 'function')
      ? TimetableEngine.getGridTotalHeight()
      : 960;

    // Days to show: Mon - Sat for THPT, Mon - Sun for Univ
    const daysToShow = isTHPT ? [1, 2, 3, 4, 5, 6] : [1, 2, 3, 4, 5, 6, 0];

    // 4. Generate Day Headers with dynamic dates from active week
    const dayHeadersHtml = daysToShow.map(dayNum => {
      const dayMeta = days.find(d => d.dayNum === dayNum) || {
        shortName: `T${dayNum + 1}`,
        dayOfMonth: 1,
        isToday: false,
        isSelected: false,
        dateKey: ''
      };

      return `
        <div class="day-header-cell ${dayMeta.isToday ? 'is-today' : ''} ${dayMeta.isSelected ? 'is-selected-day' : ''}" data-day="${dayNum}" data-date="${dayMeta.dateKey}" style="cursor: pointer;" title="Bấm để chọn ngày này">
          <div class="day-name">${dayMeta.shortName}</div>
          <div class="day-date-badge ${dayMeta.isToday ? 'current-date-circle' : ''}">${dayMeta.dayOfMonth}</div>
        </div>
      `;
    }).join('');

    // 5. Generate Time Axis Period Slots & Break Slots
    const timeSlotsHtml = (scheduleLayout || []).map(item => {
      if (item.isBreak) {
        return `
          <div class="time-break-slot" style="top: ${item.top}px; height: ${item.height}px;">
            <span class="break-tag">${item.label}</span>
          </div>
        `;
      }
      return `
        <div class="time-period-slot" style="top: ${item.top}px; height: ${item.height}px;">
          <div class="period-num-badge">Tiết ${item.periodNumber}</div>
          <div class="period-time-range">${item.startTime}–${item.endTime}</div>
        </div>
      `;
    }).join('');

    // 6. Grid backdrop lines & break zones across each day column
    const gridBackdropLinesHtml = `
      <div class="grid-layout-backdrop" style="position: absolute; inset: 0; pointer-events: none;">
        ${(scheduleLayout || []).map(item => {
          if (item.isBreak) {
            return `<div class="grid-break-zone" style="position: absolute; top: ${item.top}px; height: ${item.height}px; left: 0; right: 0;"></div>`;
          }
          return `<div class="grid-period-slot-row" style="position: absolute; top: ${item.top}px; height: ${item.height}px; left: 0; right: 0;"></div>`;
        }).join('')}
      </div>
    `;

    // 7. Generate Day Columns & Course Blocks for this week
    const now = new Date();
    const dayColumnsHtml = daysToShow.map(dayNum => {
      const dayMeta = days.find(d => d.dayNum === dayNum);
      const isToday = dayMeta?.isToday || false;
      const isSelected = dayMeta?.isSelected || false;

      // Filter occurrences for this specific day
      const dayItems = weekOccurrences.filter(item => Number(item.day) === Number(dayNum));
      const positionedCards = (typeof TimetableEngine.calculateDayCardPositions === 'function')
        ? TimetableEngine.calculateDayCardPositions(dayItems)
        : (dayItems || []).map(item => ({
            ...item,
            top: TimetableEngine.timeToY ? TimetableEngine.timeToY(item.startTime) : 0,
            height: TimetableEngine.durationToHeight ? TimetableEngine.durationToHeight(item.startTime, item.endTime) : 55,
            leftCss: '4px',
            widthCss: 'calc(100% - 8px)'
          }));

      const cardsHtml = positionedCards.map(item => {
        const isConflicting = conflicts.some(c => c.itemA.id === item.id || c.itemB.id === item.id);
        const periodBadge = item.startPeriod && item.endPeriod 
          ? (item.startPeriod === item.endPeriod ? `Tiết ${item.startPeriod}` : `Tiết ${item.startPeriod}–${item.endPeriod}`)
          : `${item.sessions || 2} tiết`;

        const isCompact = item.height < 65;

        return `
          <div class="course-card-block ${isConflicting ? 'conflicting-card' : ''}" 
               data-course-id="${item.courseId}" 
               data-schedule-id="${item.scheduleId || item.id}"
               data-day="${dayNum}"
               data-start="${item.startTime}"
               data-end="${item.endTime}"
               title="${item.courseName} (${item.courseCode || 'SUB'}) · ${periodBadge} (${item.startTime} – ${item.endTime}) · ${item.room || 'A203'}"
               style="top: ${item.top}px; height: ${item.height}px; left: ${item.leftCss}; width: ${item.widthCss}; background: ${isConflicting ? 'rgba(254, 242, 242, 0.96)' : item.courseColor}; border-left: 3.5px solid ${isConflicting ? '#EF4444' : (item.courseColor || 'var(--color-primary)')}; ${isConflicting ? 'border-top: 1.5px solid #EF4444; border-right: 1.5px solid #EF4444; border-bottom: 1.5px solid #EF4444; box-shadow: 0 2px 8px rgba(239,68,68,0.2);' : ''}">
            
            <!-- Top info: Title & Code Badge -->
            <div class="course-top-info" style="display: flex; align-items: flex-start; justify-content: space-between; gap: 4px;">
              <div class="course-title" style="font-size: 0.82rem; font-weight: 700; color: #1F2937; line-height: 1.25; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                ${item.courseName}
              </div>
              <span class="course-badge-pill" style="font-size: 0.64rem; font-weight: 800; padding: 1px 5px; border-radius: 4px; background: rgba(255, 255, 255, 0.9); color: #1F2937; flex-shrink: 0;">
                ${item.courseCode || 'SUB'}
              </span>
            </div>

            <!-- Meta Row: Period & Exact Time -->
            <div class="course-meta-row" style="display: flex; align-items: center; gap: 4px; font-size: 0.7rem; color: rgba(31, 41, 55, 0.85); font-weight: 600; margin-top: 2px;">
              <span>${periodBadge}</span>
              <span style="opacity: 0.6;">•</span>
              <span>${item.startTime}–${item.endTime}</span>
            </div>

            <!-- Bottom Row: Room & Warning if conflict -->
            ${!isCompact ? `
              <div class="course-teacher-name" style="display: flex; justify-content: space-between; align-items: center; font-size: 0.68rem; color: rgba(31, 41, 55, 0.8); margin-top: auto;">
                <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                  <i data-lucide="map-pin" style="width: 10px; height: 10px; color: var(--color-primary); display: inline-block; vertical-align: middle;"></i>
                  <span style="font-weight: 600;">${item.room || (isTHPT ? '11A2' : 'A203')}</span>
                </div>
                ${isConflicting ? `
                  <span class="glass-pill" style="font-size: 0.6rem; padding: 1px 4px; background: #EF4444; color: white; font-weight: 700; flex-shrink: 0;">
                    ⚠ Trùng
                  </span>
                ` : ''}
              </div>
            ` : (isConflicting ? `
              <div style="margin-top: auto; text-align: right;">
                <span class="glass-pill" style="font-size: 0.6rem; padding: 1px 4px; background: #EF4444; color: white; font-weight: 700;">
                  ⚠ Trùng
                </span>
              </div>
            ` : '')}
          </div>
        `;
      }).join('');

      let currentTimeMarkerHtml = '';
      if (isToday) {
        const currentMins = now.getHours() * 60 + now.getMinutes();
        if (currentMins >= TimetableEngine.START_MINUTES && currentMins <= TimetableEngine.END_MINUTES) {
          const curTop = TimetableEngine.timeToY(now.toTimeString().substring(0, 5));
          currentTimeMarkerHtml = `<div class="current-time-marker" style="top: ${curTop}px;"></div>`;
        }
      }

      return `
        <div class="day-column ${isToday ? 'is-today-column' : ''} ${isSelected ? 'is-selected-column' : ''}" data-day="${dayNum}" data-date="${dayMeta?.dateKey || ''}" style="height: ${totalGridHeight}px; min-height: ${totalGridHeight}px;" title="Bấm vào ô trống để thêm môn học">
          ${gridBackdropLinesHtml}
          ${currentTimeMarkerHtml}
          ${cardsHtml}
        </div>
      `;
    }).join('');

    // 8. Dynamic Academic Weeks Dropdown (Tuần 01 -> Tuần 20)
    let weekOptionsHtml = '';
    for (let w = 1; w <= 20; w++) {
      const isSelected = w === weekNumber;
      weekOptionsHtml += `
        <option value="${w}" ${isSelected ? 'selected' : ''}>Tuần ${String(w).padStart(2, '0')} ${w === 3 ? '(Kỳ I)' : ''}</option>
      `;
    }

    // Conflict banner
    let conflictBannerHtml = '';
    if (conflicts.length > 0) {
      conflictBannerHtml = `
        <div class="conflict-toast-banner" style="background: #FEF2F2; border-left: 4px solid #EF4444; padding: 10px 16px; border-radius: var(--radius-md); margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 12px rgba(239,68,68,0.12);">
          <div style="display: flex; align-items: center; gap: 8px; font-size: 0.84rem; color: #991B1B; font-weight: 600;">
            <i data-lucide="alert-triangle" style="color: #EF4444; width: 18px; height: 18px; flex-shrink: 0;"></i>
            <span>Phát hiện <strong>${conflicts.length} xung đột lịch học</strong> trong tuần này.</span>
          </div>
          <button id="btn-resolve-all-conflicts" class="glass-button" style="padding: 5px 12px; font-size: 0.76rem; background: #EF4444; color: white; border: none; font-weight: 700;">
            Xem & Giải quyết
          </button>
        </div>
      `;
    }

    return `
      <div class="timetable-wrapper fade-in-lift">
        ${conflictBannerHtml}

        <!-- Timetable Header Bar -->
        <div class="timetable-toolbar" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 14px;">
          <!-- Left: Week Navigation -->
          <div class="week-navigation" style="display: flex; align-items: center; gap: 8px;">
            <button id="btn-prev-week" class="icon-btn" aria-label="Tuần trước" style="width: 34px; height: 34px;" title="Xem tuần trước">
              <i data-lucide="chevron-left" style="width: 16px; height: 16px;"></i>
            </button>
            
            <select id="select-active-week" class="glass-input" style="padding: 5px 10px; font-size: 0.82rem; font-weight: 700; width: auto; cursor: pointer;">
              ${weekOptionsHtml}
            </select>

            <button id="btn-next-week" class="icon-btn" aria-label="Tuần sau" style="width: 34px; height: 34px;" title="Xem tuần sau">
              <i data-lucide="chevron-right" style="width: 16px; height: 16px;"></i>
            </button>

            <!-- Quick "Hôm nay" button -->
            <button id="btn-tb-today" class="glass-button ${isCurrentWeek ? 'active' : ''}" style="padding: 4px 10px; font-size: 0.76rem; font-weight: 700;" title="Quay về tuần hiện tại">
              Hôm nay
            </button>

            <span class="current-week-label" style="font-size: 0.84rem; font-weight: 600; color: var(--color-text-secondary); margin-left: 4px;">${weekDateRange}</span>
          </div>

          <!-- Right: Actions Hub -->
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="glass-pill desktop-only-txt" style="font-size: 0.74rem; font-weight: 600; background: var(--color-card-background); color: var(--color-text-secondary);">
              <i data-lucide="sparkles" style="color: var(--color-primary); width: 13px; height: 13px;"></i> Nguồn: ${courses.some(c => c.source === 'manual') ? '✍️ Thủ công' : 'AI OCR (96.8%)'}
            </span>

            <!-- Prominent Primary Add Button -->
            <button id="btn-tb-open-add-menu" class="glass-button glass-button-primary" style="padding: 7px 16px; font-size: 0.84rem; font-weight: 700;" title="Thêm môn thủ công, nhập ảnh hoặc tự động xếp lịch">
              <i data-lucide="plus-circle" style="width: 16px; height: 16px;"></i> ＋ Thêm lịch học
            </button>

            <!-- Quick Action Options -->
            <button id="btn-tb-open-wallpaper" class="icon-btn" style="width: 34px; height: 34px;" title="Xuất hình nền khóa điện thoại 9:16">
              <i data-lucide="smartphone" style="width: 15px; height: 15px;"></i>
            </button>

            <button id="btn-tb-open-share" class="icon-btn" style="width: 34px; height: 34px;" title="Chia sẻ mã lớp cho bạn bè">
              <i data-lucide="share-2" style="width: 15px; height: 15px;"></i>
            </button>
          </div>
        </div>

        <!-- Timetable Matrix Grid -->
        <div class="timetable-grid-container custom-scroll">
          <div class="grid-header-row" style="--timetable-days: ${daysToShow.length};">
            <div class="day-header-cell time-header-cell" style="font-weight: 700; font-size: 0.72rem; color: var(--color-text-secondary);">
              TIẾT / GIỜ
            </div>
            ${dayHeadersHtml}
          </div>

          <div class="grid-body" style="--timetable-days: ${daysToShow.length}; height: ${totalGridHeight}px; min-height: ${totalGridHeight}px;">
            <div class="time-column" style="height: ${totalGridHeight}px; min-height: ${totalGridHeight}px;">
              ${timeSlotsHtml}
            </div>
            ${dayColumnsHtml}
          </div>
        </div>
      </div>
    `;
  },

  bindEvents(container, callbacks = {}) {
    const { onSelectCourse, onSlotClick, onMoveSchedule, onResolveConflict, onSwitchUniversity, onOpenAddMenu, onExportWallpaper, onShareClass, onCopySchedule, onDeleteSchedule, onWeekChange } = callbacks;
    const courses = callbacks.courses || Storage.getCourses();

    // Week navigation buttons
    container.querySelector('#btn-prev-week')?.addEventListener('click', () => {
      CalendarEngine.prevWeek();
      if (onWeekChange) onWeekChange();
      else if (this.onReRender) this.onReRender();
    });

    container.querySelector('#btn-next-week')?.addEventListener('click', () => {
      CalendarEngine.nextWeek();
      if (onWeekChange) onWeekChange();
      else if (this.onReRender) this.onReRender();
    });

    container.querySelector('#btn-tb-today')?.addEventListener('click', () => {
      CalendarEngine.goToToday();
      if (onWeekChange) onWeekChange();
      else if (this.onReRender) this.onReRender();
    });

    container.querySelector('#select-active-week')?.addEventListener('change', (e) => {
      const weekNum = Number(e.target.value) || 1;
      CalendarEngine.selectWeekByNumber(weekNum);
      if (onWeekChange) onWeekChange();
      else if (this.onReRender) this.onReRender();
    });

    // Click on Day Header Cell to select that day
    container.querySelectorAll('.day-header-cell[data-date]').forEach(cell => {
      cell.addEventListener('click', () => {
        const dateKey = cell.getAttribute('data-date');
        if (dateKey) {
          CalendarEngine.selectDate(dateKey);
          if (onWeekChange) onWeekChange();
          else if (this.onReRender) this.onReRender();
        }
      });
    });

    // Action Hub buttons
    container.querySelector('#btn-tb-open-add-menu')?.addEventListener('click', onOpenAddMenu);
    container.querySelector('#btn-tb-open-wallpaper')?.addEventListener('click', onExportWallpaper);
    container.querySelector('#btn-tb-open-share')?.addEventListener('click', onShareClass);

    // Conflict resolve banner button
    container.querySelector('#btn-resolve-all-conflicts')?.addEventListener('click', () => {
      const weekInfo = CalendarEngine.getWeekInfo();
      const weekOccurrences = ScheduleEngine.getScheduleForWeek(courses, weekInfo.monday, weekInfo.sunday);
      const conflicts = TimetableEngine.findConflicts(weekOccurrences);
      if (conflicts.length > 0 && onResolveConflict) {
        onResolveConflict(conflicts[0]);
      }
    });

    // Course Card Click -> Open Detail Drawer
    container.querySelectorAll('.course-card-block').forEach(card => {
      card.addEventListener('click', (e) => {
        const courseId = card.getAttribute('data-course-id');
        const courseList = callbacks.courses || Storage.getCourses();
        const found = courseList.find(c => c.id === courseId);
        if (onSelectCourse) {
          onSelectCourse(found || courseId);
        }
      });
    });

    // Empty slot click to add schedule
    container.querySelectorAll('.day-column').forEach(col => {
      col.addEventListener('click', (e) => {
        if (e.target.closest('.course-card-block')) return;
        const day = Number(col.getAttribute('data-day'));
        const rect = col.getBoundingClientRect();
        const offsetY = e.clientY - rect.top;

        const mode = Storage.getMode();
        const isTHPT = mode === 'high_school';
        const activeState = ProfileEngine.getActiveProfileState();
        const scheduleLayout = TimetableEngine.getProfileScheduleLayout(activeState.profileId, isTHPT);

        const clickedItem = scheduleLayout.find(item => !item.isBreak && offsetY >= item.top && offsetY <= (item.top + item.height));
        const startPeriod = clickedItem ? clickedItem.periodNumber : 1;
        const endPeriod = Math.min(12, startPeriod + 2);

        if (onSlotClick) {
          onSlotClick(day, startPeriod, endPeriod);
        }
      });
    });
  }
};
