import { Storage } from '../utils/storage.js';
import { AvatarHelper } from '../utils/avatarHelper.js';
import { AvatarModal } from './AvatarModal.js';

export const Sidebar = {
  render(activeView, user, onNavigate, onSwitchMode) {
    const mode = Storage.getMode();
    const isTHPT = mode === 'high_school';
    const isGrade12 = isTHPT && (user.grade === 12 || (user.className && user.className.startsWith('12')));

    const thptNavItems = [
      { id: 'dashboard', label: 'Tổng quan', icon: 'house' },
      { id: 'timetable', label: 'Thời khóa biểu', icon: 'calendar-days' },
      { id: 'homework', label: 'Bài tập về nhà', icon: 'book-open' },
      { id: 'exams', label: 'Lịch thi & kiểm tra', icon: 'file-text' },
      ...(isGrade12 ? [{ id: 'target12', label: 'Ôn thi THPT QG', icon: 'target', badge: 'Lớp 12' }] : []),
      { id: 'courses', label: 'Danh sách môn', icon: 'layers' },
      { id: 'statistics', label: 'Thống kê học tập', icon: 'chart-no-axes-column' },
      { id: 'settings', label: 'Cài đặt', icon: 'settings' }
    ];

    const univNavItems = [
      { id: 'dashboard', label: 'Tổng quan', icon: 'house' },
      { id: 'timetable', label: 'Thời khóa biểu', icon: 'calendar-days' },
      { id: 'month-calendar', label: 'Lịch tháng', icon: 'calendar' },
      { id: 'courses', label: 'Học phần tín chỉ', icon: 'book-open' },
      { id: 'assignments', label: 'Deadline bài tập', icon: 'clipboard-list' },
      { id: 'statistics', label: 'Thống kê học tập', icon: 'chart-no-axes-column' },
      { id: 'settings', label: 'Cài đặt & Khung giờ', icon: 'settings' }
    ];

    const navItems = isTHPT ? thptNavItems : univNavItems;

    const navLinksHtml = navItems.map(item => {
      const isActive = activeView === item.id;
      return `
        <a href="#${item.id}" class="nav-item ${isActive ? 'active' : ''}" data-view="${item.id}">
          <i data-lucide="${item.icon}"></i>
          <span style="flex: 1;">${item.label}</span>
          ${item.badge ? `<span class="glass-pill" style="font-size: 0.68rem; font-weight: 600; background: var(--primary); color: white; padding: 1px 6px;">${item.badge}</span>` : ''}
        </a>
      `;
    }).join('');

    const subTitle = isTHPT 
      ? `${user.schoolShort || user.school || 'THPT Đông Anh'} · Lớp ${user.className || '11A2'}` 
      : `${user.schoolShort || 'HaUI'} · ${user.major || 'CNTT'} (K${user.cohort || '20'})`;

    return `
      <aside class="sidebar glass-sidebar">
        <!-- Brand Header -->
        <div class="sidebar-brand-wrapper">
          <div class="brand-logo-card">
            <div class="logo-icon-wrap">
              <i data-lucide="graduation-cap"></i>
            </div>
            <div class="brand-info">
              <h1>OuraDesk</h1>
              <p>Chụp TKB. App lo.</p>
            </div>
          </div>
        </div>

        <!-- Mode Indicator Badge -->
        <div style="margin: 8px 0 12px; padding: 0 2px;">
          <button id="btn-sidebar-switch-mode" class="glass-card" style="width: 100%; padding: 8px 10px; display: flex; align-items: center; justify-content: space-between; border: 1px solid var(--primary-border); background: var(--color-card-background); cursor: pointer;" title="Bấm để đổi giữa Đại học và THPT">
            <div style="display: flex; align-items: center; gap: 8px; font-size: 0.78rem; font-weight: 600; color: var(--color-text);">
              <i data-lucide="${isTHPT ? 'school' : 'graduation-cap'}" style="color: var(--color-primary); width: 16px; height: 16px;"></i>
              <span>${isTHPT ? 'Học sinh THPT' : 'Sinh viên Đại học'}</span>
            </div>
            <span style="font-size: 0.72rem; color: var(--color-primary); font-weight: 600; display: flex; align-items: center; gap: 4px;">
              Đổi mode <i data-lucide="arrow-left-right" style="width: 12px; height: 12px;"></i>
            </span>
          </button>
        </div>

        <!-- Navigation Menu -->
        <nav class="sidebar-nav custom-scroll">
          ${navLinksHtml}
        </nav>

        <!-- User Profile Card -->
        <div class="user-profile-card" data-view="settings" title="Cài đặt thông tin tài khoản">
          ${AvatarHelper.renderAvatarHtml(user, 38)}
          <div class="user-details">
            <div class="user-name">${user.name}</div>
            <div class="user-role">${subTitle}</div>
          </div>
          <i data-lucide="more-vertical" style="color: var(--text-muted); width: 16px; height: 16px;"></i>
        </div>
      </aside>
    `;
  },

  bindEvents(container, onNavigate, onSwitchMode) {
    container.querySelectorAll('.nav-item').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const viewId = link.getAttribute('data-view');
        if (viewId && onNavigate) onNavigate(viewId);
      });
    });

    container.querySelector('.user-avatar')?.addEventListener('click', (e) => {
      e.stopPropagation();
      AvatarModal.openModal(Storage.getUser());
    });

    container.querySelector('.user-profile-card')?.addEventListener('click', () => {
      if (onNavigate) onNavigate('settings');
    });

    container.querySelector('#btn-sidebar-switch-mode')?.addEventListener('click', () => {
      if (onSwitchMode) onSwitchMode();
    });
  }
};
