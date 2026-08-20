/**
 * SearchModal: Global Search & Command Palette (⌘K)
 */
export const SearchModal = {
  backdrop: null,
  callbacks: {},
  courses: [],
  assignments: [],

  init(callbacks = {}) {
    this.callbacks = callbacks;
    this.renderContainer();
    this.bindKeyboardShortcut();
  },

  bindKeyboardShortcut() {
    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.openModal();
      }
    });
  },

  renderContainer() {
    let el = document.getElementById('search-modal-backdrop');
    if (!el) {
      el = document.createElement('div');
      el.id = 'search-modal-backdrop';
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

  openModal(courses = [], assignments = []) {
    this.courses = courses;
    this.assignments = assignments;

    this.backdrop.innerHTML = `
      <div class="modal-window" style="max-width: 580px; margin-top: 10vh;">
        <div style="padding: 16px 20px; border-bottom: 1px solid rgba(0,0,0,0.06); display: flex; align-items: center; gap: 12px;">
          <i class="fa-solid fa-magnifying-glass" style="color: var(--primary); font-size: 1.1rem;"></i>
          <input type="text" id="global-search-input" class="glass-input" style="border: none; background: transparent; font-size: 1.05rem; padding: 0; box-shadow: none;" placeholder="Tìm kiếm môn học, giảng viên, phòng học, bài tập... (nhập từ khóa)">
          <kbd style="font-size: 0.72rem; padding: 3px 6px; background: rgba(0,0,0,0.05); border-radius: 4px; color: var(--text-muted);">ESC để đóng</kbd>
        </div>

        <div id="search-results-list" style="max-height: 380px; overflow-y: auto; padding: 12px;">
          <div style="font-size: 0.8rem; color: var(--text-muted); text-align: center; padding: 20px;">
            Gõ tên môn học, mã môn (vd: MAT101), tên giảng viên hoặc phòng học để tìm nhanh...
          </div>
        </div>
      </div>
    `;

    this.open();

    const input = document.getElementById('global-search-input');
    if (input) {
      input.focus();
      input.addEventListener('input', (e) => this.handleSearch(e.target.value));
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') this.close();
      });
    }
  },

  handleSearch(query) {
    const listEl = document.getElementById('search-results-list');
    if (!listEl) return;

    const q = query.trim().toLowerCase();
    if (!q) {
      listEl.innerHTML = `
        <div style="font-size: 0.8rem; color: var(--text-muted); text-align: center; padding: 20px;">
          Gõ tên môn học, mã môn, tên giảng viên hoặc phòng học để tìm nhanh...
        </div>
      `;
      return;
    }

    const matchedCourses = this.courses.filter(c => 
      c.name.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      (c.teacher && c.teacher.toLowerCase().includes(q)) ||
      (c.room && c.room.toLowerCase().includes(q))
    );

    const matchedTasks = this.assignments.filter(t =>
      t.title.toLowerCase().includes(q) ||
      (t.courseName && t.courseName.toLowerCase().includes(q))
    );

    if (matchedCourses.length === 0 && matchedTasks.length === 0) {
      listEl.innerHTML = `
        <div style="font-size: 0.84rem; color: var(--text-muted); text-align: center; padding: 24px;">
          Không tìm thấy kết quả phù hợp cho "<strong>${query}</strong>"
        </div>
      `;
      return;
    }

    let html = '';

    if (matchedCourses.length > 0) {
      html += `
        <div style="font-size: 0.72rem; font-weight: 800; color: var(--text-secondary); text-transform: uppercase; margin: 6px 8px 8px 8px;">
          Môn học (${matchedCourses.length})
        </div>
      `;
      html += matchedCourses.map(c => `
        <div class="search-result-item" data-course-id="${c.id}" style="padding: 10px 12px; border-radius: var(--radius-sm); background: rgba(255,255,255,0.7); border: 1px solid var(--glass-border); margin-bottom: 6px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; transition: all 0.15s ease;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 8px; height: 32px; border-radius: 4px; background: ${c.color};"></div>
            <div>
              <div style="font-size: 0.88rem; font-weight: 700; color: var(--text-main);">${c.name}</div>
              <div style="font-size: 0.75rem; color: var(--text-secondary);">
                ${c.code} • ${c.credits} tín chỉ • ${c.teacher || 'Chưa rõ GV'} • ${c.room || ''}
              </div>
            </div>
          </div>
          <i class="fa-solid fa-chevron-right" style="font-size: 0.75rem; color: var(--text-muted);"></i>
        </div>
      `).join('');
    }

    if (matchedTasks.length > 0) {
      html += `
        <div style="font-size: 0.72rem; font-weight: 800; color: var(--text-secondary); text-transform: uppercase; margin: 12px 8px 8px 8px;">
          Bài tập & Deadline (${matchedTasks.length})
        </div>
      `;
      html += matchedTasks.map(t => `
        <div class="search-result-task" data-task-id="${t.id}" style="padding: 10px 12px; border-radius: var(--radius-sm); background: rgba(255,255,255,0.7); border: 1px solid var(--glass-border); margin-bottom: 6px; cursor: pointer; display: flex; align-items: center; justify-content: space-between;">
          <div>
            <div style="font-size: 0.86rem; font-weight: 700; color: var(--text-main);">${t.title}</div>
            <div style="font-size: 0.74rem; color: var(--text-secondary);">${t.courseName} • Hạn nộp: ${t.dueDate}</div>
          </div>
          <span class="glass-pill" style="font-size: 0.7rem; background: ${t.priority === 'high' ? '#FEE2E2' : '#FEF3C7'}; color: #991B1B;">
            ${t.priority === 'high' ? 'Ưu tiên cao' : 'Bình thường'}
          </span>
        </div>
      `).join('');
    }

    listEl.innerHTML = html;

    listEl.querySelectorAll('.search-result-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-course-id');
        const course = this.courses.find(c => c.id === id);
        this.close();
        if (course && this.callbacks.onSelectCourse) {
          this.callbacks.onSelectCourse(course);
        }
      });
    });
  },

  open() {
    if (this.backdrop) {
      this.backdrop.classList.add('open');
      if (window.lucide) window.lucide.createIcons();
    }
  },

  close() {
    if (this.backdrop) this.backdrop.classList.remove('open');
  }
};
