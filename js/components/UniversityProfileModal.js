/**
 * UniversityProfileModal: Switch and Configure University Time Profiles
 * Supports Preset Universities (HaUI, HUST, VNU, NEU, TMU, UTC) & Custom Visual Profile Builder
 */
import { ProfileEngine } from '../utils/profileEngine.js';
import { Storage } from '../utils/storage.js';

export const UniversityProfileModal = {
  backdrop: null,
  callbacks: {},
  activeTab: 'select', // 'select' or 'custom'
  tempCustomPeriods: [],

  init(callbacks = {}) {
    this.callbacks = callbacks;
    this.renderContainer();
  },

  renderContainer() {
    let el = document.getElementById('university-profile-modal-backdrop');
    if (!el) {
      el = document.createElement('div');
      el.id = 'university-profile-modal-backdrop';
      el.className = 'modal-backdrop';
      document.body.appendChild(el);
    }
    this.backdrop = el;

    this.backdrop.addEventListener('click', (e) => {
      if (e.target === this.backdrop) {
        this.close();
      }
    });
  },

  openModal() {
    this.activeTab = 'select';
    this.renderUI();
    this.open();
  },

  renderUI() {
    const activeState = ProfileEngine.getActiveProfileState();
    const allUniversities = ProfileEngine.getUniversities();

    const univOptions = allUniversities.map(u => `
      <option value="${u.id}" ${u.id === activeState.univId ? 'selected' : ''}>
        ${u.name} (${u.shortName})
      </option>
    `).join('');

    const selectedUniv = ProfileEngine.getUniversity(activeState.univId);
    const campusOptions = (selectedUniv?.campuses || []).map(c => `
      <option value="${c.id}" ${c.id === activeState.campusId ? 'selected' : ''}>
        ${c.name}
      </option>
    `).join('');

    const selectedCampus = ProfileEngine.getCampus(activeState.univId, activeState.campusId);
    const profileOptions = (selectedCampus?.profiles || []).map(p => `
      <option value="${p.id}" ${p.id === activeState.profileId ? 'selected' : ''}>
        ${p.name} (${p.type === 'theory' ? 'Lý thuyết' : (p.type === 'practical' ? 'Thực hành' : 'Tùy chỉnh')})
      </option>
    `).join('');

    const currentProfile = ProfileEngine.getProfile(activeState.univId, activeState.campusId, activeState.profileId);

    // Period breakdown table
    const periodsRowsHtml = (currentProfile?.periods || []).map(p => `
      <tr style="border-bottom: 1px solid rgba(0,0,0,0.04); ${!p.isUsable ? 'opacity: 0.45;' : ''}">
        <td style="padding: 8px 10px; font-weight: 700; color: var(--text-main);">${p.name}</td>
        <td style="padding: 8px 10px; font-weight: 800; color: var(--primary);">${p.startTime} – ${p.endTime}</td>
        <td style="padding: 8px 10px; color: var(--text-secondary);">
          <span class="glass-pill" style="font-size: 0.7rem; padding: 1px 6px;">
            ${p.session === 'morning' ? 'Ca Sáng' : (p.session === 'afternoon' ? 'Ca Chiều' : 'Ca Tối')}
          </span>
        </td>
        <td style="padding: 8px 10px; font-size: 0.76rem; color: #10B981; font-weight: 700;">
          ${p.breakAfter > 0 ? `Nghỉ ${p.breakAfter} phút` : '---'}
        </td>
      </tr>
    `).join('');

    this.backdrop.innerHTML = `
      <div class="modal-window" style="max-width: 760px;">
        <div class="modal-header">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div class="logo-icon-wrap" style="width: 38px; height: 38px; font-size: 1.1rem;">
              <i class="fa-solid fa-school"></i>
            </div>
            <div>
              <h3 class="modal-title" style="font-size: 1.15rem;">Khung Giờ Trường Đại Học (Time Profile)</h3>
              <p style="font-size: 0.76rem; color: var(--text-secondary);">Định cấu hình khung giờ tiết học chuẩn cho trường và cơ sở của bạn</p>
            </div>
          </div>
          <button id="univ-profile-close-x" class="icon-btn" style="width: 32px; height: 32px; font-size: 0.9rem;" aria-label="Đóng">&times;</button>
        </div>

        <!-- View switcher tabs -->
        <div style="padding: 0 24px; padding-top: 14px; display: flex; gap: 8px; border-bottom: 1px solid rgba(0,0,0,0.06);">
          <button id="tab-btn-select-profile" class="glass-pill ${this.activeTab === 'select' ? 'active' : ''}" style="cursor: pointer; border-bottom-left-radius: 0; border-bottom-right-radius: 0; ${this.activeTab === 'select' ? 'background: var(--primary); color: white;' : ''}">
            <i class="fa-solid fa-list-check"></i> Chọn Trường & Khung Giờ Có Sẵn
          </button>
          <button id="tab-btn-custom-profile" class="glass-pill ${this.activeTab === 'custom' ? 'active' : ''}" style="cursor: pointer; border-bottom-left-radius: 0; border-bottom-right-radius: 0; ${this.activeTab === 'custom' ? 'background: var(--primary); color: white;' : ''}">
            <i class="fa-solid fa-plus"></i> + Tạo Khung Giờ Riêng
          </button>
        </div>

        <div class="modal-body" style="gap: 16px; padding: 20px 24px;">
          ${this.activeTab === 'select' ? `
            <!-- Selection Controls -->
            <div style="display: grid; grid-template-columns: 1.2fr 1fr 1fr; gap: 12px; background: var(--color-card-background); border: 1px solid var(--color-glass-border); border-radius: var(--radius-md); padding: 14px;">
              <div>
                <label style="font-size: 0.74rem; font-weight: 700; color: var(--color-text-secondary); margin-bottom: 4px; display: block;">TRƯỜNG ĐẠI HỌC</label>
                <select id="select-univ-id" class="glass-input" style="font-weight: 700;">
                  ${univOptions}
                </select>
              </div>

              <div>
                <label style="font-size: 0.74rem; font-weight: 700; color: var(--color-text-secondary); margin-bottom: 4px; display: block;">CƠ SỞ / ĐỊA ĐIỂM</label>
                <select id="select-campus-id" class="glass-input">
                  ${campusOptions}
                </select>
              </div>

              <div>
                <label style="font-size: 0.74rem; font-weight: 700; color: var(--color-text-secondary); margin-bottom: 4px; display: block;">LOẠI KHUNG GIỜ</label>
                <select id="select-profile-id" class="glass-input">
                  ${profileOptions}
                </select>
              </div>
            </div>

            <!-- Profile Info Banner -->
            <div style="background: var(--primary-light); border-left: 4px solid var(--color-primary); border-radius: var(--radius-md); padding: 12px 16px; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--color-text);">${currentProfile?.name || 'Khung giờ'}</h4>
                <p style="font-size: 0.78rem; color: var(--color-text-secondary); margin-top: 2px;">${currentProfile?.description || 'Khung giờ học theo quy định của trường.'}</p>
              </div>
              <span class="glass-pill" style="font-size: 0.75rem; font-weight: 700; background: var(--color-primary); color: white;">
                ${(currentProfile?.periods || []).filter(p => p.isUsable).length} Tiết Học
              </span>
            </div>

            <!-- Periods Table View -->
            <div style="background: var(--color-card-background); border: 1px solid var(--color-glass-border); border-radius: var(--radius-md); overflow: hidden;">
              <table style="width: 100%; border-collapse: collapse; font-size: 0.82rem; text-align: left;">
                <thead>
                  <tr style="background: var(--color-glass); border-bottom: 1px solid var(--color-glass-border);">
                    <th style="padding: 8px 10px; font-weight: 700; color: var(--text-secondary);">TIẾT</th>
                    <th style="padding: 8px 10px; font-weight: 700; color: var(--text-secondary);">KHUNG GIỜ</th>
                    <th style="padding: 8px 10px; font-weight: 700; color: var(--text-secondary);">CA HỌC</th>
                    <th style="padding: 8px 10px; font-weight: 700; color: var(--text-secondary);">GIẢI LAO SAU TIẾT</th>
                  </tr>
                </thead>
                <tbody class="custom-scroll" style="max-height: 240px; overflow-y: auto;">
                  ${periodsRowsHtml}
                </tbody>
              </table>
            </div>
          ` : `
            <!-- Custom Profile Builder -->
            <div style="display: flex; flex-direction: column; gap: 14px;">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <div>
                  <label style="font-size: 0.74rem; font-weight: 700; color: var(--text-secondary); margin-bottom: 4px; display: block;">TÊN TRƯỜNG / HỌC VIỆN *</label>
                  <input type="text" id="custom-univ-name" class="glass-input" placeholder="VD: Đại học ABC">
                </div>
                <div>
                  <label style="font-size: 0.74rem; font-weight: 700; color: var(--text-secondary); margin-bottom: 4px; display: block;">TÊN KHUNG GIỜ *</label>
                  <input type="text" id="custom-profile-name" class="glass-input" placeholder="VD: Khung giờ 45 phút / Tiết 50p">
                </div>
              </div>

              <!-- Period row builder helper -->
              <div style="background: rgba(255,255,255,0.7); border: 1px solid var(--glass-border); border-radius: var(--radius-md); padding: 14px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                  <span style="font-size: 0.84rem; font-weight: 800; color: var(--text-main);">Danh Sách Tiết Học</span>
                  <button id="btn-add-custom-period-row" type="button" class="glass-button" style="padding: 4px 10px; font-size: 0.76rem;">
                    <i class="fa-solid fa-plus"></i> Thêm Tiết
                  </button>
                </div>

                <div id="custom-periods-container" style="display: flex; flex-direction: column; gap: 8px; max-height: 220px; overflow-y: auto;">
                  <!-- Row items inserted here -->
                </div>
              </div>
            </div>
          `}
        </div>

        <div class="modal-footer" style="justify-content: space-between;">
          <button id="univ-profile-cancel-btn" class="glass-button">Đóng</button>
          <button id="univ-profile-save-btn" class="glass-button glass-button-primary">
            <i class="fa-solid fa-check"></i> ${this.activeTab === 'select' ? 'Áp Dụng Khung Giờ Này' : 'Lưu Khung Giờ Mới'}
          </button>
        </div>
      </div>
    `;

    this.bindEvents(activeState);
  },

  bindEvents(activeState) {
    document.getElementById('univ-profile-close-x')?.addEventListener('click', () => this.close());
    document.getElementById('univ-profile-cancel-btn')?.addEventListener('click', () => this.close());

    // Switch tab
    document.getElementById('tab-btn-select-profile')?.addEventListener('click', () => {
      this.activeTab = 'select';
      this.renderUI();
    });
    document.getElementById('tab-btn-custom-profile')?.addEventListener('click', () => {
      this.activeTab = 'custom';
      this.initCustomPeriodRows();
      this.renderUI();
    });

    // Dropdown change listeners
    document.getElementById('select-univ-id')?.addEventListener('change', (e) => {
      const newUnivId = e.target.value;
      const univ = ProfileEngine.getUniversity(newUnivId);
      const defaultCampus = univ?.campuses[0];
      const defaultProfile = defaultCampus?.profiles[0];

      ProfileEngine.setActiveProfile(newUnivId, defaultCampus?.id, defaultProfile?.id);
      this.renderUI();
    });

    document.getElementById('select-campus-id')?.addEventListener('change', (e) => {
      const univId = document.getElementById('select-univ-id')?.value;
      const newCampusId = e.target.value;
      const campus = ProfileEngine.getCampus(univId, newCampusId);
      const defaultProfile = campus?.profiles[0];

      ProfileEngine.setActiveProfile(univId, newCampusId, defaultProfile?.id);
      this.renderUI();
    });

    document.getElementById('select-profile-id')?.addEventListener('change', (e) => {
      const univId = document.getElementById('select-univ-id')?.value;
      const campusId = document.getElementById('select-campus-id')?.value;
      const newProfileId = e.target.value;

      ProfileEngine.setActiveProfile(univId, campusId, newProfileId);
      this.renderUI();
    });

    // Save/Apply button
    document.getElementById('univ-profile-save-btn')?.addEventListener('click', () => {
      if (this.activeTab === 'select') {
        const univId = document.getElementById('select-univ-id')?.value;
        const campusId = document.getElementById('select-campus-id')?.value;
        const profileId = document.getElementById('select-profile-id')?.value;

        ProfileEngine.setActiveProfile(univId, campusId, profileId);
        this.close();
        if (this.callbacks.onProfileChanged) {
          this.callbacks.onProfileChanged({ univId, campusId, profileId });
        }
      } else {
        // Save custom profile
        this.saveCustomProfileFromForm();
      }
    });

    if (this.activeTab === 'custom') {
      this.renderCustomPeriodRows();
      document.getElementById('btn-add-custom-period-row')?.addEventListener('click', () => {
        const nextNum = this.tempCustomPeriods.length + 1;
        const lastEnd = this.tempCustomPeriods[this.tempCustomPeriods.length - 1]?.endTime || '07:00';
        const [lh, lm] = lastEnd.split(':').map(Number);
        const nextStartMins = (lh * 60 + lm) + 5;
        const nextEndMins = nextStartMins + 50;

        const pad = (n) => String(n).padStart(2, '0');
        const startStr = `${pad(Math.floor(nextStartMins / 60))}:${pad(nextStartMins % 60)}`;
        const endStr = `${pad(Math.floor(nextEndMins / 60))}:${pad(nextEndMins % 60)}`;

        this.tempCustomPeriods.push({
          id: 'cp-' + Date.now(),
          number: nextNum,
          name: `Tiết ${nextNum}`,
          startTime: startStr,
          endTime: endStr,
          session: nextStartMins < 720 ? 'morning' : (nextStartMins < 1050 ? 'afternoon' : 'evening'),
          breakAfter: 0,
          isUsable: true
        });
        this.renderCustomPeriodRows();
      });
    }
  },

  initCustomPeriodRows() {
    if (this.tempCustomPeriods.length === 0) {
      this.tempCustomPeriods = [
        { id: 'cp-1', number: 1, name: 'Tiết 1', startTime: '07:00', endTime: '07:45', session: 'morning', breakAfter: 5, isUsable: true },
        { id: 'cp-2', number: 2, name: 'Tiết 2', startTime: '07:50', endTime: '08:35', session: 'morning', breakAfter: 10, isUsable: true },
        { id: 'cp-3', number: 3, name: 'Tiết 3', startTime: '08:45', endTime: '09:30', session: 'morning', breakAfter: 10, isUsable: true },
        { id: 'cp-4', number: 4, name: 'Tiết 4', startTime: '09:40', endTime: '10:25', session: 'morning', breakAfter: 0, isUsable: true }
      ];
    }
  },

  renderCustomPeriodRows() {
    const container = document.getElementById('custom-periods-container');
    if (!container) return;

    container.innerHTML = this.tempCustomPeriods.map((p, idx) => `
      <div style="display: grid; grid-template-columns: 80px 100px 100px 100px 100px 32px; gap: 8px; align-items: center; background: rgba(255,255,255,0.8); padding: 6px 10px; border-radius: var(--radius-sm); border: 1px solid rgba(0,0,0,0.06);">
        <span style="font-weight: 700; font-size: 0.8rem;">${p.name}</span>
        <input type="time" class="glass-input custom-p-start" data-idx="${idx}" value="${p.startTime}" style="padding: 4px 6px; font-size: 0.8rem;">
        <input type="time" class="glass-input custom-p-end" data-idx="${idx}" value="${p.endTime}" style="padding: 4px 6px; font-size: 0.8rem;">
        <select class="glass-input custom-p-session" data-idx="${idx}" style="padding: 4px 6px; font-size: 0.76rem;">
          <option value="morning" ${p.session === 'morning' ? 'selected' : ''}>Sáng</option>
          <option value="afternoon" ${p.session === 'afternoon' ? 'selected' : ''}>Chiều</option>
          <option value="evening" ${p.session === 'evening' ? 'selected' : ''}>Tối</option>
        </select>
        <div style="display: flex; align-items: center; gap: 4px; font-size: 0.72rem;">
          <input type="number" class="glass-input custom-p-break" data-idx="${idx}" value="${p.breakAfter}" style="padding: 4px; font-size: 0.78rem; width: 44px;"> p nghỉ
        </div>
        <button type="button" class="icon-btn btn-remove-custom-period" data-idx="${idx}" style="width: 26px; height: 26px; font-size: 0.7rem; color: #EF4444;" title="Xóa">
          &times;
        </button>
      </div>
    `).join('');

    // Bind row inputs
    container.querySelectorAll('.custom-p-start').forEach(input => {
      input.addEventListener('change', (e) => {
        const idx = Number(e.target.getAttribute('data-idx'));
        if (this.tempCustomPeriods[idx]) this.tempCustomPeriods[idx].startTime = e.target.value;
      });
    });
    container.querySelectorAll('.custom-p-end').forEach(input => {
      input.addEventListener('change', (e) => {
        const idx = Number(e.target.getAttribute('data-idx'));
        if (this.tempCustomPeriods[idx]) this.tempCustomPeriods[idx].endTime = e.target.value;
      });
    });
    container.querySelectorAll('.custom-p-session').forEach(input => {
      input.addEventListener('change', (e) => {
        const idx = Number(e.target.getAttribute('data-idx'));
        if (this.tempCustomPeriods[idx]) this.tempCustomPeriods[idx].session = e.target.value;
      });
    });
    container.querySelectorAll('.custom-p-break').forEach(input => {
      input.addEventListener('change', (e) => {
        const idx = Number(e.target.getAttribute('data-idx'));
        if (this.tempCustomPeriods[idx]) this.tempCustomPeriods[idx].breakAfter = Number(e.target.value || 0);
      });
    });
    container.querySelectorAll('.btn-remove-custom-period').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = Number(e.currentTarget.getAttribute('data-idx'));
        this.tempCustomPeriods.splice(idx, 1);
        // Re-number
        this.tempCustomPeriods.forEach((p, i) => {
          p.number = i + 1;
          p.name = `Tiết ${i + 1}`;
        });
        this.renderCustomPeriodRows();
      });
    });
  },

  saveCustomProfileFromForm() {
    const univName = document.getElementById('custom-univ-name')?.value.trim();
    const profileName = document.getElementById('custom-profile-name')?.value.trim();

    if (!univName || !profileName) {
      alert('Vui lòng nhập tên trường và tên khung giờ.');
      return;
    }

    if (this.tempCustomPeriods.length === 0) {
      alert('Vui lòng thêm ít nhất 1 tiết học.');
      return;
    }

    const newUnivId = 'custom_' + Date.now();
    const newCampusId = 'campus_' + Date.now();
    const newProfileId = 'profile_' + Date.now();

    const customUniv = {
      id: newUnivId,
      name: univName,
      shortName: univName.substring(0, 8),
      code: 'CUSTOM',
      logo: 'fa-graduation-cap',
      campuses: [
        {
          id: newCampusId,
          name: 'Cơ sở chính',
          isDefault: true,
          profiles: [
            {
              id: newProfileId,
              name: profileName,
              type: 'custom',
              isDefault: true,
              description: `Khung giờ tự tạo cho ${univName}`,
              periods: this.tempCustomPeriods
            }
          ]
        }
      ]
    };

    const existingCustom = Storage.getCustomUniversities() || [];
    existingCustom.push(customUniv);
    Storage.saveCustomUniversities(existingCustom);

    ProfileEngine.setActiveProfile(newUnivId, newCampusId, newProfileId);
    this.close();

    if (this.callbacks.onProfileChanged) {
      this.callbacks.onProfileChanged({ univId: newUnivId, campusId: newCampusId, profileId: newProfileId });
    }
  },

  open() {
    if (this.backdrop) {
      this.backdrop.classList.add('open');
      if (window.lucide) window.lucide.createIcons();
    }
  },

  close() {
    if (this.backdrop) this.backdrop.classList.remove('open');
  }
};
