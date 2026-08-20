/**
 * HomeworkView: High School Homework & Tasks Manager
 * Status Kanban: Todo -> Doing -> Done
 * Uses Lucide Icons & Clean Typography
 */
import { Storage } from '../utils/storage.js';

export const HomeworkView = {
  render(homeworkList, courses, onAddHomework, onUpdateStatus, onDeleteHomework) {
    const todos = homeworkList.filter(h => h.status === 'todo');
    const doings = homeworkList.filter(h => h.status === 'doing');
    const dones = homeworkList.filter(h => h.status === 'done');

    const renderColumn = (title, items, colStatus, badgeColor) => {
      const cardsHtml = items.length === 0 ? `
        <div style="padding: 24px 12px; text-align: center; color: var(--text-muted); font-size: 0.8rem;">
          Không có bài tập
        </div>
      ` : items.map(item => `
        <div class="glass-card fade-in-lift" style="padding: 12px 14px; margin-bottom: 8px; border-left: 4px solid ${item.color || '#AFC8F5'}; position: relative;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <span class="glass-pill" style="font-size: 0.72rem; font-weight: 600; background: ${item.color || '#AFC8F5'}; color: #1F2937;">
              ${item.subject}
            </span>
            <span style="font-size: 0.72rem; font-weight: 600; color: ${item.priority === 'high' ? '#EF4444' : '#6B7280'};">
              ${item.priority === 'high' ? '🔥 Gấp' : 'Bình thường'}
            </span>
          </div>

          <h4 style="font-size: 0.88rem; font-weight: 600; color: var(--color-text); margin-top: 6px; line-height: 1.35;">
            ${item.title}
          </h4>

          ${item.notes ? `
            <p style="font-size: 0.76rem; color: var(--color-text-secondary); margin-top: 3px; line-height: 1.35;">${item.notes}</p>
          ` : ''}

          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px; border-top: 1px dashed var(--color-glass-border); padding-top: 6px;">
            <span style="font-size: 0.74rem; font-weight: 600; color: var(--color-primary); display: flex; align-items: center; gap: 4px;">
              <i data-lucide="clock" style="width: 12px; height: 12px;"></i> Hạn: ${item.dueDate}
            </span>
            <div style="display: flex; gap: 4px;">
              ${colStatus !== 'todo' ? `<button class="icon-btn btn-hw-move" data-id="${item.id}" data-to="todo" title="Chuyển sang Cần làm" style="width: 24px; height: 24px; font-size: 0.65rem;">◀</button>` : ''}
              ${colStatus !== 'doing' ? `<button class="icon-btn btn-hw-move" data-id="${item.id}" data-to="doing" title="Chuyển sang Đang làm" style="width: 24px; height: 24px; font-size: 0.65rem;">▶</button>` : ''}
              ${colStatus !== 'done' ? `<button class="icon-btn btn-hw-move" data-id="${item.id}" data-to="done" title="Đánh dấu Hoàn thành" style="width: 24px; height: 24px; font-size: 0.65rem; color: #10B981;">✓</button>` : ''}
              <button class="icon-btn btn-hw-delete" data-id="${item.id}" title="Xóa" style="width: 24px; height: 24px; font-size: 0.65rem; color: #EF4444;">&times;</button>
            </div>
          </div>
        </div>
      `).join('');

      return `
        <div style="flex: 1; min-width: 250px; background: var(--color-glass); border: 1px solid var(--color-glass-border); border-radius: var(--radius-lg); padding: 14px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 0.92rem; font-weight: 600; color: var(--color-text);">${title}</span>
              <span class="glass-pill" style="font-size: 0.7rem; font-weight: 600; background: ${badgeColor}; color: white; padding: 1px 7px;">
                ${items.length}
              </span>
            </div>
          </div>
          <div>${cardsHtml}</div>
        </div>
      `;
    };

    return `
      <div class="homework-view-wrapper fade-in-lift">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
          <div>
            <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--text-main); display: flex; align-items: center; gap: 8px;">
              <i data-lucide="book-open" style="color: var(--primary); width: 20px; height: 20px;"></i>
              Bài tập & nhiệm vụ học tập
            </h3>
            <p style="font-size: 0.78rem; color: var(--text-secondary);">Quản lý bài tập về nhà, chuẩn bị bài và ôn tập kiểm tra</p>
          </div>
          <button id="btn-add-hw-trigger" class="glass-button glass-button-primary" style="padding: 7px 14px;">
            <i data-lucide="plus" style="width: 15px; height: 15px;"></i> Thêm bài tập mới
          </button>
        </div>

        <div style="display: flex; gap: 14px; flex-wrap: wrap;">
          ${renderColumn('Cần làm (Todo)', todos, 'todo', '#F59E0B')}
          ${renderColumn('Đang làm (Doing)', doings, 'doing', '#3B82F6')}
          ${renderColumn('Đã xong (Done)', dones, 'done', '#10B981')}
        </div>
      </div>
    `;
  },

  bindEvents(container, { onAddHomework, onUpdateStatus, onDeleteHomework }) {
    container.querySelector('#btn-add-hw-trigger')?.addEventListener('click', onAddHomework);

    container.querySelectorAll('.btn-hw-move').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const toStatus = e.currentTarget.getAttribute('data-to');
        if (onUpdateStatus) onUpdateStatus(id, toStatus);
      });
    });

    container.querySelectorAll('.btn-hw-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        if (confirm('Bạn có chắc muốn xóa bài tập này?')) {
          if (onDeleteHomework) onDeleteHomework(id);
        }
      });
    });
  }
};
