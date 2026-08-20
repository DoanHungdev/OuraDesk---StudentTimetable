/**
 * ManualScheduleModal: Dedicated Manual Timetable Entry System
 * Features:
 * 1. Detailed Form Entry (University vs High School with live University Time Profile calculation)
 * 2. Inline New Course Creator (+ Tạo môn mới ngay lúc nhập lịch không mất context)
 * 3. ⚡ Quick Text Syntax Parser (Parse multiple lines into schedule blocks with live preview)
 * 4. Conflict Detection & Warning Banner
 * 5. Draft Preservation (Lưu nháp / Khôi phục nháp)
 * 6. Multi-period Block Support (Tiết 1 -> 3 => 07:00 - 09:40)
 */
import { DAY_NAMES } from '../data/mockData.js';
import { ProfileEngine } from '../utils/profileEngine.js';
import { TimetableEngine } from '../utils/timetableEngine.js';
import { Storage } from '../utils/storage.js';
import { HIGH_SCHOOL_TIME_PROFILE } from '../data/highSchoolData.js';
import { CurriculumEngine } from '../utils/curriculumEngine.js';
import { ScheduleEngine } from '../utils/scheduleEngine.js';
import { CalendarEngine } from '../utils/calendarEngine.js';
import { AcademicCalendar } from '../data/academicCalendar.js';

export const ManualScheduleModal = {
  backdrop: null,
  callbacks: {},
  activeTab: 'form', // 'form' or 'quick'
  isCreatingNewCourse: false,
  allCourses: [],
  selectedDay: 1,
  selectedStartPeriod: 1,
  selectedEndPeriod: 3,

  init(callbacks = {}) {
    this.callbacks = callbacks;
    this.renderContainer();
  },

  renderContainer() {
    let el = document.getElementById('manual-schedule-modal-backdrop');
    if (!el) {
      el = document.createElement('div');
      el.id = 'manual-schedule-modal-backdrop';
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

  openModal(courses = [], defaultDay = 1, defaultStartPeriod = 1, defaultEndPeriod = 3) {
    this.allCourses = Storage.getCourses();
    this.selectedDay = Number(defaultDay) || 1;
    this.selectedStartPeriod = Number(defaultStartPeriod) || 1;
    this.selectedEndPeriod = Number(defaultEndPeriod) || (this.selectedStartPeriod + 2);
    this.activeTab = 'form';
    this.isCreatingNewCourse = this.allCourses.length === 0;
    this.renderUI();
    this.open();
  },

  openForSlot(day, startPeriod, endPeriod = null) {
    const end = endPeriod !== null ? Number(endPeriod) : (Number(startPeriod) + 1);
    this.openModal(Storage.getCourses(), day, startPeriod, end);
  },

  renderUI() {
    const mode = Storage.getMode();
    const isTHPT = mode === 'high_school';
    const activeState = ProfileEngine.getActiveProfileState();

    const periods = isTHPT 
      ? HIGH_SCHOOL_TIME_PROFILE.periods 
      : (activeState.profile?.periods || []).filter(p => p.isUsable);

    // Calculate time range for currently selected period range
    const timeRange = isTHPT 
      ? this.calculateTHPTTimeRange(this.selectedStartPeriod, this.selectedEndPeriod)
      : ProfileEngine.calculateTimeRangeFromPeriods(activeState.profileId, this.selectedStartPeriod, this.selectedEndPeriod);

    // Existing courses options
    const courseOptions = this.allCourses.map(c => `
      <option value="${c.id}">${c.name} (${c.code || 'Môn'}) · ${c.teacher || 'Chưa gán GV'}</option>
    `).join('');

    // Pastel colors for new course
    const pastelColors = [
      { code: '#AFC8F5', name: 'Xanh dương' },
      { code: '#F5B28D', name: 'Cam đào' },
      { code: '#C7B7F4', name: 'Tím pastel' },
      { code: '#F7D99A', name: 'Vàng pastel' },
      { code: '#A9DED5', name: 'Xanh ngọc' },
      { code: '#F4B5C2', name: 'Hồng pastel' }
    ];

    const colorPillsHtml = pastelColors.map((c, idx) => `
      <label style="cursor: pointer; display: inline-flex; align-items: center; gap: 4px; padding: 4px 8px; border-radius: var(--radius-sm); background: ${c.code}; border: 2px solid ${idx === 0 ? 'var(--color-primary)' : 'transparent'};">
        <input type="radio" name="manual-new-color" value="${c.code}" ${idx === 0 ? 'checked' : ''} style="display: none;">
        <span style="font-size: 0.72rem; font-weight: 700; color: #1F2937;">${c.name}</span>
      </label>
    `).join('');

    // Period options for select dropdowns
    const startPeriodOptions = periods.map(p => `
      <option value="${p.number}" ${p.number === this.selectedStartPeriod ? 'selected' : ''}>
        ${p.name} (${p.startTime})
      </option>
    `).join('');

    const endPeriodOptions = periods.map(p => `
      <option value="${p.number}" ${p.number === this.selectedEndPeriod ? 'selected' : ''}>
        ${p.name} (${p.endTime})
      </option>
    `).join('');

    // Day options
    const daysToShow = isTHPT ? [1, 2, 3, 4, 5, 6] : [1, 2, 3, 4, 5, 6, 0];
    const dayOptions = daysToShow.map(d => {
      const dayObj = DAY_NAMES.find(dn => dn.day === d) || { name: `Thứ ${d + 1}` };
      return `<option value="${d}" ${d === this.selectedDay ? 'selected' : ''}>${dayObj.name}</option>`;
    }).join('');

    this.backdrop.innerHTML = `
      <div class="modal-window fade-in-lift" style="max-width: 680px; border-radius: var(--radius-xl); overflow: hidden; border: 1px solid var(--color-glass-border); box-shadow: 0 20px 48px var(--color-shadow);">
        <!-- Header -->
        <div class="modal-header" style="background: linear-gradient(135deg, var(--primary-light) 0%, var(--color-glass) 100%); padding: 18px 24px; border-bottom: 1px solid var(--color-glass-border);">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 44px; height: 44px; border-radius: var(--radius-md); background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 1.25rem; box-shadow: 0 4px 12px var(--primary-glow); flex-shrink: 0;">
              ✍️
            </div>
            <div>
              <h3 class="modal-title" style="font-size: 1.18rem; font-weight: 700; color: var(--color-text); line-height: 1.25;">Nhập thời khóa biểu thủ công</h3>
              <p style="font-size: 0.78rem; color: var(--color-text-secondary); margin-top: 2px;">
                ${isTHPT ? 'Thêm tiết học chuẩn khối THPT' : `Áp dụng khung giờ chuẩn: ${activeState.university.name}`}
              </p>
            </div>
          </div>
          <button id="manual-modal-close-x" class="icon-btn" style="width: 32px; height: 32px; font-size: 1rem;" aria-label="Đóng">&times;</button>
        </div>

        <!-- Mode switcher tabs -->
        <div style="padding: 0 24px; padding-top: 12px; display: flex; gap: 8px; border-bottom: 1px solid var(--color-glass-border); background: var(--color-glass);">
          <button id="tab-btn-form-mode" class="glass-pill ${this.activeTab === 'form' ? 'active' : ''}" style="cursor: pointer; border-bottom-left-radius: 0; border-bottom-right-radius: 0; ${this.activeTab === 'form' ? 'background: var(--color-primary); color: white;' : ''}">
            <i data-lucide="edit-3" style="width: 14px; height: 14px;"></i> Nhập theo Form chi tiết
          </button>
          <button id="tab-btn-quick-mode" class="glass-pill ${this.activeTab === 'quick' ? 'active' : ''}" style="cursor: pointer; border-bottom-left-radius: 0; border-bottom-right-radius: 0; ${this.activeTab === 'quick' ? 'background: var(--color-primary); color: white;' : ''}">
            <i data-lucide="zap" style="width: 14px; height: 14px;"></i> ⚡ Nhập nhanh dạng Text
          </button>
        </div>

        <div class="modal-body custom-scroll" style="padding: 20px 24px; max-height: 70vh; overflow-y: auto; display: flex; flex-direction: column; gap: 14px;">
          ${this.activeTab === 'form' ? `
            <!-- FORM-BASED MANUAL ENTRY -->

            <!-- Dynamic Conflict Slot -->
            <div id="manual-conflict-slot"></div>

            <!-- 1. Course Selection Section -->
            <div style="background: var(--color-card-background); border: 1px solid var(--color-glass-border); border-radius: var(--radius-md); padding: 14px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <label style="font-size: 0.78rem; font-weight: 700; color: var(--color-text-secondary); text-transform: uppercase;">
                  MÔN HỌC
                </label>
                <button type="button" id="btn-toggle-new-course" class="glass-pill" style="font-size: 0.74rem; font-weight: 600; cursor: pointer; background: var(--primary-light); color: var(--color-primary);">
                  ${this.isCreatingNewCourse ? '← Chọn môn có sẵn' : '＋ Tạo môn mới'}
                </button>
              </div>

              <!-- Pick Existing Course Container -->
              <div id="manual-course-select-wrap" style="display: ${this.isCreatingNewCourse ? 'none' : 'block'};">
                ${this.allCourses.length === 0 ? `
                  <p style="font-size: 0.82rem; color: var(--color-text-secondary); padding: 8px 0;">Chưa có môn nào trong danh sách. Vui lòng bấm <strong>"＋ Tạo môn mới"</strong> ở góc phải để thêm môn.</p>
                ` : `
                  <select id="manual-select-course" class="glass-input" style="font-weight: 600;">
                    ${courseOptions}
                  </select>
                `}
              </div>

              <!-- Create New Course Inline Form -->
              <div id="manual-new-course-form-wrap" style="display: ${this.isCreatingNewCourse ? 'grid' : 'none'}; grid-template-columns: 1.5fr 1fr; gap: 10px; margin-top: 6px; padding-top: 8px; border-top: 1px dashed var(--color-glass-border);">
                <div>
                  <label style="font-size: 0.72rem; font-weight: 600; color: var(--color-text-secondary); display: block; margin-bottom: 2px;">TÊN ${isTHPT ? 'MÔN HỌC' : 'HỌC PHẦN'} *</label>
                  <input type="text" id="manual-new-name" class="glass-input" placeholder="vd: Toán cao cấp, Kỹ thuật số..." required>
                </div>
                <div>
                  <label style="font-size: 0.72rem; font-weight: 600; color: var(--color-text-secondary); display: block; margin-bottom: 2px;">MÃ MÔN</label>
                  <input type="text" id="manual-new-code" class="glass-input" placeholder="vd: MAT101, CSE201">
                </div>
                <div>
                  <label style="font-size: 0.72rem; font-weight: 600; color: var(--color-text-secondary); display: block; margin-bottom: 2px;">${isTHPT ? 'SỐ TIẾT/TUẦN' : 'SỐ TÍN CHỈ'}</label>
                  <input type="number" id="manual-new-credits" class="glass-input" value="${isTHPT ? 4 : 3}" min="1" max="15">
                </div>
                <div>
                  <label style="font-size: 0.72rem; font-weight: 600; color: var(--color-text-secondary); display: block; margin-bottom: 2px;">${isTHPT ? 'NHÓM MÔN' : 'NHÓM HỌC PHẦN'}</label>
                  <select id="manual-new-group" class="glass-input" style="font-size: 0.8rem; cursor: pointer;">
                    ${(isTHPT ? [
                      { id: 'math_sci', name: 'Khoa học Tự nhiên' },
                      { id: 'soc_lang', name: 'Khoa học Xã hội' },
                      { id: 'pe_art', name: 'Thể chất & Nghệ thuật' }
                    ] : CurriculumEngine.getActiveCourseGroups()).map(g => `<option value="${g.id}">${g.name} ${g.code ? `(${g.code})` : ''}</option>`).join('')}
                  </select>
                </div>
                <div style="grid-column: 1 / -1;">
                  <label style="font-size: 0.72rem; font-weight: 600; color: var(--color-text-secondary); display: block; margin-bottom: 2px;">NGÀY BẮT ĐẦU HỌC *</label>
                  <input type="date" id="manual-new-start-date" class="glass-input" value="${AcademicCalendar.formatDateKey(CalendarEngine.selectedDate || new Date())}" style="font-weight: 700; color: var(--color-primary); cursor: pointer;" required>
                </div>
                <div style="grid-column: 1 / -1;">
                  <label style="font-size: 0.72rem; font-weight: 600; color: var(--color-text-secondary); display: block; margin-bottom: 2px;">MÀU ĐÁNH DẤU</label>
                  <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-top: 4px;">
                    ${colorPillsHtml}
                  </div>
                </div>
              </div>
            </div>

            <!-- 2. Schedule Slot & Time Profile -->
            <div style="background: var(--color-card-background); border: 1px solid var(--color-glass-border); border-radius: var(--radius-md); padding: 14px;">
              <label style="font-size: 0.78rem; font-weight: 700; color: var(--color-text-secondary); text-transform: uppercase; margin-bottom: 10px; display: block;">
                KHUNG THỜI GIAN & TIẾT HỌC
              </label>

              <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                <div>
                  <label style="font-size: 0.72rem; font-weight: 600; color: var(--color-text-secondary); display: block; margin-bottom: 3px;">THỨ TRONG TUẦN</label>
                  <select id="manual-select-day" class="glass-input" style="font-weight: 600;">
                    ${dayOptions}
                  </select>
                </div>
                <div>
                  <label style="font-size: 0.72rem; font-weight: 600; color: var(--color-text-secondary); display: block; margin-bottom: 3px;">TIẾT BẮT ĐẦU</label>
                  <select id="manual-select-start-period" class="glass-input" style="font-weight: 600;">
                    ${startPeriodOptions}
                  </select>
                </div>
                <div>
                  <label style="font-size: 0.72rem; font-weight: 600; color: var(--color-text-secondary); display: block; margin-bottom: 3px;">TIẾT KẾT THÚC</label>
                  <select id="manual-select-end-period" class="glass-input" style="font-weight: 600;">
                    ${endPeriodOptions}
                  </select>
                </div>
              </div>

              <!-- Computed Time Range Card -->
              <div style="background: var(--primary-light); border-left: 4px solid var(--color-primary); border-radius: var(--radius-sm); padding: 10px 14px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <span style="font-size: 0.72rem; font-weight: 600; color: var(--color-primary); text-transform: uppercase;">KHUNG GIỜ TỰ ĐỘNG TÍNH TOÁN</span>
                  <div id="manual-computed-time" style="font-size: 1.15rem; font-weight: 800; color: var(--color-text); margin-top: 1px;">
                    ${timeRange.startTime} → ${timeRange.endTime}
                  </div>
                  <div id="manual-computed-sessions" style="font-size: 0.74rem; color: var(--color-text-secondary); margin-top: 2px;">
                    Tổng số tiết: <strong>${Math.max(1, this.selectedEndPeriod - this.selectedStartPeriod + 1)} tiết</strong> (${isTHPT ? 'THPT Đông Anh' : activeState.profile.name})
                  </div>
                </div>
                <div style="text-align: right;">
                  <span id="manual-computed-badge" class="glass-pill" style="font-size: 0.72rem; font-weight: 700; background: var(--color-primary); color: white;">
                    Tiết ${this.selectedStartPeriod}–${this.selectedEndPeriod}
                  </span>
                </div>
              </div>
            </div>

            <!-- 3. Room, Teacher & Session Info -->
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; background: var(--color-card-background); border: 1px solid var(--color-glass-border); border-radius: var(--radius-md); padding: 14px;">
              <div>
                <label style="font-size: 0.72rem; font-weight: 600; color: var(--color-text-secondary); display: block; margin-bottom: 3px;">PHÒNG HỌC / ĐỊA ĐIỂM</label>
                <input type="text" id="manual-input-room" class="glass-input" value="${isTHPT ? 'Phòng 11A2' : 'Phòng A203'}" placeholder="vd: A203, Lab 3">
              </div>
              <div>
                <label style="font-size: 0.72rem; font-weight: 600; color: var(--color-text-secondary); display: block; margin-bottom: 3px;">GIẢNG VIÊN / GIÁO VIÊN</label>
                <input type="text" id="manual-input-teacher" class="glass-input" placeholder="vd: TS. Nguyễn Văn A">
              </div>
              <div>
                <label style="font-size: 0.72rem; font-weight: 600; color: var(--color-text-secondary); display: block; margin-bottom: 3px;">LOẠI HÌNH</label>
                <select id="manual-select-type" class="glass-input">
                  ${isTHPT ? `
                    <option value="theory">Chính khóa</option>
                    <option value="extra">Học thêm</option>
                    <option value="self_study">Tự học</option>
                    <option value="activity">Hoạt động trải nghiệm</option>
                  ` : `
                    <option value="theory">Lý thuyết</option>
                    <option value="practical">Thực hành / Xưởng</option>
                    <option value="lab">Thí nghiệm</option>
                  `}
                </select>
              </div>
            </div>

            <!-- 4. Applied Weeks -->
            <div style="background: var(--color-card-background); border: 1px solid var(--color-glass-border); border-radius: var(--radius-md); padding: 12px 14px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
              <div>
                <label style="font-size: 0.76rem; font-weight: 700; color: var(--color-text);">TUẦN HỌC ÁP DỤNG</label>
                <p style="font-size: 0.74rem; color: var(--color-text-secondary); margin-top: 1px;">Cho phép cấu hình biến thiên TKB theo tuần</p>
              </div>
              <select id="manual-select-weeks" class="glass-input" style="width: auto; font-size: 0.8rem; font-weight: 600;">
                <option value="all">Tất cả các tuần (Tuần 01 – 16)</option>
                <option value="w1_8">Nửa đầu kỳ (Tuần 01 – 08)</option>
                <option value="w9_16">Nửa cuối kỳ (Tuần 09 – 16)</option>
                <option value="current">Chỉ áp dụng tuần hiện tại</option>
              </select>
            </div>
          ` : `
            <!-- QUICK TEXT SYNTAX PARSER -->
            <div style="background: var(--color-card-background); border: 1px solid var(--color-glass-border); border-radius: var(--radius-md); padding: 16px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <label style="font-size: 0.8rem; font-weight: 700; color: var(--color-text); display: flex; align-items: center; gap: 6px;">
                  <i data-lucide="terminal" style="width: 15px; height: 15px; color: var(--color-primary);"></i>
                  Dán danh sách lịch học (Cú pháp phân tách | )
                </label>
                <button type="button" id="btn-quick-sample" class="glass-pill" style="font-size: 0.72rem; cursor: pointer; background: var(--primary-light); color: var(--color-primary);">
                  Chèn mẫu
                </button>
              </div>

              <p style="font-size: 0.76rem; color: var(--color-text-secondary); margin-bottom: 10px;">
                Định dạng: <code>Thứ [2-7] | Tiết [1-3] | Tên môn | Phòng (tuỳ chọn) | Mã môn (tuỳ chọn)</code>
              </p>

              <textarea id="quick-syntax-input" class="glass-input" rows="6" placeholder="Thứ 2 | Tiết 1-3 | Toán cao cấp | Phòng A203 | MAT101&#10;Thứ 3 | Tiết 4-5 | Vật lý đại cương | Phòng B102 | PHY101&#10;Thứ 5 | Tiết 1-2 | Tiếng Anh chuyên ngành | Phòng C203 | ENG202" style="font-family: monospace; font-size: 0.82rem; line-height: 1.5; resize: vertical;"></textarea>

              <div id="quick-parse-preview" style="margin-top: 14px;">
                <!-- Live preview generated dynamically -->
              </div>
            </div>
          `}
        </div>

        <!-- Footer -->
        <div class="modal-footer" style="padding: 14px 24px; background: var(--color-glass); border-top: 1px solid var(--color-glass-border); display: flex; justify-content: space-between; align-items: center;">
          <div>
            <button id="btn-manual-save-draft" class="glass-button" style="font-size: 0.82rem;" title="Lưu nháp vào máy">
              <i data-lucide="bookmark" style="width: 14px; height: 14px;"></i> Lưu nháp
            </button>
          </div>

          <div style="display: flex; gap: 8px;">
            <button id="btn-manual-cancel" class="glass-button" style="padding: 8px 16px;">Hủy</button>
            <button id="btn-manual-submit" class="glass-button glass-button-primary" style="padding: 8px 20px; font-weight: 700;">
              <i data-lucide="plus" style="width: 15px; height: 15px;"></i> ${this.activeTab === 'form' ? '＋ Thêm vào thời khóa biểu' : '⚡ Thêm tất cả vào TKB'}
            </button>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
    this.updateDynamicCalculation();
    if (window.lucide) window.lucide.createIcons();
  },

  bindEvents() {
    this.backdrop.querySelector('#manual-modal-close-x')?.addEventListener('click', () => this.close());
    this.backdrop.querySelector('#btn-manual-cancel')?.addEventListener('click', () => this.close());

    // Switch Tabs
    this.backdrop.querySelector('#tab-btn-form-mode')?.addEventListener('click', () => {
      this.activeTab = 'form';
      this.renderUI();
    });

    this.backdrop.querySelector('#tab-btn-quick-mode')?.addEventListener('click', () => {
      this.activeTab = 'quick';
      this.renderUI();
      this.updateQuickParsePreview();
    });

    // Toggle Create New Course without wiping typed inputs
    this.backdrop.querySelector('#btn-toggle-new-course')?.addEventListener('click', (e) => {
      this.isCreatingNewCourse = !this.isCreatingNewCourse;
      const selectWrap = this.backdrop.querySelector('#manual-course-select-wrap');
      const formWrap = this.backdrop.querySelector('#manual-new-course-form-wrap');
      if (selectWrap) selectWrap.style.display = this.isCreatingNewCourse ? 'none' : 'block';
      if (formWrap) formWrap.style.display = this.isCreatingNewCourse ? 'grid' : 'none';
      e.currentTarget.innerText = this.isCreatingNewCourse ? '← Chọn môn có sẵn' : '＋ Tạo môn mới';
    });

    // Period selectors change -> dynamic update only
    this.backdrop.querySelector('#manual-select-start-period')?.addEventListener('change', (e) => {
      this.selectedStartPeriod = Number(e.target.value);
      const endSelect = this.backdrop.querySelector('#manual-select-end-period');
      if (endSelect && Number(endSelect.value) < this.selectedStartPeriod) {
        endSelect.value = String(this.selectedStartPeriod);
        this.selectedEndPeriod = this.selectedStartPeriod;
      }
      this.updateDynamicCalculation();
    });

    this.backdrop.querySelector('#manual-select-end-period')?.addEventListener('change', (e) => {
      this.selectedEndPeriod = Number(e.target.value);
      const startSelect = this.backdrop.querySelector('#manual-select-start-period');
      if (startSelect && Number(startSelect.value) > this.selectedEndPeriod) {
        startSelect.value = String(this.selectedEndPeriod);
        this.selectedStartPeriod = this.selectedEndPeriod;
      }
      this.updateDynamicCalculation();
    });

    this.backdrop.querySelector('#manual-select-day')?.addEventListener('change', (e) => {
      this.selectedDay = Number(e.target.value);
      this.updateDynamicCalculation();
    });

    // Quick text input listener
    const quickInput = this.backdrop.querySelector('#quick-syntax-input');
    quickInput?.addEventListener('input', () => {
      this.updateQuickParsePreview();
    });

    this.backdrop.querySelector('#btn-quick-sample')?.addEventListener('click', () => {
      if (quickInput) {
        quickInput.value = `Thứ 2 | Tiết 1-3 | Toán cao cấp | Phòng A203 | MAT101\nThứ 3 | Tiết 4-5 | Vật lý đại cương | Phòng B102 | PHY101\nThứ 4 | Tiết 1-3 | Kỹ thuật lập trình C++ | Lab CNTT 3 | CSE201\nThứ 5 | Tiết 7-9 | Tiếng Anh chuyên ngành | Phòng C302 | ENG202`;
        this.updateQuickParsePreview();
      }
    });

    // Save Draft
    this.backdrop.querySelector('#btn-manual-save-draft')?.addEventListener('click', () => {
      this.saveDraft();
    });

    // Submit
    this.backdrop.querySelector('#btn-manual-submit')?.addEventListener('click', () => {
      if (this.activeTab === 'form') {
        this.submitForm();
      } else {
        this.submitQuick();
      }
    });
  },

  updateDynamicCalculation() {
    const mode = Storage.getMode();
    const isTHPT = mode === 'high_school';
    const activeState = ProfileEngine.getActiveProfileState();

    const timeRange = isTHPT 
      ? this.calculateTHPTTimeRange(this.selectedStartPeriod, this.selectedEndPeriod)
      : ProfileEngine.calculateTimeRangeFromPeriods(activeState.profileId, this.selectedStartPeriod, this.selectedEndPeriod);

    // Update time range text
    const timeDisplay = this.backdrop.querySelector('#manual-computed-time');
    if (timeDisplay) {
      timeDisplay.innerText = `${timeRange.startTime} → ${timeRange.endTime}`;
    }

    const badgeDisplay = this.backdrop.querySelector('#manual-computed-badge');
    if (badgeDisplay) {
      badgeDisplay.innerText = `Tiết ${this.selectedStartPeriod}–${this.selectedEndPeriod}`;
    }

    const sessionsDisplay = this.backdrop.querySelector('#manual-computed-sessions');
    if (sessionsDisplay) {
      const totalPeriods = Math.max(1, this.selectedEndPeriod - this.selectedStartPeriod + 1);
      sessionsDisplay.innerHTML = `Tổng số tiết: <strong>${totalPeriods} tiết</strong> (${isTHPT ? 'THPT Đông Anh' : activeState.profile.name})`;
    }

    // Check conflict
    const conflictCheck = this.checkSlotConflict(this.selectedDay, timeRange.startTime, timeRange.endTime);
    const conflictBannerContainer = this.backdrop.querySelector('#manual-conflict-slot');
    if (conflictBannerContainer) {
      if (conflictCheck.hasConflict) {
        conflictBannerContainer.innerHTML = `
          <div class="conflict-alert-banner" style="background: #FEF2F2; border-left: 4px solid #EF4444; padding: 10px 14px; border-radius: var(--radius-md); display: flex; align-items: flex-start; gap: 10px; margin-bottom: 12px;">
            <i data-lucide="alert-triangle" style="color: #EF4444; width: 18px; height: 18px; flex-shrink: 0; margin-top: 2px;"></i>
            <div>
              <h4 style="font-size: 0.88rem; font-weight: 700; color: #991B1B;">Cảnh báo trùng lịch học!</h4>
              <p style="font-size: 0.78rem; color: #7F1D1D; margin-top: 1px;">
                Khoảng thời gian ${timeRange.startTime} – ${timeRange.endTime} đang trùng với môn <strong>${conflictCheck.conflictingCourse.name}</strong> (${conflictCheck.conflictingSchedule.startTime} – ${conflictCheck.conflictingSchedule.endTime}).
              </p>
            </div>
          </div>
        `;
        if (window.lucide) window.lucide.createIcons();
      } else {
        conflictBannerContainer.innerHTML = '';
      }
    }
  },

  checkSlotConflict(day, startTime, endTime) {
    const allItems = TimetableEngine.getAllScheduleItems(this.allCourses);
    const dayItems = allItems.filter(i => i.day === day);

    const sMins = TimetableEngine.timeToMinutes(startTime);
    const eMins = TimetableEngine.timeToMinutes(endTime);

    for (const item of dayItems) {
      const itemSMins = TimetableEngine.timeToMinutes(item.startTime);
      const itemEMins = TimetableEngine.timeToMinutes(item.endTime);

      if (Math.max(sMins, itemSMins) < Math.min(eMins, itemEMins)) {
        const parentCourse = this.allCourses.find(c => c.id === item.courseId);
        return {
          hasConflict: true,
          conflictingCourse: parentCourse || { name: item.courseName },
          conflictingSchedule: item
        };
      }
    }

    return { hasConflict: false };
  },

  calculateTHPTTimeRange(startPeriod, endPeriod) {
    const startP = HIGH_SCHOOL_TIME_PROFILE.periods.find(p => p.number === Number(startPeriod)) || HIGH_SCHOOL_TIME_PROFILE.periods[0];
    const endP = HIGH_SCHOOL_TIME_PROFILE.periods.find(p => p.number === Number(endPeriod)) || HIGH_SCHOOL_TIME_PROFILE.periods[Math.min(HIGH_SCHOOL_TIME_PROFILE.periods.length - 1, Number(startPeriod) + 1)];

    return {
      startTime: startP.startTime,
      endTime: endP.endTime,
      sessions: Math.max(1, Number(endPeriod) - Number(startPeriod) + 1)
    };
  },

  updateQuickParsePreview() {
    const input = this.backdrop.querySelector('#quick-syntax-input');
    const previewEl = this.backdrop.querySelector('#quick-parse-preview');
    if (!input || !previewEl) return;

    const parsedItems = this.parseQuickSyntax(input.value);

    if (parsedItems.length === 0) {
      previewEl.innerHTML = `
        <div style="padding: 12px; background: var(--color-glass); border-radius: var(--radius-sm); font-size: 0.78rem; color: var(--color-text-secondary); text-align: center;">
          Nhập dữ liệu ở trên để xem trước bảng thời khóa biểu được bóc tách
        </div>
      `;
      return;
    }

    const rowsHtml = parsedItems.map((item, idx) => `
      <tr style="border-bottom: 1px solid var(--color-glass-border);">
        <td style="padding: 6px 8px; font-weight: 700; color: var(--color-primary);">${item.dayName}</td>
        <td style="padding: 6px 8px; font-weight: 700; color: var(--color-text);">Tiết ${item.startPeriod}–${item.endPeriod}</td>
        <td style="padding: 6px 8px; font-weight: 600; color: var(--color-text);">${item.startTime} – ${item.endTime}</td>
        <td style="padding: 6px 8px; font-weight: 700; color: var(--color-text);">${item.name}</td>
        <td style="padding: 6px 8px; color: var(--color-text-secondary);">${item.room}</td>
      </tr>
    `).join('');

    previewEl.innerHTML = `
      <div style="background: var(--color-glass); border: 1px solid var(--color-glass-border); border-radius: var(--radius-sm); overflow: hidden;">
        <div style="padding: 6px 10px; background: var(--primary-light); font-size: 0.74rem; font-weight: 700; color: var(--color-primary); display: flex; justify-content: space-between;">
          <span>Xem trước ${parsedItems.length} tiết học được bóc tách:</span>
          <span>✓ Cú pháp hợp lệ</span>
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 0.78rem; text-align: left;">
          <thead>
            <tr style="background: var(--color-card-background); border-bottom: 1px solid var(--color-glass-border);">
              <th style="padding: 6px 8px; color: var(--color-text-secondary);">Thứ</th>
              <th style="padding: 6px 8px; color: var(--color-text-secondary);">Tiết</th>
              <th style="padding: 6px 8px; color: var(--color-text-secondary);">Thời gian</th>
              <th style="padding: 6px 8px; color: var(--color-text-secondary);">Môn học</th>
              <th style="padding: 6px 8px; color: var(--color-text-secondary);">Phòng</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    `;
  },

  parseQuickSyntax(text) {
    if (!text || !text.trim()) return [];

    const mode = Storage.getMode();
    const isTHPT = mode === 'high_school';
    const activeState = ProfileEngine.getActiveProfileState();

    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const results = [];

    lines.forEach(line => {
      const parts = line.split('|').map(p => p.trim());
      if (parts.length < 3) return;

      // 1. Parse Day
      const dayStr = parts[0].toLowerCase();
      let dayNum = 1;
      if (dayStr.includes('2') || dayStr.includes('hai') || dayStr.includes('mon')) dayNum = 1;
      else if (dayStr.includes('3') || dayStr.includes('ba') || dayStr.includes('tue')) dayNum = 2;
      else if (dayStr.includes('4') || dayStr.includes('tư') || dayStr.includes('tu') || dayStr.includes('wed')) dayNum = 3;
      else if (dayStr.includes('5') || dayStr.includes('năm') || dayStr.includes('nam') || dayStr.includes('thu')) dayNum = 4;
      else if (dayStr.includes('6') || dayStr.includes('sáu') || dayStr.includes('sau') || dayStr.includes('fri')) dayNum = 5;
      else if (dayStr.includes('7') || dayStr.includes('bảy') || dayStr.includes('bay') || dayStr.includes('sat')) dayNum = 6;
      else if (dayStr.includes('cn') || dayStr.includes('nhật') || dayStr.includes('sun')) dayNum = 0;

      // 2. Parse Periods
      const periodStr = parts[1].toLowerCase().replace(/tiết|tiet|p/g, '').trim();
      let startP = 1;
      let endP = 3;

      if (periodStr.includes('-')) {
        const [s, e] = periodStr.split('-').map(Number);
        startP = s || 1;
        endP = e || startP;
      } else if (periodStr.includes('đến') || periodStr.includes('den')) {
        const [s, e] = periodStr.split(/đến|den/).map(Number);
        startP = s || 1;
        endP = e || startP;
      } else {
        startP = Number(periodStr) || 1;
        endP = startP;
      }

      // Calculate time
      const timeRange = isTHPT 
        ? this.calculateTHPTTimeRange(startP, endP)
        : ProfileEngine.calculateTimeRangeFromPeriods(activeState.profileId, startP, endP);

      // 3. Name & Room & Code
      const name = parts[2] || 'Môn học mới';
      const room = parts[3] || (isTHPT ? 'Phòng 11A2' : 'Phòng A203');
      const code = parts[4] || 'SUB';

      const dayObj = DAY_NAMES.find(d => d.day === dayNum) || { name: `Thứ ${dayNum + 1}` };

      results.push({
        day: dayNum,
        dayName: dayObj.name,
        startPeriod: startP,
        endPeriod: endP,
        startTime: timeRange.startTime,
        endTime: timeRange.endTime,
        sessions: timeRange.sessions,
        name,
        room,
        code
      });
    });

    return results;
  },

  submitForm() {
    const mode = Storage.getMode();
    const isTHPT = mode === 'high_school';
    const activeState = ProfileEngine.getActiveProfileState();

    const timeRange = isTHPT 
      ? this.calculateTHPTTimeRange(this.selectedStartPeriod, this.selectedEndPeriod)
      : ProfileEngine.calculateTimeRangeFromPeriods(activeState.profileId, this.selectedStartPeriod, this.selectedEndPeriod);

    const room = this.backdrop.querySelector('#manual-input-room')?.value.trim() || (isTHPT ? 'Phòng 11A2' : 'Phòng A203');
    const teacher = this.backdrop.querySelector('#manual-input-teacher')?.value.trim() || '';
    const type = this.backdrop.querySelector('#manual-select-type')?.value || 'theory';
    const weeks = this.backdrop.querySelector('#manual-select-weeks')?.value || 'all';

    const newSchedule = {
      id: 'sch-' + Date.now(),
      day: this.selectedDay,
      startPeriod: this.selectedStartPeriod,
      endPeriod: this.selectedEndPeriod,
      startTime: timeRange.startTime,
      endTime: timeRange.endTime,
      sessions: timeRange.sessions,
      room,
      teacher,
      type,
      source: 'manual',
      weeks
    };

    let targetCourse = null;

    if (this.isCreatingNewCourse || this.allCourses.length === 0) {
      const name = this.backdrop.querySelector('#manual-new-name')?.value.trim();
      if (!name) {
        alert('Vui lòng nhập tên môn học!');
        return;
      }
      const code = this.backdrop.querySelector('#manual-new-code')?.value.trim() || name.substring(0, 4).toUpperCase();
      const credits = Number(this.backdrop.querySelector('#manual-new-credits')?.value || 3);
      const color = this.backdrop.querySelector('input[name="manual-new-color"]:checked')?.value || '#AFC8F5';

      const chosenGroupId = this.backdrop.querySelector('#manual-new-group')?.value;
      const chosenGroup = isTHPT ? null : CurriculumEngine.getCourseGroupById(chosenGroupId);
      const activeCurriculumState = isTHPT ? null : CurriculumEngine.getActiveCurriculumState();

      targetCourse = {
        id: 'crs-' + Date.now(),
        universityId: activeState.univId,
        campusId: activeState.campusId,
        profileId: activeState.profileId,
        curriculumId: activeCurriculumState?.curriculumId || null,
        courseGroupId: chosenGroup?.id || chosenGroupId || null,
        courseGroupName: chosenGroup?.name || (isTHPT ? 'Môn học' : 'Học phần'),
        name,
        code,
        credits: isTHPT ? 0 : credits,
        hoursPerWeek: isTHPT ? credits : 3,
        totalHours: isTHPT ? credits * 15 : credits * 15,
        type,
        teacher,
        room,
        color: color || chosenGroup?.color || '#AFC8F5',
        category: chosenGroup?.id || 'it',
        schedules: [newSchedule],
        source: 'manual'
      };
    } else {
      const courseId = this.backdrop.querySelector('#manual-select-course')?.value;
      const found = this.allCourses.find(c => c.id === courseId);
      if (!found) {
        alert('Không tìm thấy môn học đã chọn!');
        return;
      }

      targetCourse = JSON.parse(JSON.stringify(found));
      if (!targetCourse.schedules) targetCourse.schedules = [];
      targetCourse.schedules.push(newSchedule);
      targetCourse.source = 'manual';
    }

    const chosenStartDate = (this.isCreatingNewCourse || this.allCourses.length === 0)
      ? (this.backdrop.querySelector('#manual-new-start-date')?.value || AcademicCalendar.formatDateKey(CalendarEngine.selectedDate || new Date()))
      : (targetCourse.startDate || AcademicCalendar.formatDateKey(CalendarEngine.selectedDate || new Date()));

    const meta = ScheduleEngine.calculateScheduleMeta({
      startDate: chosenStartDate,
      totalPeriods: targetCourse.totalHours || (targetCourse.credits * 15) || 45,
      schedules: targetCourse.schedules,
      mode: isTHPT ? 'high_school' : 'university',
      profileId: activeState.profileId
    });

    targetCourse.hoursPerWeek = meta.periodsPerWeek;
    targetCourse.totalHours = meta.totalPeriods;
    targetCourse.startDate = chosenStartDate;
    targetCourse.calculatedEndDate = meta.calculatedEndDate;
    targetCourse.calculatedEndDateIso = meta.calculatedEndDateIso;
    targetCourse.endDateMode = targetCourse.endDateMode || 'auto';
    targetCourse.totalWeeks = meta.totalWeeks;
    targetCourse.totalSessions = meta.totalSessions;

    this.close();
    if (this.callbacks.onSaveCourse) {
      this.callbacks.onSaveCourse(targetCourse, !this.isCreatingNewCourse && this.allCourses.some(c => c.id === targetCourse.id));
    }
  },

  submitQuick() {
    const input = this.backdrop.querySelector('#quick-syntax-input');
    if (!input || !input.value.trim()) {
      alert('Vui lòng nhập ít nhất một dòng thời khóa biểu!');
      return;
    }

    const parsedItems = this.parseQuickSyntax(input.value);
    if (parsedItems.length === 0) {
      alert('Không nhận diện được cú pháp hợp lệ!');
      return;
    }

    const mode = Storage.getMode();
    const isTHPT = mode === 'high_school';
    const activeState = ProfileEngine.getActiveProfileState();
    const colors = ['#AFC8F5', '#F5B28D', '#C7B7F4', '#F7D99A', '#A9DED5', '#F4B5C2'];
    const defaultStartDate = AcademicCalendar.formatDateKey(CalendarEngine.selectedDate || new Date());

    const newCoursesToCreate = [];

    parsedItems.forEach((item, idx) => {
      const schedule = {
        id: 'sch-' + Date.now() + '-' + idx,
        day: item.day,
        startPeriod: item.startPeriod,
        endPeriod: item.endPeriod,
        startTime: item.startTime,
        endTime: item.endTime,
        sessions: item.sessions,
        room: item.room,
        type: 'theory',
        source: 'manual',
        weeks: 'all'
      };

      // Check if existing course matching name
      const existing = this.allCourses.find(c => c.name.toLowerCase() === item.name.toLowerCase()) 
                    || newCoursesToCreate.find(c => c.name.toLowerCase() === item.name.toLowerCase());

      if (existing) {
        if (!existing.schedules) existing.schedules = [];
        existing.schedules.push(schedule);
      } else {
        const newCourse = {
          id: 'crs-' + Date.now() + '-' + idx,
          universityId: activeState.univId,
          campusId: activeState.campusId,
          profileId: activeState.profileId,
          name: item.name,
          code: item.code || 'SUB',
          credits: isTHPT ? 0 : 3,
          hoursPerWeek: isTHPT ? 3 : 3,
          totalHours: 45,
          type: 'theory',
          room: item.room,
          color: colors[idx % colors.length],
          category: 'it',
          schedules: [schedule],
          source: 'manual',
          startDate: defaultStartDate
        };
        newCoursesToCreate.push(newCourse);
      }
    });

    // Compute metadata for all new courses
    newCoursesToCreate.forEach(course => {
      const meta = ScheduleEngine.calculateScheduleMeta({
        startDate: defaultStartDate,
        totalPeriods: course.totalHours || (course.credits * 15) || 45,
        schedules: course.schedules,
        mode: isTHPT ? 'high_school' : 'university',
        profileId: activeState.profileId
      });

      course.hoursPerWeek = meta.periodsPerWeek;
      course.totalHours = meta.totalPeriods;
      course.startDate = defaultStartDate;
      course.calculatedEndDate = meta.calculatedEndDate;
      course.calculatedEndDateIso = meta.calculatedEndDateIso;
      course.endDateMode = 'auto';
      course.totalWeeks = meta.totalWeeks;
      course.totalSessions = meta.totalSessions;
    });

    this.close();
    if (this.callbacks.onBatchSave) {
      this.callbacks.onBatchSave(newCoursesToCreate);
    }
  },

  saveDraft() {
    const draft = {
      day: this.selectedDay,
      startPeriod: this.selectedStartPeriod,
      endPeriod: this.selectedEndPeriod,
      room: this.backdrop.querySelector('#manual-input-room')?.value,
      teacher: this.backdrop.querySelector('#manual-input-teacher')?.value,
      quickText: this.backdrop.querySelector('#quick-syntax-input')?.value
    };
    localStorage.setItem('class_schedule_manual_draft', JSON.stringify(draft));
    alert('Đã lưu nháp vào máy thành công! ✨');
  },

  open() {
    if (this.backdrop) {
      this.backdrop.classList.add('open');
    }
  },

  close() {
    if (this.backdrop) {
      this.backdrop.classList.remove('open');
    }
  }
};
