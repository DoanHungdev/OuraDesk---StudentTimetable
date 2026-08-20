/**
 * MonthCalendarView: Monthly Calendar
 * - 35/42 Cell grid view
 * - Events & Deadline indicator dots
 * - Day inspector drawer / detail view
 * Uses Lucide Icons & Clean Typography
 */
import { TimetableEngine } from '../utils/timetableEngine.js';
import { ScheduleEngine } from '../utils/scheduleEngine.js';
import { DAY_NAMES } from '../data/mockData.js';
import { AssignmentRepository } from '../repositories/assignmentRepository.js';

export const MonthCalendarView = {
  currentMonthOffset: 0,
  selectedDay: new Date().getDate(),

  render(courses, assignments, onSelectCourse) {
    const now = new Date();
    const targetDate = new Date(now.getFullYear(), now.getMonth() + this.currentMonthOffset, 1);
    const year = targetDate.getFullYear();
    const month = targetDate.getMonth();

    const monthNames = [
      'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
      'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ];

    const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7; // 0 = Mon, 6 = Sun
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const activeAssignments = assignments || AssignmentRepository.getAll();

    // Build calendar grid cells
    let gridCellsHtml = '';

    // Prev month padding
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      gridCellsHtml += `
        <div class="month-grid-cell is-other-month">
          <span class="cell-day-num">${prevMonthDays - i}</span>
        </div>
      `;
    }

    // Current month cells
    for (let d = 1; d <= totalDaysInMonth; d++) {
      const cellDate = new Date(year, month, d);
      const isToday = this.currentMonthOffset === 0 && d === now.getDate();
      const isSelected = d === this.selectedDay;

      // Find classes strictly active on this calendar date
      const classesOnDay = ScheduleEngine.getOccurrencesForDate(courses, cellDate);

      // Find assignments due on this exact date (uncompleted)
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const tasksOnDay = activeAssignments.filter(t => t.dueDate === dateStr && !t.completed);

      const badgesHtml = [
        ...classesOnDay.slice(0, 2).map(c => `
          <div class="month-event-chip" style="background: ${c.courseColor}; font-weight: 500;" title="${c.courseName} (${c.startTime})">
            <span class="event-time">${c.startTime}</span>
            <span class="event-title">${c.courseName}</span>
          </div>
        `),
        ...tasksOnDay.slice(0, 1).map(t => `
          <div class="month-event-chip" style="background: #FEE2E2; color: #991B1B; font-weight: 600;" title="${t.title}">
            Deadline: ${t.title}
          </div>
        `)
      ].join('');

      const moreCount = (classesOnDay.length + tasksOnDay.length) - 3;

      gridCellsHtml += `
        <div class="month-grid-cell ${isToday ? 'is-today' : ''} ${isSelected ? 'is-selected' : ''}" data-day="${d}" data-weekday="${dayOfWeek}">
          <div class="cell-header">
            <span class="cell-day-num ${isToday ? 'today-pill' : ''}">${d}</span>
            ${tasksOnDay.length > 0 ? `<span class="due-dot-badge" title="${tasksOnDay.length} deadline"></span>` : ''}
          </div>
          <div class="cell-events-list">
            ${badgesHtml}
            ${moreCount > 0 ? `<span class="more-events-tag">+${moreCount} nữa</span>` : ''}
          </div>
        </div>
      `;
    }

    // Next month padding to reach 35 or 42 cells
    const cellsFilled = firstDayIndex + totalDaysInMonth;
    const totalCellsNeeded = cellsFilled <= 35 ? 35 : 42;
    for (let d = 1; d <= (totalCellsNeeded - cellsFilled); d++) {
      gridCellsHtml += `
        <div class="month-grid-cell is-other-month">
          <span class="cell-day-num">${d}</span>
        </div>
      `;
    }

    return `
      <div class="month-calendar-wrapper fade-in-lift">
        <!-- Month Navigation Toolbar -->
        <div class="timetable-toolbar">
          <div class="week-navigation">
            <button id="btn-month-prev" class="icon-btn" style="width: 32px; height: 32px;" aria-label="Tháng trước">
              <i data-lucide="chevron-left" style="width: 16px; height: 16px;"></i>
            </button>
            <button id="btn-month-today" class="glass-button" style="padding: 5px 12px; font-size: 0.8rem;">
              Tháng này
            </button>
            <button id="btn-month-next" class="icon-btn" style="width: 32px; height: 32px;" aria-label="Tháng sau">
              <i data-lucide="chevron-right" style="width: 16px; height: 16px;"></i>
            </button>
            <span class="current-week-label" style="font-size: 1rem; font-weight: 600;">${monthNames[month]}, ${year}</span>
          </div>

          <div style="display: flex; gap: 8px;">
            <span class="glass-pill" style="font-size: 0.74rem; font-weight: 500;">
              <span style="width: 8px; height: 8px; border-radius: 50%; background: #EF4444; display: inline-block;"></span> Deadline bài tập
            </span>
            <span class="glass-pill" style="font-size: 0.74rem; font-weight: 500;">
              <span style="width: 8px; height: 8px; border-radius: 50%; background: var(--primary); display: inline-block;"></span> Lịch học cố định
            </span>
          </div>
        </div>

        <!-- Full Month Grid -->
        <div class="month-calendar-grid-wrap custom-scroll">
          <!-- Weekday Labels -->
          <div class="month-weekday-row">
            <div>Thứ Hai</div>
            <div>Thứ Ba</div>
            <div>Thứ Tư</div>
            <div>Thứ Năm</div>
            <div>Thứ Sáu</div>
            <div>Thứ Bảy</div>
            <div>Chủ Nhật</div>
          </div>

          <!-- 35/42 Grid -->
          <div class="month-grid-body">
            ${gridCellsHtml}
          </div>
        </div>
      </div>
    `;
  },

  bindEvents(container, { onSelectCourse }) {
    container.querySelector('#btn-month-prev')?.addEventListener('click', () => {
      this.currentMonthOffset--;
      if (this.onReRender) this.onReRender();
    });

    container.querySelector('#btn-month-today')?.addEventListener('click', () => {
      this.currentMonthOffset = 0;
      if (this.onReRender) this.onReRender();
    });

    container.querySelector('#btn-month-next')?.addEventListener('click', () => {
      this.currentMonthOffset++;
      if (this.onReRender) this.onReRender();
    });

    container.querySelectorAll('.month-grid-cell:not(.is-other-month)').forEach(cell => {
      cell.addEventListener('click', (e) => {
        const d = Number(e.currentTarget.getAttribute('data-day'));
        if (d) {
          this.selectedDay = d;
          if (this.onReRender) this.onReRender();
        }
      });
    });
  }
};
