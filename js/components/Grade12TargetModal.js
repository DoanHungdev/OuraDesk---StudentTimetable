/**
 * Grade12TargetModal: Target Planner for Grade 12 Students
 * "Ôn thi THPT Quốc Gia"
 * Uses Lucide Icons & Clean Typography
 */
import { Storage } from '../utils/storage.js';

export const Grade12TargetModal = {
  backdrop: null,
  callbacks: {},

  init(callbacks = {}) {
    this.callbacks = callbacks;
    this.renderContainer();
  },

  renderContainer() {
    let el = document.getElementById('grade12-target-modal-backdrop');
    if (!el) {
      el = document.createElement('div');
      el.id = 'grade12-target-modal-backdrop';
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

  openModal() {
    const targets = Storage.getGrade12Targets();

    // Calculate days remaining
    const examDate = new Date(targets.examDate || '2027-06-25');
    const now = new Date();
    const diffDays = Math.max(0, Math.ceil((examDate - now) / (1000 * 60 * 60 * 24)));

    const subjectsRowsHtml = (targets.subjects || []).map(s => `
      <div style="background: rgba(255,255,255,0.7); border: 1px solid var(--glass-border); border-radius: var(--radius-md); padding: 10px 14px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h4 style="font-size: 0.92rem; font-weight: 600; color: var(--text-main);">${s.name}</h4>
          <span style="font-size: 0.76rem; color: var(--text-secondary);">Mục tiêu học: <strong>${s.currentWeeklyHours}h / ${s.goalHours}h tuần này</strong></span>
        </div>
        <div style="text-align: right;">
          <span style="font-size: 1.25rem; font-weight: 700; color: var(--primary);">${s.target}</span>
          <span style="font-size: 0.72rem; color: var(--text-muted); display: block;">Điểm mục tiêu</span>
        </div>
      </div>
    `).join('');

    this.backdrop.innerHTML = `
      <div class="modal-window" style="max-width: 560px;">
        <div class="modal-header">
          <div>
            <h3 class="modal-title" style="display: flex; align-items: center; gap: 8px;">
              <i data-lucide="target" style="color: var(--primary); width: 20px; height: 20px;"></i>
              Kế hoạch ôn thi THPT Quốc gia ${targets.examYear || 2027}
            </h3>
            <p style="font-size: 0.78rem; color: var(--text-secondary);">Mục tiêu điểm số và kế hoạch học tập khối 12</p>
          </div>
          <button id="g12-close-x" class="icon-btn" style="width: 30px; height: 30px; font-size: 0.85rem;" aria-label="Đóng">&times;</button>
        </div>

        <div class="modal-body" style="gap: 12px;">
          <!-- Countdown Card -->
          <div style="background: linear-gradient(135deg, var(--primary-light) 0%, var(--color-glass) 100%); border: 1px solid var(--primary-border); border-radius: var(--radius-lg); padding: 14px 18px; text-align: center;">
            <div style="font-size: 0.74rem; font-weight: 600; color: var(--color-primary); text-transform: uppercase; letter-spacing: 0.04em;">ĐẾM NGƯỢC KỲ THI TỐT NGHIỆP THPT</div>
            <div style="font-size: 2.5rem; font-weight: 700; color: var(--text-main); line-height: 1.1; margin: 4px 0;">
              ${diffDays} <span style="font-size: 1.1rem; font-weight: 600; color: var(--primary);">NGÀY</span>
            </div>
            <p style="font-size: 0.8rem; color: var(--text-secondary);">
              Tổ hợp: <strong>${targets.combination}</strong> · Mục tiêu tổng: <strong style="color: var(--primary);">${targets.targetTotalScore} điểm</strong>
            </p>
          </div>

          <!-- Target University -->
          <div style="background: rgba(255,255,255,0.7); border: 1px solid var(--glass-border); border-radius: var(--radius-md); padding: 10px 14px;">
            <div style="font-size: 0.74rem; font-weight: 600; color: var(--text-secondary); display: flex; align-items: center; gap: 4px;">
              <i data-lucide="school" style="width: 14px; height: 14px; color: var(--primary);"></i> TRƯỜNG ĐẠI HỌC MƠ ƯỚC
            </div>
            <div style="font-size: 0.92rem; font-weight: 600; color: var(--text-main); margin-top: 2px;">${targets.targetUniversity}</div>
            <div style="font-size: 0.78rem; color: var(--primary); font-weight: 500; margin-top: 2px;">${targets.targetMajor}</div>
          </div>

          <!-- Subject Target List -->
          <div>
            <div style="font-size: 0.76rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 6px; text-transform: uppercase;">
              MỤC TIÊU TỪNG MÔN TRONG TỔ HỢP
            </div>
            <div style="display: flex; flex-direction: column; gap: 6px;">
              ${subjectsRowsHtml}
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button id="btn-g12-close" class="glass-button glass-button-primary">Đóng</button>
        </div>
      </div>
    `;

    document.getElementById('g12-close-x')?.addEventListener('click', () => this.close());
    document.getElementById('btn-g12-close')?.addEventListener('click', () => this.close());

    this.open();
    if (window.lucide) window.lucide.createIcons();
  },

  open() {
    if (this.backdrop) this.backdrop.classList.add('open');
  },

  close() {
    if (this.backdrop) this.backdrop.classList.remove('open');
  }
};
