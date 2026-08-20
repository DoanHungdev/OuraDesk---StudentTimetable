/**
 * ClassCodeShareModal: Share Class Timetable via Code & QR
 * Uses Lucide Icons & Clean Typography
 */
import { ShareEngine } from '../utils/shareEngine.js';
import { Storage } from '../utils/storage.js';

export const ClassCodeShareModal = {
  backdrop: null,
  callbacks: {},

  init(callbacks = {}) {
    this.callbacks = callbacks;
    this.renderContainer();
  },

  renderContainer() {
    let el = document.getElementById('class-code-share-modal-backdrop');
    if (!el) {
      el = document.createElement('div');
      el.id = 'class-code-share-modal-backdrop';
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

  openModal(courses) {
    const user = Storage.getUser();
    const mode = Storage.getMode();
    const isTHPT = mode === 'high_school';
    const week = Storage.getActiveWeek();
    const shareCode = isTHPT 
      ? ShareEngine.generateClassCode('DA', user.className || '11A2', week.replace(/\s+/g, ''))
      : ShareEngine.generateClassCode('HAUI', 'K20', week.replace(/\s+/g, ''));

    this.backdrop.innerHTML = `
      <div class="modal-window" style="max-width: 480px; text-align: center;">
        <div class="modal-header">
          <div>
            <h3 class="modal-title">Chia sẻ Thời khóa biểu</h3>
            <p style="font-size: 0.78rem; color: var(--text-secondary);">Gửi cho bạn bè để đồng bộ TKB chỉ trong 1 giây</p>
          </div>
          <button id="share-code-close-x" class="icon-btn" style="width: 30px; height: 30px; font-size: 0.85rem;" aria-label="Đóng">&times;</button>
        </div>

        <div class="modal-body" style="padding: 18px; display: flex; flex-direction: column; align-items: center; gap: 14px;">
          <!-- QR Code Canvas / Box -->
          <div style="background: white; padding: 16px; border-radius: var(--radius-lg); box-shadow: 0 4px 16px rgba(0,0,0,0.06); border: 1px solid var(--glass-border);">
            <svg width="160" height="160" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="100" height="100" fill="white"/>
              <!-- Simulated QR Matrix -->
              <rect x="10" y="10" width="25" height="25" fill="#1F2937"/>
              <rect x="15" y="15" width="15" height="15" fill="white"/>
              <rect x="18" y="18" width="9" height="9" fill="#F47C63"/>

              <rect x="65" y="10" width="25" height="25" fill="#1F2937"/>
              <rect x="70" y="15" width="15" height="15" fill="white"/>
              <rect x="73" y="18" width="9" height="9" fill="#F47C63"/>

              <rect x="10" y="65" width="25" height="25" fill="#1F2937"/>
              <rect x="15" y="70" width="15" height="15" fill="white"/>
              <rect x="18" y="73" width="9" height="9" fill="#F47C63"/>

              <!-- Dots -->
              <rect x="42" y="15" width="6" height="6" fill="#1F2937"/>
              <rect x="52" y="25" width="6" height="6" fill="#1F2937"/>
              <rect x="42" y="42" width="16" height="16" fill="#F47C63" rx="4"/>
              <rect x="65" y="45" width="6" height="6" fill="#1F2937"/>
              <rect x="75" y="55" width="6" height="6" fill="#1F2937"/>
              <rect x="45" y="70" width="6" height="6" fill="#1F2937"/>
              <rect x="65" y="75" width="6" height="6" fill="#1F2937"/>
              <rect x="75" y="80" width="12" height="6" fill="#1F2937"/>
            </svg>
          </div>

          <!-- Share Code Display -->
          <div style="background: rgba(255,255,255,0.85); border: 2px dashed var(--primary); border-radius: var(--radius-md); padding: 12px 18px; width: 100%;">
            <div style="font-size: 0.72rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase;">MÃ CHIA SẺ</div>
            <div id="display-share-code" style="font-size: 1.5rem; font-weight: 700; color: var(--primary); letter-spacing: 0.05em; margin: 3px 0;">
              ${shareCode}
            </div>
            <p style="font-size: 0.76rem; color: var(--text-secondary);">
              ${isTHPT ? `Lớp <strong>${user.className || '11A2'}</strong> · ${courses.length} môn học` : `${user.university || 'HaUI'} · ${courses.length} học phần`}
            </p>
          </div>
        </div>

        <div class="modal-footer" style="justify-content: space-between;">
          <button id="btn-share-close" class="glass-button">Đóng</button>
          <button id="btn-copy-share-code" class="glass-button glass-button-primary">
            <i data-lucide="copy" style="width: 15px; height: 15px;"></i> Sao chép mã
          </button>
        </div>
      </div>
    `;

    document.getElementById('share-code-close-x')?.addEventListener('click', () => this.close());
    document.getElementById('btn-share-close')?.addEventListener('click', () => this.close());
    document.getElementById('btn-copy-share-code')?.addEventListener('click', () => {
      navigator.clipboard.writeText(shareCode);
      alert(`Đã sao chép mã "${shareCode}" vào bộ nhớ tạm!`);
    });

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
