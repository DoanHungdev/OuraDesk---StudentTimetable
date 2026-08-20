/**
 * OnboardingModal: First-Run Experience for Class Schedule
 * "Chụp TKB. Phần còn lại để app lo."
 * Uses Lucide Icons & Clean Typography
 */
import { PRESET_HIGH_SCHOOLS } from '../data/highSchoolData.js';
import { PRESET_UNIVERSITIES } from '../data/universities/universityProfiles.js';
import { Storage } from '../utils/storage.js';

export const OnboardingModal = {
  backdrop: null,
  callbacks: {},
  currentStep: 1,
  selectedMode: 'university',
  selectedSchool: '',
  selectedClass: '11A2',
  selectedGrade: 11,

  init(callbacks = {}) {
    this.callbacks = callbacks;
    this.renderContainer();
  },

  renderContainer() {
    let el = document.getElementById('onboarding-modal-backdrop');
    if (!el) {
      el = document.createElement('div');
      el.id = 'onboarding-modal-backdrop';
      el.className = 'modal-backdrop';
      document.body.appendChild(el);
    }
    this.backdrop = el;
  },

  openOnboarding() {
    this.currentStep = 1;
    this.selectedMode = Storage.getMode() || 'university';
    this.renderStep();
    this.open();
  },

  renderStep() {
    if (this.currentStep === 1) {
      // Step 1: Mode Selection
      this.backdrop.innerHTML = `
        <div class="modal-window fade-in-lift" style="max-width: 540px; text-align: center; padding: 10px;">
          <div style="padding: 20px 18px 8px;">
            <div class="logo-icon-wrap" style="width: 50px; height: 50px; margin: 0 auto 12px;">
              <i data-lucide="graduation-cap" style="width: 26px; height: 26px;"></i>
            </div>
            <h2 style="font-size: 1.4rem; font-weight: 700; color: var(--text-main); line-height: 1.25;">
              Chào mừng bạn đến với <span style="color: var(--primary);">Class Schedule</span>
            </h2>
            <p style="font-size: 0.88rem; color: var(--text-secondary); margin-top: 4px; font-weight: 500;">
              “Chụp TKB. Phần còn lại để app lo.”
            </p>
            <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 2px;">
              Vui lòng chọn môi trường học tập của bạn:
            </p>
          </div>

          <div class="modal-body" style="padding: 14px 18px; gap: 12px;">
            <!-- University Option Card -->
            <div id="btn-choose-univ" class="glass-card" style="cursor: pointer; padding: 16px; display: flex; align-items: center; gap: 14px; border: 2px solid ${this.selectedMode === 'university' ? 'var(--color-primary)' : 'var(--color-glass-border)'}; background: ${this.selectedMode === 'university' ? 'var(--primary-light)' : 'var(--color-card-background)'}; transition: all 0.2s ease;">
              <div style="width: 44px; height: 44px; border-radius: var(--radius-md); background: #AFC8F5; display: flex; align-items: center; justify-content: center; color: #1E3A8A; flex-shrink: 0;">
                <i data-lucide="graduation-cap" style="width: 22px; height: 22px;"></i>
              </div>
              <div style="text-align: left; flex: 1;">
                <h4 style="font-size: 0.98rem; font-weight: 600; color: var(--color-text);">Sinh viên Đại học / Cao đẳng</h4>
                <p style="font-size: 0.78rem; color: var(--color-text-secondary); margin-top: 2px;">
                  Quản lý tín chỉ, giảng viên, phòng lab và khung giờ chuẩn trường (HaUI, HUST, VNU...).
                </p>
              </div>
              <i data-lucide="chevron-right" style="color: var(--color-primary); width: 16px; height: 16px;"></i>
            </div>

            <!-- THPT Option Card -->
            <div id="btn-choose-thpt" class="glass-card" style="cursor: pointer; padding: 16px; display: flex; align-items: center; gap: 14px; border: 2px solid ${this.selectedMode === 'high_school' ? 'var(--color-primary)' : 'var(--color-glass-border)'}; background: ${this.selectedMode === 'high_school' ? 'var(--primary-light)' : 'var(--color-card-background)'}; transition: all 0.2s ease;">
              <div style="width: 44px; height: 44px; border-radius: var(--radius-md); background: #C7B7F4; display: flex; align-items: center; justify-content: center; color: #4C1D95; flex-shrink: 0;">
                <i data-lucide="school" style="width: 22px; height: 22px;"></i>
              </div>
              <div style="text-align: left; flex: 1;">
                <h4 style="font-size: 0.98rem; font-weight: 600; color: var(--text-main);">Học sinh THPT (Lớp 10 – 12)</h4>
                <p style="font-size: 0.78rem; color: var(--text-secondary); margin-top: 2px;">
                  Quản lý theo lớp & tiết học, bài tập về nhà, lịch thi và mục tiêu ôn thi THPT Quốc gia.
                </p>
              </div>
              <i data-lucide="chevron-right" style="color: var(--primary); width: 16px; height: 16px;"></i>
            </div>
          </div>

          <div class="modal-footer" style="justify-content: center; padding: 12px 18px 16px;">
            <button id="btn-onboarding-step1-next" class="glass-button glass-button-primary" style="width: 100%; padding: 10px; font-size: 0.9rem;">
              Tiếp tục thiết lập trường học <i data-lucide="arrow-right" style="width: 14px; height: 14px;"></i>
            </button>
          </div>
        </div>
      `;

      this.bindStep1Events();
    } else if (this.currentStep === 2) {
      // Step 2: Choose School & Class
      const isTHPT = this.selectedMode === 'high_school';

      const schoolOptions = isTHPT 
        ? PRESET_HIGH_SCHOOLS.map(s => `<option value="${s.id}" ${s.id === 'thpt_donganh' ? 'selected' : ''}>${s.name}</option>`).join('')
        : PRESET_UNIVERSITIES.map(u => `<option value="${u.id}" ${u.id === 'haui' ? 'selected' : ''}>${u.name} (${u.shortName})</option>`).join('');

      this.backdrop.innerHTML = `
        <div class="modal-window fade-in-lift" style="max-width: 520px;">
          <div class="modal-header">
            <div>
              <h3 class="modal-title">${isTHPT ? 'Thiết lập Trường & Lớp THPT' : 'Thiết lập Trường Đại học'}</h3>
              <p style="font-size: 0.78rem; color: var(--text-secondary);">Bước 2/3: Điền thông tin trường của bạn</p>
            </div>
          </div>

          <div class="modal-body" style="gap: 12px;">
            <div>
              <label style="font-size: 0.76rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 4px; display: block;">
                ${isTHPT ? 'TRƯỜNG THPT' : 'TRƯỜNG ĐẠI HỌC / CAO ĐẲNG'}
              </label>
              <select id="ob-school-select" class="glass-input" style="font-weight: 600;">
                ${schoolOptions}
              </select>
            </div>

            ${isTHPT ? `
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <div>
                  <label style="font-size: 0.76rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 4px; display: block;">HỌ VÀ TÊN</label>
                  <input type="text" id="ob-name-input" class="glass-input" value="Nguyễn Doãn Uy Vũ">
                </div>
                <div>
                  <label style="font-size: 0.76rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 4px; display: block;">TÊN LỚP</label>
                  <input type="text" id="ob-class-input" class="glass-input" value="11A2" placeholder="VD: 11A2, 12A1...">
                </div>
              </div>
            ` : `
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <div>
                  <label style="font-size: 0.76rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 4px; display: block;">HỌ VÀ TÊN</label>
                  <input type="text" id="ob-name-input" class="glass-input" value="Nguyễn Doãn Tuấn Hưng">
                </div>
                <div>
                  <label style="font-size: 0.76rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 4px; display: block;">MÃ SINH VIÊN (MSV)</label>
                  <input type="text" id="ob-msv-input" class="glass-input" value="2025601062">
                </div>
                <div>
                  <label style="font-size: 0.76rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 4px; display: block;">NGÀNH HỌC</label>
                  <input type="text" id="ob-major-input" list="ob-major-list" class="glass-input" value="Công nghệ Thông tin" placeholder="vd: Công nghệ thông tin...">
                  <datalist id="ob-major-list">
                    <option value="Công nghệ Thông tin"></option>
                    <option value="Kỹ thuật Phần mềm"></option>
                    <option value="Khoa học Máy tính"></option>
                    <option value="Khoa học Dữ liệu & AI"></option>
                    <option value="Kỹ thuật Cơ điện tử"></option>
                    <option value="Kỹ thuật Ô tô"></option>
                    <option value="Quản trị Kinh doanh"></option>
                    <option value="Marketing"></option>
                    <option value="Logistics"></option>
                    <option value="Ngôn ngữ Anh"></option>
                  </datalist>
                </div>
                <div>
                  <label style="font-size: 0.76rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 4px; display: block;">KHÓA HỌC</label>
                  <input type="text" id="ob-cohort-input" class="glass-input" value="20" placeholder="vd: 20">
                </div>
              </div>
            `}
          </div>

          <div class="modal-footer" style="justify-content: space-between;">
            <button id="btn-ob-step2-back" class="glass-button"><i data-lucide="arrow-left" style="width: 14px; height: 14px;"></i> Quay lại</button>
            <button id="btn-ob-step2-next" class="glass-button glass-button-primary">
              Tiếp tục: Nhập TKB <i data-lucide="arrow-right" style="width: 14px; height: 14px;"></i>
            </button>
          </div>
        </div>
      `;

      this.bindStep2Events();
    } else if (this.currentStep === 3) {
      // Step 3: Choose Import Method or Manual
      this.backdrop.innerHTML = `
        <div class="modal-window fade-in-lift" style="max-width: 580px; text-align: center;">
          <div class="modal-header">
            <div>
              <h3 class="modal-title">Bạn đã có sẵn Thời khóa biểu chưa?</h3>
              <p style="font-size: 0.78rem; color: var(--text-secondary);">“Chụp TKB. Phần còn lại để app lo.”</p>
            </div>
          </div>

          <div class="modal-body" style="gap: 10px; padding: 18px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <!-- Option Photo -->
              <div id="ob-opt-photo" class="glass-card" style="cursor: pointer; padding: 14px; text-align: center; border: 2px solid var(--color-primary); background: var(--primary-light); transition: all 0.2s ease;">
                <div style="color: var(--color-primary); margin-bottom: 4px;"><i data-lucide="camera" style="width: 24px; height: 24px;"></i></div>
                <h4 style="font-size: 0.92rem; font-weight: 600; color: var(--color-text);">Chụp / Tải ảnh TKB</h4>
                <p style="font-size: 0.74rem; color: var(--text-secondary); margin-top: 2px;">AI tự động đọc ảnh Zalo, ma trận lớp</p>
              </div>

              <!-- Option PDF -->
              <div id="ob-opt-pdf" class="glass-card" style="cursor: pointer; padding: 14px; text-align: center; transition: all 0.2s ease;">
                <div style="color: #3B82F6; margin-bottom: 4px;"><i data-lucide="file-text" style="width: 24px; height: 24px;"></i></div>
                <h4 style="font-size: 0.92rem; font-weight: 600; color: var(--text-main);">Tải file PDF</h4>
                <p style="font-size: 0.74rem; color: var(--text-secondary); margin-top: 2px;">Bóc tách TKB từ file PDF trường</p>
              </div>

              <!-- Option Excel -->
              <div id="ob-opt-excel" class="glass-card" style="cursor: pointer; padding: 14px; text-align: center; transition: all 0.2s ease;">
                <div style="color: #10B981; margin-bottom: 4px;"><i data-lucide="file-spreadsheet" style="width: 24px; height: 24px;"></i></div>
                <h4 style="font-size: 0.92rem; font-weight: 600; color: var(--text-main);">Tải file Excel / CSV</h4>
                <p style="font-size: 0.74rem; color: var(--text-secondary); margin-top: 2px;">Nhận diện cột thứ, tiết, môn</p>
              </div>

              <!-- Option Community Code -->
              <div id="ob-opt-code" class="glass-card" style="cursor: pointer; padding: 14px; text-align: center; transition: all 0.2s ease;">
                <div style="color: #8B5CF6; margin-bottom: 4px;"><i data-lucide="qr-code" style="width: 24px; height: 24px;"></i></div>
                <h4 style="font-size: 0.92rem; font-weight: 600; color: var(--text-main);">Nhập mã lớp / QR</h4>
                <p style="font-size: 0.74rem; color: var(--text-secondary); margin-top: 2px;">Đồng bộ TKB từ bạn bè</p>
              </div>
            </div>

            <!-- Manual entry link -->
            <div style="margin-top: 6px;">
              <button id="ob-opt-manual" class="glass-button" style="width: 100%; padding: 9px; font-size: 0.82rem;">
                <i data-lucide="edit-3" style="width: 14px; height: 14px;"></i> Tôi muốn dùng TKB mẫu / tự nhập sau
              </button>
            </div>
          </div>
        </div>
      `;

      this.bindStep3Events();
    }

    if (window.lucide) window.lucide.createIcons();
  },

  bindStep1Events() {
    const thptCard = document.getElementById('btn-choose-thpt');
    const univCard = document.getElementById('btn-choose-univ');

    thptCard?.addEventListener('click', () => {
      this.selectedMode = 'high_school';
      this.renderStep();
    });

    univCard?.addEventListener('click', () => {
      this.selectedMode = 'university';
      this.renderStep();
    });

    document.getElementById('btn-onboarding-step1-next')?.addEventListener('click', () => {
      this.currentStep = 2;
      this.renderStep();
    });
  },

  bindStep2Events() {
    document.getElementById('btn-ob-step2-back')?.addEventListener('click', () => {
      this.currentStep = 1;
      this.renderStep();
    });

    document.getElementById('btn-ob-step2-next')?.addEventListener('click', () => {
      const isTHPT = this.selectedMode === 'high_school';
      const user = Storage.getUser();

      if (isTHPT) {
        const schoolEl = document.getElementById('ob-school-select');
        const schoolObj = PRESET_HIGH_SCHOOLS.find(s => s.id === schoolEl?.value) || PRESET_HIGH_SCHOOLS[0];
        const nameVal = document.getElementById('ob-name-input')?.value.trim() || 'Nguyễn Doãn Uy Vũ';
        const classVal = document.getElementById('ob-class-input')?.value.trim() || '11A2';

        user.name = nameVal;
        user.school = schoolObj.name;
        user.schoolShort = schoolObj.shortName;
        user.grade = 11;
        user.className = classVal;
        user.mode = 'high_school';
        user.avatar = 'UV';
      } else {
        const univEl = document.getElementById('ob-school-select');
        const univObj = PRESET_UNIVERSITIES.find(u => u.id === univEl?.value) || PRESET_UNIVERSITIES[0];
        const nameVal = document.getElementById('ob-name-input')?.value.trim() || 'Nguyễn Doãn Tuấn Hưng';
        const msvVal = document.getElementById('ob-msv-input')?.value.trim() || '2025601062';
        const majorVal = document.getElementById('ob-major-input')?.value.trim() || 'Công nghệ Thông tin';
        const cohortVal = document.getElementById('ob-cohort-input')?.value.trim() || '20';

        user.name = nameVal;
        user.studentId = msvVal;
        user.university = univObj.name;
        user.schoolShort = univObj.shortName;
        user.major = majorVal;
        user.cohort = cohortVal;
        user.mode = 'university';
        user.avatar = 'TH';
      }

      Storage.setMode(this.selectedMode);
      Storage.saveUser(user);

      this.currentStep = 3;
      this.renderStep();
    });
  },

  bindStep3Events() {
    const finish = (openMethod = null) => {
      Storage.setOnboarded(true);
      this.close();
      if (this.callbacks.onComplete) {
        this.callbacks.onComplete({ mode: this.selectedMode, openMethod });
      }
    };

    document.getElementById('ob-opt-photo')?.addEventListener('click', () => finish('photo'));
    document.getElementById('ob-opt-pdf')?.addEventListener('click', () => finish('pdf'));
    document.getElementById('ob-opt-excel')?.addEventListener('click', () => finish('excel'));
    document.getElementById('ob-opt-code')?.addEventListener('click', () => finish('code'));
    document.getElementById('ob-opt-manual')?.addEventListener('click', () => finish(null));
  },

  open() {
    if (this.backdrop) this.backdrop.classList.add('open');
  },

  close() {
    if (this.backdrop) this.backdrop.classList.remove('open');
  }
};
