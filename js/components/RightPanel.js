/**
 * RightPanel Component: Companion Panel
 * Synchronized with CalendarEngine & ScheduleEngine
 */
import { DAY_NAMES } from '../data/mockData.js';
import { TimetableEngine } from '../utils/timetableEngine.js';
import { Storage } from '../utils/storage.js';
import { CalendarEngine } from '../utils/calendarEngine.js';
import { ScheduleEngine } from '../utils/scheduleEngine.js';
import { AcademicCalendar } from '../data/academicCalendar.js';
import { AssignmentRepository } from '../repositories/assignmentRepository.js';
import { HomeworkRepository } from '../repositories/homeworkRepository.js';

export const RightPanel = {
  onReRender: null,

  prevMonth() {
    const y = CalendarEngine.calendarMonthDate.getFullYear();
    const m = CalendarEngine.calendarMonthDate.getMonth();
    if (m === 0) {
      CalendarEngine.calendarMonthDate = new Date(y - 1, 11, 1);
    } else {
      CalendarEngine.calendarMonthDate = new Date(y, m - 1, 1);
    }
  },

  nextMonth() {
    const y = CalendarEngine.calendarMonthDate.getFullYear();
    const m = CalendarEngine.calendarMonthDate.getMonth();
    if (m === 11) {
      CalendarEngine.calendarMonthDate = new Date(y + 1, 0, 1);
    } else {
      CalendarEngine.calendarMonthDate = new Date(y, m + 1, 1);
    }
  },

  selectDate(dateStr) {
    CalendarEngine.selectDate(dateStr);
  },

  render(courses = [], assignmentsOrHw = [], user = {}, onSelectCourse, onToggleTask, onNavigate, isMobile = false) {
    const mode = Storage.getMode();
    const isTHPT = mode === 'high_school';
    const isGrade12 = isTHPT && (user.grade === 12 || (user.className && user.className.startsWith('12')));
    const today = new Date();

    // 1. Single source of truth tasks from Repository
    const tasks = isTHPT ? HomeworkRepository.getAll() : AssignmentRepository.getAll();

    // 2. Mini Calendar generator using CalendarEngine.calendarMonthDate
    const miniCalendarHtml = this.renderMiniCalendar(CalendarEngine.calendarMonthDate, courses, today, tasks);

    // 3. Selected Date Schedule calculation from ScheduleEngine
    const selectedDate = CalendarEngine.selectedDate;
    const selectedDateItems = ScheduleEngine.getOccurrencesForDate(courses, selectedDate);
    selectedDateItems.sort((a, b) => TimetableEngine.timeToMinutes(a.startTime) - TimetableEngine.timeToMinutes(b.startTime));

    const isSelectedToday = CalendarEngine.isSameDay(today, selectedDate);
    const dayLabels = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    const selectedDayOfWeek = selectedDate.getDay();
    const selectedDateFormatted = AcademicCalendar.formatDisplayDate(selectedDate);

    const scheduleTitle = isSelectedToday 
      ? 'Lịch học hôm nay' 
      : `Lịch học ${dayLabels[selectedDayOfWeek]} (${selectedDateFormatted.substring(0, 5)})`;

    // Classes for selected date
    const classesListHtml = selectedDateItems.length === 0 ? `
      <div class="empty-mini-state" style="font-size: 0.8rem; color: var(--color-text-secondary); text-align: center; padding: 14px 10px; background: var(--color-card-background); border: 1px dashed var(--color-glass-border); border-radius: var(--radius-sm);">
        Không có tiết học ${isSelectedToday ? 'hôm nay' : 'vào ngày này'} 🎉
      </div>
    ` : selectedDateItems.map(item => `
      <button type="button" class="today-class-item" data-course-id="${item.courseId}" aria-label="Xem chi tiết môn ${item.courseName}" style="border-left: 3px solid ${item.courseColor};">
        <div>
          <div class="today-class-name">${item.courseName}</div>
          <div class="today-class-time">${item.startTime} – ${item.endTime} · ${item.room || (isTHPT ? `Phòng ${user.className || '11A2'}` : 'A203')}</div>
        </div>
        <i data-lucide="chevron-right" style="color: var(--color-text-secondary); width: 14px; height: 14px; flex-shrink: 0;"></i>
      </button>
    `).join('');

    // Tasks / Homework list from Repository
    const pendingTasks = (tasks || []).filter(t => t.status !== 'done' && !t.completed).slice(0, 4);

    const tasksHtml = pendingTasks.length === 0 ? `
      <div class="empty-mini-state" style="font-size: 0.8rem; color: var(--color-text-secondary); text-align: center; padding: 14px 10px; background: var(--color-card-background); border: 1px dashed var(--color-glass-border); border-radius: var(--radius-sm);">
        Đã hoàn thành hết bài tập! 🎉
      </div>
    ` : pendingTasks.map(t => `
      <div class="task-mini-item ${t.completed || t.status === 'done' ? 'completed' : ''}" style="background: var(--color-card-background);">
        <input type="checkbox" class="task-checkbox" data-task-id="${t.id}" aria-label="Đánh dấu hoàn thành ${t.title}" ${t.completed || t.status === 'done' ? 'checked' : ''}>
        <span class="task-mini-title">${t.title}</span>
        <span class="task-due-tag">${t.dueDate ? t.dueDate.substring(5) : 'Gấp'}</span>
      </div>
    `).join('');

    // Grade 12 Countdown
    const targets = Storage.getGrade12Targets();
    const examDate = new Date(targets.examDate || '2027-06-25');
    const diffDays = Math.max(0, Math.ceil((examDate - today) / (1000 * 60 * 60 * 24)));

    const contentHtml = `
      <!-- Mini Calendar Widget -->
      <div class="panel-widget">
        ${miniCalendarHtml}
      </div>

      <!-- Grade 12 Countdown Widget (If Grade 12) -->
      ${isGrade12 ? `
        <div class="panel-widget" style="background: linear-gradient(135deg, var(--primary-light) 0%, var(--color-glass) 100%); border-left: 3px solid var(--color-primary);">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.74rem; font-weight: 600; color: var(--primary); display: flex; align-items: center; gap: 4px;">
              <i data-lucide="target" style="width: 14px; height: 14px;"></i> ÔN THI THPT 2027
            </span>
            <span style="font-size: 1.05rem; font-weight: 700; color: var(--primary);">${diffDays} ngày</span>
          </div>
          <p style="font-size: 0.74rem; color: var(--text-secondary); margin-top: 3px;">
            Mục tiêu: <strong>${targets.targetTotalScore}đ</strong> (${targets.combination})
          </p>
        </div>
      ` : ''}

      <!-- Selected Date Schedule Widget -->
      <div class="panel-widget">
        <div class="widget-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <span class="widget-title" style="font-size: 0.88rem; font-weight: 700; color: var(--color-text);">${scheduleTitle}</span>
          <button class="widget-action-link btn-view-day-schedule" type="button" aria-label="Xem toàn bộ thời khóa biểu" style="background: none; border: none; cursor: pointer; color: var(--color-primary); font-weight: 600; font-size: 0.78rem; text-decoration: none; padding: 2px 4px;">
            ${selectedDateItems.length} môn
          </button>
        </div>
        <div>${classesListHtml}</div>
      </div>

      <!-- Homework / Deadlines Widget -->
      <div class="panel-widget">
        <div class="widget-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <span class="widget-title" style="font-size: 0.88rem; font-weight: 700; color: var(--color-text);">${isTHPT ? 'Bài tập cần làm' : 'Deadline sắp tới'}</span>
          <button class="widget-action-link btn-right-view-tasks" type="button" aria-label="Quản lý bài tập" style="background: none; border: none; cursor: pointer; color: var(--color-primary); font-weight: 600; font-size: 0.78rem; text-decoration: none; padding: 2px 4px;">
            Quản lý
          </button>
        </div>
        <div>${tasksHtml}</div>
      </div>
    `;

    if (isMobile) {
      return `<div class="mobile-companion-container">${contentHtml}</div>`;
    }

    return `
      <aside class="right-panel glass-sidebar custom-scroll">
        ${contentHtml}
      </aside>
    `;
  },

  renderMiniCalendar(currentDate, courses = [], today, tasks = []) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const monthNames = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];

    // 1st day of month (0 = Sun, 1 = Mon ... 6 = Sat)
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    // Monday-based offset (0 for Mon, 6 for Sun)
    const startOffset = firstDay === 0 ? 6 : firstDay - 1;

    let calendarCellsHtml = '';

    // 1. Previous month overflow days
    for (let i = startOffset - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const prevMonthYear = month === 0 ? year - 1 : year;
      const prevMonthVal = month === 0 ? 11 : month - 1;
      const curDate = new Date(prevMonthYear, prevMonthVal, d);
      const isSelected = CalendarEngine.isSameDay(CalendarEngine.selectedDate, curDate);
      const isToday = CalendarEngine.isSameDay(today, curDate);
      const dateStr = AcademicCalendar.formatDateKey(curDate);

      // Check occurrences strictly active on this specific date
      const activeOccurrences = ScheduleEngine.getOccurrencesForDate(courses, curDate);
      const hasEvents = activeOccurrences.length > 0;
      const hasDeadline = (tasks || []).some(t => t.dueDate === dateStr && !t.completed && t.status !== 'done');

      calendarCellsHtml += `
        <button type="button" class="mini-cal-day-cell other-month ${isToday ? 'is-today' : ''} ${isSelected ? 'is-selected' : ''} ${hasEvents ? 'has-events' : ''} ${hasDeadline ? 'has-deadline' : ''}" data-date="${dateStr}" aria-label="${d} tháng ${prevMonthVal + 1} năm ${prevMonthYear}" tabindex="0">
          ${d}
        </button>
      `;
    }

    // 2. Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const curDate = new Date(year, month, d);
      const isSelected = CalendarEngine.isSameDay(CalendarEngine.selectedDate, curDate);
      const isToday = CalendarEngine.isSameDay(today, curDate);
      const dateStr = AcademicCalendar.formatDateKey(curDate);

      // Check occurrences strictly active on this specific date
      const activeOccurrences = ScheduleEngine.getOccurrencesForDate(courses, curDate);
      const hasEvents = activeOccurrences.length > 0;
      const hasDeadline = (tasks || []).some(t => t.dueDate === dateStr && !t.completed && t.status !== 'done');

      calendarCellsHtml += `
        <button type="button" class="mini-cal-day-cell ${isToday ? 'is-today' : ''} ${isSelected ? 'is-selected' : ''} ${hasEvents ? 'has-events' : ''} ${hasDeadline ? 'has-deadline' : ''}" data-date="${dateStr}" aria-label="${d} tháng ${month + 1} năm ${year}" tabindex="0">
          ${d}
        </button>
      `;
    }

    // 3. Next month overflow days (fill grid)
    const totalCellsSoFar = startOffset + daysInMonth;
    const remainingCells = (totalCellsSoFar % 7 === 0) ? 0 : (7 - (totalCellsSoFar % 7));
    for (let d = 1; d <= remainingCells; d++) {
      const nextMonthYear = month === 11 ? year + 1 : year;
      const nextMonthVal = month === 11 ? 0 : month + 1;
      const curDate = new Date(nextMonthYear, nextMonthVal, d);
      const isSelected = CalendarEngine.isSameDay(CalendarEngine.selectedDate, curDate);
      const isToday = CalendarEngine.isSameDay(today, curDate);
      const dateStr = AcademicCalendar.formatDateKey(curDate);

      // Check occurrences strictly active on this specific date
      const activeOccurrences = ScheduleEngine.getOccurrencesForDate(courses, curDate);
      const hasEvents = activeOccurrences.length > 0;
      const hasDeadline = (tasks || []).some(t => t.dueDate === dateStr && !t.completed && t.status !== 'done');

      calendarCellsHtml += `
        <button type="button" class="mini-cal-day-cell other-month ${isToday ? 'is-today' : ''} ${isSelected ? 'is-selected' : ''} ${hasEvents ? 'has-events' : ''} ${hasDeadline ? 'has-deadline' : ''}" data-date="${dateStr}" aria-label="${d} tháng ${nextMonthVal + 1} năm ${nextMonthYear}" tabindex="0">
          ${d}
        </button>
      `;
    }

    return `
      <div class="mini-calendar-wrap">
        <div class="mini-cal-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <span class="mini-cal-month-title" style="font-size: 0.88rem; font-weight: 700; color: var(--color-text);">${monthNames[month]}, ${year}</span>
          <div style="display: flex; gap: 4px;">
            <button class="mini-cal-nav-btn btn-mini-cal-prev" type="button" aria-label="Tháng trước">
              <i data-lucide="chevron-left" style="width: 14px; height: 14px;"></i>
            </button>
            <button class="mini-cal-nav-btn btn-mini-cal-next" type="button" aria-label="Tháng sau">
              <i data-lucide="chevron-right" style="width: 14px; height: 14px;"></i>
            </button>
          </div>
        </div>

        <div class="mini-cal-grid">
          <div class="mini-cal-day-label">T2</div>
          <div class="mini-cal-day-label">T3</div>
          <div class="mini-cal-day-label">T4</div>
          <div class="mini-cal-day-label">T5</div>
          <div class="mini-cal-day-label">T6</div>
          <div class="mini-cal-day-label">T7</div>
          <div class="mini-cal-day-label">CN</div>
          ${calendarCellsHtml}
        </div>
      </div>
    `;
  },

  bindEvents(container, callbacks = {}) {
    const { onSelectCourse, onToggleTask, onNavigate, onDateSelect } = callbacks;

    // Prev / Next Month
    container.querySelector('.btn-mini-cal-prev')?.addEventListener('click', () => {
      this.prevMonth();
      if (this.onReRender) this.onReRender();
    });

    container.querySelector('.btn-mini-cal-next')?.addEventListener('click', () => {
      this.nextMonth();
      if (this.onReRender) this.onReRender();
    });

    // Date Cell Click
    container.querySelectorAll('.mini-cal-day-cell[data-date]').forEach(cell => {
      cell.addEventListener('click', (e) => {
        const dateStr = e.currentTarget.getAttribute('data-date');
        if (dateStr) {
          this.selectDate(dateStr);
          if (onDateSelect) onDateSelect(dateStr);
          else if (this.onReRender) this.onReRender();
        }
      });
    });

    // Today item click -> Open Course Details
    container.querySelectorAll('.today-class-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const courseId = e.currentTarget.getAttribute('data-course-id');
        if (courseId && onSelectCourse) {
          onSelectCourse(courseId);
        }
      });
    });

    // Task toggle checkbox
    container.querySelectorAll('.task-mini-item input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', (e) => {
        const taskId = e.target.getAttribute('data-task-id');
        if (taskId && onToggleTask) {
          onToggleTask(taskId, e.target.checked);
        }
      });
    });

    // View All Tasks -> Navigate to Assignments or Homework
    container.querySelector('.btn-right-view-tasks')?.addEventListener('click', () => {
      const mode = Storage.getMode();
      if (onNavigate) onNavigate(mode === 'high_school' ? 'homework' : 'assignments');
    });

    // View Day Schedule -> Navigate to Timetable
    container.querySelector('.btn-view-day-schedule')?.addEventListener('click', () => {
      if (onNavigate) onNavigate('timetable');
    });
  }
};
