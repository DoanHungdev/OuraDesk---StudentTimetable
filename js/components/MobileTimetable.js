/**
 * MobileTimetable: Dedicated Day-by-Day Mobile Experience (<768px)
 * Synchronized with CalendarEngine & ScheduleEngine
 */
import { TimetableEngine } from '../utils/timetableEngine.js';
import { ProfileEngine } from '../utils/profileEngine.js';
import { Storage } from '../utils/storage.js';
import { CalendarEngine } from '../utils/calendarEngine.js';
import { ScheduleEngine } from '../utils/scheduleEngine.js';
import { DAY_NAMES } from '../data/mockData.js';
import { HIGH_SCHOOL_TIME_PROFILE } from '../data/highSchoolData.js';

export const MobileTimetable = {
  onReRender: null,

  render(courses = [], onSelectCourse, onAddCourse, onSwitchUniversity, onOpenAddMenu) {
    const mode = Storage.getMode();
    const isTHPT = mode === 'high_school';
    const user = Storage.getUser();

    // 1. Get central academic week information
    const weekInfo = CalendarEngine.getWeekInfo();
    const { monday, sunday, weekLabel, weekDateRange, days, isCurrentWeek } = weekInfo;

    // 2. Query occurrences strictly for this week
    const weekOccurrences = ScheduleEngine.getScheduleForWeek(courses, monday, sunday);

    // 3. Active day selected
    const activeDay = CalendarEngine.selectedDate.getDay();
    const activeDayMeta = days.find(d => d.dayNum === activeDay) || days[0];
    const dayItems = weekOccurrences.filter(item => Number(item.day) === Number(activeDay));
    dayItems.sort((a, b) => TimetableEngine.timeToMinutes(a.startTime) - TimetableEngine.timeToMinutes(b.startTime));

    // 4. Day selector pills (Mon - Sat for THPT, Mon - Sun for Univ)
    const daysToShow = isTHPT ? [1, 2, 3, 4, 5, 6] : [1, 2, 3, 4, 5, 6, 0];
    const dayPillsHtml = daysToShow.map(dNum => {
      const dMeta = days.find(d => d.dayNum === dNum);
      const isActive = activeDay === dNum;
      const isToday = dMeta?.isToday || false;
      const count = weekOccurrences.filter(i => Number(i.day) === Number(dNum)).length;

      return `
        <button class="mobile-day-pill ${isActive ? 'active' : ''}" data-day="${dNum}" data-date="${dMeta?.dateKey || ''}">
          <span class="day-txt">${dMeta?.shortName || `T${dNum + 1}`}</span>
          <span class="date-txt" style="${isToday ? 'color: var(--color-primary); font-weight: 800;' : ''}">${dMeta?.dayOfMonth || ''}</span>
          <span style="font-size: 0.65rem; opacity: 0.75; margin-top: 2px;">${count} môn</span>
        </button>
      `;
    }).join('');

    // 5. Timeline of courses for the selected day
    let timelineHtml = '';
    if (dayItems.length === 0) {
      timelineHtml = `
        <div style="background: var(--color-card-background); border-radius: var(--radius-lg); padding: 28px 16px; text-align: center; border: 1px dashed var(--color-glass-border); margin-top: 10px;">
          <div style="width: 44px; height: 44px; border-radius: 50%; background: var(--primary-light); display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; color: var(--color-primary);">
            <i data-lucide="coffee" style="width: 22px; height: 22px;"></i>
          </div>
          <h4 style="font-size: 1rem; font-weight: 700; color: var(--color-text);">Chưa có tiết học vào ${activeDayMeta?.dayName || 'ngày này'}!</h4>
          <p style="font-size: 0.8rem; color: var(--color-text-secondary); margin-top: 3px;">Bạn có thể tự nhập môn hoặc quay về tuần khác.</p>
          <div style="display: flex; gap: 8px; margin-top: 14px;">
            <button id="btn-mobile-add-slot-1" class="glass-button glass-button-primary btn-mobile-quick-slot" data-period="1" style="flex: 1; font-weight: 700; font-size: 0.82rem;">
              ✍️ Nhập môn vào ${activeDayMeta?.dayName || 'ngày này'}
            </button>
          </div>
        </div>
      `;
    } else {
      timelineHtml = dayItems.map(item => {
        const periodLabel = item.startPeriod && item.endPeriod 
          ? (item.startPeriod === item.endPeriod ? `Tiết ${item.startPeriod}` : `Tiết ${item.startPeriod}–${item.endPeriod}`)
          : `${item.sessions || 2} tiết`;

        return `
          <div class="mobile-course-card fade-in-lift" data-course-id="${item.courseId}" style="border-left: 4px solid ${item.courseColor}; background: var(--color-card-background); border: 1px solid var(--color-glass-border); border-radius: var(--radius-md); padding: 12px 14px; margin-bottom: 8px; cursor: pointer;">
            <div class="mobile-card-content">
              <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div style="display: flex; gap: 6px; align-items: center;">
                  <span class="glass-pill" style="font-size: 0.68rem; font-weight: 700; background: rgba(0,0,0,0.05);">${item.courseCode || 'MÔN'}</span>
                  <span class="glass-pill" style="font-size: 0.68rem; font-weight: 700; background: ${item.courseColor}; color: #1F2937;">${periodLabel}</span>
                </div>
                <span style="font-size: 0.82rem; font-weight: 800; color: var(--color-primary);">
                  ${item.startTime} – ${item.endTime}
                </span>
              </div>
              <h4 style="font-size: 1rem; font-weight: 700; color: var(--color-text); margin-top: 6px; line-height: 1.3;">
                ${item.courseName}
              </h4>
              <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 6px; font-size: 0.76rem; color: var(--color-text-secondary); font-weight: 500;">
                <span style="display: flex; align-items: center; gap: 4px;"><i data-lucide="map-pin" style="color: var(--color-primary); width: 12px; height: 12px;"></i> ${item.room || (isTHPT ? `Phòng ${user.className || '11A2'}` : 'Phòng A203')}</span>
                ${item.teacher ? `<span style="display: flex; align-items: center; gap: 4px;"><i data-lucide="user-check" style="width: 12px; height: 12px;"></i> ${item.teacher}</span>` : ''}
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    return `
      <div class="mobile-timetable-container fade-in-lift">
        <!-- Week Navigator for Mobile -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; background: var(--color-card-background); padding: 8px 12px; border-radius: var(--radius-md); border: 1px solid var(--color-glass-border);">
          <button id="btn-mobile-prev-week" class="icon-btn" style="width: 32px; height: 32px;" title="Tuần trước">
            <i data-lucide="chevron-left" style="width: 16px; height: 16px;"></i>
          </button>
          
          <div style="text-align: center;">
            <div style="font-size: 0.9rem; font-weight: 700; color: var(--color-text);">${weekLabel}</div>
            <div style="font-size: 0.72rem; color: var(--color-text-secondary);">${weekDateRange}</div>
          </div>

          <div style="display: flex; gap: 4px; align-items: center;">
            <button id="btn-mobile-today" class="glass-button ${isCurrentWeek ? 'active' : ''}" style="padding: 4px 8px; font-size: 0.72rem; font-weight: 700;">
              Hôm nay
            </button>
            <button id="btn-mobile-next-week" class="icon-btn" style="width: 32px; height: 32px;" title="Tuần sau">
              <i data-lucide="chevron-right" style="width: 16px; height: 16px;"></i>
            </button>
          </div>
        </div>

        <!-- Day Selector Tabs -->
        <div class="mobile-day-selector custom-scroll">
          ${dayPillsHtml}
        </div>

        <!-- Selected Day Timeline -->
        <div class="mobile-timeline-section" style="margin-top: 14px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <h3 style="font-size: 1.05rem; font-weight: 700; color: var(--color-text);">
              ${activeDayMeta?.dayName || 'Lịch học'} (${activeDayMeta?.dateFormatted || ''})
            </h3>
            <span class="glass-pill" style="font-size: 0.72rem; font-weight: 600;">
              ${dayItems.length} môn
            </span>
          </div>

          <div>
            ${timelineHtml}
          </div>
        </div>
      </div>
    `;
  },

  bindEvents(container, callbacks = {}) {
    const { onSelectCourse, onAddCourse, onSwitchUniversity, onOpenAddMenu, onWeekChange } = callbacks;

    // Week navigation
    container.querySelector('#btn-mobile-prev-week')?.addEventListener('click', () => {
      CalendarEngine.prevWeek();
      if (onWeekChange) onWeekChange();
      else if (this.onReRender) this.onReRender();
    });

    container.querySelector('#btn-mobile-next-week')?.addEventListener('click', () => {
      CalendarEngine.nextWeek();
      if (onWeekChange) onWeekChange();
      else if (this.onReRender) this.onReRender();
    });

    container.querySelector('#btn-mobile-today')?.addEventListener('click', () => {
      CalendarEngine.goToToday();
      if (onWeekChange) onWeekChange();
      else if (this.onReRender) this.onReRender();
    });

    // Day Pills
    container.querySelectorAll('.mobile-day-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const dateKey = pill.getAttribute('data-date');
        if (dateKey) {
          CalendarEngine.selectDate(dateKey);
        } else {
          const day = Number(pill.getAttribute('data-day'));
          const weekInfo = CalendarEngine.getWeekInfo();
          const targetDay = weekInfo.days.find(d => d.dayNum === day);
          if (targetDay) CalendarEngine.selectDate(targetDay.date);
        }
        if (onWeekChange) onWeekChange();
        else if (this.onReRender) this.onReRender();
      });
    });

    // Course Card Click
    container.querySelectorAll('.mobile-course-card').forEach(card => {
      card.addEventListener('click', () => {
        const courseId = card.getAttribute('data-course-id');
        const courses = Storage.getCourses();
        const found = courses.find(c => c.id === courseId);
        if (onSelectCourse) onSelectCourse(found || courseId);
      });
    });

    // Quick add slot button
    container.querySelector('#btn-mobile-add-slot-1')?.addEventListener('click', () => {
      const activeDay = CalendarEngine.selectedDate.getDay();
      if (onAddCourse) onAddCourse(activeDay, 1, 3);
    });
  }
};
