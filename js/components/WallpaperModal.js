/**
 * WallpaperModal: Export Timetable as 9:16 Phone Wallpaper
 * Uses Lucide Icons & Clean Typography
 */
import { WallpaperExporter } from '../utils/wallpaperExporter.js';
import { Storage } from '../utils/storage.js';

export const WallpaperModal = {
  backdrop: null,
  callbacks: {},

  init(callbacks = {}) {
    this.callbacks = callbacks;
    this.renderContainer();
  },

  renderContainer() {
    let el = document.getElementById('wallpaper-modal-backdrop');
    if (!el) {
      el = document.createElement('div');
      el.id = 'wallpaper-modal-backdrop';
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
    const dataUrl = WallpaperExporter.generateWallpaperBlob(courses, user, mode);

    this.backdrop.innerHTML = `
      <div class="modal-window" style="max-width: 500px; text-align: center;">
        <div class="modal-header">
          <div>
            <h3 class="modal-title" style="display: flex; align-items: center; gap: 8px;">
              <i data-lucide="smartphone" style="color: var(--primary); width: 18px; height: 18px;"></i>
              Hình nền điện thoại Thời khóa biểu (9:16)
            </h3>
            <p style="font-size: 0.78rem; color: var(--text-secondary);">Thiết kế Soft Glassmorphism chuẩn màn hình khóa iPhone & Android</p>
          </div>
          <button id="wp-close-x" class="icon-btn" style="width: 30px; height: 30px; font-size: 0.85rem;" aria-label="Đóng">&times;</button>
        </div>

        <div class="modal-body" style="padding: 14px; display: flex; flex-direction: column; align-items: center;">
          <div style="width: 230px; height: 408px; border-radius: 26px; overflow: hidden; border: 3px solid #1F2937; box-shadow: 0 10px 25px rgba(0,0,0,0.12); background: #000;">
            <img src="${dataUrl}" alt="Hình nền điện thoại TKB" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
          <p style="font-size: 0.78rem; color: var(--text-secondary); margin-top: 10px;">
            Ảnh đã được tạo tự động với độ phân giải cao 1080 × 1920 px.
          </p>
        </div>

        <div class="modal-footer" style="justify-content: space-between;">
          <button id="btn-wp-cancel" class="glass-button">Đóng</button>
          <a id="btn-wp-download" href="${dataUrl}" download="ClassSchedule_Wallpaper_${user.name || 'TKB'}.png" class="glass-button glass-button-primary">
            <i data-lucide="download" style="width: 15px; height: 15px;"></i> Tải ảnh hình nền về máy
          </a>
        </div>
      </div>
    `;

    document.getElementById('wp-close-x')?.addEventListener('click', () => this.close());
    document.getElementById('btn-wp-cancel')?.addEventListener('click', () => this.close());

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
