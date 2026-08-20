/**
 * ExamModal Component: Add, Edit & Manage Exam / Test Schedules
 * Types: 15 phút, 45 phút, Giữa kỳ, Cuối kỳ, Thi thử THPT
 * Uses Lucide Icons & Centralized Design System
 */

export const ExamModal = {
  backdrop: null,
  isEdit: false,
  editingExamId: null,
  courses: [],
  onSave: null,
  onDelete: null,

  init({ onSave, onDelete }) {
    this.onSave = onSave;
    this.onDelete = onDelete;

    let modalBackdrop = document.getElementById('exam-modal-backdrop');
    if (!modalBackdrop) {
      modalBackdrop = document.createElement('div');
      modalBackdrop.id = 'exam-modal-backdrop';
      modalBackdrop.className = 'modal-backdrop';
      document.body.appendChild(modalBackdrop);
    }
    this.backdrop = modalBackdrop;
  },

  openAdd(courses = []) {
    this.isEdit = false;
    this.editingExamId = null;
    this.courses = courses;
    this.renderForm({
      subject: courses[0]?.name || 'Toán',
      type: '45 phút',
      date: new Date().toISOString().split('T')[0],
      time: '07:45 – 09:15',
      room: 'Phòng học',
      scope: 'Kiểm tra định kỳ theo chương trình',
      color: '#AFC8F5'
    });
    this.open();
  },

  openEdit(exam, courses = []) {
    this.isEdit = true;
    this.editingExamId = exam.id;
    this.courses = courses;
    this.renderForm(exam);
    this.open();
  },

  open() {
    if (!this.backdrop) return;
    this.backdrop.classList.add('open');
    if (window.lucide) window.lucide.createIcons();
    this.bindEvents();
  },

  close() {
    if (!this.backdrop) return;
    this.backdrop.classList.remove('open');
  },

  renderForm(exam) {
    const defaultColors = ['#AFC8F5', '#C7B7F4', '#A9DED5', '#F7D99A', '#F4B5C2', '#F5B28D'];
    const examTypes = ['15 phút', '45 phút', 'Giữa kỳ', 'Cuối kỳ', 'Thi thử THPT'];

    const courseOptions = this.courses.map(c => `
      <option value="${c.name}" ${c.name === exam.subject ? 'selected' : ''}>${c.name}</option>
    `).join('');

    const typeOptions = examTypes.map(t => `
      <option value="${t}" ${t === exam.type ? 'selected' : ''}>${t}</option>
    `).join('');

    const colorPills = defaultColors.map(col => `
      <label style="cursor: pointer; display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 50%; background: ${col}; border: 2.5px solid ${col === exam.color ? 'var(--color-primary)' : 'transparent'}; transition: all 0.15s ease;">
        <input type="radio" name="exam-color" value="${col}" ${col === exam.color ? 'checked' : ''} style="display: none;">
      </label>
    `).join('');

    this.backdrop.innerHTML = `
      <div class="modal-window" style="max-width: 580px;">
        <div class="modal-header">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div class="logo-icon-wrap" style="width: 36px; height: 36px;">
              <i data-lucide="file-signature" style="width: 20px; height: 20px;"></i>
            </div>
            <div>
              <h3 class="modal-title">${this.isEdit ? 'Chỉnh sửa lịch thi / kiểm tra' : 'Thêm lịch thi / kiểm tra mới'}</h3>
              <p style="font-size: 0.78rem; color: var(--color-text-secondary); margin-top: 1px;">
                Nhận thông báo nhắc nhở và chuẩn bị bài thi chu đáo
              </p>
            </div>
          </div>
          <button id="exam-modal-close-x" class="icon-btn" style="width: 30px; height: 30px; font-size: 0.85rem;" aria-label="Đóng">&times;</button>
        </div>

        <form id="exam-form">
          <div class="modal-body" style="gap: 12px;">
            <!-- Môn học & Loại bài thi -->
            <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 12px;">
              <div>
                <label style="font-size: 0.76rem; font-weight: 600; color: var(--color-text-secondary); margin-bottom: 4px; display: block;">MÔN HỌC *</label>
                <div style="display: flex; gap: 6px;">
                  <input type="text" id="exam-subject-input" class="glass-input" list="exam-course-datalist" value="${exam.subject || ''}" placeholder="Nhập hoặc chọn môn..." required>
                  <datalist id="exam-course-datalist">
                    ${courseOptions}
                  </datalist>
                </div>
              </div>

              <div>
                <label style="font-size: 0.76rem; font-weight: 600; color: var(--color-text-secondary); margin-bottom: 4px; display: block;">HÌNH THỨC / LOẠI *</label>
                <select id="exam-type-select" class="glass-input" style="font-weight: 600;">
                  ${typeOptions}
                </select>
              </div>
            </div>

            <!-- Ngày & Giờ thi -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div>
                <label style="font-size: 0.76rem; font-weight: 600; color: var(--color-text-secondary); margin-bottom: 4px; display: block;">NGÀY THI *</label>
                <input type="date" id="exam-date-input" class="glass-input" value="${exam.date || ''}" required>
              </div>

              <div>
                <label style="font-size: 0.76rem; font-weight: 600; color: var(--color-text-secondary); margin-bottom: 4px; display: block;">KHUNG GIỜ *</label>
                <input type="text" id="exam-time-input" class="glass-input" value="${exam.time || '07:45 – 09:15'}" placeholder="VD: 07:45 – 09:15" required>
              </div>
            </div>

            <!-- Địa điểm / Phòng thi -->
            <div>
              <label style="font-size: 0.76rem; font-weight: 600; color: var(--color-text-secondary); margin-bottom: 4px; display: block;">PHÒNG THI / ĐỊA ĐIỂM</label>
              <input type="text" id="exam-room-input" class="glass-input" value="${exam.room || ''}" placeholder="VD: Phòng 11A2, Hội đồng thi A...">
            </div>

            <!-- Nội dung ôn tập / Phạm vi kiến thức -->
            <div>
              <label style="font-size: 0.76rem; font-weight: 600; color: var(--color-text-secondary); margin-bottom: 4px; display: block;">NỘI DUNG ÔN TẬP / TRỌNG TÂM</label>
              <textarea id="exam-scope-input" class="glass-input" rows="2" placeholder="VD: Chương 1: Dao động cơ học, ôn tập lý thuyết & bài tập...">${exam.scope || ''}</textarea>
            </div>

            <!-- Màu sắc thẻ -->
            <div>
              <label style="font-size: 0.76rem; font-weight: 600; color: var(--color-text-secondary); margin-bottom: 6px; display: block;">MÀU ĐÁNH DẤU</label>
              <div id="exam-color-group" style="display: flex; gap: 8px;">
                ${colorPills}
              </div>
            </div>
          </div>

          <div class="modal-footer" style="display: flex; justify-content: space-between; align-items: center;">
            ${this.isEdit ? `
              <button type="button" id="btn-delete-exam" class="glass-button" style="color: #EF4444; border-color: rgba(239,68,68,0.3);">
                <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i> Xóa lịch này
              </button>
            ` : '<div></div>'}

            <div style="display: flex; gap: 8px;">
              <button type="button" id="exam-cancel-btn" class="glass-button">Hủy bỏ</button>
              <button type="submit" class="glass-button glass-button-primary">
                <i data-lucide="check" style="width: 15px; height: 15px;"></i>
                ${this.isEdit ? 'Lưu thay đổi' : 'Tạo lịch kiểm tra'}
              </button>
            </div>
          </div>
        </form>
      </div>
    `;
  },

  bindEvents() {
    this.backdrop.querySelector('#exam-modal-close-x')?.addEventListener('click', () => this.close());
    this.backdrop.querySelector('#exam-cancel-btn')?.addEventListener('click', () => this.close());

    // Color picker
    const colorLabels = this.backdrop.querySelectorAll('#exam-color-group label');
    colorLabels.forEach(label => {
      label.addEventListener('click', () => {
        colorLabels.forEach(l => l.style.borderColor = 'transparent');
        label.style.borderColor = 'var(--color-primary)';
        const radio = label.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;
      });
    });

    // Delete Exam
    this.backdrop.querySelector('#btn-delete-exam')?.addEventListener('click', () => {
      if (confirm('Bạn có chắc chắn muốn xóa lịch thi này không?')) {
        if (this.onDelete && this.editingExamId) {
          this.onDelete(this.editingExamId);
        }
        this.close();
      }
    });

    // Submit form
    this.backdrop.querySelector('#exam-form')?.addEventListener('submit', (e) => {
      e.preventDefault();

      const subject = this.backdrop.querySelector('#exam-subject-input')?.value.trim();
      const type = this.backdrop.querySelector('#exam-type-select')?.value;
      const date = this.backdrop.querySelector('#exam-date-input')?.value;
      const time = this.backdrop.querySelector('#exam-time-input')?.value.trim();
      const room = this.backdrop.querySelector('#exam-room-input')?.value.trim();
      const scope = this.backdrop.querySelector('#exam-scope-input')?.value.trim();
      const selectedColorInput = this.backdrop.querySelector('input[name="exam-color"]:checked');
      const color = selectedColorInput ? selectedColorInput.value : '#AFC8F5';

      if (!subject || !date || !time) {
        alert('Vui lòng điền đầy đủ môn học, ngày thi và khung giờ.');
        return;
      }

      const examData = {
        id: this.isEdit ? this.editingExamId : 'ex-' + Date.now(),
        subject,
        type,
        date,
        time,
        room,
        scope,
        color
      };

      if (this.onSave) {
        this.onSave(examData, this.isEdit);
      }
      this.close();
    });
  }
};
