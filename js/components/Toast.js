/**
 * Toast Notification Component
 * Supports standard toast and interactive action toasts (e.g. "Hoàn tác" / Undo)
 */
export const Toast = {
  container: null,

  init() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    }
  },

  show(message, type = 'success', duration = 3200) {
    this.init();
    const item = document.createElement('div');
    item.className = `toast-item ${type}`;

    let iconClass = 'fa-circle-check';
    if (type === 'warning') iconClass = 'fa-triangle-exclamation';
    if (type === 'error') iconClass = 'fa-circle-xmark';
    if (type === 'info') iconClass = 'fa-circle-info';

    item.innerHTML = `
      <i class="fa-solid ${iconClass}"></i>
      <span>${message}</span>
    `;

    this.container.appendChild(item);

    setTimeout(() => {
      if (item.parentElement) {
        item.style.opacity = '0';
        item.style.transform = 'translateY(8px)';
        item.style.transition = 'all 0.25s ease';
        setTimeout(() => item.remove(), 250);
      }
    }, duration);
  },

  showWithAction(message, type = 'success', actionLabel = 'Hoàn tác', onAction = null, duration = 6000) {
    this.init();
    const item = document.createElement('div');
    item.className = `toast-item ${type}`;
    item.style.display = 'flex';
    item.style.alignItems = 'center';
    item.style.justifyContent = 'space-between';
    item.style.gap = '12px';

    let iconClass = 'fa-circle-check';
    if (type === 'warning') iconClass = 'fa-triangle-exclamation';
    if (type === 'error') iconClass = 'fa-circle-xmark';
    if (type === 'info') iconClass = 'fa-circle-info';

    item.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <i class="fa-solid ${iconClass}"></i>
        <span>${message}</span>
      </div>
      ${actionLabel && onAction ? `
        <button type="button" class="toast-action-btn" style="background: rgba(255,255,255,0.25); border: 1px solid rgba(255,255,255,0.4); color: inherit; font-weight: 700; font-size: 0.78rem; padding: 4px 10px; border-radius: 4px; cursor: pointer; white-space: nowrap;">
          ${actionLabel}
        </button>
      ` : ''}
    `;

    if (onAction) {
      item.querySelector('.toast-action-btn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        item.remove();
        onAction();
      });
    }

    this.container.appendChild(item);

    setTimeout(() => {
      if (item.parentElement) {
        item.style.opacity = '0';
        item.style.transform = 'translateY(8px)';
        item.style.transition = 'all 0.25s ease';
        setTimeout(() => item.remove(), 250);
      }
    }, duration);
  }
};
