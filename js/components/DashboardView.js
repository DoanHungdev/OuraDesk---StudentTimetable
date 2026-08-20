/**
 * DashboardView Component: Personalized Student Home
 * Tailored for University (HaUI) vs High School (THPT Đông Anh)
 * Uses Lucide Icons & Clean Vietnamese Typography
 */
import { TimetableEngine } from '../utils/timetableEngine.js';
import { Storage } from '../utils/storage.js';
import { ScheduleEngine } from '../utils/scheduleEngine.js';
import { AssignmentRepository } from '../repositories/assignmentRepository.js';
import { HomeworkRepository } from '../repositories/homeworkRepository.js';
import { RightPanel } from './RightPanel.js';

export const DashboardView = {
  render(courses, homeworkOrAssignments, user, onSelectCourse, onNavigate, onOpenImport, onOpenTarget12) {
    const mode = Storage.getMode();
    const isTHPT = mode === 'high_school';
    const isGrade12 = isTHPT && (user.grade === 12 || (user.className && user.className.startsWith('12')));

    const now = new Date();
    // Query schedule items strictly active on REAL TODAY
    const todayItems = ScheduleEngine.getOccurrencesForDate(courses, now);
    todayItems.sort((a, b) => TimetableEngine.timeToMinutes(a.startTime) - TimetableEngine.timeToMinutes(b.startTime));

    // Next class calculation
    const currentMins = now.getHours() * 60 + now.getMinutes();
    const upcomingToday = todayItems.filter(i => TimetableEngine.timeToMinutes(i.endTime) > currentMins);
    const nextClass = upcomingToday.length > 0 ? upcomingToday[0] : (todayItems[0] || null);

    // Days remaining for Grade 12 (if applicable)
    const targets = Storage.getGrade12Targets();
    const examDate = new Date(targets.examDate || '2027-06-25');
    const diffDays = Math.max(0, Math.ceil((examDate - now) / (1000 * 60 * 60 * 24)));

    // Total credits for University mode
    const totalCredits = courses.reduce((sum, c) => sum + (c.credits || 0), 0);

    // Tasks and exams from single source of truth repositories
    const pendingHw = isTHPT ? HomeworkRepository.getAll().filter(h => h.status !== 'done' && !h.completed) : [];
    const pendingExams = isTHPT ? (Storage.getExams() || []) : [];
    const pendingAssignments = !isTHPT ? AssignmentRepository.getAll().filter(a => !a.completed) : [];

    const todayTimelineHtml = todayItems.length === 0 ? `
      <div style="background: var(--color-card-background); border-radius: var(--radius-md); padding: 32px 20px; text-align: center; border: 1px dashed var(--color-glass-border);">
        <div style="width: 44px; height: 44px; border-radius: 50%; background: var(--primary-light); display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; color: var(--color-primary);">
          <i data-lucide="sun" style="width: 24px; height: 24px;"></i>
        </div>
        <h4 style="font-size: 0.96rem; font-weight: 600; color: var(--color-text);">Hôm nay bạn không có lịch học!</h4>
        <p style="font-size: 0.82rem; color: var(--color-text-secondary); margin-top: 3px;">Tận hưởng ngày nghỉ hoặc tự học theo kế hoạch nhé.</p>
      </div>
    ` : todayItems.map(item => {
      const sMins = TimetableEngine.timeToMinutes(item.startTime);
      const eMins = TimetableEngine.timeToMinutes(item.endTime);
      let statusBadge = '<span class="glass-pill" style="font-size: 0.72rem; background: rgba(0,0,0,0.05); color: var(--color-text-secondary);">Sắp diễn ra</span>';

      if (currentMins >= sMins && currentMins <= eMins) {
        statusBadge = '<span class="glass-pill" style="font-size: 0.72rem; background: #DCFCE7; color: #166534; font-weight: 600;">● Đang học</span>';
      } else if (currentMins > eMins) {
        statusBadge = '<span class="glass-pill" style="font-size: 0.72rem; background: rgba(148,163,184,0.2); color: var(--color-text-secondary);">✓ Đã xong</span>';
      }

      const pLabel = item.startPeriod ? (item.startPeriod === item.endPeriod ? `Tiết ${item.startPeriod}` : `Tiết ${item.startPeriod}–${item.endPeriod}`) : item.startTime;

      return `
        <div class="today-item-card fade-in-lift" data-course-id="${item.courseId}" style="cursor: pointer; display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: var(--color-card-background); border: 1px solid var(--color-glass-border); border-radius: var(--radius-md); margin-bottom: 8px; border-left: 4px solid ${item.courseColor};">
          <div style="display: flex; align-items: center; gap: 14px;">
            <div style="text-align: center; min-width: 68px;">
              <span style="font-size: 0.92rem; font-weight: 700; color: var(--color-primary); display: block;">${item.startTime}</span>
              <span style="font-size: 0.72rem; color: var(--color-text-secondary); font-weight: 500;">${pLabel}</span>
            </div>
            <div>
              <h4 style="font-size: 0.94rem; font-weight: 600; color: var(--color-text); line-height: 1.3;">${item.courseName}</h4>
              <div style="display: flex; gap: 12px; font-size: 0.76rem; color: var(--color-text-secondary); margin-top: 2px;">
                <span style="display: flex; align-items: center; gap: 4px;">
                  <i data-lucide="map-pin" style="color: var(--color-primary); width: 13px; height: 13px;"></i>
                  ${item.room || (isTHPT ? `Phòng ${user.className || '11A2'}` : 'A203')}
                </span>
                ${item.teacher ? `
                  <span style="display: flex; align-items: center; gap: 4px;">
                    <i data-lucide="user-check" style="width: 13px; height: 13px;"></i>
                    ${item.teacher}
                  </span>
                ` : ''}
              </div>
            </div>
          </div>
          <div>${statusBadge}</div>
        </div>
      `;
    }).join('');

    return `
      <div class="dashboard-wrapper fade-in-lift">
        <!-- BIG HERO IMPORT CTA BANNER -->
        <div class="glass-card hero-import-card" style="padding: 18px 22px; margin-bottom: 16px; background: linear-gradient(135deg, var(--primary-light) 0%, var(--color-glass) 100%); border: 1px solid var(--primary-border); display: flex; justify-content: space-between; align-items: center; box-shadow: var(--shadow-sm);">
          <div style="display: flex; align-items: center; gap: 16px;">
            <div style="width: 48px; height: 48px; border-radius: var(--radius-md); background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%); display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 4px 14px var(--primary-glow); flex-shrink: 0;">
              <i data-lucide="camera" style="width: 24px; height: 24px;"></i>
            </div>
            <div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span class="glass-pill" style="font-size: 0.7rem; font-weight: 600; background: var(--color-primary); color: white;">Tính năng thông minh</span>
                <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--color-text);">Nhập TKB của trường bằng AI</h3>
              </div>
              <p style="font-size: 0.84rem; color: var(--color-text-secondary); margin-top: 3px; line-height: 1.4;">
                “Chụp TKB. Phần còn lại để app lo.” — Tự động nhận diện ảnh Zalo, PDF, Excel hoặc ma trận lớp.
              </p>
            </div>
          </div>

          <div style="display: flex; gap: 8px; flex-shrink: 0;">
            <button id="btn-dash-manual-hero" class="glass-button" style="padding: 9px 16px; font-size: 0.86rem; font-weight: 700; background: var(--color-card-background);" title="Tự nhập từng môn vào thời khóa biểu">
              ✍️ Nhập thủ công
            </button>
            <button id="btn-dash-import-hero" class="glass-button glass-button-primary" style="padding: 9px 18px; font-size: 0.86rem; font-weight: 700; white-space: nowrap;" title="Mở menu thêm và import TKB">
              <i data-lucide="plus-circle" style="width: 16px; height: 16px;"></i> ＋ Thêm lịch học
            </button>
          </div>
        </div>

        <!-- Grade 12 Countdown (If Grade 12) -->
        ${isGrade12 ? `
          <div class="glass-card" style="padding: 14px 18px; margin-bottom: 16px; background: var(--color-card-background); display: flex; justify-content: space-between; align-items: center; border-left: 4px solid var(--color-primary);">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 36px; height: 36px; border-radius: 50%; background: var(--primary-light); display: flex; align-items: center; justify-content: center; color: var(--color-primary);">
                <i data-lucide="target" style="width: 20px; height: 20px;"></i>
              </div>
              <div>
                <h4 style="font-size: 0.96rem; font-weight: 600; color: var(--color-text);">
                  Ôn thi THPT Quốc gia ${targets.examYear || 2027}: Còn <span style="color: var(--color-primary); font-weight: 700;">${diffDays} ngày</span>
                </h4>
                <p style="font-size: 0.78rem; color: var(--color-text-secondary); margin-top: 1px;">
                  Tổ hợp: <strong>${targets.combination}</strong> · Mục tiêu: <strong>${targets.targetTotalScore} điểm</strong>
                </p>
              </div>
            </div>
            <button id="btn-dash-open-g12" class="glass-button" style="padding: 6px 12px; font-size: 0.78rem;">
              Xem kế hoạch <i data-lucide="chevron-right" style="width: 14px; height: 14px;"></i>
            </button>
          </div>
        ` : ''}

        <!-- Next Class & Today Overview Grid -->
        <div style="display: grid; grid-template-columns: 1.25fr 1fr; gap: 14px; margin-bottom: 16px;">
          <!-- Next Class Card -->
          <div class="glass-card" style="padding: 18px; border-left: 5px solid ${nextClass ? nextClass.courseColor : 'var(--primary)'}; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 0.74rem; font-weight: 600; color: var(--primary); display: flex; align-items: center; gap: 5px;">
                  <i data-lucide="clock-3" style="width: 14px; height: 14px;"></i>
                  ${nextClass ? 'TIẾT HỌC TIẾP THEO' : 'HÔM NAY'}
                </span>
                <span class="glass-pill" style="font-size: 0.72rem; font-weight: 600; background: rgba(0,0,0,0.05);">
                  ${nextClass ? (nextClass.startPeriod ? `Tiết ${nextClass.startPeriod}–${nextClass.endPeriod}` : nextClass.startTime) : 'Nghỉ'}
                </span>
              </div>

              <h3 style="font-size: 1.3rem; font-weight: 700; color: var(--text-main); margin-top: 8px; line-height: 1.25;">
                ${nextClass ? nextClass.courseName : 'Không còn tiết học nào trong ngày'}
              </h3>

              <div style="display: flex; flex-wrap: wrap; gap: 12px; margin-top: 10px; font-size: 0.82rem; color: var(--text-secondary); font-weight: 500;">
                <span style="display: flex; align-items: center; gap: 4px;">
                  <i data-lucide="clock" style="color: var(--primary); width: 14px; height: 14px;"></i>
                  ${nextClass ? `${nextClass.startTime} – ${nextClass.endTime}` : '--:--'}
                </span>
                <span style="display: flex; align-items: center; gap: 4px;">
                  <i data-lucide="map-pin" style="color: var(--primary); width: 14px; height: 14px;"></i>
                  ${nextClass ? (nextClass.room || (isTHPT ? `Phòng ${user.className || '11A2'}` : 'A203')) : '---'}
                </span>
                ${nextClass && nextClass.teacher ? `
                  <span style="display: flex; align-items: center; gap: 4px;">
                    <i data-lucide="user" style="width: 14px; height: 14px;"></i>
                    ${nextClass.teacher}
                  </span>
                ` : ''}
                ${!isTHPT && nextClass && nextClass.credits ? `
                  <span style="display: flex; align-items: center; gap: 4px;">
                    <i data-lucide="graduation-cap" style="color: #3B82F6; width: 14px; height: 14px;"></i>
                    ${nextClass.credits} tín chỉ
                  </span>
                ` : ''}
              </div>
            </div>

            <div style="display: flex; justify-content: flex-end; margin-top: 12px;">
              <button class="glass-button" id="btn-dash-view-tkb" style="padding: 6px 12px; font-size: 0.8rem;">
                Xem thời khóa biểu tuần <i data-lucide="chevron-right" style="width: 14px; height: 14px;"></i>
              </button>
            </div>
          </div>

          <!-- Quick Stats Cards (2x2) -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div class="glass-card" style="padding: 14px; text-align: center;">
              <div style="color: var(--primary); margin-bottom: 2px;">
                <i data-lucide="${isTHPT ? 'book-open' : 'clipboard-list'}" style="width: 22px; height: 22px;"></i>
              </div>
              <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary); line-height: 1.1;">
                ${isTHPT ? pendingHw.length : pendingAssignments.length}
              </div>
              <div style="font-size: 0.72rem; font-weight: 600; color: var(--text-secondary); margin-top: 2px;">
                ${isTHPT ? 'Bài tập cần làm' : 'Deadline cần nộp'}
              </div>
            </div>

            <div class="glass-card" style="padding: 14px; text-align: center;">
              <div style="color: var(--text-main); margin-bottom: 2px;">
                <i data-lucide="${isTHPT ? 'file-text' : 'calendar-check'}" style="width: 22px; height: 22px;"></i>
              </div>
              <div style="font-size: 1.5rem; font-weight: 700; color: var(--text-main); line-height: 1.1;">
                ${isTHPT ? pendingExams.length : todayItems.length}
              </div>
              <div style="font-size: 0.72rem; font-weight: 600; color: var(--text-secondary); margin-top: 2px;">
                ${isTHPT ? 'Lịch kiểm tra' : 'Môn học hôm nay'}
              </div>
            </div>

            <div class="glass-card" style="padding: 14px; text-align: center;">
              <div style="color: var(--text-main); margin-bottom: 2px;">
                <i data-lucide="${isTHPT ? 'clock-3' : 'award'}" style="width: 22px; height: 22px;"></i>
              </div>
              <div style="font-size: 1.5rem; font-weight: 700; color: var(--text-main); line-height: 1.1;">
                ${isTHPT ? (todayItems.length * 2) : totalCredits}
              </div>
              <div style="font-size: 0.72rem; font-weight: 600; color: var(--text-secondary); margin-top: 2px;">
                ${isTHPT ? 'Tiết học hôm nay' : 'Tổng số tín chỉ'}
              </div>
            </div>

            <div class="glass-card" style="padding: 14px; text-align: center;">
              <div style="color: var(--primary); margin-bottom: 2px;">
                <i data-lucide="layers" style="width: 22px; height: 22px;"></i>
              </div>
              <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary); line-height: 1.1;">
                ${courses.length}
              </div>
              <div style="font-size: 0.72rem; font-weight: 600; color: var(--text-secondary); margin-top: 2px;">
                Tổng số môn học
              </div>
            </div>
          </div>
        </div>

        <!-- Today Schedule Timeline List -->
        <div class="glass-card" style="padding: 18px; margin-bottom: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <h3 style="font-size: 1.05rem; font-weight: 600; color: var(--color-text); display: flex; align-items: center; gap: 8px;">
              <i data-lucide="calendar" style="color: var(--color-primary); width: 18px; height: 18px;"></i>
              Lịch trình hôm nay
            </h3>
            <span style="font-size: 0.78rem; color: var(--color-text-secondary); font-weight: 500;">${todayItems.length} môn học</span>
          </div>

          <div>${todayTimelineHtml}</div>
        </div>

        <!-- Mobile Companion Section (Mini Calendar, Selected Day Schedule, Deadlines) -->
        <div class="dashboard-mobile-companion" id="mobile-companion-panel">
          ${RightPanel.render(courses, homeworkOrAssignments, user, onSelectCourse, null, onNavigate, true)}
        </div>
      </div>
    `;
  },

  bindEvents(container, { onAddCourse, onSelectCourse, onNavigate, onOpenImport, onOpenManualEntry, onOpenTarget12, onToggleTask }) {
    container.querySelector('#btn-dash-import-hero')?.addEventListener('click', onOpenImport);
    container.querySelector('#btn-dash-manual-hero')?.addEventListener('click', onOpenManualEntry || onAddCourse);
    container.querySelector('#btn-dash-open-g12')?.addEventListener('click', onOpenTarget12);
    container.querySelector('#btn-dash-view-tkb')?.addEventListener('click', () => {
      if (onNavigate) onNavigate('timetable');
    });

    container.querySelectorAll('.today-item-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-course-id');
        if (id && onSelectCourse) onSelectCourse(id);
      });
    });

    // Bind events for Mobile Companion (Mini Calendar, Date selection, Task toggle, Quick links)
    RightPanel.bindEvents(container, {
      onSelectCourse,
      onToggleTask: (tId, completed) => {
        if (onToggleTask) {
          onToggleTask(tId, completed);
        } else {
          const mode = Storage.getMode();
          if (mode === 'high_school') {
            HomeworkRepository.toggleComplete(tId, completed);
          } else {
            AssignmentRepository.toggleComplete(tId, completed);
          }
          if (RightPanel.onReRender) RightPanel.onReRender();
        }
      },
      onNavigate
    });
  }
};
