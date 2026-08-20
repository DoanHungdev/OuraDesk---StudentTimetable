/**
 * TaskModal: Add and Edit Assignments / Deadlines
 */
export const TaskModal = {
  backdrop: null,
  callbacks: {},
  courses: [],

  init(callbacks = {}) {
    this.callbacks = callbacks;
    this.renderContainer();
  },

  renderContainer() {
    let el = document.getElementById('task-modal-backdrop');
    if (!el) {
      el = document.createElement('div');
      el.id = 'task-modal-backdrop';
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

  openAdd(courses) {
    this.courses = courses;
    this.renderForm('Thêm Bài Tập / Deadline Mới', {
      id: '',
      courseId: courses[0]?.id || '',
      title: '',
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      priority: 'medium',
      completed: false,
      notes: ''
    }, false);
    this.open();
  },

  openEdit(task, courses) {
    this.courses = courses;
    this.renderForm(`Chỉnh sửa bài tập: ${task.title}`, task, true);
    this.open();
  },

  renderForm(title, data, isEdit) {
    const courseOptions = this.courses.map(c => `
      <option value="${c.id}" ${data.courseId === c.id ? 'selected' : ''}>${c.name} (${c.code})</option>
    `).join('');

    this.backdrop.innerHTML = `
      <div class="modal-window" style="max-width: 500px;">
        <div class="modal-header">
          <h3 class="modal-title">${title}</h3>
          <button id="task-modal-close-x" class="icon-btn" style="width: 32px; height: 32px; font-size: 0.9rem;" aria-label="Đóng">&times;</button>
        </div>

        <form id="task-form" class="modal-body">
          <div>
            <label style="font-size: 0.78rem; font-weight: 700; color: var(--text-secondary); margin-bottom: 4px; display: block;">TÊN BÀI TẬP / NHIỆM VỤ *</label>
            <input type="text" id="task-title" class="glass-input" required value="${data.title || ''}" placeholder="VD: Báo cáo thực hành vi điều khiển...">
          </div>

          <div>
            <label style="font-size: 0.78rem; font-weight: 700; color: var(--text-secondary); margin-bottom: 4px; display: block;">MÔN HỌC *</label>
            <select id="task-course-id" class="glass-input">
              ${courseOptions}
            </select>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div>
              <label style="font-size: 0.78rem; font-weight: 700; color: var(--text-secondary); margin-bottom: 4px; display: block;">HẠN NỘP (DEADLINE) *</label>
              <input type="date" id="task-due-date" class="glass-input" required value="${data.dueDate || ''}">
            </div>
            <div>
              <label style="font-size: 0.78rem; font-weight: 700; color: var(--text-secondary); margin-bottom: 4px; display: block;">MỨC ĐỘ ƯU TIÊN</label>
              <select id="task-priority" class="glass-input">
                <option value="low" ${data.priority === 'low' ? 'selected' : ''}>Thấp (Low)</option>
                <option value="medium" ${data.priority === 'medium' ? 'selected' : ''}>Trung bình (Medium)</option>
                <option value="high" ${data.priority === 'high' ? 'selected' : ''}>Cao / Quan trọng (High)</option>
              </select>
            </div>
          </div>

          <div>
            <label style="font-size: 0.78rem; font-weight: 700; color: var(--text-secondary); margin-bottom: 4px; display: block;">GHI CHÚ CHI TIẾT</label>
            <textarea id="task-notes" class="glass-input" rows="2" placeholder="Yêu cầu cụ thể, link tài liệu...">${data.notes || ''}</textarea>
          </div>
        </form>

        <div class="modal-footer">
          <button id="task-cancel-btn" class="glass-button">Hủy</button>
          <button id="task-save-btn" class="glass-button glass-button-primary">
            <i class="fa-solid fa-check"></i> ${isEdit ? 'Lưu Bài Tập' : 'Thêm Bài Tập'}
          </button>
        </div>
      </div>
    `;

    document.getElementById('task-modal-close-x')?.addEventListener('click', () => this.close());
    document.getElementById('task-cancel-btn')?.addEventListener('click', () => this.close());

    document.getElementById('task-save-btn')?.addEventListener('click', () => {
      const taskTitle = document.getElementById('task-title')?.value.trim();
      const courseId = document.getElementById('task-course-id')?.value;
      const dueDate = document.getElementById('task-due-date')?.value;
      const priority = document.getElementById('task-priority')?.value || 'medium';
      const notes = document.getElementById('task-notes')?.value.trim();

      if (!taskTitle || !dueDate) {
        alert('Vui lòng nhập tên bài tập và hạn nộp.');
        return;
      }

      const selectedCourse = this.courses.find(c => c.id === courseId);

      const savedTask = {
        id: data.id || ('asg-' + Date.now()),
        courseId,
        courseName: selectedCourse ? selectedCourse.name : 'Môn học',
        courseCode: selectedCourse ? selectedCourse.code : '',
        color: selectedCourse ? selectedCourse.color : '#AFC8F5',
        title: taskTitle,
        dueDate,
        priority,
        completed: data.completed || false,
        notes
      };

      this.close();
      if (this.callbacks.onSave) {
        this.callbacks.onSave(savedTask, isEdit);
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
