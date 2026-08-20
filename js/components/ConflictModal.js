/**
 * ConflictModal: Schedule conflict warning and smart alternative suggester
 */
import { TimetableEngine } from '../utils/timetableEngine.js';
import { DAY_NAMES } from '../data/mockData.js';

export const ConflictModal = {
  backdrop: null,
  callbacks: {},

  init(callbacks = {}) {
    this.callbacks = callbacks;
    this.renderContainer();
  },

  renderContainer() {
    let el = document.getElementById('conflict-modal-backdrop');
    if (!el) {
      el = document.createElement('div');
      el.id = 'conflict-modal-backdrop';
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

  openConflict(conflict, allCourses) {
    const dayInfo = DAY_NAMES.find(d => d.day === conflict.day) || DAY_NAMES[0];
    const suggestions = TimetableEngine.suggestAlternativeSlots(conflict.itemB, allCourses);

    const suggestionItems = suggestions.map((sug, idx) => {
      const sugDay = DAY_NAMES.find(d => d.day === sug.day) || DAY_NAMES[0];
      return `
        <div style="background: rgba(255,255,255,0.75); border: 1px solid var(--glass-border); border-radius: var(--radius-md); padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <div>
            <div style="font-size: 0.88rem; font-weight: 700; color: var(--text-main);">
              <i class="fa-regular fa-clock" style="color: #10B981; margin-right: 6px;"></i>
              ${sugDay.name} (${sug.startTime} – ${sug.endTime})
            </div>
            <div style="font-size: 0.76rem; color: var(--text-secondary); margin-top: 2px;">
              Không trùng môn nào • Đảm bảo đủ thời lượng
            </div>
          </div>
          <button class="glass-button glass-button-primary btn-apply-suggestion" data-sug-idx="${idx}" style="padding: 6px 12px; font-size: 0.8rem;">
            Áp dụng giờ này
          </button>
        </div>
      `;
    }).join('');

    this.backdrop.innerHTML = `
      <div class="modal-window" style="max-width: 560px;">
        <div class="modal-header" style="border-bottom: 2px solid #EF4444;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 36px; height: 36px; border-radius: var(--radius-md); background: #FEF2F2; color: #EF4444; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; border: 1px solid #FECACA;">
              <i class="fa-solid fa-triangle-exclamation"></i>
            </div>
            <div>
              <h3 class="modal-title" style="color: #991B1B;">Phát Hiện Trùng Lịch Học!</h3>
              <p style="font-size: 0.76rem; color: var(--text-secondary);">${dayInfo.name} • Trùng nhau khoảng ${conflict.overlapStart} – ${conflict.overlapEnd}</p>
            </div>
          </div>
          <button id="conflict-close-x" class="icon-btn" style="width: 32px; height: 32px; font-size: 0.9rem;" aria-label="Đóng">&times;</button>
        </div>

        <div class="modal-body" style="gap: 16px;">
          <!-- 2 Conflicting courses compared -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div style="background: ${conflict.itemA.courseColor || '#AFC8F5'}; padding: 12px; border-radius: var(--radius-md); border: 2px solid #EF4444;">
              <div style="font-size: 0.7rem; font-weight: 800; color: #991B1B; text-transform: uppercase;">Môn 1</div>
              <div style="font-size: 0.92rem; font-weight: 800; color: #1F2937; margin-top: 2px;">${conflict.itemA.courseName}</div>
              <div style="font-size: 0.78rem; font-weight: 700; color: #374151; margin-top: 4px;">
                <i class="fa-regular fa-clock"></i> ${conflict.itemA.startTime} – ${conflict.itemA.endTime}
              </div>
              <div style="font-size: 0.72rem; color: #4B5563;">${conflict.itemA.room || 'Phòng học'}</div>
            </div>

            <div style="background: ${conflict.itemB.courseColor || '#F7D99A'}; padding: 12px; border-radius: var(--radius-md); border: 2px solid #EF4444;">
              <div style="font-size: 0.7rem; font-weight: 800; color: #991B1B; text-transform: uppercase;">Môn 2 (Trùng)</div>
              <div style="font-size: 0.92rem; font-weight: 800; color: #1F2937; margin-top: 2px;">${conflict.itemB.courseName}</div>
              <div style="font-size: 0.78rem; font-weight: 700; color: #374151; margin-top: 4px;">
                <i class="fa-regular fa-clock"></i> ${conflict.itemB.startTime} – ${conflict.itemB.endTime}
              </div>
              <div style="font-size: 0.72rem; color: #4B5563;">${conflict.itemB.room || 'Phòng học'}</div>
            </div>
          </div>

          <!-- Suggested Alternatives -->
          <div>
            <div style="font-size: 0.82rem; font-weight: 700; color: var(--text-main); margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
              <i class="fa-solid fa-wand-magic-sparkles" style="color: var(--primary);"></i>
              GỢI Ý KHUNG GIỜ THAY THẾ CHO "${conflict.itemB.courseName}":
            </div>
            ${suggestionItems.length > 0 ? suggestionItems : '<p style="font-size: 0.82rem; color: var(--text-muted);">Không tìm thấy khung giờ trống phù hợp trong tuần.</p>'}
          </div>
        </div>

        <div class="modal-footer">
          <button id="btn-close-conflict" class="glass-button">Đóng</button>
        </div>
      </div>
    `;

    document.getElementById('conflict-close-x')?.addEventListener('click', () => this.close());
    document.getElementById('btn-close-conflict')?.addEventListener('click', () => this.close());

    this.backdrop.querySelectorAll('.btn-apply-suggestion').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = Number(e.currentTarget.getAttribute('data-sug-idx'));
        const chosenSug = suggestions[idx];
        if (chosenSug && this.callbacks.onResolve) {
          this.callbacks.onResolve(conflict.itemB.courseId, conflict.itemB.id, chosenSug);
          this.close();
        }
      });
    });

    this.open();
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
