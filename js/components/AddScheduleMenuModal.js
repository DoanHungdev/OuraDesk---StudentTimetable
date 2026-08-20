/**
 * AddScheduleMenuModal: Unified "＋ Thêm lịch học" Action Hub
 * Displays 4 co-existing methods to create/import schedules:
 * 1. ✍️ Nhập thủ công (Manual Entry)
 * 2. 📷 Nhập từ ảnh / AI (AI OCR from photo/screenshot/Zalo)
 * 3. 📄 Nhập PDF / Excel (File import)
 * 4. ✨ Tự động xếp lịch (Smart Auto-scheduler)
 */
export const AddScheduleMenuModal = {
  backdrop: null,
  callbacks: {},

  init(callbacks = {}) {
    this.callbacks = callbacks;
    this.renderContainer();
  },

  renderContainer() {
    let el = document.getElementById('add-schedule-menu-backdrop');
    if (!el) {
      el = document.createElement('div');
      el.id = 'add-schedule-menu-backdrop';
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
    this.renderUI();
    this.open();
  },

  renderUI() {
    this.backdrop.innerHTML = `
      <div class="modal-window fade-in-lift" style="max-width: 520px; border-radius: var(--radius-xl); overflow: hidden; border: 1px solid var(--color-glass-border); box-shadow: 0 16px 40px var(--color-shadow);">
        <div class="modal-header" style="background: linear-gradient(135deg, var(--primary-light) 0%, var(--color-glass) 100%); padding: 18px 22px; border-bottom: 1px solid var(--color-glass-border);">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 42px; height: 42px; border-radius: var(--radius-md); background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 1.2rem; box-shadow: 0 4px 12px var(--primary-glow); flex-shrink: 0;">
              <i data-lucide="plus-circle" style="width: 22px; height: 22px;"></i>
            </div>
            <div>
              <h3 class="modal-title" style="font-size: 1.15rem; font-weight: 700; color: var(--color-text); line-height: 1.25;">Thêm thời khóa biểu</h3>
              <p style="font-size: 0.78rem; color: var(--color-text-secondary); margin-top: 2px;">Chọn phương thức thêm hoặc nhập lịch học phù hợp với bạn</p>
            </div>
          </div>
          <button id="add-menu-close-x" class="icon-btn" style="width: 32px; height: 32px; font-size: 1rem;" aria-label="Đóng">&times;</button>
        </div>

        <div class="modal-body" style="padding: 16px 20px; display: flex; flex-direction: column; gap: 10px;">
          <!-- Option 1: Manual Entry (Primary) -->
          <div class="add-menu-option-card" id="opt-menu-manual" role="button" tabindex="0" style="display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; background: var(--color-card-background); border: 2px solid var(--color-primary); border-radius: var(--radius-lg); cursor: pointer; transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);">
            <div style="display: flex; align-items: center; gap: 14px;">
              <div style="width: 44px; height: 44px; border-radius: var(--radius-md); background: var(--primary-light); color: var(--color-primary); display: flex; align-items: center; justify-content: center; font-size: 1.3rem; flex-shrink: 0;">
                ✍️
              </div>
              <div>
                <div style="display: flex; align-items: center; gap: 6px;">
                  <h4 style="font-size: 0.98rem; font-weight: 700; color: var(--color-text);">Nhập thủ công</h4>
                  <span class="glass-pill" style="font-size: 0.68rem; font-weight: 700; background: var(--color-primary); color: white; padding: 1px 6px;">Phổ biến</span>
                </div>
                <p style="font-size: 0.8rem; color: var(--color-text-secondary); margin-top: 2px;">Tự thêm từng môn, chọn tiết trên bảng hoặc nhập nhanh dạng text</p>
              </div>
            </div>
            <i data-lucide="chevron-right" style="color: var(--color-primary); width: 18px; height: 18px; flex-shrink: 0;"></i>
          </div>

          <!-- Option 2: AI Photo Import -->
          <div class="add-menu-option-card" id="opt-menu-ai-photo" role="button" tabindex="0" style="display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; background: var(--color-card-background); border: 1px solid var(--color-glass-border); border-radius: var(--radius-lg); cursor: pointer; transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);">
            <div style="display: flex; align-items: center; gap: 14px;">
              <div style="width: 44px; height: 44px; border-radius: var(--radius-md); background: rgba(59,130,246,0.12); color: #3B82F6; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; flex-shrink: 0;">
                📷
              </div>
              <div>
                <h4 style="font-size: 0.98rem; font-weight: 700; color: var(--color-text);">Nhập từ ảnh / AI</h4>
                <p style="font-size: 0.8rem; color: var(--color-text-secondary); margin-top: 2px;">AI quét ảnh chụp TKB Zalo, ảnh màn hình hoặc ảnh trường</p>
              </div>
            </div>
            <i data-lucide="chevron-right" style="color: var(--color-text-secondary); width: 18px; height: 18px; flex-shrink: 0;"></i>
          </div>

          <!-- Option 3: PDF / Excel Import -->
          <div class="add-menu-option-card" id="opt-menu-file" role="button" tabindex="0" style="display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; background: var(--color-card-background); border: 1px solid var(--color-glass-border); border-radius: var(--radius-lg); cursor: pointer; transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);">
            <div style="display: flex; align-items: center; gap: 14px;">
              <div style="width: 44px; height: 44px; border-radius: var(--radius-md); background: rgba(16,185,129,0.12); color: #10B981; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; flex-shrink: 0;">
                📄
              </div>
              <div>
                <h4 style="font-size: 0.98rem; font-weight: 700; color: var(--color-text);">Nhập PDF / Excel</h4>
                <p style="font-size: 0.8rem; color: var(--color-text-secondary); margin-top: 2px;">Tải file thời khóa biểu .pdf, .xlsx hoặc ma trận lớp</p>
              </div>
            </div>
            <i data-lucide="chevron-right" style="color: var(--color-text-secondary); width: 18px; height: 18px; flex-shrink: 0;"></i>
          </div>

          <!-- Option 4: Auto Scheduler -->
          <div class="add-menu-option-card" id="opt-menu-auto" role="button" tabindex="0" style="display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; background: var(--color-card-background); border: 1px solid var(--color-glass-border); border-radius: var(--radius-lg); cursor: pointer; transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);">
            <div style="display: flex; align-items: center; gap: 14px;">
              <div style="width: 44px; height: 44px; border-radius: var(--radius-md); background: rgba(168,85,247,0.12); color: #A855F7; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; flex-shrink: 0;">
                ✨
              </div>
              <div>
                <h4 style="font-size: 0.98rem; font-weight: 700; color: var(--color-text);">Tự động xếp lịch thông minh</h4>
                <p style="font-size: 0.8rem; color: var(--color-text-secondary); margin-top: 2px;">App tự tính toán các phương án xếp lịch tối ưu ca học và ngày nghỉ</p>
              </div>
            </div>
            <i data-lucide="chevron-right" style="color: var(--color-text-secondary); width: 18px; height: 18px; flex-shrink: 0;"></i>
          </div>
        </div>

        <div class="modal-footer" style="padding: 12px 20px; background: var(--color-glass); border-top: 1px solid var(--color-glass-border); justify-content: flex-end;">
          <button id="btn-add-menu-cancel" class="glass-button" style="padding: 8px 16px; font-weight: 600;">Đóng</button>
        </div>
      </div>
    `;

    this.bindEvents();
    if (window.lucide) window.lucide.createIcons();
  },

  bindEvents() {
    this.backdrop.querySelector('#add-menu-close-x')?.addEventListener('click', () => this.close());
    this.backdrop.querySelector('#btn-add-menu-cancel')?.addEventListener('click', () => this.close());

    // Option 1: Manual Entry
    this.backdrop.querySelector('#opt-menu-manual')?.addEventListener('click', () => {
      this.close();
      if (this.callbacks.onManualEntry) this.callbacks.onManualEntry();
    });

    // Option 2: AI Photo Import
    this.backdrop.querySelector('#opt-menu-ai-photo')?.addEventListener('click', () => {
      this.close();
      if (this.callbacks.onAIPhoto) this.callbacks.onAIPhoto();
    });

    // Option 3: PDF/Excel File Import
    this.backdrop.querySelector('#opt-menu-file')?.addEventListener('click', () => {
      this.close();
      if (this.callbacks.onFileImport) this.callbacks.onFileImport();
    });

    // Option 4: Auto Scheduler
    this.backdrop.querySelector('#opt-menu-auto')?.addEventListener('click', () => {
      this.close();
      if (this.callbacks.onAutoSchedule) this.callbacks.onAutoSchedule();
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
