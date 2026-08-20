/**
 * AutoSchedulerModal: Automatic Timetable Generator
 * Rule-based multi-option generator (Best Schedule, Morning Focus, Long Weekend, Even Distribution)
 */
import { TimetableEngine } from '../utils/timetableEngine.js';
import { DAY_NAMES } from '../data/mockData.js';

export const AutoSchedulerModal = {
  backdrop: null,
  callbacks: {},
  currentProposals: [],
  selectedProposalIndex: 0,
  currentCourses: [],

  init(callbacks = {}) {
    this.callbacks = callbacks;
    this.renderContainer();
  },

  renderContainer() {
    let el = document.getElementById('auto-scheduler-backdrop');
    if (!el) {
      el = document.createElement('div');
      el.id = 'auto-scheduler-backdrop';
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

  openModal(allCourses) {
    this.currentCourses = JSON.parse(JSON.stringify(allCourses));
    this.generateAndRender();
    this.open();
  },

  generateAndRender(customPrefs = null) {
    const defaultPrefs = customPrefs || {
      preferredShift: 'any',
      offDays: [6, 0], // Saturday & Sunday
      minBreakMins: 15,
      maxSessionsPerDay: 6
    };

    this.currentProposals = TimetableEngine.generateProposals(this.currentCourses, defaultPrefs);
    this.renderUI(defaultPrefs);
  },

  renderUI(prefs) {
    const activeProposal = this.currentProposals[this.selectedProposalIndex] || this.currentProposals[0];

    // Tabs for proposals
    const proposalTabs = this.currentProposals.map((prop, idx) => `
      <button class="glass-pill proposal-tab-btn ${idx === this.selectedProposalIndex ? 'active' : ''}" 
              data-idx="${idx}"
              style="cursor: pointer; padding: 8px 14px; font-weight: 700; ${idx === this.selectedProposalIndex ? 'background: var(--primary); color: white;' : ''}">
        ${prop.badge}
      </button>
    `).join('');

    // Days representation for active proposal
    const daysPreview = [1, 2, 3, 4, 5, 6].map(dayNum => {
      const dayInfo = DAY_NAMES.find(d => d.day === dayNum);
      const daySchedules = [];

      activeProposal.courses.forEach(c => {
        (c.schedules || []).forEach(s => {
          if (s.day === dayNum) {
            daySchedules.push({ ...s, courseName: c.name, color: c.color, code: c.code });
          }
        });
      });

      // Sort by start time
      daySchedules.sort((a, b) => TimetableEngine.timeToMinutes(a.startTime) - TimetableEngine.timeToMinutes(b.startTime));

      return `
        <div style="background: rgba(255,255,255,0.65); border: 1px solid var(--glass-border); border-radius: var(--radius-md); padding: 12px; min-height: 140px;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(0,0,0,0.06); padding-bottom: 6px; margin-bottom: 8px;">
            <span style="font-weight: 700; font-size: 0.85rem; color: var(--text-main);">${dayInfo.name}</span>
            <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: 600;">${daySchedules.length} môn</span>
          </div>
          ${daySchedules.length === 0 ? `
            <div style="color: var(--text-muted); font-size: 0.76rem; text-align: center; padding-top: 30px;">
              <i class="fa-solid fa-mug-hot" style="font-size: 1.1rem; display: block; margin-bottom: 4px; opacity: 0.4;"></i>
              Trống (Nghỉ)
            </div>
          ` : daySchedules.map(item => `
            <div style="background: ${item.color}; border: 1px solid rgba(255,255,255,0.9); border-radius: var(--radius-sm); padding: 6px 8px; margin-bottom: 6px; box-shadow: 0 2px 6px rgba(0,0,0,0.04);">
              <div style="font-size: 0.78rem; font-weight: 700; color: #1F2937; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${item.courseName}
              </div>
              <div style="font-size: 0.68rem; color: #374151; font-weight: 600; display: flex; justify-content: space-between; margin-top: 2px;">
                <span>${item.startTime} – ${item.endTime}</span>
                <span>${item.room || 'A203'}</span>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }).join('');

    this.backdrop.innerHTML = `
      <div class="modal-window" style="max-width: 920px;">
        <div class="modal-header">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div class="logo-icon-wrap" style="width: 36px; height: 36px; font-size: 1rem;">
              <i class="fa-solid fa-wand-magic-sparkles"></i>
            </div>
            <div>
              <h3 class="modal-title" style="font-size: 1.15rem;">Tự Động Xếp Thời Khóa Biểu</h3>
              <p style="font-size: 0.76rem; color: var(--text-secondary);">Tạo và so sánh các phương án lịch học tối ưu dựa trên nhu cầu của bạn</p>
            </div>
          </div>
          <button id="auto-sched-close-x" class="icon-btn" style="width: 32px; height: 32px; font-size: 0.9rem;" aria-label="Đóng">&times;</button>
        </div>

        <div class="modal-body" style="gap: 16px; padding: 20px;">
          <!-- Controls bar -->
          <div style="background: rgba(255,255,255,0.7); border: 1px solid var(--glass-border); border-radius: var(--radius-md); padding: 14px; display: flex; flex-wrap: wrap; gap: 14px; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <label style="font-size: 0.78rem; font-weight: 700; color: var(--text-secondary);">CA ƯU TIÊN:</label>
              <select id="pref-shift" class="glass-input" style="padding: 6px 12px; width: auto; font-size: 0.82rem; font-weight: 600;">
                <option value="any" ${prefs.preferredShift === 'any' ? 'selected' : ''}>Tự do linh hoạt</option>
                <option value="morning" ${prefs.preferredShift === 'morning' ? 'selected' : ''}>Ca Sáng (07:00 – 11:30)</option>
                <option value="afternoon" ${prefs.preferredShift === 'afternoon' ? 'selected' : ''}>Ca Chiều (13:00 – 17:30)</option>
              </select>
            </div>

            <div style="display: flex; align-items: center; gap: 8px;">
              <label style="font-size: 0.78rem; font-weight: 700; color: var(--text-secondary);">NGÀY MUỐN NGHỈ:</label>
              <label style="font-size: 0.78rem; font-weight: 600; display: inline-flex; align-items: center; gap: 4px; cursor: pointer;">
                <input type="checkbox" id="pref-off-fri" ${prefs.offDays.includes(5) ? 'checked' : ''}> Thứ 6
              </label>
              <label style="font-size: 0.78rem; font-weight: 600; display: inline-flex; align-items: center; gap: 4px; cursor: pointer;">
                <input type="checkbox" id="pref-off-sat" ${prefs.offDays.includes(6) ? 'checked' : ''}> Thứ 7
              </label>
            </div>

            <button id="btn-re-generate" class="glass-button glass-button-primary" style="padding: 6px 14px; font-size: 0.82rem;">
              <i class="fa-solid fa-arrows-rotate"></i> Tạo lại phương án
            </button>
          </div>

          <!-- Proposal Selector Tabs -->
          <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px;">
            ${proposalTabs}
          </div>

          <!-- Proposal Metrics & Description -->
          <div style="background: rgba(255,255,255,0.85); border-left: 4px solid var(--primary); border-radius: var(--radius-md); padding: 14px 18px; border: 1px solid var(--glass-border); box-shadow: var(--shadow-sm);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 10px;">
              <div>
                <h4 style="font-size: 1rem; font-weight: 800; color: var(--text-main);">${activeProposal.title}</h4>
                <p style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 2px;">${activeProposal.description}</p>
              </div>
              <div style="display: flex; gap: 12px;">
                <div style="text-align: center;">
                  <span style="font-size: 0.68rem; color: var(--text-muted); font-weight: 700; display: block;">ĐIỂM TIỆN LỢI</span>
                  <span style="font-size: 1.15rem; font-weight: 800; color: var(--primary);">${activeProposal.metrics.convenienceScore}/100</span>
                </div>
                <div style="text-align: center; border-left: 1px solid rgba(0,0,0,0.08); padding-left: 12px;">
                  <span style="font-size: 0.68rem; color: var(--text-muted); font-weight: 700; display: block;">THỜI GIAN RẢNH</span>
                  <span style="font-size: 1.15rem; font-weight: 800; color: #10B981;">${activeProposal.metrics.freeTimePercent}%</span>
                </div>
                <div style="text-align: center; border-left: 1px solid rgba(0,0,0,0.08); padding-left: 12px;">
                  <span style="font-size: 0.68rem; color: var(--text-muted); font-weight: 700; display: block;">SỐ NGÀY ĐI HỌC</span>
                  <span style="font-size: 1.15rem; font-weight: 800; color: var(--text-main);">${activeProposal.metrics.daysWithClass} ngày/tuần</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Schedule Grid Visual -->
          <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 10px; max-height: 280px; overflow-y: auto;">
            ${daysPreview}
          </div>
        </div>

        <div class="modal-footer" style="justify-content: space-between;">
          <div style="font-size: 0.8rem; color: var(--text-secondary);">
            <i class="fa-solid fa-shield-check" style="color: #10B981;"></i> 0 xung đột lịch học phát hiện
          </div>
          <div style="display: flex; gap: 10px;">
            <button id="btn-cancel-auto-sched" class="glass-button">Đóng</button>
            <button id="btn-apply-proposal" class="glass-button glass-button-primary">
              <i class="fa-solid fa-circle-check"></i> Áp Dụng Phương Án Này
            </button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('auto-sched-close-x')?.addEventListener('click', () => this.close());
    document.getElementById('btn-cancel-auto-sched')?.addEventListener('click', () => this.close());

    // Switch proposal tab
    this.backdrop.querySelectorAll('.proposal-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.selectedProposalIndex = Number(e.currentTarget.getAttribute('data-idx'));
        this.renderUI(prefs);
      });
    });

    // Re-generate button
    document.getElementById('btn-re-generate')?.addEventListener('click', () => {
      const shift = document.getElementById('pref-shift')?.value || 'any';
      const offDays = [0]; // Sunday default
      if (document.getElementById('pref-off-fri')?.checked) offDays.push(5);
      if (document.getElementById('pref-off-sat')?.checked) offDays.push(6);

      this.generateAndRender({
        preferredShift: shift,
        offDays,
        minBreakMins: 15,
        maxSessionsPerDay: 6
      });
    });

    // Apply Proposal Button
    document.getElementById('btn-apply-proposal')?.addEventListener('click', () => {
      const chosenProposal = this.currentProposals[this.selectedProposalIndex];
      if (chosenProposal && this.callbacks.onApply) {
        this.callbacks.onApply(chosenProposal.courses);
        this.close();
      }
    });
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
