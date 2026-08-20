/**
 * Header Component: Class Schedule Master Top Bar
 * "📷 Nhập TKB của trường — Chụp TKB. Phần còn lại để app lo."
 * Uses Lucide Icons and clean typography
 */
import { Storage } from '../utils/storage.js';
import { ProfileEngine } from '../utils/profileEngine.js';

export const Header = {
  render(activeView, user, conflictCount = 0) {
    const mode = Storage.getMode();
    const isTHPT = mode === 'high_school';
    const activeState = ProfileEngine.getActiveProfileState();

    // Default Title & Subtitle based on active view and mode
    let title = '';
    let subtitle = '';
    let msvBadge = '';

    if (activeView === 'dashboard') {
      title = `Chào ${user.name} 👋`;
      if (isTHPT) {
        subtitle = `${user.school || 'THPT Đông Anh'} · Lớp ${user.className || '11A2'}`;
      } else {
        subtitle = `${user.university || 'Đại học Công nghiệp Hà Nội'} · Khóa ${user.cohort || '20'}`;
        if (user.studentId) {
          msvBadge = `<span class="glass-pill" style="font-size: 0.74rem; font-weight: 600; background: rgba(255,255,255,0.85); color: var(--primary); margin-left: 8px;">MSV: ${user.studentId}</span>`;
        }
      }
    } else if (activeView === 'timetable') {
      title = isTHPT ? `Thời khóa biểu lớp ${user.className || '11A2'}` : 'Thời khóa biểu tuần';
      subtitle = isTHPT ? 'Chụp TKB hoặc kéo thả để đổi giờ học' : `Lịch học ${activeState.university.name}`;
    } else if (activeView === 'homework') {
      title = 'Bài tập về nhà';
      subtitle = 'Quản lý nhiệm vụ, bài tập cần nộp và ôn tập';
    } else if (activeView === 'exams') {
      title = 'Lịch thi & kiểm tra';
      subtitle = 'Kiểm tra 15p, 45p, giữa kỳ, cuối kỳ và thi thử';
    } else if (activeView === 'target12') {
      title = 'Ôn thi THPT Quốc gia';
      subtitle = 'Kế hoạch học tập, đếm ngược ngày thi và mục tiêu điểm số';
    } else if (activeView === 'month-calendar') {
      title = 'Lịch tháng';
      subtitle = 'Tổng thể kế hoạch học tập trong tháng';
    } else if (activeView === 'courses') {
      title = isTHPT ? 'Danh sách môn học' : 'Học phần tín chỉ';
      subtitle = isTHPT ? 'Quản lý giáo viên, phòng học và số tiết' : 'Quản lý tín chỉ, giảng viên và phòng học';
    } else if (activeView === 'assignments') {
      title = 'Deadline bài tập';
      subtitle = 'Theo dõi nhiệm vụ và bài tập lớn cần nộp';
    } else if (activeView === 'statistics') {
      title = 'Thống kê học tập';
      subtitle = 'Phân tích số tiết và khối lượng học tập trong tuần';
    } else if (activeView === 'settings') {
      title = 'Cài đặt ứng dụng';
      subtitle = 'Chuyển đổi chế độ THPT/Đại học, thông tin tài khoản và khung giờ';
    }

    return `
      <header class="main-header">
        <div class="page-title-group">
          <div style="display: flex; align-items: center; flex-wrap: wrap; gap: 4px;">
            <h2>${title}</h2>
            ${msvBadge}
          </div>
          <p>${subtitle}</p>
        </div>

        <div class="header-actions">
          <!-- MAIN HERO CTA: ＋ THÊM LỊCH HỌC -->
          <button id="header-import-tkb-btn" class="glass-button glass-button-primary" style="padding: 7px 16px; font-weight: 700;" title="Thêm lịch thủ công, quét ảnh AI, import PDF hoặc tự động xếp lịch">
            <i data-lucide="plus-circle" style="width: 16px; height: 16px;"></i>
            <span>＋ Thêm lịch học</span>
          </button>

          <!-- Export Wallpaper Trigger -->
          <button id="header-wallpaper-btn" class="glass-button" title="Xuất hình nền điện thoại 9:16">
            <i data-lucide="smartphone" style="color: var(--primary); width: 16px; height: 16px;"></i>
            <span class="desktop-only-txt">Hình nền</span>
          </button>

          <!-- Share to Class Trigger -->
          <button id="header-share-class-btn" class="glass-button" title="Chia sẻ mã TKB hoặc QR cho bạn cùng lớp">
            <i data-lucide="share-2" style="color: #3B82F6; width: 16px; height: 16px;"></i>
            <span class="desktop-only-txt">Chia sẻ</span>
          </button>

          <!-- Search trigger bar -->
          <button id="header-search-btn" class="search-trigger-btn" aria-label="Tìm kiếm nhanh">
            <i data-lucide="search" style="width: 16px; height: 16px;"></i>
            <span>Tìm kiếm...</span>
            <kbd>⌘K</kbd>
          </button>

          <!-- Notification Bell -->
          <div style="position: relative;">
            <button id="header-notification-btn" class="icon-btn" aria-label="Thông báo" title="Thông báo">
              <i data-lucide="bell" style="width: 18px; height: 18px;"></i>
              ${conflictCount > 0 ? `<span class="icon-badge" style="background: #EF4444;"></span>` : `<span class="icon-badge"></span>`}
            </button>

            <!-- Notification Dropdown Panel -->
            <div id="notification-dropdown" class="glass-panel custom-scroll" style="display: none; position: absolute; right: 0; top: 48px; width: 310px; z-index: 50; padding: 14px; background: rgba(255,255,255,0.96); box-shadow: var(--shadow-lg);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <span style="font-size: 0.86rem; font-weight: 600; color: var(--text-main);">Thông báo học tập</span>
                <span style="font-size: 0.72rem; color: var(--color-primary); font-weight: 600;">OuraDesk</span>
              </div>
              <div style="display: flex; flex-direction: column; gap: 8px;">
                <div style="background: var(--primary-light); border-left: 3px solid var(--color-primary); padding: 8px 10px; border-radius: var(--radius-sm); font-size: 0.78rem; color: var(--color-text); line-height: 1.4;">
                  <strong>Toán (Tiết 1):</strong> Bắt đầu lúc 07:00 tại ${isTHPT ? `Phòng ${user.className || '11A2'}` : 'Phòng A203'}.
                </div>
                <div style="background: rgba(175,200,245,0.25); border-left: 3px solid #3B82F6; padding: 8px 10px; border-radius: var(--radius-sm); font-size: 0.78rem; color: var(--text-main); line-height: 1.4;">
                  <strong>Kiểm tra 45 phút:</strong> Vật lý vào Thứ Bảy tuần này.
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    `;
  },

  bindEvents(container, { onImportTKB, onExportWallpaper, onShareClass, onSearch }) {
    container.querySelector('#header-import-tkb-btn')?.addEventListener('click', onImportTKB);
    container.querySelector('#header-wallpaper-btn')?.addEventListener('click', onExportWallpaper);
    container.querySelector('#header-share-class-btn')?.addEventListener('click', onShareClass);
    container.querySelector('#header-search-btn')?.addEventListener('click', onSearch);

    const notifBtn = container.querySelector('#header-notification-btn');
    const notifDropdown = container.querySelector('#notification-dropdown');
    if (notifBtn && notifDropdown) {
      notifBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = notifDropdown.style.display === 'block';
        notifDropdown.style.display = isOpen ? 'none' : 'block';
      });

      document.addEventListener('click', (e) => {
        if (!notifDropdown.contains(e.target) && e.target !== notifBtn) {
          notifDropdown.style.display = 'none';
        }
      });
    }
  }
};
