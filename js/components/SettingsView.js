/**
 * SettingsView Component: Education Mode Switcher, Theme Picker (Appearance), 
 * UNIVERSITY TIME PROFILE & UNIVERSITY CURRICULUM ENGINE (University -> Campus -> Major -> Curriculum -> CourseGroup -> Course)
 * Uses Lucide Icons, Be Vietnam Pro Typography & Centralized Theme Engine
 */
import { Storage } from '../utils/storage.js';
import { Exporter } from '../utils/exporter.js';
import { ProfileEngine } from '../utils/profileEngine.js';
import { CurriculumEngine } from '../utils/curriculumEngine.js';
import { ThemeEngine } from '../theme/themeEngine.js';
import { AvatarHelper } from '../utils/avatarHelper.js';
import { AvatarModal } from './AvatarModal.js';
import { CurriculumImportModal } from './CurriculumImportModal.js';
import { CustomCourseGroupModal } from './CustomCourseGroupModal.js';

export const SettingsView = {
  onReRender: null,

  render(user, courses, homeworkOrAsg, onSaveUser, onResetData, onOpenUnivModal, onSwitchMode, onExportWallpaper, onOpenImport) {
    const mode = Storage.getMode();
    const isTHPT = mode === 'high_school';
    const activeProfileState = ProfileEngine.getActiveProfileState();
    const activeCurriculumState = isTHPT ? null : CurriculumEngine.getActiveCurriculumState();
    const currentTheme = ThemeEngine.getCurrentTheme();
    const allThemes = ThemeEngine.getThemes();

    // 1. Render 6 Theme Preview Cards
    const themeCardsHtml = allThemes.map(t => {
      const isSelected = t.id === currentTheme.id;
      const isDark = t.mode === 'dark';

      return `
        <div class="theme-card ${isSelected ? 'active' : ''}" data-theme-id="${t.id}">
          ${isSelected ? `
            <div class="theme-check-badge">
              <i data-lucide="check" style="width: 14px; height: 14px; stroke-width: 3;"></i>
            </div>
          ` : ''}

          <!-- Mini Canvas Preview -->
          <div class="theme-preview-box" style="background: linear-gradient(135deg, ${t.colors.background} 0%, ${t.colors.backgroundSecondary} 100%);">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.65rem; font-weight: 700; color: ${t.colors.text}; display: flex; align-items: center; gap: 3px;">
                <span>${t.emoji}</span> ${t.name.split(' ')[0]}
              </span>
              <span style="width: 8px; height: 8px; border-radius: 50%; background: ${t.colors.primary};"></span>
            </div>

            <!-- Mini Glass Card with Course -->
            <div style="background: ${t.colors.glass}; border: 1px solid ${t.colors.glassBorder}; border-radius: 8px; padding: 4px 6px; backdrop-filter: blur(8px);">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 0.62rem; font-weight: 700; color: ${isDark ? '#FFFFFF' : t.colors.text};">Toán</span>
                <span style="font-size: 0.58rem; font-weight: 600; color: ${t.colors.primary};">07:00</span>
              </div>
              <div style="width: 100%; height: 3px; background: ${t.colors.primary}; border-radius: 2px; margin-top: 3px;"></div>
            </div>

            <!-- Mini Weekday Row -->
            <div style="display: flex; justify-content: space-between; font-size: 0.55rem; font-weight: 600; color: ${t.colors.textSecondary}; padding: 0 2px;">
              <span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span>
            </div>
          </div>

          <!-- Theme Details -->
          <div style="margin-top: 8px; padding: 2px 4px;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <h4 style="font-size: 0.88rem; font-weight: 700; color: var(--color-text); line-height: 1.2;">
                ${t.name}
              </h4>
              ${t.mode === 'dark' ? `<span class="glass-pill" style="font-size: 0.62rem; padding: 1px 5px; background: rgba(0,0,0,0.3); color: #818CF8;">Dark</span>` : ''}
            </div>
            <p style="font-size: 0.72rem; color: var(--color-text-secondary); margin-top: 2px;">
              ${t.description}
            </p>
          </div>
        </div>
      `;
    }).join('');

    // 2. University Profile Options
    const allUniversities = ProfileEngine.getUniversities();
    const univOptions = allUniversities.map(u => `
      <option value="${u.id}" ${u.id === activeProfileState.univId ? 'selected' : ''}>
        ${u.name} (${u.shortName})
      </option>
    `).join('');

    const selectedUniv = ProfileEngine.getUniversity(activeProfileState.univId);
    const campusOptions = (selectedUniv?.campuses || []).map(c => `
      <option value="${c.id}" ${c.id === activeProfileState.campusId ? 'selected' : ''}>
        ${c.name}
      </option>
    `).join('');

    const selectedCampus = ProfileEngine.getCampus(activeProfileState.univId, activeProfileState.campusId);
    const profileOptions = (selectedCampus?.profiles || []).map(p => `
      <option value="${p.id}" ${p.id === activeProfileState.profileId ? 'selected' : ''}>
        ${p.name} (${p.type === 'theory' ? 'Lý thuyết' : (p.type === 'practical' ? 'Thực hành' : 'Tùy chỉnh')})
      </option>
    `).join('');

    // 3. Period Rows Preview
    const currentProfile = activeProfileState.profile;
    const periodsRowsHtml = (currentProfile?.periods || []).slice(0, 8).map(p => `
      <tr style="border-bottom: 1px solid var(--color-glass-border); ${!p.isUsable ? 'opacity: 0.4;' : ''}">
        <td style="padding: 6px 10px; font-weight: 700; color: var(--color-text); font-size: 0.78rem;">${p.name}</td>
        <td style="padding: 6px 10px; font-weight: 700; color: var(--color-primary); font-size: 0.78rem;">${p.startTime} – ${p.endTime}</td>
        <td style="padding: 6px 10px; font-size: 0.74rem; color: var(--color-text-secondary);">
          <span class="glass-pill" style="font-size: 0.68rem; padding: 1px 6px;">
            ${p.session === 'morning' ? 'Ca Sáng' : (p.session === 'afternoon' ? 'Ca Chiều' : 'Ca Tối')}
          </span>
        </td>
        <td style="padding: 6px 10px; font-size: 0.74rem; color: #10B981; font-weight: 600;">
          ${p.breakAfter > 0 ? `Nghỉ ${p.breakAfter}p` : '---'}
        </td>
      </tr>
    `).join('');

    // 4. University Curriculum & Course Groups Section Data
    let majorOptions = '';
    let curriculumOptions = '';
    let courseGroupsRowsHtml = '';

    if (!isTHPT) {
      const majors = CurriculumEngine.getMajors(activeProfileState.univId);
      majorOptions = majors.map(m => `
        <option value="${m.id}" ${m.id === activeCurriculumState.majorId ? 'selected' : ''}>
          ${m.name} ${m.code ? `(${m.code})` : ''}
        </option>
      `).join('');

      const curriculums = CurriculumEngine.getCurriculums(activeProfileState.univId, activeCurriculumState.majorId);
      curriculumOptions = curriculums.map(c => `
        <option value="${c.id}" ${c.id === activeCurriculumState.curriculumId ? 'selected' : ''}>
          ${c.name} (${c.academicYear || '2026–2027'})
        </option>
      `).join('');

      courseGroupsRowsHtml = (activeCurriculumState.groups || []).map((grp, idx) => `
        <tr style="border-bottom: 1px solid var(--color-glass-border);">
          <td style="padding: 8px 10px; font-weight: 700;">
            <span class="glass-pill" style="font-size: 0.72rem; background: ${grp.color || 'var(--primary-light)'}; color: #1F2937; font-weight: 700;">
              ${grp.code || `NHP-${idx + 1}`}
            </span>
          </td>
          <td style="padding: 8px 10px; font-weight: 700; color: var(--color-text); font-size: 0.82rem;">
            ${grp.name}
          </td>
          <td style="padding: 8px 10px; font-size: 0.76rem; color: var(--color-text-secondary);">
            ${grp.description || 'Khối kiến thức đào tạo'}
          </td>
          <td style="padding: 8px 10px; font-weight: 700; color: var(--color-primary); font-size: 0.82rem;">
            ${grp.requiredCredits || 0} tín chỉ
          </td>
          <td style="padding: 8px 10px; font-size: 0.76rem; color: var(--color-text-secondary);">
            ${grp.courses ? `${grp.courses.length} học phần` : '---'}
          </td>
        </tr>
      `).join('');
    }

    return `
      <div class="settings-view-wrapper fade-in-lift" style="max-width: 860px; margin: 0 auto;">
        <!-- Theme Selection (Appearance) -->
        <div class="glass-card" style="padding: 20px 22px; margin-bottom: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 14px;">
            <div>
              <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--color-text); display: flex; align-items: center; gap: 8px;">
                <i data-lucide="palette" style="color: var(--color-primary); width: 20px; height: 20px;"></i>
                Chủ đề giao diện (Theme Engine)
              </h3>
              <p style="font-size: 0.82rem; color: var(--color-text-secondary); margin-top: 2px;">
                Chọn màu sắc phù hợp với phong cách học tập của bạn (chuyển đổi tức thì, không reload).
              </p>
            </div>

            <span class="glass-pill" style="background: var(--color-glass); font-size: 0.76rem; font-weight: 600; color: var(--color-primary); border-color: var(--color-primary); white-space: nowrap; flex-shrink: 0;">
              Đang dùng: ${currentTheme.emoji} ${currentTheme.name}
            </span>
          </div>

          <!-- 6 Theme Cards Grid -->
          <div class="theme-selector-grid">
            ${themeCardsHtml}
          </div>
        </div>

        <!-- Mode Switcher Card -->
        <div class="glass-card" style="padding: 20px 22px; margin-bottom: 16px; border-left: 5px solid var(--color-primary);">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
            <div>
              <div style="font-size: 0.72rem; font-weight: 600; color: var(--color-primary); text-transform: uppercase; letter-spacing: 0.04em;">
                CHẾ ĐỘ ỨNG DỤNG HIỆN TẠI
              </div>
              <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--color-text); margin-top: 2px;">
                ${isTHPT ? 'Chế độ Học sinh THPT (Lớp 10 – 12)' : 'Chế độ Sinh viên Đại học / Cao đẳng'}
              </h3>
              <p style="font-size: 0.82rem; color: var(--color-text-secondary); margin-top: 2px;">
                ${isTHPT ? `Đang áp dụng cấu hình lớp ${user.className || '11A2'} · ${user.school || 'THPT Đông Anh'}` : `Đang áp dụng hệ thống tín chỉ & khung giờ ${activeProfileState.university.name}`}
              </p>
            </div>
            <button id="btn-settings-toggle-mode" class="glass-button glass-button-primary" style="padding: 9px 16px; font-weight: 600;">
              <i data-lucide="arrow-left-right" style="width: 16px; height: 16px;"></i>
              Chuyển sang ${isTHPT ? 'Đại học' : 'THPT'}
            </button>
          </div>
        </div>

        <!-- UNIVERSITY CURRICULUM & COURSE GROUPS ENGINE SECTION -->
        <!-- UNIVERSITY CURRICULUM & COURSE GROUPS ENGINE SECTION -->
        ${!isTHPT ? `
        <div class="glass-card" style="padding: 20px 22px; margin-bottom: 16px; border-left: 5px solid #8B5CF6;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 14px;">
            <div>
              <div style="font-size: 0.72rem; font-weight: 700; color: #8B5CF6; text-transform: uppercase; letter-spacing: 0.04em;">
                CHƯƠNG TRÌNH ĐÀO TẠO & NHÓM HỌC PHẦN
              </div>
              <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--color-text); margin-top: 2px; display: flex; align-items: center; gap: 8px;">
                <i data-lucide="layers" style="color: #8B5CF6; width: 20px; height: 20px;"></i>
                Khung Chương trình đào tạo (Curriculum)
              </h3>
              <p style="font-size: 0.82rem; color: var(--color-text-secondary); margin-top: 2px;">
                Tự động xác định khung CTĐT và nhóm học phần theo Trường → Ngành → Khóa học.
              </p>
            </div>

            <div style="display: flex; gap: 8px;">
              <button id="btn-import-curriculum" class="glass-button" style="background: rgba(139,92,246,0.12); color: #8B5CF6; border-color: rgba(139,92,246,0.3); padding: 8px 12px; font-weight: 600; font-size: 0.78rem;">
                <i data-lucide="file-up" style="width: 14px; height: 14px;"></i> Nhập khung CTĐT (PDF/Excel)
              </button>
              <button id="btn-add-custom-group" class="glass-button" style="background: var(--primary-light); color: var(--color-primary); border-color: var(--color-primary); padding: 8px 12px; font-weight: 600; font-size: 0.78rem;">
                <i data-lucide="plus" style="width: 14px; height: 14px;"></i> ＋ Thêm nhóm học phần
              </button>
            </div>
          </div>

          <!-- University -> Campus -> Major -> Cohort Selectors -->
          <div style="display: grid; grid-template-columns: 1.4fr 1fr; gap: 12px; margin-bottom: 14px;">
            <div>
              <label style="font-size: 0.74rem; font-weight: 700; color: var(--color-text-secondary); margin-bottom: 4px; display: block;">NGÀNH / CHƯƠNG TRÌNH ĐÀO TẠO</label>
              <select id="set-select-major-id" class="glass-input" style="font-weight: 700;">
                ${majorOptions}
              </select>
            </div>

            <div>
              <label style="font-size: 0.74rem; font-weight: 700; color: var(--color-text-secondary); margin-bottom: 4px; display: block;">KHÓA</label>
              <select id="set-select-cohort" class="glass-input" style="font-weight: 600;">
                <option value="20" ${activeCurriculumState.cohort === '20' ? 'selected' : ''}>Khóa 20 (2026–2027)</option>
                <option value="19" ${activeCurriculumState.cohort === '19' ? 'selected' : ''}>Khóa 19 (2025–2026)</option>
                <option value="18" ${activeCurriculumState.cohort === '18' ? 'selected' : ''}>Khóa 18 (2024–2025)</option>
                <option value="69" ${activeCurriculumState.cohort === '69' ? 'selected' : ''}>Khóa 69 (2024–2029)</option>
                <option value="68" ${activeCurriculumState.cohort === '68' ? 'selected' : ''}>Khóa 68 (2023–2028)</option>
                <option value="66" ${activeCurriculumState.cohort === '66' ? 'selected' : ''}>Khóa 66 (2024–2028)</option>
              </select>
            </div>
          </div>

          <!-- Active Curriculum Summary Card or Empty State -->
          ${activeCurriculumState.curriculum ? `
            <div style="background: linear-gradient(135deg, rgba(139,92,246,0.08) 0%, var(--color-glass) 100%); border-left: 4px solid #8B5CF6; border-radius: var(--radius-md); padding: 14px 18px; margin-bottom: 14px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
              <div>
                <div style="font-size: 0.72rem; font-weight: 700; color: #8B5CF6; text-transform: uppercase; letter-spacing: 0.04em;">
                  CHƯƠNG TRÌNH ĐÀO TẠO
                </div>
                <h4 style="font-size: 1.05rem; font-weight: 700; color: var(--color-text); margin-top: 2px;">
                  ${activeCurriculumState.major?.name || 'Kỹ thuật máy tính'}
                </h4>
                <div style="font-size: 0.8rem; color: var(--color-text-secondary); margin-top: 2px;">
                  Khóa ${activeCurriculumState.cohort || '20'} · ${activeCurriculumState.curriculum?.academicYear || '2026–2027'}
                </div>
                <div style="margin-top: 8px; display: flex; align-items: center; gap: 6px; color: #10B981; font-size: 0.78rem; font-weight: 600;">
                  <i data-lucide="check-circle-2" style="width: 15px; height: 15px;"></i>
                  ✓ Đã tải khung chương trình (${(activeCurriculumState.groups || []).length} nhóm học phần · ${activeCurriculumState.curriculum?.totalCreditsRequired || 145} tín chỉ)
                </div>
              </div>
              <div style="display: flex; gap: 6px;">
                <span class="glass-pill" style="font-size: 0.75rem; font-weight: 700; background: #8B5CF6; color: white;">
                  ${activeCurriculumState.curriculum?.totalCreditsRequired || 145} Tín Chỉ Tốt Nghiệp
                </span>
                <span class="glass-pill" style="font-size: 0.75rem; font-weight: 700; background: var(--color-primary); color: white;">
                  ${(activeCurriculumState.groups || []).length} Nhóm Học Phần
                </span>
              </div>
            </div>
          ` : `
            <div style="background: rgba(239, 68, 68, 0.05); border: 1px dashed rgba(239, 68, 68, 0.3); border-radius: var(--radius-md); padding: 18px 20px; margin-bottom: 14px; text-align: center;">
              <div style="width: 40px; height: 40px; border-radius: 50%; background: rgba(239, 68, 68, 0.1); display: flex; align-items: center; justify-content: center; margin: 0 auto 8px; color: #EF4444;">
                <i data-lucide="info" style="width: 20px; height: 20px;"></i>
              </div>
              <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--color-text);">Chưa có khung chương trình cho ngành và khóa này.</h4>
              <p style="font-size: 0.78rem; color: var(--color-text-secondary); margin-top: 3px; max-width: 460px; margin-left: auto; margin-right: auto;">
                Bạn có thể tải lên sổ tay sinh viên / file CTĐT hoặc tự tạo các nhóm học phần cho ngành học của mình.
              </p>
              <div style="display: flex; gap: 10px; justify-content: center; margin-top: 12px; flex-wrap: wrap;">
                <button id="btn-empty-import-curriculum" class="glass-button glass-button-primary" style="font-size: 0.8rem; padding: 7px 14px;">
                  <i data-lucide="file-up" style="width: 14px; height: 14px;"></i> Nhập khung chương trình
                </button>
                <button id="btn-empty-create-curriculum" class="glass-button" style="font-size: 0.8rem; padding: 7px 14px;">
                  <i data-lucide="plus" style="width: 14px; height: 14px;"></i> Tạo khung chương trình thủ công
                </button>
              </div>
            </div>
          `}

          <!-- Course Groups Grid / Table -->
          <div style="background: var(--color-card-background); border: 1px solid var(--color-glass-border); border-radius: var(--radius-md); overflow: hidden;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.8rem; text-align: left;">
              <thead>
                <tr style="background: var(--color-glass); border-bottom: 1px solid var(--color-glass-border);">
                  <th style="padding: 8px 10px; font-weight: 700; color: var(--color-text-secondary);">MÃ NHÓM</th>
                  <th style="padding: 8px 10px; font-weight: 700; color: var(--color-text-secondary);">TÊN NHÓM HỌC PHẦN</th>
                  <th style="padding: 8px 10px; font-weight: 700; color: var(--color-text-secondary);">MÔ TẢ / ĐỊNH HƯỚNG</th>
                  <th style="padding: 8px 10px; font-weight: 700; color: var(--color-text-secondary);">TÍN CHỈ YÊU CẦU</th>
                  <th style="padding: 8px 10px; font-weight: 700; color: var(--color-text-secondary);">SỐ HỌC PHẦN</th>
                </tr>
              </thead>
              <tbody>
                ${courseGroupsRowsHtml || `
                  <tr>
                    <td colspan="5" style="text-align: center; padding: 24px; color: var(--color-text-secondary); font-size: 0.82rem;">
                      Chưa có nhóm học phần nào. Bấm "Nhập khung CTĐT" hoặc "Thêm nhóm học phần" để bắt đầu.
                    </td>
                  </tr>
                `}
              </tbody>
            </table>
          </div>
        </div>
        ` : ''}

        <!-- UNIVERSITY TIME PROFILE SECTION -->
        <div class="glass-card" style="padding: 20px 22px; margin-bottom: 16px; border-left: 5px solid #3B82F6;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 14px;">
            <div>
              <div style="font-size: 0.72rem; font-weight: 700; color: #3B82F6; text-transform: uppercase; letter-spacing: 0.04em;">
                CHỨC NĂNG QUAN TRỌNG: UNIVERSITY TIME PROFILE
              </div>
              <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--color-text); margin-top: 2px; display: flex; align-items: center; gap: 8px;">
                <i data-lucide="school" style="color: #3B82F6; width: 20px; height: 20px;"></i>
                Khung giờ học Đại học & Cơ sở
              </h3>
              <p style="font-size: 0.82rem; color: var(--color-text-secondary); margin-top: 2px;">
                Hỗ trợ nhiều trường đại học (HaUI, HUST, VNU, TMU, NEU, UTC...). Không hard-code giờ học.
              </p>
            </div>

            <button id="btn-set-open-univ-profile" class="glass-button" style="background: rgba(59,130,246,0.12); color: #3B82F6; border-color: rgba(59,130,246,0.3); padding: 8px 14px; font-weight: 600;">
              <i data-lucide="sliders-horizontal" style="width: 15px; height: 15px;"></i> Cấu hình chi tiết & Khung giờ riêng
            </button>
          </div>

          <!-- University -> Campus -> Schedule Profile Selector -->
          <div style="display: grid; grid-template-columns: 1.2fr 1fr 1fr; gap: 12px; margin-bottom: 14px;">
            <div>
              <label style="font-size: 0.74rem; font-weight: 700; color: var(--color-text-secondary); margin-bottom: 4px; display: block;">TRƯỜNG ĐẠI HỌC</label>
              <select id="set-select-univ-id" class="glass-input" style="font-weight: 700;">
                ${univOptions}
              </select>
            </div>

            <div>
              <label style="font-size: 0.74rem; font-weight: 700; color: var(--color-text-secondary); margin-bottom: 4px; display: block;">CƠ SỞ / CAMPUS</label>
              <select id="set-select-campus-id" class="glass-input" style="font-weight: 600;">
                ${campusOptions}
              </select>
            </div>

            <div>
              <label style="font-size: 0.74rem; font-weight: 700; color: var(--color-text-secondary); margin-bottom: 4px; display: block;">LOẠI KHUNG GIỜ</label>
              <select id="set-select-profile-id" class="glass-input" style="font-weight: 600;">
                ${profileOptions}
              </select>
            </div>
          </div>

          <!-- Active Profile Info Banner -->
          <div style="background: var(--primary-light); border-left: 4px solid var(--color-primary); border-radius: var(--radius-md); padding: 12px 16px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
            <div>
              <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--color-text);">
                ${activeProfileState.university.name} — ${activeProfileState.campus.name}
              </h4>
              <p style="font-size: 0.78rem; color: var(--color-text-secondary); margin-top: 2px;">
                ${activeProfileState.profile.name} · ${activeProfileState.profile.description || 'Khung giờ học theo quy định chuẩn của trường'}
              </p>
            </div>
            <span class="glass-pill" style="font-size: 0.75rem; font-weight: 700; background: var(--color-primary); color: white;">
              ${(activeProfileState.profile.periods || []).filter(p => p.isUsable).length} Tiết Học Chuẩn
            </span>
          </div>

          <!-- Periods Table Preview -->
          <div style="background: var(--color-card-background); border: 1px solid var(--color-glass-border); border-radius: var(--radius-md); overflow: hidden;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.8rem; text-align: left;">
              <thead>
                <tr style="background: var(--color-glass); border-bottom: 1px solid var(--color-glass-border);">
                  <th style="padding: 8px 10px; font-weight: 700; color: var(--color-text-secondary);">TIẾT</th>
                  <th style="padding: 8px 10px; font-weight: 700; color: var(--color-text-secondary);">KHUNG GIỜ</th>
                  <th style="padding: 8px 10px; font-weight: 700; color: var(--color-text-secondary);">CA HỌC</th>
                  <th style="padding: 8px 10px; font-weight: 700; color: var(--color-text-secondary);">GIẢI LAO</th>
                </tr>
              </thead>
              <tbody>
                ${periodsRowsHtml}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Hero Actions: Import TKB & Wallpaper -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
          <div class="glass-card" style="padding: 16px 18px; display: flex; align-items: center; justify-content: space-between; cursor: pointer;" id="btn-set-import-tkb">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 40px; height: 40px; border-radius: var(--radius-md); background: var(--primary-light); display: flex; align-items: center; justify-content: center; color: var(--color-primary);">
                <i data-lucide="camera" style="width: 20px; height: 20px;"></i>
              </div>
              <div>
                <h4 style="font-size: 0.92rem; font-weight: 600; color: var(--color-text);">Nhập TKB tự động</h4>
                <p style="font-size: 0.76rem; color: var(--color-text-secondary);">Chụp ảnh, tải PDF, Excel hoặc Link</p>
              </div>
            </div>
            <i data-lucide="chevron-right" style="color: var(--color-primary); width: 16px; height: 16px;"></i>
          </div>

          <div class="glass-card" style="padding: 16px 18px; display: flex; align-items: center; justify-content: space-between; cursor: pointer;" id="btn-set-wallpaper">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 40px; height: 40px; border-radius: var(--radius-md); background: rgba(59,130,246,0.12); display: flex; align-items: center; justify-content: center; color: #3B82F6;">
                <i data-lucide="smartphone" style="width: 20px; height: 20px;"></i>
              </div>
              <div>
                <h4 style="font-size: 0.92rem; font-weight: 600; color: var(--color-text);">Tạo hình nền điện thoại</h4>
                <p style="font-size: 0.76rem; color: var(--color-text-secondary);">Xuất ảnh 9:16 cài màn hình khóa</p>
              </div>
            </div>
            <i data-lucide="chevron-right" style="color: var(--color-primary); width: 16px; height: 16px;"></i>
          </div>
        </div>

        <!-- Student Profile Form -->
        <div class="glass-card" style="padding: 20px; margin-bottom: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
            <h3 style="font-size: 1.05rem; font-weight: 600; color: var(--color-text); display: flex; align-items: center; gap: 8px;">
              <i data-lucide="user" style="color: var(--color-primary); width: 18px; height: 18px;"></i>
              Thông tin ${isTHPT ? 'học sinh' : 'sinh viên'}
            </h3>
            <button type="button" id="btn-set-avatar-quick" class="glass-pill" style="cursor: pointer; font-size: 0.76rem; font-weight: 600; background: var(--primary-light); color: var(--color-primary); display: flex; align-items: center; gap: 5px;">
              <i data-lucide="smile" style="width: 14px; height: 14px;"></i> Đổi Avatar
            </button>
          </div>

          <!-- Avatar Banner Preview -->
          <div style="display: flex; align-items: center; gap: 14px; padding: 12px 14px; background: var(--color-glass); border: 1px solid var(--color-glass-border); border-radius: var(--radius-md); margin-bottom: 14px;">
            <div id="set-avatar-trigger" style="position: relative; cursor: pointer;" title="Bấm để đổi Avatar">
              ${AvatarHelper.renderAvatarHtml(user, 52)}
              <div style="position: absolute; bottom: -2px; right: -2px; width: 20px; height: 20px; border-radius: 50%; background: var(--color-primary); color: white; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(0,0,0,0.2);">
                <i data-lucide="camera" style="width: 11px; height: 11px;"></i>
              </div>
            </div>
            <div>
              <span style="font-size: 0.72rem; font-weight: 700; color: var(--color-primary); text-transform: uppercase;">ẢNH ĐẠI DIỆN CỦA BẠN</span>
              <p style="font-size: 0.78rem; color: var(--color-text-secondary); margin-top: 1px;">
                Bấm vào avatar hoặc nút "Đổi Avatar" để chọn Emoji linh vật, ảnh cá nhân hoặc chữ viết tắt
              </p>
            </div>
          </div>

          <form id="settings-profile-form" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div>
              <label style="font-size: 0.76rem; font-weight: 600; color: var(--color-text-secondary); margin-bottom: 4px; display: block;">HỌ VÀ TÊN</label>
              <input type="text" id="set-user-name" class="glass-input" value="${user.name}">
            </div>

            ${isTHPT ? `
              <div>
                <label style="font-size: 0.76rem; font-weight: 600; color: var(--color-text-secondary); margin-bottom: 4px; display: block;">LỚP HỌC</label>
                <input type="text" id="set-user-class" class="glass-input" value="${user.className || '11A2'}">
              </div>
              <div>
                <label style="font-size: 0.76rem; font-weight: 600; color: var(--color-text-secondary); margin-bottom: 4px; display: block;">TRƯỜNG THPT</label>
                <input type="text" id="set-user-school" class="glass-input" value="${user.school || 'THPT Đông Anh'}">
              </div>
              <div>
                <label style="font-size: 0.76rem; font-weight: 600; color: var(--color-text-secondary); margin-bottom: 4px; display: block;">KHỐI LỚP</label>
                <input type="number" id="set-user-grade" class="glass-input" value="${user.grade || 11}">
              </div>
              <div>
                <label style="font-size: 0.76rem; font-weight: 600; color: var(--color-text-secondary); margin-bottom: 4px; display: block;">BAN / TỔ HỢP MÔN</label>
                <input type="text" id="set-user-track" class="glass-input" value="${user.track || 'Tự nhiên (KHTN: Toán - Lý - Hóa)'}" placeholder="vd: Tự nhiên (KHTN), Xã hội (KHXH)...">
              </div>
            ` : `
              <div>
                <label style="font-size: 0.76rem; font-weight: 600; color: var(--color-text-secondary); margin-bottom: 4px; display: block;">MÃ SINH VIÊN (MSV)</label>
                <input type="text" id="set-user-id" class="glass-input" value="${user.studentId || '2025601062'}">
              </div>
              <div>
                <label style="font-size: 0.76rem; font-weight: 600; color: var(--color-text-secondary); margin-bottom: 4px; display: block;">TRƯỜNG ĐẠI HỌC</label>
                <input type="text" id="set-user-univ" class="glass-input" value="${user.university || 'Đại học Công nghiệp Hà Nội'}">
              </div>
              <div>
                <label style="font-size: 0.76rem; font-weight: 600; color: var(--color-text-secondary); margin-bottom: 4px; display: block;">NGÀNH HỌC / CHUYÊN NGÀNH</label>
                <input type="text" id="set-user-major" class="glass-input" value="${user.major || 'Kỹ thuật máy tính'}">
              </div>
              <div>
                <label style="font-size: 0.76rem; font-weight: 600; color: var(--color-text-secondary); margin-bottom: 4px; display: block;">KHÓA HỌC</label>
                <input type="text" id="set-user-cohort" class="glass-input" value="${user.cohort || '20'}">
              </div>
              <div>
                <label style="font-size: 0.76rem; font-weight: 600; color: var(--color-text-secondary); margin-bottom: 4px; display: block;">CƠ SỞ / CAMPUS</label>
                <input type="text" id="set-user-campus" class="glass-input" value="${user.campus || 'Cơ sở 1, 2 - Hà Nội'}">
              </div>
            `}

            <div style="grid-column: 1 / -1; display: flex; justify-content: flex-end; margin-top: 6px;">
              <button type="submit" class="glass-button glass-button-primary" style="padding: 8px 20px; font-weight: 600;">
                <i data-lucide="save" style="width: 15px; height: 15px;"></i>
                Lưu thay đổi
              </button>
            </div>
          </form>
        </div>

        <!-- Export & Reset Data Options -->
        <div class="glass-card" style="padding: 20px; margin-bottom: 16px;">
          <h3 style="font-size: 1.05rem; font-weight: 600; color: var(--color-text); margin-bottom: 14px; display: flex; align-items: center; gap: 8px;">
            <i data-lucide="download" style="color: var(--color-primary); width: 18px; height: 18px;"></i>
            Xuất dữ liệu & in ấn
          </h3>

          <div style="display: flex; gap: 10px; flex-wrap: wrap; justify-content: space-between; align-items: center;">
            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
              <button id="btn-export-print" class="glass-button glass-button-primary">
                <i data-lucide="printer" style="width: 15px; height: 15px;"></i> In / Xuất PDF (A4)
              </button>
              <button id="btn-export-ical" class="glass-button">
                <i data-lucide="calendar-plus" style="width: 15px; height: 15px;"></i> Xuất iCal (.ics)
              </button>
              <button id="btn-replay-intro" class="glass-button" style="background: rgba(241,108,108,0.1); border-color: rgba(241,108,108,0.3); color: #F16C6C; font-weight: 600;">
                <i data-lucide="play" style="width: 14px; height: 14px;"></i> Xem lại Intro (5.8s)
              </button>
            </div>

            <button id="btn-reset-defaults" class="glass-button" style="color: var(--color-text-secondary); font-size: 0.78rem;">
              <i data-lucide="rotate-ccw" style="width: 14px; height: 14px;"></i> Khôi phục dữ liệu gốc
            </button>
          </div>
        </div>
      </div>
    `;
  },

  bindEvents(container, { user, courses, homeworkOrAsg, onSaveUser, onResetData, onOpenUnivModal, onSwitchMode, onExportWallpaper, onOpenImport, onThemeChanged }) {
    // 1. Theme Card Click Listeners
    container.querySelectorAll('.theme-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const themeId = card.getAttribute('data-theme-id');
        if (themeId) {
          ThemeEngine.setTheme(themeId);
          if (onThemeChanged) onThemeChanged(themeId);
          if (this.onReRender) this.onReRender();
        }
      });
    });

    // 2. Open University Profile Modal
    container.querySelector('#btn-set-open-univ-profile')?.addEventListener('click', onOpenUnivModal);

    // 3. Dropdown Listeners for University Time Profile & Curriculum
    const univSelect = container.querySelector('#set-select-univ-id');
    const campusSelect = container.querySelector('#set-select-campus-id');
    const profileSelect = container.querySelector('#set-select-profile-id');
    const majorSelect = container.querySelector('#set-select-major-id');
    const cohortSelect = container.querySelector('#set-select-cohort');

    univSelect?.addEventListener('change', (e) => {
      const newUnivId = e.target.value;
      const univ = ProfileEngine.getUniversity(newUnivId);
      const defaultCampus = univ?.campuses?.[0];
      const defaultProfile = defaultCampus?.profiles?.[0];

      ProfileEngine.setActiveProfile(newUnivId, defaultCampus?.id, defaultProfile?.id);
      CurriculumEngine.setActiveCurriculumState(newUnivId, defaultCampus?.id);
      if (this.onReRender) this.onReRender();
    });

    campusSelect?.addEventListener('change', (e) => {
      const activeState = ProfileEngine.getActiveProfileState();
      const newCampusId = e.target.value;
      const campus = ProfileEngine.getCampus(activeState.univId, newCampusId);
      const defaultProfile = campus?.profiles?.[0];

      ProfileEngine.setActiveProfile(activeState.univId, newCampusId, defaultProfile?.id);
      if (this.onReRender) this.onReRender();
    });

    profileSelect?.addEventListener('change', (e) => {
      const activeState = ProfileEngine.getActiveProfileState();
      const newProfileId = e.target.value;

      ProfileEngine.setActiveProfile(activeState.univId, activeState.campusId, newProfileId);
      if (this.onReRender) this.onReRender();
    });

    // Major change confirmation & auto curriculum resolution
    majorSelect?.addEventListener('change', (e) => {
      const newMajorId = e.target.value;
      const activeCurriculumState = CurriculumEngine.getActiveCurriculumState();
      const newMajor = CurriculumEngine.getMajor(activeCurriculumState.univId, newMajorId);

      const confirmChange = confirm(
        `Thay đổi chương trình đào tạo sang "${newMajor?.name || newMajorId}" sẽ cập nhật nhóm học phần và danh sách môn tương ứng.\n\nBạn có muốn tiếp tục?`
      );

      if (confirmChange) {
        CurriculumEngine.setActiveCurriculumState(
          activeCurriculumState.univId,
          activeCurriculumState.campusId,
          newMajorId,
          activeCurriculumState.cohort
        );
        if (this.onReRender) this.onReRender();
      } else {
        // Revert select back to previous major
        majorSelect.value = activeCurriculumState.majorId;
      }
    });

    // Cohort change & auto curriculum resolution
    cohortSelect?.addEventListener('change', (e) => {
      const activeCurriculumState = CurriculumEngine.getActiveCurriculumState();
      CurriculumEngine.setActiveCurriculumState(
        activeCurriculumState.univId,
        activeCurriculumState.campusId,
        activeCurriculumState.majorId,
        e.target.value
      );
      if (this.onReRender) this.onReRender();
    });

    // Action buttons for Curriculum
    container.querySelector('#btn-import-curriculum')?.addEventListener('click', () => {
      CurriculumImportModal.openModal();
    });

    container.querySelector('#btn-add-custom-group')?.addEventListener('click', () => {
      CustomCourseGroupModal.openModal();
    });

    container.querySelector('#btn-empty-import-curriculum')?.addEventListener('click', () => {
      CurriculumImportModal.openModal();
    });

    container.querySelector('#btn-empty-create-curriculum')?.addEventListener('click', () => {
      CustomCourseGroupModal.openModal();
    });

    container.querySelector('#btn-settings-toggle-mode')?.addEventListener('click', onSwitchMode);
    container.querySelector('#btn-set-import-tkb')?.addEventListener('click', onOpenImport);
    container.querySelector('#btn-set-wallpaper')?.addEventListener('click', onExportWallpaper);
    container.querySelector('#btn-replay-intro')?.addEventListener('click', () => {
      window.ouradeskReplayIntro?.();
    });

    const openAvatarModal = () => {
      AvatarModal.openModal(user);
    };

    container.querySelector('#btn-set-avatar-quick')?.addEventListener('click', openAvatarModal);
    container.querySelector('#set-avatar-trigger')?.addEventListener('click', openAvatarModal);

    container.querySelector('#settings-profile-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const mode = Storage.getMode();
      const isTHPT = mode === 'high_school';

      const updated = {
        ...user,
        name: container.querySelector('#set-user-name')?.value.trim() || user.name
      };

      if (isTHPT) {
        updated.className = container.querySelector('#set-user-class')?.value.trim() || user.className;
        updated.school = container.querySelector('#set-user-school')?.value.trim() || user.school;
        updated.grade = Number(container.querySelector('#set-user-grade')?.value || 11);
        updated.track = container.querySelector('#set-user-track')?.value.trim() || user.track;
      } else {
        updated.studentId = container.querySelector('#set-user-id')?.value.trim() || user.studentId;
        updated.university = container.querySelector('#set-user-univ')?.value.trim() || user.university;
        updated.major = container.querySelector('#set-user-major')?.value.trim() || user.major;
        updated.cohort = container.querySelector('#set-user-cohort')?.value.trim() || user.cohort;
        updated.campus = container.querySelector('#set-user-campus')?.value.trim() || user.campus;
      }

      if (onSaveUser) onSaveUser(updated);
    });

    container.querySelector('#btn-export-print')?.addEventListener('click', () => {
      Exporter.printTimetable(courses, user);
    });

    container.querySelector('#btn-export-ical')?.addEventListener('click', () => {
      Exporter.exportToICS(courses, user);
    });

    container.querySelector('#btn-reset-defaults')?.addEventListener('click', () => {
      if (confirm('Bạn có chắc chắn muốn đặt lại toàn bộ dữ liệu về mặc định không?')) {
        Storage.resetToDefault();
        ThemeEngine.setTheme('peach');
        if (onResetData) onResetData();
      }
    });
  }
};
