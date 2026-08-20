/**
 * CourseModal: 3-STEP Professional Course Creation & Editing Wizard
 * 
 * STEP 1: Thông tin học phần (Name, Code, Group, Credits, Total periods, Teacher, Room, Type)
 * STEP 2: Lịch học (Start date, multiple weekly schedule slots with auto-calculated periods & exact times, live auto-calculated end date & sessions)
 * STEP 3: Xem trước (Structured summary review before saving)
 * 
 * Integrated with University Time Profile & University Curriculum Engine & ScheduleEngine
 */
import { DAY_NAMES } from '../data/mockData.js';
import { ProfileEngine } from '../utils/profileEngine.js';
import { CurriculumEngine } from '../utils/curriculumEngine.js';
import { ScheduleEngine } from '../utils/scheduleEngine.js';
import { AcademicCalendar } from '../data/academicCalendar.js';
import { Storage } from '../utils/storage.js';

export const CourseModal = {
  backdrop: null,
  callbacks: {},
  currentStep: 1, // 1, 2, 3
  isEdit: false,
  formData: {},
  tempSchedules: [],

  init(callbacks = {}) {
    this.callbacks = callbacks;
    this.renderContainer();
  },

  renderContainer() {
    let el = document.getElementById('course-modal-backdrop');
    if (!el) {
      el = document.createElement('div');
      el.id = 'course-modal-backdrop';
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

  openAdd(defaultDay = 1, defaultStartPeriod = 1, defaultEndPeriod = 3) {
    const mode = Storage.getMode();
    const isTHPT = mode === 'high_school';
    const activeState = ProfileEngine.getActiveProfileState();
    const activeCurr = isTHPT ? null : CurriculumEngine.getActiveCurriculumState();
    const firstGroup = isTHPT ? null : (CurriculumEngine.getActiveCourseGroups()[0] || null);

    const timeRange = ProfileEngine.calculateTimeRangeFromPeriods(activeState.profileId, defaultStartPeriod, defaultEndPeriod);

    this.isEdit = false;
    this.currentStep = 1;
    this.tempSchedules = [
      {
        id: 'sch-' + Date.now(),
        day: Number(defaultDay),
        startPeriod: Number(defaultStartPeriod),
        endPeriod: Number(defaultEndPeriod),
        startTime: timeRange.startTime,
        endTime: timeRange.endTime,
        sessions: timeRange.sessions,
        room: isTHPT ? 'Phòng 11A2' : 'Phòng A203',
        teacher: '',
        type: activeState.profile?.type || 'theory'
      }
    ];

    this.formData = {
      id: '',
      universityId: activeState.univId,
      campusId: activeState.campusId,
      profileId: activeState.profileId,
      curriculumId: activeCurr?.curriculumId || null,
      courseGroupId: firstGroup?.id || 'it',
      courseGroupName: firstGroup?.name || 'Học phần',
      name: '',
      code: '',
      credits: 3,
      totalHours: 45,
      hoursPerWeek: 3,
      type: 'theory',
      teacher: '',
      teacherEmail: '',
      room: isTHPT ? 'Phòng 11A2' : 'Phòng A203',
      color: '#AFC8F5',
      category: firstGroup?.id || 'it',
      startDate: '2026-08-18',
      endDateMode: 'auto',
      customEndDate: '',
      notes: ''
    };

    this.renderWizard();
    this.open();
  },

  openEdit(course) {
    this.isEdit = true;
    this.currentStep = 1;
    this.formData = JSON.parse(JSON.stringify(course));
    this.formData.endDateMode = course.endDateMode || 'auto';
    this.formData.customEndDate = course.customEndDate || '';
    this.tempSchedules = JSON.parse(JSON.stringify(course.schedules || []));
    if (this.tempSchedules.length === 0) {
      this.tempSchedules = [{
        id: 'sch-' + Date.now(),
        day: 1,
        startPeriod: 1,
        endPeriod: 3,
        startTime: '07:00',
        endTime: '09:40',
        sessions: 3,
        room: course.room || 'Phòng A203',
        teacher: course.teacher || '',
        type: course.type || 'theory'
      }];
    }
    this.renderWizard();
    this.open();
  },

  renderWizard() {
    const mode = Storage.getMode();
    const isTHPT = mode === 'high_school';
    const activeProfileState = ProfileEngine.getActiveProfileState();
    const activeCurriculumState = isTHPT ? null : CurriculumEngine.getActiveCurriculumState();
    const title = this.isEdit 
      ? (isTHPT ? `Chỉnh sửa môn học: ${this.formData.name || ''}` : `Chỉnh sửa học phần: ${this.formData.name || ''}`)
      : (isTHPT ? 'Thêm Môn Học Mới' : 'Thêm Học Phần Tín Chỉ Mới');

    // Stepper header
    const stepperHtml = `
      <div class="modal-stepper" style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 16px; padding: 0 10px;">
        <div class="step-badge ${this.currentStep >= 1 ? 'active' : ''}" style="display: flex; align-items: center; gap: 6px; font-size: 0.76rem; font-weight: 700; color: ${this.currentStep === 1 ? 'var(--color-primary)' : 'var(--color-text-secondary)'};">
          <span style="width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.72rem; ${this.currentStep === 1 ? 'background: var(--color-primary); color: white;' : (this.currentStep > 1 ? 'background: #10B981; color: white;' : 'background: var(--color-glass); color: var(--color-text-secondary);')}">
            ${this.currentStep > 1 ? '✓' : '1'}
          </span>
          <span>Thông tin ${isTHPT ? 'môn học' : 'học phần'}</span>
        </div>

        <div style="width: 24px; height: 2px; background: ${this.currentStep >= 2 ? 'var(--color-primary)' : 'var(--color-glass-border)'};"></div>

        <div class="step-badge ${this.currentStep >= 2 ? 'active' : ''}" style="display: flex; align-items: center; gap: 6px; font-size: 0.76rem; font-weight: 700; color: ${this.currentStep === 2 ? 'var(--color-primary)' : 'var(--color-text-secondary)'};">
          <span style="width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.72rem; ${this.currentStep === 2 ? 'background: var(--color-primary); color: white;' : (this.currentStep > 2 ? 'background: #10B981; color: white;' : 'background: var(--color-glass); color: var(--color-text-secondary);')}">
            ${this.currentStep > 2 ? '✓' : '2'}
          </span>
          <span>Lịch học & Ngày bắt đầu</span>
        </div>

        <div style="width: 24px; height: 2px; background: ${this.currentStep >= 3 ? 'var(--color-primary)' : 'var(--color-glass-border)'};"></div>

        <div class="step-badge ${this.currentStep === 3 ? 'active' : ''}" style="display: flex; align-items: center; gap: 6px; font-size: 0.76rem; font-weight: 700; color: ${this.currentStep === 3 ? 'var(--color-primary)' : 'var(--color-text-secondary)'};">
          <span style="width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.72rem; ${this.currentStep === 3 ? 'background: var(--color-primary); color: white;' : 'background: var(--color-glass); color: var(--color-text-secondary);'}">
            3
          </span>
          <span>Xem trước & Lưu</span>
        </div>
      </div>
    `;

    // Render body according to currentStep
    let bodyHtml = '';
    if (this.currentStep === 1) {
      bodyHtml = this.renderStep1(isTHPT, activeCurriculumState);
    } else if (this.currentStep === 2) {
      bodyHtml = this.renderStep2(isTHPT, activeProfileState);
    } else {
      bodyHtml = this.renderStep3(isTHPT, activeCurriculumState);
    }

    this.backdrop.innerHTML = `
      <div class="modal-window fade-in-lift" style="max-width: 660px; border-radius: var(--radius-xl); overflow: hidden; border: 1px solid var(--color-glass-border); box-shadow: 0 20px 48px var(--color-shadow);">
        <div class="modal-header" style="background: linear-gradient(135deg, var(--primary-light) 0%, var(--color-glass) 100%); padding: 18px 24px; border-bottom: 1px solid var(--color-glass-border);">
          <div>
            <h3 class="modal-title" style="font-size: 1.18rem; font-weight: 700; color: var(--color-text); line-height: 1.25;">${title}</h3>
            <p style="font-size: 0.78rem; color: var(--color-text-secondary); margin-top: 2px;">
              ${isTHPT ? 'Chuẩn hóa số tiết và thời khóa biểu khối THPT' : `${activeProfileState.university.name} • ${activeProfileState.campus.name}`}
            </p>
          </div>
          <button id="modal-close-x" class="icon-btn" style="width: 32px; height: 32px; font-size: 1rem;" aria-label="Đóng">&times;</button>
        </div>

        <div class="modal-body custom-scroll" style="padding: 20px 24px; max-height: 68vh; overflow-y: auto; display: flex; flex-direction: column; gap: 14px;">
          ${stepperHtml}
          ${bodyHtml}
        </div>
      </div>
    `;

    this.bindEvents(isTHPT, activeProfileState);
    if (window.lucide) window.lucide.createIcons();
  },

  renderStep1(isTHPT, activeCurriculumState) {
    const activeGroups = isTHPT ? [
      { id: 'math_sci', name: 'Khoa học Tự nhiên (Toán - Lý - Hóa - Sinh)' },
      { id: 'soc_lang', name: 'Khoa học Xã hội (Văn - Sử - Địa - GDCD)' },
      { id: 'pe_art', name: 'Thể chất & Nghệ thuật' }
    ] : CurriculumEngine.getActiveCourseGroups();

    const categoryOptions = activeGroups.map(g => `
      <option value="${g.id}" ${(this.formData.courseGroupId === g.id || this.formData.category === g.id) ? 'selected' : ''}>
        ${g.name} ${g.code ? `(${g.code})` : ''}
      </option>
    `).join('');

    const pastelColors = [
      { code: '#AFC8F5', name: 'Xanh dương' },
      { code: '#A9DED5', name: 'Xanh ngọc' },
      { code: '#F5B28D', name: 'Cam đào' },
      { code: '#C7B7F4', name: 'Tím pastel' },
      { code: '#F7D99A', name: 'Vàng pastel' },
      { code: '#F4B5C2', name: 'Hồng pastel' }
    ];

    const colorPills = pastelColors.map(c => `
      <label style="cursor: pointer; display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: var(--radius-sm); background: ${c.code}; border: 2px solid ${this.formData.color === c.code ? 'var(--color-primary)' : 'transparent'};">
        <input type="radio" name="course-color" value="${c.code}" ${this.formData.color === c.code ? 'checked' : ''} style="display: none;">
        <span style="font-size: 0.74rem; font-weight: 700; color: #1F2937;">${c.name}</span>
      </label>
    `).join('');

    return `
      <form id="step1-form" style="display: flex; flex-direction: column; gap: 14px;">
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 12px;">
          <div>
            <label style="font-size: 0.76rem; font-weight: 700; color: var(--color-text-secondary); text-transform: uppercase; margin-bottom: 4px; display: block;">
              TÊN ${isTHPT ? 'MÔN HỌC' : 'HỌC PHẦN'} *
            </label>
            <input type="text" id="course-name" class="glass-input" required value="${this.formData.name || ''}" placeholder="VD: Toán cao cấp, Kỹ thuật Vi xử lý..." style="font-weight: 600;">
          </div>
          <div>
            <label style="font-size: 0.76rem; font-weight: 700; color: var(--color-text-secondary); text-transform: uppercase; margin-bottom: 4px; display: block;">
              MÃ ${isTHPT ? 'MÔN' : 'HỌC PHẦN'} *
            </label>
            <input type="text" id="course-code" class="glass-input" required value="${this.formData.code || ''}" placeholder="VD: MAT101" style="font-weight: 600; text-transform: uppercase;">
          </div>
        </div>

        <div style="display: grid; grid-template-columns: ${isTHPT ? '1fr 1fr' : '1fr 1fr 1.5fr'}; gap: 12px;">
          ${!isTHPT ? `
            <div>
              <label style="font-size: 0.76rem; font-weight: 700; color: var(--color-text-secondary); text-transform: uppercase; margin-bottom: 4px; display: block;">
                SỐ TÍN CHỈ
              </label>
              <input type="number" id="course-credits" class="glass-input" min="1" max="15" value="${this.formData.credits || 3}">
            </div>
          ` : ''}

          <div>
            <label style="font-size: 0.76rem; font-weight: 700; color: var(--color-text-secondary); text-transform: uppercase; margin-bottom: 4px; display: block;">
              ${isTHPT ? 'SỐ TIẾT / TUẦN' : 'TỔNG SỐ TIẾT *'}
            </label>
            <input type="number" id="course-total-hours" class="glass-input" min="1" max="200" value="${this.formData.totalHours || 45}" required>
          </div>

          <div>
            <label style="font-size: 0.76rem; font-weight: 700; color: var(--color-text-secondary); text-transform: uppercase; margin-bottom: 4px; display: block;">
              ${isTHPT ? 'NHÓM MÔN' : 'NHÓM HỌC PHẦN (CTĐT)'}
            </label>
            <select id="course-category" class="glass-input" style="font-size: 0.82rem; cursor: pointer;">
              ${categoryOptions}
            </select>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1.2fr 1fr 1fr; gap: 12px;">
          <div>
            <label style="font-size: 0.76rem; font-weight: 700; color: var(--color-text-secondary); text-transform: uppercase; margin-bottom: 4px; display: block;">
              GIẢNG VIÊN / GIÁO VIÊN
            </label>
            <input type="text" id="course-teacher" class="glass-input" value="${this.formData.teacher || ''}" placeholder="VD: TS. Nguyễn Văn An">
          </div>

          <div>
            <label style="font-size: 0.76rem; font-weight: 700; color: var(--color-text-secondary); text-transform: uppercase; margin-bottom: 4px; display: block;">
              PHÒNG HỌC
            </label>
            <input type="text" id="course-room" class="glass-input" value="${this.formData.room || (isTHPT ? 'Phòng 11A2' : 'Phòng A203')}">
          </div>

          <div>
            <label style="font-size: 0.76rem; font-weight: 700; color: var(--color-text-secondary); text-transform: uppercase; margin-bottom: 4px; display: block;">
              LOẠI HỌC PHẦN
            </label>
            <select id="course-type" class="glass-input" style="cursor: pointer;">
              <option value="theory" ${this.formData.type === 'theory' ? 'selected' : ''}>Lý thuyết</option>
              <option value="practical" ${this.formData.type === 'practical' ? 'selected' : ''}>Thực hành</option>
              <option value="lab" ${this.formData.type === 'lab' ? 'selected' : ''}>Thí nghiệm</option>
            </select>
          </div>
        </div>

        <div>
          <label style="font-size: 0.76rem; font-weight: 700; color: var(--color-text-secondary); text-transform: uppercase; margin-bottom: 6px; display: block;">
            MÀU ĐÁNH DẤU
          </label>
          <div id="color-pill-group" style="display: flex; flex-wrap: wrap; gap: 8px;">
            ${colorPills}
          </div>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px; padding-top: 12px; border-top: 1px solid var(--color-glass-border);">
          <button type="button" id="btn-cancel-modal" class="glass-button">Hủy bỏ</button>
          <button type="button" id="btn-goto-step2" class="glass-button glass-button-primary" style="padding: 9px 22px; font-weight: 700;">
            Tiếp tục sang Lịch học →
          </button>
        </div>
      </form>
    `;
  },

  renderStep2(isTHPT, activeProfileState) {
    const periods = isTHPT 
      ? HIGH_SCHOOL_TIME_PROFILE.periods 
      : (activeProfileState.profile?.periods || []).filter(p => p.isUsable);

    // Live meta calculation via ScheduleEngine
    // Calculate Auto Meta
    const meta = ScheduleEngine.calculateScheduleMeta({
      startDate: this.formData.startDate || '2026-08-18',
      totalPeriods: this.formData.totalHours || (this.formData.credits * 15) || 45,
      schedules: this.tempSchedules,
      mode: isTHPT ? 'high_school' : 'university',
      profileId: activeProfileState.profileId
    });

    const isManualMode = this.formData.endDateMode === 'manual';
    let displayEndDate = meta.calculatedEndDate;
    let displayEndDateDayName = '';
    let displayWeeks = meta.totalWeeks;
    let displaySessions = meta.totalSessions;
    let manualValidation = null;

    if (isManualMode && this.formData.customEndDate) {
      manualValidation = ScheduleEngine.calculateOccurrencesBetweenDates({
        startDate: this.formData.startDate || '2026-08-18',
        endDate: this.formData.customEndDate,
        schedules: this.tempSchedules,
        totalTargetPeriods: this.formData.totalHours || (this.formData.credits * 15) || 45,
        mode: isTHPT ? 'high_school' : 'university',
        profileId: activeProfileState.profileId
      });
      displayEndDate = manualValidation.endDateFormatted;
      displayWeeks = manualValidation.totalWeeks;
      displaySessions = manualValidation.actualSessions;
      const parsedCustom = AcademicCalendar.parseDate(this.formData.customEndDate);
      if (parsedCustom) {
        const dObj = DAY_NAMES.find(d => d.day === parsedCustom.getDay());
        displayEndDateDayName = dObj ? dObj.name : '';
      }
    } else {
      const parsedLast = meta.occurrences[meta.occurrences.length - 1];
      if (parsedLast) {
        const dObj = DAY_NAMES.find(d => d.day === parsedLast.dayOfWeek);
        displayEndDateDayName = dObj ? dObj.name : '';
      }
    }

    const dayOptions = [
      { day: 1, name: 'Thứ Hai' },
      { day: 2, name: 'Thứ Ba' },
      { day: 3, name: 'Thứ Tư' },
      { day: 4, name: 'Thứ Năm' },
      { day: 5, name: 'Thứ Sáu' },
      { day: 6, name: 'Thứ Bảy' },
      ...(isTHPT ? [] : [{ day: 0, name: 'Chủ Nhật' }])
    ].map(d => `<option value="${d.day}">${d.name}</option>`).join('');

    const startPeriodOptions = periods.map(p => `
      <option value="${p.number}">${p.name} (${p.startTime})</option>
    `).join('');

    const endPeriodOptions = periods.map(p => `
      <option value="${p.number}">${p.name} (${p.endTime})</option>
    `).join('');

    // List of added schedule chips
    const scheduleChipsHtml = this.tempSchedules.length === 0 ? `
      <div style="padding: 16px; background: var(--color-glass); border: 1px dashed var(--color-glass-border); border-radius: var(--radius-md); text-align: center; color: var(--color-text-secondary); font-size: 0.82rem;">
        Chưa có buổi học nào trong tuần. Hãy thêm ít nhất 1 buổi học ở biểu mẫu dưới đây.
      </div>
    ` : this.tempSchedules.map((sch, idx) => {
      const dayInfo = DAY_NAMES.find(d => d.day === Number(sch.day)) || { name: `Thứ ${sch.day + 1}` };
      const periodLabel = sch.startPeriod && sch.endPeriod ? `Tiết ${sch.startPeriod} – ${sch.endPeriod}` : `${sch.sessions || 3} tiết`;
      return `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: var(--color-card-background); border: 1px solid var(--color-glass-border); border-left: 4px solid var(--color-primary); border-radius: var(--radius-md);">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 36px; height: 36px; border-radius: var(--radius-sm); background: var(--primary-light); color: var(--color-primary); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.85rem;">
              ${dayInfo.shortName || 'T2'}
            </div>
            <div>
              <div style="font-weight: 700; color: var(--color-text); font-size: 0.88rem;">
                ${dayInfo.name} · ${periodLabel}
              </div>
              <div style="font-size: 0.76rem; color: var(--color-text-secondary); margin-top: 1px;">
                <span><i data-lucide="clock" style="width: 12px; height: 12px;"></i> ${sch.startTime} – ${sch.endTime}</span>
                <span style="margin-left: 10px;"><i data-lucide="map-pin" style="width: 12px; height: 12px;"></i> ${sch.room || this.formData.room || 'A203'}</span>
              </div>
            </div>
          </div>
          <button type="button" class="icon-btn btn-remove-sch-slot" data-idx="${idx}" style="width: 28px; height: 28px; color: #EF4444;" title="Xóa buổi học này">
            <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
          </button>
        </div>
      `;
    }).join('');

    return `
      <div style="display: flex; flex-direction: column; gap: 14px;">
        <!-- Start Date & Read-Only Projected End Date Summary Card -->
        <div style="background: var(--color-card-background); border: 1px solid var(--color-glass-border); border-radius: var(--radius-lg); padding: 18px;">
          <div class="course-date-setup-grid" style="display: grid; grid-template-columns: 1fr 1.6fr; gap: 16px; align-items: stretch;">
            <!-- Start Date Input -->
            <div style="display: flex; flex-direction: column; justify-content: space-between; background: var(--color-glass); padding: 14px 16px; border-radius: var(--radius-md); border: 1px solid var(--color-glass-border);">
              <div>
                <label for="course-start-date-input" style="font-size: 0.74rem; font-weight: 700; color: var(--color-text-secondary); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; display: block;">
                  NGÀY BẮT ĐẦU HỌC *
                </label>
                <input type="date" id="course-start-date-input" class="glass-input" value="${this.formData.startDate || '2026-08-18'}" style="font-weight: 700; color: var(--color-primary); font-size: 0.95rem; cursor: pointer;">
              </div>
              <div style="font-size: 0.72rem; color: var(--color-text-secondary); margin-top: 8px;">
                <i data-lucide="info" style="width: 12px; height: 12px; display: inline-block; vertical-align: middle;"></i> Bắt đầu tính lịch học từ ngày này
              </div>
            </div>

            <!-- READ-ONLY PROJECTED END DATE SUMMARY CARD -->
            <div id="course-end-date-summary-card" style="background: linear-gradient(135deg, var(--primary-light) 0%, var(--color-glass) 100%); border-radius: var(--radius-md); padding: 14px 16px; border: 1.5px solid var(--primary-border); display: flex; flex-direction: column; justify-content: space-between; gap: 8px;">
              <!-- Header Row: Title & Status Badge -->
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 0.72rem; font-weight: 700; color: var(--color-text-secondary); text-transform: uppercase; letter-spacing: 0.5px;">
                  DỰ KIẾN KẾT THÚC HỌC PHẦN
                </span>
                ${isManualMode ? `
                  <span class="glass-pill" style="font-size: 0.68rem; font-weight: 700; background: #8B5CF6; color: white;">
                    ⚙️ Tự đặt ngày
                  </span>
                ` : `
                  <span class="glass-pill" style="font-size: 0.68rem; font-weight: 700; background: var(--color-primary); color: white;">
                    ⚡ Tự động tính
                  </span>
                `}
              </div>

              <!-- Main End Date Display (Read-Only) & Action Button -->
              <div style="display: flex; justify-content: space-between; align-items: center; gap: 10px;">
                <div>
                  <div id="summary-end-date-txt" style="font-size: 1.25rem; font-weight: 800; color: var(--color-primary); line-height: 1.2;">
                    ${displayEndDate}
                  </div>
                  <div style="font-size: 0.72rem; color: var(--color-text-secondary); font-weight: 600; margin-top: 1px;">
                    ${displayEndDateDayName ? `${displayEndDateDayName} · ` : ''}${isManualMode ? (manualValidation?.isSufficient ? '✓ Đủ thời lượng' : '⚠️ Cần kiểm tra số tiết') : 'Tính theo lịch học & nghỉ lễ'}
                  </div>
                </div>

                <!-- Customization button with touch target >= 44px -->
                <button type="button" id="btn-open-end-date-custom-modal" class="glass-button" style="min-height: 44px; min-width: 44px; padding: 8px 14px; font-size: 0.82rem; font-weight: 700; background: var(--color-card-background); border-color: var(--color-primary); color: var(--color-primary); border-radius: var(--radius-md); box-shadow: var(--shadow-sm); display: inline-flex; align-items: center; gap: 6px; cursor: pointer; flex-shrink: 0;" title="Tùy chỉnh phương thức tính hoặc tự chọn ngày kết thúc">
                  <i data-lucide="sliders-horizontal" style="width: 14px; height: 14px;"></i>
                  <span>Tùy chỉnh</span>
                </button>
              </div>

              <!-- Metrics Row -->
              <div style="display: flex; flex-wrap: wrap; gap: 8px 14px; font-size: 0.75rem; color: var(--color-text); font-weight: 600; padding-top: 8px; border-top: 1px dashed var(--primary-border);">
                <span>✓ <strong>${displayWeeks}</strong> tuần</span>
                <span>✓ <strong>${displaySessions}</strong> buổi</span>
                <span>✓ <strong>${meta.periodsPerWeek}</strong> tiết/tuần</span>
                <span>✓ Tổng <strong>${meta.totalPeriods}</strong> tiết</span>
              </div>

              <!-- Warning Banner if Manual & Insufficient -->
              ${isManualMode && manualValidation && !manualValidation.isSufficient ? `
                <div style="background: #FEF2F2; border-left: 3px solid #EF4444; border-radius: var(--radius-sm); padding: 6px 10px; font-size: 0.72rem; color: #991B1B; font-weight: 600; margin-top: 2px;">
                  ⚠️ Chỉ có ${manualValidation.actualPeriods}/${meta.totalPeriods} tiết (thiếu ${manualValidation.deficitPeriods} tiết).
                </div>
              ` : ''}
            </div>
          </div>
        </div>

        <!-- Weekly Schedules Section -->
        <div style="background: var(--color-card-background); border: 1px solid var(--color-glass-border); border-radius: var(--radius-lg); padding: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <div>
              <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--color-text);">Các buổi học trong tuần</h4>
              <p style="font-size: 0.76rem; color: var(--color-text-secondary);">Thêm 1 hoặc nhiều buổi học mỗi tuần (vd: Thứ 2 Tiết 1–2 & Thứ 5 Tiết 3–5)</p>
            </div>
            <span class="glass-pill" style="font-size: 0.74rem; font-weight: 700;">
              ${this.tempSchedules.length} buổi / tuần
            </span>
          </div>

          <!-- Schedule Chips Container -->
          <div id="sch-chips-container" style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 14px;">
            ${scheduleChipsHtml}
          </div>

          <!-- Add Schedule Slot Inline Sub-form -->
          <div style="background: var(--color-glass); border: 1.5px dashed var(--color-glass-border); border-radius: var(--radius-md); padding: 14px;">
            <div style="font-size: 0.76rem; font-weight: 700; color: var(--color-primary); text-transform: uppercase; margin-bottom: 8px;">
              ＋ Thêm buổi học mới vào tuần
            </div>

            <div style="display: grid; grid-template-columns: 1.2fr 1fr 1fr; gap: 10px; margin-bottom: 10px;">
              <div>
                <label style="font-size: 0.72rem; font-weight: 600; color: var(--color-text-secondary); display: block; margin-bottom: 2px;">THỨ</label>
                <select id="slot-add-day" class="glass-input" style="font-weight: 600;">
                  ${dayOptions}
                </select>
              </div>

              <div>
                <label style="font-size: 0.72rem; font-weight: 600; color: var(--color-text-secondary); display: block; margin-bottom: 2px;">TIẾT BẮT ĐẦU</label>
                <select id="slot-add-start" class="glass-input" style="font-weight: 600;">
                  ${startPeriodOptions}
                </select>
              </div>

              <div>
                <label style="font-size: 0.72rem; font-weight: 600; color: var(--color-text-secondary); display: block; margin-bottom: 2px;">TIẾT KẾT THÚC</label>
                <select id="slot-add-end" class="glass-input" style="font-weight: 600;">
                  ${endPeriodOptions}
                </select>
              </div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
              <div style="font-size: 0.76rem; font-weight: 600; color: var(--color-text);">
                Khung giờ chuẩn: <strong id="slot-preview-time-txt" style="color: var(--color-primary);">07:00 – 09:40</strong>
              </div>
              <button type="button" id="btn-add-schedule-slot" class="glass-button" style="background: var(--primary-light); color: var(--color-primary); border-color: var(--color-primary); font-weight: 700; padding: 6px 14px;">
                <i data-lucide="plus" style="width: 14px; height: 14px;"></i> Thêm buổi học này
              </button>
            </div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px; padding-top: 12px; border-top: 1px solid var(--color-glass-border);">
          <button type="button" id="btn-back-to-step1" class="glass-button">← Quay lại Thông tin</button>
          <button type="button" id="btn-goto-step3" class="glass-button glass-button-primary" style="padding: 9px 22px; font-weight: 700;">
            Xem trước & Lưu →
          </button>
        </div>
      </div>
    `;
  },

  renderStep3(isTHPT, activeCurriculumState) {
    const meta = ScheduleEngine.calculateScheduleMeta({
      startDate: this.formData.startDate || '2026-08-18',
      totalPeriods: this.formData.totalHours || (this.formData.credits * 15) || 45,
      schedules: this.tempSchedules,
      mode: isTHPT ? 'high_school' : 'university',
      profileId: this.formData.profileId
    });

    const isManualMode = this.formData.endDateMode === 'manual';
    let displayEndDate = meta.calculatedEndDate;
    let displayWeeks = meta.totalWeeks;
    let displaySessions = meta.totalSessions;
    let manualValidation = null;

    if (isManualMode && this.formData.customEndDate) {
      manualValidation = ScheduleEngine.calculateOccurrencesBetweenDates({
        startDate: this.formData.startDate || '2026-08-18',
        endDate: this.formData.customEndDate,
        schedules: this.tempSchedules,
        totalTargetPeriods: this.formData.totalHours || (this.formData.credits * 15) || 45,
        mode: isTHPT ? 'high_school' : 'university',
        profileId: this.formData.profileId
      });
      displayEndDate = manualValidation.endDateFormatted;
      displayWeeks = manualValidation.totalWeeks;
      displaySessions = manualValidation.actualSessions;
    }

    const group = isTHPT ? null : CurriculumEngine.getCourseGroupById(this.formData.courseGroupId || this.formData.category);

    const scheduleListItemsHtml = this.tempSchedules.map(sch => {
      const dayInfo = DAY_NAMES.find(d => d.day === Number(sch.day)) || { name: `Thứ ${sch.day + 1}` };
      return `
        <li style="display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px dashed var(--color-glass-border); font-size: 0.84rem;">
          <span style="font-weight: 700; color: var(--color-text);">
            <i data-lucide="calendar" style="width: 13px; height: 13px; color: var(--color-primary); display: inline-block; vertical-align: middle; margin-right: 4px;"></i>
            ${dayInfo.name} (Tiết ${sch.startPeriod}–${sch.endPeriod})
          </span>
          <span style="font-weight: 600; color: var(--color-primary);">
            ${sch.startTime} – ${sch.endTime} (${sch.sessions} tiết)
          </span>
        </li>
      `;
    }).join('');

    return `
      <div style="display: flex; flex-direction: column; gap: 14px;">
        <!-- Clean Preview Card -->
        <div style="background: var(--color-card-background); border: 2px solid var(--color-primary); border-radius: var(--radius-xl); overflow: hidden; box-shadow: 0 12px 32px var(--color-shadow);">
          <!-- Top Course Header Banner -->
          <div style="background: linear-gradient(135deg, ${this.formData.color || '#AFC8F5'} 0%, var(--color-glass) 100%); padding: 18px 22px; border-bottom: 1px solid var(--color-glass-border);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div>
                <span class="glass-pill" style="font-size: 0.72rem; font-weight: 800; background: rgba(255,255,255,0.9); color: #1F2937; margin-bottom: 6px;">
                  ${this.formData.code || 'MÃ HỌC PHẦN'}
                </span>
                <h3 style="font-size: 1.35rem; font-weight: 800; color: #1F2937; line-height: 1.25; margin-top: 4px;">
                  ${this.formData.name || 'Tên học phần'}
                </h3>
                <p style="font-size: 0.8rem; font-weight: 600; color: rgba(31,41,55,0.85); margin-top: 3px;">
                  ${group ? group.name : (isTHPT ? 'Môn học THPT' : 'Khối kiến thức đào tạo')} · ${this.formData.type === 'practical' ? 'Thực hành' : (this.formData.type === 'lab' ? 'Thí nghiệm' : 'Lý thuyết')}
                </p>
              </div>

              <div style="text-align: right;">
                ${!isTHPT ? `
                  <div style="font-size: 1.5rem; font-weight: 800; color: #1F2937;">
                    ${this.formData.credits || 3} <span style="font-size: 0.8rem; font-weight: 600;">Tín chỉ</span>
                  </div>
                ` : ''}
                <div style="font-size: 0.8rem; font-weight: 700; color: rgba(31,41,55,0.8);">
                  ${meta.totalPeriods} Tổng số tiết
                </div>
              </div>
            </div>
          </div>

          <!-- Body details -->
          <div style="padding: 18px 22px; display: flex; flex-direction: column; gap: 12px;">
            <!-- Timeline details -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; background: var(--color-glass); padding: 12px 14px; border-radius: var(--radius-md); border: 1px solid var(--color-glass-border);">
              <div>
                <span style="font-size: 0.7rem; font-weight: 700; color: var(--color-text-secondary); text-transform: uppercase; display: block;">NGÀY BẮT ĐẦU</span>
                <span style="font-size: 0.95rem; font-weight: 700; color: var(--color-text);">${meta.startDateFormatted}</span>
              </div>
              <div>
                <span style="font-size: 0.7rem; font-weight: 700; color: var(--color-text-secondary); text-transform: uppercase; display: block;">DỰ KIẾN KẾT THÚC</span>
                <div style="display: flex; align-items: center; gap: 6px; margin-top: 2px;">
                  <span style="font-size: 0.95rem; font-weight: 800; color: var(--color-primary);">${displayEndDate}</span>
                  <span class="glass-pill" style="font-size: 0.65rem; font-weight: 700; ${isManualMode ? 'background: #8B5CF6; color: white;' : 'background: var(--color-primary); color: white;'}">
                    ${isManualMode ? 'Tự đặt' : 'Tự động'}
                  </span>
                </div>
              </div>
            </div>

            <!-- Weekly schedule list -->
            <div>
              <span style="font-size: 0.74rem; font-weight: 700; color: var(--color-text-secondary); text-transform: uppercase; display: block; margin-bottom: 6px;">
                LỊCH HỌC TRONG TUẦN (${meta.periodsPerWeek} TIẾT/TUẦN · ${displaySessions} BUỔI · ${displayWeeks} TUẦN)
              </span>
              <ul style="list-style: none; padding: 0; margin: 0;">
                ${scheduleListItemsHtml}
              </ul>
            </div>

            <!-- Teacher & Room -->
            <div style="display: flex; justify-content: space-between; font-size: 0.82rem; color: var(--color-text-secondary); border-top: 1px solid var(--color-glass-border); padding-top: 8px;">
              <span><i data-lucide="user" style="width: 13px; height: 13px; display: inline-block; vertical-align: middle;"></i> ${this.formData.teacher || 'Chưa cập nhật GV'}</span>
              <span><i data-lucide="map-pin" style="width: 13px; height: 13px; display: inline-block; vertical-align: middle;"></i> ${this.formData.room || (isTHPT ? '11A2' : 'A203')}</span>
            </div>
          </div>
        </div>

        <!-- Action Footer -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px; padding-top: 12px; border-top: 1px solid var(--color-glass-border);">
          <button type="button" id="btn-back-to-step2" class="glass-button">← Quay lại chỉnh sửa Lịch</button>
          <button type="button" id="btn-confirm-save-course" class="glass-button glass-button-primary" style="padding: 10px 26px; font-size: 0.92rem; font-weight: 700;">
            <i data-lucide="check" style="width: 16px; height: 16px;"></i> ${this.isEdit ? 'Lưu Thay Đổi' : 'Lưu Lịch Học'}
          </button>
        </div>
      </div>
    `;
  },

  bindEvents(isTHPT, activeProfileState) {
    this.backdrop.querySelector('#modal-close-x')?.addEventListener('click', () => this.close());
    this.backdrop.querySelector('#btn-cancel-modal')?.addEventListener('click', () => this.close());

    // Color radios
    const colorLabels = this.backdrop.querySelectorAll('#color-pill-group label');
    colorLabels.forEach(label => {
      label.addEventListener('click', () => {
        colorLabels.forEach(l => l.style.borderColor = 'transparent');
        label.style.borderColor = 'var(--color-primary)';
        const radio = label.querySelector('input[type="radio"]');
        if (radio) {
          radio.checked = true;
          this.formData.color = radio.value;
        }
      });
    });

    // STEP 1 Navigation
    this.backdrop.querySelector('#btn-goto-step2')?.addEventListener('click', () => {
      const name = this.backdrop.querySelector('#course-name')?.value.trim();
      const code = this.backdrop.querySelector('#course-code')?.value.trim().toUpperCase();

      if (!name || !code) {
        alert(`Vui lòng nhập đầy đủ tên ${isTHPT ? 'môn học' : 'học phần'} và mã môn.`);
        return;
      }

      this.formData.name = name;
      this.formData.code = code;
      this.formData.credits = Number(this.backdrop.querySelector('#course-credits')?.value || 3);
      this.formData.totalHours = Number(this.backdrop.querySelector('#course-total-hours')?.value || (this.formData.credits * 15));
      this.formData.teacher = this.backdrop.querySelector('#course-teacher')?.value.trim() || '';
      this.formData.room = this.backdrop.querySelector('#course-room')?.value.trim() || (isTHPT ? 'Phòng 11A2' : 'Phòng A203');
      this.formData.type = this.backdrop.querySelector('#course-type')?.value || 'theory';

      const chosenGroupId = this.backdrop.querySelector('#course-category')?.value;
      const group = isTHPT ? null : CurriculumEngine.getCourseGroupById(chosenGroupId);
      this.formData.courseGroupId = group?.id || chosenGroupId;
      this.formData.courseGroupName = group?.name || (isTHPT ? 'Môn học' : 'Học phần');
      this.formData.category = group?.id || chosenGroupId;

      this.currentStep = 2;
      this.renderWizard();
    });

    // STEP 2 Navigation
    this.backdrop.querySelector('#btn-back-to-step1')?.addEventListener('click', () => {
      this.currentStep = 1;
      this.renderWizard();
    });

    this.backdrop.querySelector('#btn-goto-step3')?.addEventListener('click', () => {
      if (this.tempSchedules.length === 0) {
        alert('Vui lòng thêm ít nhất 1 buổi học trong tuần!');
        return;
      }
      this.currentStep = 3;
      this.renderWizard();
    });

    // Start Date change -> re-render step 2
    this.backdrop.querySelector('#course-start-date-input')?.addEventListener('change', (e) => {
      this.formData.startDate = e.target.value;
      this.renderWizard();
    });

    // Customization Modal Button Click
    this.backdrop.querySelector('#btn-open-end-date-custom-modal')?.addEventListener('click', () => {
      this.openEndDateCustomModal(isTHPT, activeProfileState);
    });

    // Period dropdowns preview updater
    const updateSlotPreviewTime = () => {
      const startP = Number(this.backdrop.querySelector('#slot-add-start')?.value || 1);
      const endP = Number(this.backdrop.querySelector('#slot-add-end')?.value || 3);
      const timeRange = isTHPT 
        ? this.calculateTHPTTime(startP, endP)
        : ProfileEngine.calculateTimeRangeFromPeriods(activeProfileState.profileId, startP, endP);

      const previewEl = this.backdrop.querySelector('#slot-preview-time-txt');
      if (previewEl) {
        previewEl.innerText = `${timeRange.startTime} – ${timeRange.endTime}`;
      }
    };

    this.backdrop.querySelector('#slot-add-start')?.addEventListener('change', updateSlotPreviewTime);
    this.backdrop.querySelector('#slot-add-end')?.addEventListener('change', updateSlotPreviewTime);

    // Add schedule slot button
    this.backdrop.querySelector('#btn-add-schedule-slot')?.addEventListener('click', () => {
      const day = Number(this.backdrop.querySelector('#slot-add-day')?.value || 1);
      const startP = Number(this.backdrop.querySelector('#slot-add-start')?.value || 1);
      const endP = Number(this.backdrop.querySelector('#slot-add-end')?.value || 3);

      if (endP < startP) {
        alert('Tiết kết thúc phải lớn hơn hoặc bằng tiết bắt đầu!');
        return;
      }

      const timeRange = isTHPT 
        ? this.calculateTHPTTime(startP, endP)
        : ProfileEngine.calculateTimeRangeFromPeriods(activeProfileState.profileId, startP, endP);

      this.tempSchedules.push({
        id: 'sch-' + Date.now(),
        day,
        startPeriod: startP,
        endPeriod: endP,
        startTime: timeRange.startTime,
        endTime: timeRange.endTime,
        sessions: timeRange.sessions,
        room: this.formData.room || (isTHPT ? 'Phòng 11A2' : 'Phòng A203'),
        teacher: this.formData.teacher || '',
        type: this.formData.type || 'theory'
      });

      this.renderWizard();
    });

    // Remove schedule slot buttons
    this.backdrop.querySelectorAll('.btn-remove-sch-slot').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = Number(e.currentTarget.getAttribute('data-idx'));
        this.tempSchedules.splice(idx, 1);
        this.renderWizard();
      });
    });

    // STEP 3 Navigation & Final Save
    this.backdrop.querySelector('#btn-back-to-step2')?.addEventListener('click', () => {
      this.currentStep = 2;
      this.renderWizard();
    });

    this.backdrop.querySelector('#btn-confirm-save-course')?.addEventListener('click', () => {
      const meta = ScheduleEngine.calculateScheduleMeta({
        startDate: this.formData.startDate || '2026-08-18',
        totalPeriods: this.formData.totalHours || (this.formData.credits * 15) || 45,
        schedules: this.tempSchedules,
        mode: isTHPT ? 'high_school' : 'university',
        profileId: activeProfileState.profileId
      });

      const isManual = this.formData.endDateMode === 'manual';
      let finalEndDate = meta.calculatedEndDate;
      let finalEndDateIso = meta.calculatedEndDateIso;
      let finalWeeks = meta.totalWeeks;
      let finalSessions = meta.totalSessions;

      if (isManual && this.formData.customEndDate) {
        const val = ScheduleEngine.calculateOccurrencesBetweenDates({
          startDate: this.formData.startDate || '2026-08-18',
          endDate: this.formData.customEndDate,
          schedules: this.tempSchedules,
          totalTargetPeriods: this.formData.totalHours || (this.formData.credits * 15) || 45,
          mode: isTHPT ? 'high_school' : 'university',
          profileId: activeProfileState.profileId
        });
        finalEndDate = val.endDateFormatted;
        finalEndDateIso = AcademicCalendar.formatDateKey(AcademicCalendar.parseDate(this.formData.customEndDate));
        finalWeeks = val.totalWeeks;
        finalSessions = val.actualSessions;
      }

      const savedCourse = {
        ...this.formData,
        id: this.formData.id || ('crs-' + Date.now()),
        hoursPerWeek: meta.periodsPerWeek,
        totalHours: meta.totalPeriods,
        startDate: this.formData.startDate,
        endDateMode: this.formData.endDateMode || 'auto',
        customEndDate: this.formData.customEndDate || '',
        calculatedEndDate: finalEndDate,
        calculatedEndDateIso: finalEndDateIso,
        totalWeeks: finalWeeks,
        totalSessions: finalSessions,
        schedules: this.tempSchedules
      };

      this.close();
      if (this.callbacks.onSave) {
        this.callbacks.onSave(savedCourse, this.isEdit);
      }
    });
  },

  openEndDateCustomModal(isTHPT, activeProfileState) {
    const meta = ScheduleEngine.calculateScheduleMeta({
      startDate: this.formData.startDate || '2026-08-18',
      totalPeriods: this.formData.totalHours || (this.formData.credits * 15) || 45,
      schedules: this.tempSchedules,
      mode: isTHPT ? 'high_school' : 'university',
      profileId: activeProfileState.profileId
    });

    let currentMode = this.formData.endDateMode || 'auto';
    let currentCustomEndDate = this.formData.customEndDate || meta.calculatedEndDateIso;

    let submodal = document.getElementById('end-date-custom-submodal');
    if (!submodal) {
      submodal = document.createElement('div');
      submodal.id = 'end-date-custom-submodal';
      submodal.className = 'modal-backdrop open';
      submodal.style.zIndex = '1050';
      submodal.style.background = 'rgba(15, 23, 42, 0.55)';
      submodal.style.backdropFilter = 'blur(8px)';
      document.body.appendChild(submodal);
    } else {
      submodal.classList.add('open');
    }

    const renderSubmodalContent = () => {
      const isManual = currentMode === 'manual';
      const manualValidation = ScheduleEngine.calculateOccurrencesBetweenDates({
        startDate: this.formData.startDate || '2026-08-18',
        endDate: currentCustomEndDate,
        schedules: this.tempSchedules,
        totalTargetPeriods: this.formData.totalHours || (this.formData.credits * 15) || 45,
        mode: isTHPT ? 'high_school' : 'university',
        profileId: activeProfileState.profileId
      });

      submodal.innerHTML = `
        <div class="modal-window fade-in-lift" style="max-width: 540px; border-radius: var(--radius-xl); overflow: hidden; border: 1px solid var(--color-glass-border); box-shadow: 0 24px 56px rgba(0,0,0,0.3); background: var(--color-background);">
          <!-- Header -->
          <div style="padding: 16px 22px; background: linear-gradient(135deg, var(--primary-light) 0%, var(--color-glass) 100%); border-bottom: 1px solid var(--color-glass-border); display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="width: 34px; height: 34px; border-radius: 50%; background: var(--color-primary); color: white; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px var(--primary-light);">
                <i data-lucide="calendar-cog" style="width: 18px; height: 18px;"></i>
              </div>
              <div>
                <h4 style="font-size: 1.08rem; font-weight: 700; color: var(--color-text); line-height: 1.2;">Tùy chỉnh ngày kết thúc</h4>
                <p style="font-size: 0.76rem; color: var(--color-text-secondary); margin-top: 1px;">Chọn cơ chế tự động chuẩn hóa hoặc tự đặt ngày</p>
              </div>
            </div>
            <button type="button" id="btn-submodal-x" class="icon-btn" style="width: 32px; height: 32px; font-size: 1.1rem;">&times;</button>
          </div>

          <!-- Body -->
          <div style="padding: 20px 22px; display: flex; flex-direction: column; gap: 14px; max-height: 65vh; overflow-y: auto;" class="custom-scroll">
            
            <!-- OPTION 1: Auto calculate -->
            <div id="card-opt-auto" class="custom-choice-card ${!isManual ? 'active-choice' : ''}" style="border: 2px solid ${!isManual ? 'var(--color-primary)' : 'var(--color-glass-border)'}; background: ${!isManual ? 'linear-gradient(135deg, var(--primary-light) 0%, var(--color-card-background) 100%)' : 'var(--color-card-background)'}; border-radius: var(--radius-lg); padding: 16px; cursor: pointer; transition: all 0.2s ease;">
              <div style="display: flex; align-items: flex-start; gap: 12px;">
                <input type="radio" name="submodal-mode" id="radio-auto" value="auto" ${!isManual ? 'checked' : ''} style="margin-top: 3px; cursor: pointer; accent-color: var(--color-primary); width: 18px; height: 18px;">
                <div style="flex: 1;">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <label for="radio-auto" style="font-size: 0.95rem; font-weight: 700; color: var(--color-text); cursor: pointer;">
                      ⚡ Tự động tính (Khuyên dùng)
                    </label>
                    <span class="glass-pill" style="font-size: 0.68rem; background: var(--color-primary); color: white; font-weight: 700;">Chuẩn hóa</span>
                  </div>
                  <p style="font-size: 0.78rem; color: var(--color-text-secondary); margin-top: 4px; line-height: 1.45;">
                    Dựa trên tổng số tiết (<strong>${meta.totalPeriods} tiết</strong>) + Lịch học tuần (<strong>${meta.periodsPerWeek} tiết/tuần</strong>) + Ngày bắt đầu (<strong>${meta.startDateFormatted}</strong>) + Lịch nghỉ lễ/Tết (Academic Calendar).
                  </p>
                  <div style="margin-top: 10px; padding: 8px 12px; background: rgba(255,255,255,0.75); border-radius: var(--radius-md); border: 1px solid var(--primary-border); display: flex; align-items: center; justify-content: space-between; font-size: 0.82rem;">
                    <span style="color: var(--color-text-secondary); font-weight: 600;">Dự kiến kết thúc:</span>
                    <strong style="color: var(--color-primary); font-size: 0.95rem;">${meta.calculatedEndDate} (${meta.totalWeeks} tuần, ${meta.totalSessions} buổi)</strong>
                  </div>
                </div>
              </div>
            </div>

            <!-- OPTION 2: Manual End Date -->
            <div id="card-opt-manual" class="custom-choice-card ${isManual ? 'active-choice' : ''}" style="border: 2px solid ${isManual ? 'var(--color-primary)' : 'var(--color-glass-border)'}; background: ${isManual ? 'linear-gradient(135deg, var(--primary-light) 0%, var(--color-card-background) 100%)' : 'var(--color-card-background)'}; border-radius: var(--radius-lg); padding: 16px; cursor: pointer; transition: all 0.2s ease;">
              <div style="display: flex; align-items: flex-start; gap: 12px;">
                <input type="radio" name="submodal-mode" id="radio-manual" value="manual" ${isManual ? 'checked' : ''} style="margin-top: 3px; cursor: pointer; accent-color: var(--color-primary); width: 18px; height: 18px;">
                <div style="flex: 1;">
                  <label for="radio-manual" style="font-size: 0.95rem; font-weight: 700; color: var(--color-text); cursor: pointer;">
                    ⚙️ Tự đặt ngày kết thúc
                  </label>
                  <p style="font-size: 0.78rem; color: var(--color-text-secondary); margin-top: 4px; line-height: 1.45;">
                    Tự chọn ngày kết thúc thủ công. Hệ thống sẽ tự động kiểm tra số buổi thực tế và cảnh báo nếu chưa đủ số tiết quy định.
                  </p>

                  <!-- Date Picker & Verification (only if manual) -->
                  <div id="submodal-manual-section" style="margin-top: 12px; display: ${isManual ? 'block' : 'none'};">
                    <label style="font-size: 0.74rem; font-weight: 700; color: var(--color-text-secondary); text-transform: uppercase; display: block; margin-bottom: 4px;">
                      CHỌN NGÀY KẾT THÚC:
                    </label>
                    <input type="date" id="input-submodal-end-date" class="glass-input" value="${currentCustomEndDate}" style="font-weight: 700; color: var(--color-primary); font-size: 0.92rem; width: 100%;">

                    <!-- Live Verification Output -->
                    <div style="margin-top: 10px;">
                      ${!manualValidation.isValidRange ? `
                        <div style="background: #FEF2F2; border-left: 3px solid #EF4444; border-radius: var(--radius-md); padding: 10px 14px; font-size: 0.76rem; color: #991B1B; font-weight: 600;">
                          ❌ Ngày kết thúc phải sau ngày bắt đầu học (${meta.startDateFormatted})!
                        </div>
                      ` : (manualValidation.isSufficient ? `
                        <div style="background: #ECFDF5; border-left: 3px solid #10B981; border-radius: var(--radius-md); padding: 10px 14px; font-size: 0.76rem; color: #065F46;">
                          <div style="font-weight: 700; font-size: 0.82rem;">✓ Đủ thời lượng học phần</div>
                          <div style="margin-top: 2px;">Trong khoảng từ <strong>${manualValidation.startDateFormatted}</strong> đến <strong>${manualValidation.endDateFormatted}</strong> có <strong>${manualValidation.actualSessions} buổi học</strong> (${manualValidation.actualPeriods}/${manualValidation.targetPeriods} tiết, ${manualValidation.totalWeeks} tuần).</div>
                          ${manualValidation.surplusPeriods > 0 ? `<div style="margin-top: 2px; color: #047857; font-weight: 600;">(Dư ${manualValidation.surplusPeriods} tiết so với quy định)</div>` : ''}
                        </div>
                      ` : `
                        <div style="background: #FEF2F2; border-left: 3px solid #EF4444; border-radius: var(--radius-md); padding: 10px 14px; font-size: 0.76rem; color: #991B1B;">
                          <div style="font-weight: 700; font-size: 0.82rem;">⚠️ Cảnh báo thiếu tiết học</div>
                          <div style="margin-top: 2px;">Chỉ có <strong>${manualValidation.actualPeriods}/${manualValidation.targetPeriods} tiết</strong> (thiếu <strong>${manualValidation.deficitPeriods} tiết</strong> / ~${Math.ceil(manualValidation.deficitPeriods / (meta.periodsPerWeek || 3))} tuần).</div>
                          <div style="margin-top: 4px; font-size: 0.72rem; color: #7F1D1D;">Trong khoảng thời gian đã chọn chỉ diễn ra ${manualValidation.actualSessions} buổi học. Bạn có thể cần tổ chức học bù hoặc kéo dài ngày kết thúc.</div>
                        </div>
                      `)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- Footer Actions (Touch target >= 44px) -->
          <div style="padding: 14px 22px; background: var(--color-glass); border-top: 1px solid var(--color-glass-border); display: flex; justify-content: flex-end; gap: 10px;">
            <button type="button" id="btn-submodal-cancel" class="glass-button" style="min-height: 44px; padding: 8px 18px; font-weight: 600;">
              Hủy
            </button>
            <button type="button" id="btn-submodal-apply" class="glass-button glass-button-primary" style="min-height: 44px; padding: 8px 24px; font-weight: 700;">
              <i data-lucide="check" style="width: 15px; height: 15px;"></i>
              Áp dụng
            </button>
          </div>
        </div>
      `;

      if (window.lucide) window.lucide.createIcons();

      // Bind Submodal Events
      const closeSubmodal = () => {
        submodal.classList.remove('open');
      };

      submodal.querySelector('#btn-submodal-x')?.addEventListener('click', closeSubmodal);
      submodal.querySelector('#btn-submodal-cancel')?.addEventListener('click', closeSubmodal);

      submodal.querySelector('#card-opt-auto')?.addEventListener('click', () => {
        currentMode = 'auto';
        renderSubmodalContent();
      });

      submodal.querySelector('#card-opt-manual')?.addEventListener('click', () => {
        currentMode = 'manual';
        renderSubmodalContent();
      });

      submodal.querySelector('#input-submodal-end-date')?.addEventListener('change', (e) => {
        currentCustomEndDate = e.target.value;
        renderSubmodalContent();
      });

      submodal.querySelector('#btn-submodal-apply')?.addEventListener('click', () => {
        this.formData.endDateMode = currentMode;
        this.formData.customEndDate = currentMode === 'manual' ? currentCustomEndDate : '';
        closeSubmodal();
        this.renderWizard();
      });
    };

    renderSubmodalContent();
  },

  calculateTHPTTime(startPeriod, endPeriod) {
    const p1 = HIGH_SCHOOL_TIME_PROFILE.periods.find(p => p.number === Number(startPeriod)) || HIGH_SCHOOL_TIME_PROFILE.periods[0];
    const p2 = HIGH_SCHOOL_TIME_PROFILE.periods.find(p => p.number === Number(endPeriod)) || p1;
    return {
      startTime: p1.startTime,
      endTime: p2.endTime,
      sessions: Math.max(1, Number(endPeriod) - Number(startPeriod) + 1)
    };
  },

  open() {
    if (this.backdrop) this.backdrop.classList.add('open');
  },

  close() {
    if (this.backdrop) this.backdrop.classList.remove('open');
    const submodal = document.getElementById('end-date-custom-submodal');
    if (submodal) submodal.classList.remove('open');
  }
};
