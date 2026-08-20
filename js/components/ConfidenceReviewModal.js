/**
 * ConfidenceReviewModal: Human Verification & Confidence System
 * "AI đã đọc được 25 tiết: 🟢 23 chắc chắn, 🟡 2 cần kiểm tra"
 * Uses Lucide Icons & Clean Typography
 */
import { OCREngine } from '../utils/ocrEngine.js';
import { DAY_NAMES } from '../data/mockData.js';
import { Storage } from '../utils/storage.js';

export const ConfidenceReviewModal = {
  backdrop: null,
  callbacks: {},
  currentResult: null,

  init(callbacks = {}) {
    this.callbacks = callbacks;
    this.renderContainer();
  },

  renderContainer() {
    let el = document.getElementById('confidence-review-modal-backdrop');
    if (!el) {
      el = document.createElement('div');
      el.id = 'confidence-review-modal-backdrop';
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

  openReview(ocrResult) {
    this.currentResult = JSON.parse(JSON.stringify(ocrResult));
    this.renderUI();
    this.open();
  },

  renderUI() {
    if (!this.currentResult) return;

    const items = this.currentResult.items || [];
    const totalCount = items.length;
    const highCount = items.filter(i => !i.needsReview && i.confidence >= 90).length;
    const lowCount = totalCount - highCount;

    const rowsHtml = items.map((item, idx) => {
      const dInfo = DAY_NAMES.find(d => d.day === item.day) || DAY_NAMES[0];
      const pBadge = item.startPeriod === item.endPeriod ? `Tiết ${item.startPeriod}` : `Tiết ${item.startPeriod} – ${item.endPeriod}`;
      const isLow = item.needsReview || item.confidence < 90;

      const suggestionButtons = (item.suggestions || []).map(s => `
        <button type="button" class="glass-pill btn-quick-suggest" data-idx="${idx}" data-val="${s}" style="cursor: pointer; padding: 2px 7px; font-size: 0.72rem; font-weight: 500; background: ${s === item.subjectName ? 'var(--primary)' : 'rgba(255,255,255,0.9)'}; color: ${s === item.subjectName ? 'white' : 'var(--text-main)'};">
          ${s}
        </button>
      `).join('');

      return `
        <tr style="border-bottom: 1px solid rgba(0,0,0,0.05); ${isLow ? 'background: rgba(254, 243, 199, 0.45);' : ''}">
          <td style="padding: 9px 10px; font-weight: 600; color: var(--text-main);">${dInfo.shortName}</td>
          <td style="padding: 9px 10px; font-weight: 600; color: var(--primary);">${pBadge}</td>
          <td style="padding: 9px 10px; font-size: 0.76rem; color: var(--text-secondary);">${item.startTime} – ${item.endTime}</td>
          
          <td style="padding: 9px 10px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <input type="text" class="glass-input item-subject-input" data-idx="${idx}" value="${item.subjectName}" style="padding: 4px 8px; font-size: 0.84rem; font-weight: 600; width: 140px; border-color: ${isLow ? '#F59E0B' : 'var(--glass-border)'};">
              <div style="display: flex; gap: 4px; flex-wrap: wrap;">
                ${suggestionButtons}
              </div>
            </div>
          </td>

          <td style="padding: 9px 10px; text-align: right;">
            ${isLow ? `
              <span class="glass-pill" style="background: #FEF3C7; color: #D97706; font-size: 0.72rem; font-weight: 600; border: 1px solid #FCD34D;">
                🟡 ${item.confidence}% Cần kiểm tra
              </span>
            ` : `
              <span class="glass-pill" style="background: #D1FAE5; color: #059669; font-size: 0.72rem; font-weight: 600; border: 1px solid #A7F3D0;">
                🟢 ${item.confidence}% Chắc chắn
              </span>
            `}
          </td>
        </tr>
      `;
    }).join('');

    this.backdrop.innerHTML = `
      <div class="modal-window" style="max-width: 800px;">
        <div class="modal-header">
          <div>
            <h3 class="modal-title" style="display: flex; align-items: center; gap: 8px;">
              <i data-lucide="sparkles" style="color: var(--primary); width: 20px; height: 20px;"></i>
              AI đã đọc được Thời khóa biểu
            </h3>
            <p style="font-size: 0.78rem; color: var(--text-secondary);">
              Lớp: <strong>${this.currentResult.className || '11A2'}</strong> · Vui lòng kiểm tra lại các mục được đánh dấu trước khi lưu.
            </p>
          </div>
          <button id="conf-review-close-x" class="icon-btn" style="width: 30px; height: 30px; font-size: 0.85rem;" aria-label="Đóng">&times;</button>
        </div>

        <!-- Confidence Summary Header Banner -->
        <div style="padding: 0 22px; padding-top: 12px;">
          <div style="background: rgba(255,255,255,0.85); border: 1px solid var(--glass-border); border-radius: var(--radius-md); padding: 10px 16px; display: flex; justify-content: space-between; align-items: center; box-shadow: var(--shadow-sm);">
            <div style="display: flex; align-items: center; gap: 14px;">
              <div style="width: 38px; height: 38px; border-radius: 50%; background: rgba(244,124,99,0.12); display: flex; align-items: center; justify-content: center; color: var(--primary);">
                <i data-lucide="bot" style="width: 22px; height: 22px;"></i>
              </div>
              <div>
                <h4 style="font-size: 0.92rem; font-weight: 600; color: var(--text-main);">
                  Tổng cộng: ${totalCount} ca học (${this.currentResult.totalPeriods || totalCount} tiết)
                </h4>
                <div style="display: flex; gap: 10px; margin-top: 2px; font-size: 0.76rem; font-weight: 600;">
                  <span style="color: #059669;">🟢 ${highCount} mục chắc chắn</span>
                  ${lowCount > 0 ? `<span style="color: #D97706;">🟡 ${lowCount} mục cần bạn xem lại</span>` : ''}
                </div>
              </div>
            </div>

            <span class="glass-pill" style="background: rgba(244,124,99,0.12); color: var(--primary); font-weight: 600; font-size: 0.78rem;">
              Độ chính xác: 96.8%
            </span>
          </div>
        </div>

        <div class="modal-body" style="padding: 14px 22px; max-height: 400px; overflow-y: auto;">
          <div style="background: rgba(255,255,255,0.7); border: 1px solid var(--glass-border); border-radius: var(--radius-md); overflow: hidden;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.8rem; text-align: left;">
              <thead>
                <tr style="background: rgba(255,255,255,0.9); border-bottom: 1px solid rgba(0,0,0,0.06);">
                  <th style="padding: 9px 10px; font-weight: 600; color: var(--text-secondary);">THỨ</th>
                  <th style="padding: 9px 10px; font-weight: 600; color: var(--text-secondary);">TIẾT</th>
                  <th style="padding: 9px 10px; font-weight: 600; color: var(--text-secondary);">GIỜ</th>
                  <th style="padding: 9px 10px; font-weight: 600; color: var(--text-secondary);">MÔN HỌC (AI ĐỌC & GỢI Ý)</th>
                  <th style="padding: 9px 10px; font-weight: 600; color: var(--text-secondary); text-align: right;">ĐỘ TIN CẬY</th>
                </tr>
              </thead>
              <tbody>
                ${rowsHtml}
              </tbody>
            </table>
          </div>
        </div>

        <div class="modal-footer" style="justify-content: space-between;">
          <button id="btn-conf-review-cancel" class="glass-button">Hủy bỏ</button>
          <button id="btn-conf-review-confirm" class="glass-button glass-button-primary" style="padding: 9px 20px;">
            <i data-lucide="check" style="width: 16px; height: 16px;"></i> Xác nhận & tạo Thời khóa biểu ngay
          </button>
        </div>
      </div>
    `;

    this.bindEvents();
    if (window.lucide) window.lucide.createIcons();
  },

  bindEvents() {
    document.getElementById('conf-review-close-x')?.addEventListener('click', () => this.close());
    document.getElementById('btn-conf-review-cancel')?.addEventListener('click', () => this.close());

    this.backdrop.querySelectorAll('.item-subject-input').forEach(input => {
      input.addEventListener('change', (e) => {
        const idx = Number(e.target.getAttribute('data-idx'));
        if (this.currentResult.items[idx]) {
          this.currentResult.items[idx].subjectName = e.target.value;
          this.currentResult.items[idx].needsReview = false;
          this.currentResult.items[idx].confidence = 100;
        }
      });
    });

    this.backdrop.querySelectorAll('.btn-quick-suggest').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = Number(e.currentTarget.getAttribute('data-idx'));
        const val = e.currentTarget.getAttribute('data-val');
        if (this.currentResult.items[idx]) {
          this.currentResult.items[idx].subjectName = val;
          this.currentResult.items[idx].needsReview = false;
          this.currentResult.items[idx].confidence = 100;
          this.renderUI();
        }
      });
    });

    document.getElementById('btn-conf-review-confirm')?.addEventListener('click', () => {
      const user = Storage.getUser();
      const schoolName = user.school || 'THPT Đông Anh';
      const className = this.currentResult.className || user.className || '11A2';

      const finalCourses = OCREngine.convertItemsToCourses(this.currentResult.items, className, schoolName);

      this.close();
      if (this.callbacks.onConfirmed) {
        this.callbacks.onConfirmed(finalCourses, className);
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
