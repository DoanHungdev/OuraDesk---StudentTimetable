/**
 * ExamsView: High School & University Exam Schedule Manager
 * Types: 15 phút, 45 phút, Giữa kỳ, Cuối kỳ, Thi thử THPT
 * Uses Lucide Icons, Be Vietnam Pro Typography & Full CRUD Support (Add, Edit, Delete)
 */

export const ExamsView = {
  render(examsList, onAddExam, onEditExam, onDeleteExam) {
    const sorted = [...examsList].sort((a, b) => new Date(a.date) - new Date(b.date));

    const examCardsHtml = sorted.length === 0 ? `
      <div style="text-align: center; padding: 40px 20px; background: var(--color-card-background); border-radius: var(--radius-lg); border: 1px dashed var(--color-glass-border);">
        <div style="width: 48px; height: 48px; border-radius: 50%; background: var(--primary-light); display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; color: var(--color-primary);">
          <i data-lucide="calendar-check" style="width: 24px; height: 24px;"></i>
        </div>
        <h4 style="font-size: 1rem; font-weight: 600; color: var(--color-text);">Chưa có lịch thi hoặc kiểm tra</h4>
        <p style="font-size: 0.8rem; color: var(--color-text-secondary); margin-top: 3px;">Thêm lịch kiểm tra 15p, 45p, giữa kỳ để nhận nhắc nhở đúng hạn.</p>
        <button id="btn-empty-add-exam" class="glass-button glass-button-primary" style="margin-top: 14px;">
          <i data-lucide="plus" style="width: 15px; height: 15px;"></i> Thêm lịch kiểm tra mới
        </button>
      </div>
    ` : sorted.map(exam => `
      <div class="glass-card exam-card-item fade-in-lift" data-exam-id="${exam.id}" style="padding: 16px 18px; margin-bottom: 12px; border-left: 5px solid ${exam.color || '#AFC8F5'}; cursor: pointer;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px;">
          <!-- Left: Icon & Info -->
          <div style="display: flex; align-items: center; gap: 14px; flex: 1; min-width: 260px;">
            <div style="width: 42px; height: 42px; border-radius: var(--radius-md); background: ${exam.color || '#AFC8F5'}; display: flex; align-items: center; justify-content: center; color: #1F2937; flex-shrink: 0; box-shadow: 0 2px 6px rgba(0,0,0,0.06);">
              <i data-lucide="file-signature" style="width: 20px; height: 20px;"></i>
            </div>
            <div>
              <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                <span class="glass-pill" style="font-size: 0.72rem; font-weight: 700; background: var(--color-primary); color: white; padding: 2px 8px;">
                  ${exam.type}
                </span>
                <h4 style="font-size: 1.05rem; font-weight: 700; color: var(--color-text); line-height: 1.3;">${exam.subject}</h4>
              </div>
              <p style="font-size: 0.82rem; color: var(--color-text-secondary); margin-top: 4px; line-height: 1.4;">
                ${exam.scope || 'Nội dung kiểm tra theo chương trình học'}
              </p>
            </div>
          </div>

          <!-- Right: Date/Time & Action Buttons -->
          <div style="display: flex; align-items: center; gap: 14px;">
            <div style="text-align: right;">
              <div style="font-size: 0.92rem; font-weight: 700; color: var(--color-primary); display: flex; align-items: center; justify-content: flex-end; gap: 5px;">
                <i data-lucide="calendar" style="width: 14px; height: 14px;"></i> ${exam.date}
              </div>
              <div style="font-size: 0.78rem; color: var(--color-text-secondary); margin-top: 2px;">
                ${exam.time} · ${exam.room || 'Phòng học'}
              </div>
            </div>

            <!-- Action buttons: Edit & Delete -->
            <div style="display: flex; gap: 6px; align-items: center;" class="exam-actions-btn-group">
              <button class="icon-btn btn-edit-exam" data-exam-id="${exam.id}" title="Chỉnh sửa lịch thi" style="width: 32px; height: 32px;">
                <i data-lucide="pencil" style="width: 14px; height: 14px;"></i>
              </button>
              <button class="icon-btn btn-delete-exam" data-exam-id="${exam.id}" title="Xóa lịch thi" style="width: 32px; height: 32px; color: #EF4444;" aria-label="Xóa">
                <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    return `
      <div class="exams-view-wrapper fade-in-lift" style="max-width: 860px; margin: 0 auto;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div>
            <h3 style="font-size: 1.2rem; font-weight: 700; color: var(--color-text); display: flex; align-items: center; gap: 8px;">
              <i data-lucide="file-text" style="color: var(--color-primary); width: 22px; height: 22px;"></i>
              Lịch thi & kiểm tra định kỳ
            </h3>
            <p style="font-size: 0.82rem; color: var(--color-text-secondary); margin-top: 2px;">
              Quản lý kiểm tra 15 phút, 45 phút, thi giữa kỳ, cuối kỳ và thi thử (Thêm, Sửa, Xóa dễ dàng)
            </p>
          </div>
          <button id="btn-add-exam-trigger" class="glass-button glass-button-primary" style="padding: 8px 16px;">
            <i data-lucide="plus" style="width: 16px; height: 16px;"></i> Thêm lịch kiểm tra
          </button>
        </div>

        <div class="exam-list-container">${examCardsHtml}</div>
      </div>
    `;
  },

  bindEvents(container, { onAddExam, onEditExam, onDeleteExam }) {
    container.querySelector('#btn-add-exam-trigger')?.addEventListener('click', onAddExam);
    container.querySelector('#btn-empty-add-exam')?.addEventListener('click', onAddExam);

    // Edit button click
    container.querySelectorAll('.btn-edit-exam').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const examId = btn.getAttribute('data-exam-id');
        if (onEditExam && examId) onEditExam(examId);
      });
    });

    // Delete button click
    container.querySelectorAll('.btn-delete-exam').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const examId = btn.getAttribute('data-exam-id');
        if (onDeleteExam && examId) onDeleteExam(examId);
      });
    });

    // Click on entire exam card opens edit
    container.querySelectorAll('.exam-card-item').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.exam-actions-btn-group')) return;
        const examId = card.getAttribute('data-exam-id');
        if (onEditExam && examId) onEditExam(examId);
      });
    });
  }
};
