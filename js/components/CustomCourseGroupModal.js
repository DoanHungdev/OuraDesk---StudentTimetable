/**
 * CustomCourseGroupModal Component: Add Custom Course Group to Active Curriculum
 */
import { CurriculumEngine } from '../utils/curriculumEngine.js';
import { Toast } from './Toast.js';

export const CustomCourseGroupModal = {
  backdrop: null,
  callbacks: {},

  init(callbacks = {}) {
    this.callbacks = callbacks;
    this.renderContainer();
  },

  renderContainer() {
    let el = document.getElementById('custom-course-group-modal-backdrop');
    if (!el) {
      el = document.createElement('div');
      el.id = 'custom-course-group-modal-backdrop';
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
    const activeState = CurriculumEngine.getActiveCurriculumState();
    this.renderUI(activeState);
    this.open();
  },

  renderUI(activeState) {
    const colorPresets = [
      { code: '#AFC8F5', name: 'Pastel Blue' },
      { code: '#A9DED5', name: 'Pastel Mint' },
      { code: '#F5B28D', name: 'Pastel Orange' },
      { code: '#C7B7F4', name: 'Pastel Purple' },
      { code: '#F4B5C2', name: 'Pastel Rose' },
      { code: '#F7D99A', name: 'Pastel Amber' }
    ];

    const colorPillsHtml = colorPresets.map((c, idx) => `
      <label style="cursor: pointer; display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: var(--radius-sm); background: ${c.code}; border: 2px solid ${idx === 0 ? 'var(--color-primary)' : 'transparent'};">
        <input type="radio" name="group-color" value="${c.code}" ${idx === 0 ? 'checked' : ''} style="display: none;">
        <span style="font-size: 0.74rem; font-weight: 700; color: #1F2937;">${c.name}</span>
      </label>
    `).join('');

    this.backdrop.innerHTML = `
      <div class="modal-window fade-in-lift" style="max-width: 520px; border-radius: var(--radius-xl); overflow: hidden; border: 1px solid var(--color-glass-border); box-shadow: 0 20px 48px var(--color-shadow);">
        <!-- Header -->
        <div class="modal-header" style="background: linear-gradient(135deg, rgba(139,92,246,0.15) 0%, var(--color-glass) 100%); padding: 18px 24px; border-bottom: 1px solid var(--color-glass-border);">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 44px; height: 44px; border-radius: var(--radius-md); background: linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 1.3rem; box-shadow: 0 4px 12px rgba(139,92,246,0.3); flex-shrink: 0;">
              ✨
            </div>
            <div>
              <h3 class="modal-title" style="font-size: 1.18rem; font-weight: 700; color: var(--color-text); line-height: 1.25;">Thêm Nhóm Học Phần Mới</h3>
              <p style="font-size: 0.78rem; color: var(--color-text-secondary); margin-top: 2px;">
                Bổ sung nhóm học phần vào khung CTĐT ${activeState.curriculum.name}
              </p>
            </div>
          </div>
          <button id="group-modal-close-x" class="icon-btn" style="width: 32px; height: 32px; font-size: 1rem;" aria-label="Đóng">&times;</button>
        </div>

        <!-- Body -->
        <form id="custom-group-form" class="modal-body custom-scroll" style="padding: 20px 24px; max-height: 60vh; overflow-y: auto; display: flex; flex-direction: column; gap: 14px;">
          <div>
            <label style="font-size: 0.76rem; font-weight: 700; color: var(--color-text-secondary); text-transform: uppercase; margin-bottom: 4px; display: block;">
              TÊN NHÓM HỌC PHẦN *
            </label>
            <input type="text" id="grp-name-input" class="glass-input" placeholder="vd: Chuyên ngành hẹp AI & Big Data, Tự chọn tự do..." required>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div>
              <label style="font-size: 0.76rem; font-weight: 700; color: var(--color-text-secondary); text-transform: uppercase; margin-bottom: 4px; display: block;">
                MÃ VIẾT TẮT
              </label>
              <input type="text" id="grp-code-input" class="glass-input" placeholder="vd: AI, BD, TC" style="text-transform: uppercase;">
            </div>
            <div>
              <label style="font-size: 0.76rem; font-weight: 700; color: var(--color-text-secondary); text-transform: uppercase; margin-bottom: 4px; display: block;">
                SỐ TÍN CHỈ YÊU CẦU
              </label>
              <input type="number" id="grp-credits-input" class="glass-input" value="12" min="1" max="60">
            </div>
          </div>

          <div>
            <label style="font-size: 0.76rem; font-weight: 700; color: var(--color-text-secondary); text-transform: uppercase; margin-bottom: 4px; display: block;">
              MÔ TẢ / ĐỊNH HƯỚNG
            </label>
            <textarea id="grp-desc-input" class="glass-input" rows="2" placeholder="vd: Khối kiến thức định hướng nghề nghiệp kỹ sư phần mềm..."></textarea>
          </div>

          <div>
            <label style="font-size: 0.76rem; font-weight: 700; color: var(--color-text-secondary); text-transform: uppercase; margin-bottom: 6px; display: block;">
              MÀU ĐÁNH DẤU NHÓM
            </label>
            <div id="group-color-pill-container" style="display: flex; gap: 6px; flex-wrap: wrap;">
              ${colorPillsHtml}
            </div>
          </div>
        </form>

        <!-- Footer -->
        <div class="modal-footer" style="padding: 14px 24px; background: var(--color-glass); border-top: 1px solid var(--color-glass-border); display: flex; justify-content: space-between; align-items: center;">
          <button id="btn-group-modal-cancel" class="glass-button" style="padding: 8px 16px;">Hủy bỏ</button>
          <button id="btn-group-modal-save" class="glass-button glass-button-primary" style="padding: 8px 22px; font-weight: 700; background: linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%);">
            <i data-lucide="check" style="width: 15px; height: 15px;"></i> Lưu Nhóm Học Phần
          </button>
        </div>
      </div>
    `;

    this.bindEvents(activeState);
    if (window.lucide) window.lucide.createIcons();
  },

  bindEvents(activeState) {
    this.backdrop.querySelector('#group-modal-close-x')?.addEventListener('click', () => this.close());
    this.backdrop.querySelector('#btn-group-modal-cancel')?.addEventListener('click', () => this.close());

    // Color radios
    const colorLabels = this.backdrop.querySelectorAll('#group-color-pill-container label');
    colorLabels.forEach(label => {
      label.addEventListener('click', () => {
        colorLabels.forEach(l => l.style.borderColor = 'transparent');
        label.style.borderColor = 'var(--color-primary)';
        const radio = label.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;
      });
    });

    // Save
    this.backdrop.querySelector('#btn-group-modal-save')?.addEventListener('click', () => {
      const name = this.backdrop.querySelector('#grp-name-input')?.value.trim();
      if (!name) {
        alert('Vui lòng nhập tên nhóm học phần.');
        return;
      }

      const code = this.backdrop.querySelector('#grp-code-input')?.value.trim().toUpperCase() || name.substring(0, 3).toUpperCase();
      const credits = Number(this.backdrop.querySelector('#grp-credits-input')?.value || 12);
      const description = this.backdrop.querySelector('#grp-desc-input')?.value.trim();
      const color = this.backdrop.querySelector('input[name="group-color"]:checked')?.value || '#AFC8F5';

      const newGroup = CurriculumEngine.addCustomCourseGroup(activeState.curriculumId, {
        name,
        code,
        requiredCredits: credits,
        description,
        color
      });

      this.close();
      Toast.show(`Đã thêm nhóm "${name}" vào khung CTĐT! 🎉`, 'success');

      if (this.callbacks.onGroupAdded) {
        this.callbacks.onGroupAdded(newGroup);
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
