/**
 * CoursesView: Course Management Screen (Học phần tín chỉ / Danh sách môn)
 * Integrated with University Curriculum Engine & Dynamic Course Groups
 * - Grid of rich course cards
 * - Filter by dynamic NHÓM HỌC PHẦN (Course Groups) of active Curriculum
 * - Add, Edit, Delete, Duplicate actions
 * Uses Lucide Icons & Clean Typography
 */
import { DAY_NAMES } from '../data/mockData.js';
import { Storage } from '../utils/storage.js';
import { CurriculumEngine } from '../utils/curriculumEngine.js';

export const CoursesView = {
  selectedCategory: 'all',
  searchQuery: '',

  render(courses, onAddCourse, onEditCourse, onDeleteCourse, onDuplicateCourse, onViewDetails) {
    const mode = Storage.getMode();
    const isTHPT = mode === 'high_school';
    const activeCurriculumState = isTHPT ? null : CurriculumEngine.getActiveCurriculumState();
    const activeGroups = isTHPT ? [
      { id: 'all', name: 'Tất cả môn học' },
      { id: 'math_sci', name: 'Khoa học Tự nhiên' },
      { id: 'soc_lang', name: 'Khoa học Xã hội' },
      { id: 'pe_art', name: 'Thể chất & Nghệ thuật' }
    ] : [
      { id: 'all', name: 'Tất cả học phần' },
      ...CurriculumEngine.getActiveCourseGroups()
    ];

    const categoriesHtml = activeGroups.map(cat => `
      <button class="glass-pill course-cat-filter ${this.selectedCategory === cat.id ? 'active' : ''}" 
              data-cat="${cat.id}"
              style="cursor: pointer; font-size: 0.78rem; font-weight: 600; transition: all 0.2s ease; ${this.selectedCategory === cat.id ? 'background: var(--color-primary); color: white;' : ''}">
        ${cat.name} ${cat.requiredCredits ? `<span style="opacity: 0.8; font-size: 0.7rem;">(${cat.requiredCredits} TC)</span>` : ''}
      </button>
    `).join('');

    const filteredCourses = courses.filter(c => {
      const matchCat = this.selectedCategory === 'all' || 
        c.courseGroupId === this.selectedCategory || 
        c.category === this.selectedCategory;
      const matchSearch = !this.searchQuery || 
        c.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        (c.code && c.code.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
        (c.teacher && c.teacher.toLowerCase().includes(this.searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });

    const cardsHtml = filteredCourses.length === 0 ? `
      <div style="grid-column: 1 / -1; background: var(--color-glass); border-radius: var(--radius-lg); padding: 40px 20px; text-align: center; border: 1px dashed var(--color-glass-border);">
        <div style="width: 48px; height: 48px; border-radius: 50%; background: var(--primary-light); display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; color: var(--color-primary);">
          <i data-lucide="book-open" style="width: 24px; height: 24px;"></i>
        </div>
        <h4 style="font-size: 1rem; font-weight: 600; color: var(--color-text);">Không tìm thấy học phần nào</h4>
        <p style="font-size: 0.8rem; color: var(--color-text-secondary); margin-top: 3px;">Thử thay đổi bộ lọc nhóm học phần hoặc thêm một học phần mới.</p>
        <button id="btn-empty-add-course" class="glass-button glass-button-primary" style="margin-top: 14px;">
          <i data-lucide="plus" style="width: 15px; height: 15px;"></i> Thêm học phần ngay
        </button>
      </div>
    ` : filteredCourses.map(course => {
      const groupInfo = isTHPT ? null : (CurriculumEngine.getCourseGroupById(course.courseGroupId || course.category) || { name: course.courseGroupName || 'Học phần', color: course.color });
      const schedulesStr = (course.schedules || []).map(sch => {
        const d = DAY_NAMES.find(day => day.day === sch.day);
        const pLabel = sch.startPeriod ? (sch.startPeriod === sch.endPeriod ? `Tiết ${sch.startPeriod}` : `Tiết ${sch.startPeriod}–${sch.endPeriod}`) : '';
        return `${d?.shortName || 'T2'} ${pLabel ? `(${pLabel})` : `(${sch.startTime}–${sch.endTime})`}`;
      }).join(' · ') || 'Chưa xếp lịch';

      return `
        <div class="glass-card course-manage-card fade-in-lift" data-course-id="${course.id}" style="padding: 18px; display: flex; flex-direction: column; justify-content: space-between; border-top: 5px solid ${course.color || groupInfo?.color || 'var(--color-primary)'};">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
              <span class="glass-pill" style="font-size: 0.72rem; font-weight: 700; background: rgba(0,0,0,0.05); color: var(--color-text);">${course.code || 'MÔN'}</span>
              <div style="display: flex; gap: 4px; flex-wrap: wrap; justify-content: flex-end;">
                ${groupInfo ? `
                  <span class="glass-pill" style="font-size: 0.68rem; font-weight: 700; background: ${groupInfo.color || 'var(--primary-light)'}; color: #1F2937;">
                    ${groupInfo.name}
                  </span>
                ` : ''}
                <span class="glass-pill" style="font-size: 0.72rem; font-weight: 600; background: var(--color-glass); color: var(--color-text);">
                  ${isTHPT ? `${course.periodsPerWeek || 3} tiết/tuần` : `${course.credits || 3} tín chỉ`}
                </span>
              </div>
            </div>

            <h3 style="font-size: 1.08rem; font-weight: 700; color: var(--color-text); margin-top: 10px; line-height: 1.3;">
              ${course.name}
            </h3>

            <div style="margin-top: 10px; display: flex; flex-direction: column; gap: 6px; font-size: 0.78rem; color: var(--color-text-secondary); font-weight: 500;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <i data-lucide="calendar" style="color: var(--color-primary); width: 14px; height: 14px;"></i>
                <span style="font-weight: 600; color: var(--color-text);">${schedulesStr}</span>
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <i data-lucide="map-pin" style="color: var(--color-primary); width: 14px; height: 14px;"></i>
                <span>${course.room || (isTHPT ? 'Phòng 11A2' : 'Phòng A203')} • ${course.totalHours || 45} tiết</span>
              </div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <i data-lucide="user-check" style="color: var(--color-primary); width: 14px; height: 14px;"></i>
                <span>${course.teacher || 'Chưa cập nhật GV'}</span>
              </div>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--color-glass-border); padding-top: 12px; margin-top: 14px;">
            <button class="glass-button btn-course-details" data-course-id="${course.id}" style="padding: 5px 12px; font-size: 0.76rem;">
              Chi tiết
            </button>
            <div style="display: flex; gap: 5px;">
              <button class="icon-btn btn-course-dup" data-course-id="${course.id}" style="width: 30px; height: 30px;" title="Nhân bản">
                <i data-lucide="copy" style="width: 14px; height: 14px;"></i>
              </button>
              <button class="icon-btn btn-course-edit" data-course-id="${course.id}" style="width: 30px; height: 30px;" title="Chỉnh sửa">
                <i data-lucide="edit-2" style="width: 14px; height: 14px;"></i>
              </button>
              <button class="icon-btn btn-course-del" data-course-id="${course.id}" style="width: 30px; height: 30px; color: #EF4444;" title="Xóa môn">
                <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="view-content fade-in-lift">
        <!-- Header Controls -->
        <div class="view-header-bar" style="margin-bottom: 20px;">
          <div>
            <h2 class="view-title" style="font-size: 1.45rem; font-weight: 700; color: var(--color-text);">
              ${isTHPT ? 'Danh sách Môn học' : 'Học phần Tín chỉ'}
            </h2>
            <p class="view-subtitle" style="font-size: 0.84rem; color: var(--color-text-secondary); margin-top: 2px;">
              ${isTHPT ? 'Quản lý môn học THPT, giáo viên bộ môn và số tiết' : `${activeCurriculumState?.university?.shortName || 'HaUI'} · ${activeCurriculumState?.curriculum?.name || 'Khung CTĐT Kỹ thuật máy tính'}`}
            </p>
          </div>
          <div style="display: flex; gap: 10px;">
            <button id="btn-add-course-main" class="glass-button glass-button-primary">
              <i data-lucide="plus" style="width: 16px; height: 16px;"></i>
              <span>${isTHPT ? 'Thêm môn học' : 'Thêm học phần'}</span>
            </button>
          </div>
        </div>

        <!-- Filter & Search Toolbar -->
        <div class="glass-card" style="padding: 14px 18px; margin-bottom: 20px; display: flex; flex-direction: column; gap: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: center; gap: 14px; flex-wrap: wrap;">
            <div style="flex: 1; min-width: 240px; position: relative;">
              <i data-lucide="search" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--color-text-secondary); width: 16px; height: 16px;"></i>
              <input type="text" id="course-search-input" class="glass-input" placeholder="${isTHPT ? 'Tìm kiếm tên môn, giáo viên...' : 'Tìm kiếm tên học phần, mã môn, giảng viên...'}" value="${this.searchQuery}" style="padding-left: 38px;">
            </div>
            <div style="font-size: 0.8rem; font-weight: 600; color: var(--color-text-secondary);">
              Hiển thị: <strong style="color: var(--color-primary);">${filteredCourses.length}</strong> / ${courses.length} ${isTHPT ? 'môn' : 'học phần'}
            </div>
          </div>

          <!-- Dynamic NHÓM HỌC PHẦN Filter Pills -->
          <div>
            <span style="font-size: 0.72rem; font-weight: 700; color: var(--color-text-secondary); text-transform: uppercase; margin-bottom: 6px; display: block;">
              ${isTHPT ? 'NHÓM MÔN HỌC' : 'NHÓM HỌC PHẦN (THEO CHƯƠNG TRÌNH ĐÀO TẠO)'}
            </span>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              ${categoriesHtml}
            </div>
          </div>
        </div>

        <!-- Course Cards Grid -->
        <div class="courses-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px;">
          ${cardsHtml}
        </div>
      </div>
    `;
  },

  bindEvents(container, callbacks = {}) {
    const { onAddCourse, onEditCourse, onDeleteCourse, onDuplicateCourse, onViewDetails } = callbacks;

    // Search input
    container.querySelector('#course-search-input')?.addEventListener('input', (e) => {
      this.searchQuery = e.target.value;
      this.reRenderFiltered(container, callbacks);
    });

    // Category Filter Pills
    container.querySelectorAll('.course-cat-filter').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.selectedCategory = e.currentTarget.getAttribute('data-cat');
        this.reRenderFiltered(container, callbacks);
      });
    });

    // Add Course
    container.querySelector('#btn-add-course-main')?.addEventListener('click', () => {
      if (onAddCourse) onAddCourse();
    });

    container.querySelector('#btn-empty-add-course')?.addEventListener('click', () => {
      if (onAddCourse) onAddCourse();
    });

    // Action buttons on cards
    container.querySelectorAll('.btn-course-details').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-course-id');
        if (onViewDetails) onViewDetails(id);
      });
    });

    container.querySelectorAll('.btn-course-edit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-course-id');
        if (onEditCourse) onEditCourse(id);
      });
    });

    container.querySelectorAll('.btn-course-dup').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-course-id');
        if (onDuplicateCourse) onDuplicateCourse(id);
      });
    });

    container.querySelectorAll('.btn-course-del').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-course-id');
        if (onDeleteCourse) onDeleteCourse(id);
      });
    });
  },

  reRenderFiltered(container, callbacks) {
    const courses = Storage.getCourses();
    const newHtml = this.render(courses, callbacks.onAddCourse, callbacks.onEditCourse, callbacks.onDeleteCourse, callbacks.onDuplicateCourse, callbacks.onViewDetails);
    container.innerHTML = newHtml;
    this.bindEvents(container, callbacks);
    if (window.lucide) window.lucide.createIcons();
  }
};
