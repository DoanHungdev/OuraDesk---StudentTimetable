/**
 * CourseDetailDrawer Component: Slide-over Drawer (Desktop) & Bottom Sheet (Mobile)
 * Rich inspection of course progress, exact period timetable, teacher, room, and calculated academic timeline.
 */
import { DAY_NAMES } from '../data/mockData.js';
import { ScheduleEngine } from '../utils/scheduleEngine.js';
import { CurriculumEngine } from '../utils/curriculumEngine.js';
import { Storage } from '../utils/storage.js';

export const CourseDetailDrawer = {
  backdrop: null,
  callbacks: {},
  currentCourse: null,

  init(callbacks = {}) {
    this.callbacks = callbacks;
    this.renderContainer();
  },

  renderContainer() {
    let el = document.getElementById('course-detail-drawer-backdrop');
    if (!el) {
      el = document.createElement('div');
      el.id = 'course-detail-drawer-backdrop';
      el.className = 'modal-backdrop';
      document.body.appendChild(el);
    }
    this.backdrop = el;

    this.backdrop.addEventListener('click', (e) => {
      if (e.target === this.backdrop) {
        this.close();
      }
    });
  },

  openDrawer(course, onEdit, onDelete, onReschedule) {
    this.currentCourse = course;
    this.renderUI(course, onEdit, onDelete, onReschedule);
    this.open();
  },

  renderUI(course, onEdit, onDelete, onReschedule) {
    const mode = Storage.getMode();
    const isTHPT = mode === 'high_school';
    const isMobile = window.innerWidth < 768;

    const group = isTHPT ? null : CurriculumEngine.getCourseGroupById(course.courseGroupId || course.category);
    const progress = ScheduleEngine.calculateCourseProgress(course, new Date());

    const schedulesHtml = (course.schedules || []).map(sch => {
      const dayInfo = DAY_NAMES.find(d => d.day === Number(sch.day)) || { name: `Thứ ${sch.day + 1}` };
      const periodBadge = sch.startPeriod && sch.endPeriod ? `Tiết ${sch.startPeriod} – ${sch.endPeriod}` : `${sch.sessions || 3} tiết`;
      return `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: var(--color-card-background); border: 1px solid var(--color-glass-border); border-left: 4px solid ${course.color || 'var(--color-primary)'}; border-radius: var(--radius-md); margin-bottom: 8px;">
          <div>
            <div style="font-weight: 700; color: var(--color-text); font-size: 0.9rem;">
              <i data-lucide="calendar" style="width: 14px; height: 14px; color: var(--color-primary); display: inline-block; vertical-align: middle; margin-right: 4px;"></i>
              ${dayInfo.name} (${periodBadge})
            </div>
            <div style="font-size: 0.78rem; color: var(--color-text-secondary); margin-top: 3px;">
              <span><i data-lucide="clock" style="width: 12px; height: 12px; display: inline-block; vertical-align: middle;"></i> ${sch.startTime} – ${sch.endTime}</span>
              <span style="margin-left: 12px;"><i data-lucide="map-pin" style="width: 12px; height: 12px; display: inline-block; vertical-align: middle;"></i> ${sch.room || course.room || 'Phòng A203'}</span>
            </div>
          </div>
          <span class="glass-pill" style="font-size: 0.74rem; font-weight: 700; background: ${course.color || 'var(--primary-light)'}; color: #1F2937;">
            ${dayInfo.shortName}
          </span>
        </div>
      `;
    }).join('');

    this.backdrop.innerHTML = `
      <div class="drawer-window fade-in-lift ${isMobile ? 'bottom-sheet' : 'slide-over-right'}" style="${isMobile ? 'position: fixed; bottom: 0; left: 0; right: 0; max-height: 85vh; border-top-left-radius: 24px; border-top-right-radius: 24px;' : 'position: fixed; top: 0; right: 0; bottom: 0; width: 460px; max-width: 90vw; border-top-left-radius: 20px; border-bottom-left-radius: 20px;'} background: var(--color-glass-sidebar); border: 1px solid var(--color-glass-border); box-shadow: -10px 0 40px var(--color-shadow); display: flex; flex-direction: column; overflow: hidden; backdrop-filter: blur(20px);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, ${course.color || '#AFC8F5'} 0%, var(--color-glass) 100%); padding: 20px 24px; border-bottom: 1px solid var(--color-glass-border); display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
              <span class="glass-pill" style="font-size: 0.72rem; font-weight: 800; background: rgba(255,255,255,0.9); color: #1F2937;">
                ${course.code || 'MÃ HP'}
              </span>
              <span class="glass-pill" style="font-size: 0.72rem; font-weight: 700; background: var(--color-card-background);">
                ${course.source === 'manual' ? '✍️ Thủ công' : '📷 AI OCR'}
              </span>
            </div>
            <h3 style="font-size: 1.3rem; font-weight: 800; color: #1F2937; line-height: 1.25;">
              ${course.name}
            </h3>
            <p style="font-size: 0.8rem; font-weight: 600; color: rgba(31,41,55,0.85); margin-top: 3px;">
              ${group ? group.name : (isTHPT ? 'Môn học THPT' : 'Khối kiến thức đào tạo')} · ${course.type === 'practical' ? 'Thực hành' : (course.type === 'lab' ? 'Thí nghiệm' : 'Lý thuyết')}
            </p>
          </div>
          <button id="drawer-close-x" class="icon-btn" style="width: 32px; height: 32px; font-size: 1rem;" aria-label="Đóng">&times;</button>
        </div>

        <!-- Body -->
        <div class="drawer-body custom-scroll" style="padding: 20px 24px; flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 14px;">
          <!-- Course Progress Card -->
          <div style="background: var(--color-card-background); border: 1px solid var(--color-glass-border); border-radius: var(--radius-lg); padding: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span style="font-size: 0.76rem; font-weight: 700; color: var(--color-text-secondary); text-transform: uppercase;">
                TIẾN ĐỘ HỌC PHẦN
              </span>
              <span style="font-size: 0.88rem; font-weight: 800; color: var(--color-primary);">
                ${progress.progressPercent}%
              </span>
            </div>

            <!-- Progress Bar -->
            <div style="width: 100%; height: 8px; background: rgba(0,0,0,0.06); border-radius: 4px; overflow: hidden; margin-bottom: 10px;">
              <div style="width: ${progress.progressPercent}%; height: 100%; background: linear-gradient(90deg, var(--color-primary) 0%, #10B981 100%); border-radius: 4px; transition: width 0.4s ease;"></div>
            </div>

            <div style="display: flex; justify-content: space-between; font-size: 0.78rem; color: var(--color-text); font-weight: 600;">
              <span>Đã học: <strong>${progress.completedPeriods}</strong> / ${progress.totalPeriods} tiết</span>
              <span style="color: var(--color-text-secondary);">Còn lại: ${progress.remainingPeriods} tiết</span>
            </div>
          </div>

          <!-- Key Metrics Grid -->
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
            ${!isTHPT ? `
              <div style="background: var(--color-card-background); border: 1px solid var(--color-glass-border); padding: 10px; border-radius: var(--radius-md); text-align: center;">
                <div style="font-size: 0.7rem; font-weight: 700; color: var(--color-text-secondary); text-transform: uppercase;">TÍN CHỈ</div>
                <div style="font-size: 1.25rem; font-weight: 800; color: var(--color-primary); margin-top: 2px;">${course.credits || 3}</div>
              </div>
            ` : ''}
            <div style="background: var(--color-card-background); border: 1px solid var(--color-glass-border); padding: 10px; border-radius: var(--radius-md); text-align: center;">
              <div style="font-size: 0.7rem; font-weight: 700; color: var(--color-text-secondary); text-transform: uppercase;">TỔNG SỐ TIẾT</div>
              <div style="font-size: 1.25rem; font-weight: 800; color: var(--color-text); margin-top: 2px;">${progress.totalPeriods}</div>
            </div>
            <div style="background: var(--color-card-background); border: 1px solid var(--color-glass-border); padding: 10px; border-radius: var(--radius-md); text-align: center;">
              <div style="font-size: 0.7rem; font-weight: 700; color: var(--color-text-secondary); text-transform: uppercase;">TIẾT / TUẦN</div>
              <div style="font-size: 1.25rem; font-weight: 800; color: var(--color-text); margin-top: 2px;">${progress.periodsPerWeek}</div>
            </div>
          </div>

          <!-- Academic Timeline (Start -> End Date) -->
          <div style="background: var(--color-card-background); border: 1px solid var(--color-glass-border); border-radius: var(--radius-lg); padding: 14px;">
            <div style="font-size: 0.76rem; font-weight: 700; color: var(--color-text-secondary); text-transform: uppercase; margin-bottom: 8px;">
              KHUNG THỜI GIAN ĐÀO TẠO
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <div>
                <span style="font-size: 0.72rem; color: var(--color-text-secondary); display: block;">Ngày bắt đầu:</span>
                <span style="font-size: 0.92rem; font-weight: 700; color: var(--color-text);">${progress.startDateFormatted}</span>
              </div>
              <div>
                <span style="font-size: 0.72rem; color: var(--color-text-secondary); display: block;">Dự kiến kết thúc:</span>
                <span style="font-size: 0.92rem; font-weight: 800; color: var(--color-primary);">${progress.calculatedEndDate}</span>
              </div>
            </div>
          </div>

          <!-- Teacher & Room -->
          <div style="background: var(--color-card-background); border: 1px solid var(--color-glass-border); border-radius: var(--radius-lg); padding: 14px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
              <span style="font-size: 0.74rem; font-weight: 700; color: var(--color-text-secondary); text-transform: uppercase;"><i data-lucide="user" style="width: 13px; height: 13px; display: inline-block; vertical-align: middle;"></i> GIẢNG VIÊN</span>
              <span style="font-size: 0.88rem; font-weight: 700; color: var(--color-text);">${course.teacher || 'Chưa cập nhật'}</span>
            </div>
            ${course.teacherEmail ? `
              <div style="font-size: 0.76rem; color: var(--color-primary); margin-bottom: 8px;">
                <i data-lucide="mail" style="width: 12px; height: 12px; display: inline-block; vertical-align: middle;"></i> ${course.teacherEmail}
              </div>
            ` : ''}
            <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px dashed var(--color-glass-border); padding-top: 8px;">
              <span style="font-size: 0.74rem; font-weight: 700; color: var(--color-text-secondary); text-transform: uppercase;"><i data-lucide="map-pin" style="width: 13px; height: 13px; display: inline-block; vertical-align: middle;"></i> PHÒNG HỌC</span>
              <span style="font-size: 0.88rem; font-weight: 700; color: var(--color-text);">${course.room || (isTHPT ? '11A2' : 'A203')}</span>
            </div>
          </div>

          <!-- Weekly Schedule Blocks -->
          <div>
            <div style="font-size: 0.76rem; font-weight: 700; color: var(--color-text-secondary); text-transform: uppercase; margin-bottom: 8px;">
              LỊCH HỌC TRONG TUẦN
            </div>
            ${schedulesHtml}
          </div>

          <!-- Notes -->
          ${course.notes ? `
            <div style="background: var(--primary-light); border-left: 3px solid var(--color-primary); padding: 10px 14px; border-radius: var(--radius-sm); font-size: 0.82rem; color: var(--color-text);">
              <strong>Ghi chú:</strong> ${course.notes}
            </div>
          ` : ''}
        </div>

        <!-- Footer Actions -->
        <div style="padding: 16px 24px; background: var(--color-glass); border-top: 1px solid var(--color-glass-border); display: flex; justify-content: space-between; align-items: center; gap: 8px;">
          <button type="button" id="drawer-btn-delete" class="glass-button" style="color: #EF4444; border-color: rgba(239,68,68,0.3); font-weight: 600;">
            <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i> Xóa môn
          </button>

          <div style="display: flex; gap: 8px;">
            <button type="button" id="drawer-btn-reschedule" class="glass-button" style="font-weight: 600;">
              <i data-lucide="calendar-sync" style="width: 14px; height: 14px;"></i> Đổi lịch
            </button>
            <button type="button" id="drawer-btn-edit" class="glass-button glass-button-primary" style="font-weight: 700;">
              <i data-lucide="edit-3" style="width: 14px; height: 14px;"></i> Chỉnh sửa
            </button>
          </div>
        </div>
      </div>
    `;

    this.bindEvents(course, onEdit, onDelete, onReschedule);
    if (window.lucide) window.lucide.createIcons();
  },

  bindEvents(course, onEdit, onDelete, onReschedule) {
    this.backdrop.querySelector('#drawer-close-x')?.addEventListener('click', () => this.close());

    this.backdrop.querySelector('#drawer-btn-edit')?.addEventListener('click', () => {
      this.close();
      if (onEdit) onEdit(course);
    });

    this.backdrop.querySelector('#drawer-btn-reschedule')?.addEventListener('click', () => {
      this.close();
      if (onReschedule) {
        onReschedule(course);
      } else if (onEdit) {
        onEdit(course);
      }
    });

    this.backdrop.querySelector('#drawer-btn-delete')?.addEventListener('click', () => {
      if (confirm(`Bạn có chắc chắn muốn xóa môn "${course.name}" không?`)) {
        this.close();
        if (onDelete) onDelete(course.id);
      }
    });
  },

  open() {
    if (this.backdrop) this.backdrop.classList.add('open');
  },

  close() {
    if (this.backdrop) this.backdrop.classList.remove('open');
  }
};
