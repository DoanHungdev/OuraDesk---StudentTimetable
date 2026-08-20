/**
 * BottomNav Component: Mobile Floating Navigation Bar (<768px)
 * Uses Lucide Icons
 */
import { Storage } from '../utils/storage.js';

export const BottomNav = {
  render(activeView) {
    const mode = Storage.getMode();
    const isTHPT = mode === 'high_school';

    const thptItems = [
      { id: 'dashboard', label: 'Trang chủ', icon: 'house' },
      { id: 'timetable', label: 'Lịch học', icon: 'calendar-days' },
      { id: 'homework', label: 'Bài tập', icon: 'book-open' },
      { id: 'exams', label: 'Lịch thi', icon: 'file-text' },
      { id: 'settings', label: 'Cài đặt', icon: 'settings' }
    ];

    const univItems = [
      { id: 'dashboard', label: 'Trang chủ', icon: 'house' },
      { id: 'timetable', label: 'Lịch học', icon: 'calendar-days' },
      { id: 'courses', label: 'Môn học', icon: 'book-open' },
      { id: 'assignments', label: 'Bài tập', icon: 'clipboard-list' },
      { id: 'settings', label: 'Cài đặt', icon: 'settings' }
    ];

    const navItems = isTHPT ? thptItems : univItems;

    const navButtonsHtml = navItems.map(item => {
      const isActive = activeView === item.id;
      return `
        <button class="mobile-nav-btn ${isActive ? 'active' : ''}" data-view="${item.id}">
          <i data-lucide="${item.icon}" style="width: 20px; height: 20px;"></i>
          <span>${item.label}</span>
        </button>
      `;
    }).join('');

    return `
      <nav class="mobile-bottom-nav">
        ${navButtonsHtml}
      </nav>
    `;
  },

  bindEvents(container, onNavigate) {
    container.querySelectorAll('.mobile-nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const viewId = e.currentTarget.getAttribute('data-view');
        if (viewId && onNavigate) onNavigate(viewId);
      });
    });
  }
};
