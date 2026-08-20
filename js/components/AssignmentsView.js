/**
 * AssignmentsView: Assignment and Deadline Management (University Mode)
 * - Filter by status (All, In Progress, Completed) and priority
 * - Interactive checklist with smooth celebration
 * - Add, Edit, Delete tasks
 * Uses Lucide Icons & Clean Typography
 */
export const AssignmentsView = {
  filterStatus: 'all', // 'all', 'pending', 'completed'

  render(assignments, courses, onAddTask, onToggleTask, onEditTask, onDeleteTask) {
    const filtered = assignments.filter(t => {
      if (this.filterStatus === 'pending') return !t.completed;
      if (this.filterStatus === 'completed') return t.completed;
      return true;
    });

    const pendingCount = assignments.filter(t => !t.completed).length;
    const completedCount = assignments.filter(t => t.completed).length;

    const tasksHtml = filtered.length === 0 ? `
      <div style="background: var(--color-card-background); border-radius: var(--radius-lg); padding: 40px 20px; text-align: center; border: 1px dashed var(--color-glass-border);">
        <div style="width: 48px; height: 48px; border-radius: 50%; background: var(--primary-light); display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; color: var(--color-primary);">
          <i data-lucide="clipboard-check" style="width: 24px; height: 24px;"></i>
        </div>
        <h4 style="font-size: 1rem; font-weight: 600; color: var(--color-text);">Không có bài tập nào trong danh sách!</h4>
        <p style="font-size: 0.8rem; color: var(--color-text-secondary); margin-top: 3px;">Thêm deadline mới để không bỏ lỡ bài tập nào.</p>
        <button id="btn-empty-add-task" class="glass-button glass-button-primary" style="margin-top: 14px;">
          <i data-lucide="plus" style="width: 15px; height: 15px;"></i> Thêm bài tập mới
        </button>
      </div>
    ` : filtered.map(t => {
      const isUrgent = !t.completed && t.priority === 'high';

      return `
        <div class="glass-card task-list-card fade-in-lift ${t.completed ? 'task-done' : ''}" data-task-id="${t.id}" style="padding: 14px 18px; display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 8px; border-left: 5px solid ${t.color || '#AFC8F5'}; ${t.completed ? 'opacity: 0.65;' : ''}">
          <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
            <input type="checkbox" class="task-checkbox-main task-checkbox" data-task-id="${t.id}" ${t.completed ? 'checked' : ''}>
            <div>
              <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                <h4 style="font-size: 0.94rem; font-weight: 600; color: var(--color-text); line-height: 1.35; ${t.completed ? 'text-decoration: line-through;' : ''}">
                  ${t.title}
                </h4>
                <span class="glass-pill" style="padding: 2px 7px; font-size: 0.7rem; font-weight: 600; background: ${t.color || '#AFC8F5'}; color: #1F2937;">
                  ${t.courseName}
                </span>
                ${isUrgent ? `
                  <span class="glass-pill" style="padding: 2px 7px; font-size: 0.7rem; font-weight: 600; background: #FEE2E2; color: #DC2626;">
                    Gấp
                  </span>
                ` : ''}
              </div>
              <div style="font-size: 0.76rem; color: var(--color-text-secondary); margin-top: 3px; display: flex; gap: 12px;">
                <span style="display: flex; align-items: center; gap: 4px;">
                  <i data-lucide="calendar" style="color: var(--color-primary); width: 13px; height: 13px;"></i>
                  Hạn nộp: <strong>${t.dueDate}</strong>
                </span>
                ${t.notes ? `<span>• ${t.notes}</span>` : ''}
              </div>
            </div>
          </div>

          <div style="display: flex; gap: 5px;">
            <button class="icon-btn btn-edit-task" data-task-id="${t.id}" style="width: 30px; height: 30px;" title="Chỉnh sửa">
              <i data-lucide="edit-2" style="width: 14px; height: 14px;"></i>
            </button>
            <button class="icon-btn btn-del-task" data-task-id="${t.id}" style="width: 30px; height: 30px; color: #EF4444;" title="Xóa bài tập">
              <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="assignments-view-wrapper fade-in-lift">
        <!-- Stats & Controls -->
        <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 16px;">
          <!-- Filter Tabs -->
          <div style="display: flex; gap: 6px;">
            <button class="glass-pill filter-asg-tab ${this.filterStatus === 'all' ? 'active' : ''}" data-status="all" style="cursor: pointer; font-size: 0.78rem; font-weight: 600; ${this.filterStatus === 'all' ? 'background: var(--primary); color: white;' : ''}">
              Tất cả (${assignments.length})
            </button>
            <button class="glass-pill filter-asg-tab ${this.filterStatus === 'pending' ? 'active' : ''}" data-status="pending" style="cursor: pointer; font-size: 0.78rem; font-weight: 600; ${this.filterStatus === 'pending' ? 'background: var(--primary); color: white;' : ''}">
              Chưa xong (${pendingCount})
            </button>
            <button class="glass-pill filter-asg-tab ${this.filterStatus === 'completed' ? 'active' : ''}" data-status="completed" style="cursor: pointer; font-size: 0.78rem; font-weight: 600; ${this.filterStatus === 'completed' ? 'background: var(--primary); color: white;' : ''}">
              Đã hoàn thành (${completedCount})
            </button>
          </div>

          <!-- Add Task Button -->
          <button id="btn-assignments-add" class="glass-button glass-button-primary" style="padding: 8px 16px;">
            <i data-lucide="plus" style="width: 15px; height: 15px;"></i> Thêm bài tập mới
          </button>
        </div>

        <!-- Task List -->
        <div>
          ${tasksHtml}
        </div>
      </div>
    `;
  },

  bindEvents(container, { onAddTask, onToggleTask, onEditTask, onDeleteTask }) {
    container.querySelectorAll('.filter-asg-tab').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.filterStatus = e.currentTarget.getAttribute('data-status');
        if (this.onReRender) this.onReRender();
      });
    });

    container.querySelector('#btn-assignments-add')?.addEventListener('click', onAddTask);
    container.querySelector('#btn-empty-add-task')?.addEventListener('click', onAddTask);

    container.querySelectorAll('.task-checkbox-main').forEach(cb => {
      cb.addEventListener('change', (e) => {
        const id = e.target.getAttribute('data-task-id');
        if (onToggleTask) onToggleTask(id, e.target.checked);
      });
    });

    container.querySelectorAll('.btn-edit-task').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-task-id');
        if (id && onEditTask) onEditTask(id);
      });
    });

    container.querySelectorAll('.btn-del-task').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-task-id');
        if (id && onDeleteTask) onDeleteTask(id);
      });
    });
  }
};
