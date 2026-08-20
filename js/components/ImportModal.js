/**
 * ImportModal: Master Import Hub for Class Schedule
 * “Chụp TKB. Phần còn lại để app lo.”
 * Multi-channel: Image/Camera, PDF, Excel, Link, Community Share Code
 * Uses Lucide Icons & Context-aware profiles (HaUI vs THPT Đông Anh)
 */
import { OCREngine } from '../utils/ocrEngine.js';
import { ShareEngine } from '../utils/shareEngine.js';
import { Storage } from '../utils/storage.js';

export const ImportModal = {
  backdrop: null,
  callbacks: {},
  activeTab: 'photo', // 'photo' | 'pdf' | 'excel' | 'link' | 'code'
  selectedClass: '11A2',

  init(callbacks = {}) {
    this.callbacks = callbacks;
    this.renderContainer();
  },

  renderContainer() {
    let el = document.getElementById('import-modal-backdrop');
    if (!el) {
      el = document.createElement('div');
      el.id = 'import-modal-backdrop';
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

  openImport(defaultTab = 'photo') {
    this.activeTab = defaultTab;
    const user = Storage.getUser();
    const mode = Storage.getMode();
    this.selectedClass = mode === 'high_school' ? (user.className || '11A2') : 'K20 CNTT';
    this.renderUI();
    this.open();
  },

  renderUI() {
    const mode = Storage.getMode();
    const isTHPT = mode === 'high_school';
    const user = Storage.getUser();

    const tabs = [
      { id: 'photo', name: 'Chụp / Tải ảnh', icon: 'camera' },
      { id: 'pdf', name: 'File PDF', icon: 'file-text' },
      { id: 'excel', name: 'File Excel / CSV', icon: 'file-spreadsheet' },
      { id: 'link', name: 'Dán Link TKB', icon: 'link' },
      { id: 'code', name: 'Mã lớp / Quét QR', icon: 'qr-code' }
    ];

    const tabButtonsHtml = tabs.map(t => `
      <button class="glass-pill btn-import-tab ${this.activeTab === t.id ? 'active' : ''}" data-tab="${t.id}" style="cursor: pointer; padding: 7px 12px; font-weight: 600; font-size: 0.8rem; display: flex; align-items: center; gap: 6px; ${this.activeTab === t.id ? 'background: var(--primary); color: white;' : 'background: rgba(255,255,255,0.7);'}">
        <i data-lucide="${t.icon}" style="width: 14px; height: 14px;"></i>
        <span>${t.name}</span>
      </button>
    `).join('');

    let tabContentHtml = '';

    if (this.activeTab === 'photo') {
      tabContentHtml = `
        <div style="text-align: center;">
          <div style="border: 2px dashed var(--primary-border); background: var(--color-card-background); border-radius: var(--radius-lg); padding: 32px 18px; cursor: pointer;" id="drop-zone-photo">
            <div style="width: 56px; height: 56px; border-radius: 50%; background: var(--primary-light); display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; color: var(--color-primary);">
              <i data-lucide="camera" style="width: 28px; height: 28px;"></i>
            </div>
            <h4 style="font-size: 1.05rem; font-weight: 600; color: var(--color-text);">Kéo thả ảnh hoặc Chụp ảnh Thời khóa biểu</h4>
            <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 3px; line-height: 1.4;">
              Hỗ trợ ảnh chụp màn hình Zalo, ảnh bảng TKB trường, ảnh chụp dọc/ngang (JPG, PNG, HEIC)
            </p>
            
            <div style="display: flex; justify-content: center; gap: 10px; margin-top: 14px; flex-wrap: wrap;">
              <label class="glass-button glass-button-primary" style="cursor: pointer; padding: 9px 16px;">
                <i data-lucide="upload" style="width: 15px; height: 15px;"></i> Chọn ảnh từ máy
                <input type="file" id="input-file-photo" accept="image/*" style="display: none;">
              </label>
              <button id="btn-demo-photo-import" class="glass-button" style="padding: 9px 16px;">
                <i data-lucide="sparkles" style="color: var(--primary); width: 15px; height: 15px;"></i> Dùng ảnh mẫu thử nghiệm
              </button>
            </div>
          </div>
        </div>
      `;
    } else if (this.activeTab === 'pdf') {
      tabContentHtml = `
        <div style="text-align: center;">
          <div style="border: 2px dashed rgba(59,130,246,0.35); background: rgba(255,255,255,0.6); border-radius: var(--radius-lg); padding: 32px 18px; cursor: pointer;" id="drop-zone-pdf">
            <div style="width: 56px; height: 56px; border-radius: 50%; background: rgba(59,130,246,0.12); display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; color: #3B82F6;">
              <i data-lucide="file-text" style="width: 28px; height: 28px;"></i>
            </div>
            <h4 style="font-size: 1.05rem; font-weight: 600; color: var(--text-main);">Tải lên file PDF Thời khóa biểu</h4>
            <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 3px; line-height: 1.4;">
              Hệ thống tự động phân tích từng trang, đọc danh sách lớp và bóc tách dữ liệu chuẩn xác
            </p>
            <div style="display: flex; justify-content: center; gap: 10px; margin-top: 14px;">
              <label class="glass-button glass-button-primary" style="cursor: pointer; padding: 9px 16px;">
                <i data-lucide="upload" style="width: 15px; height: 15px;"></i> Chọn file PDF
                <input type="file" id="input-file-pdf" accept=".pdf" style="display: none;">
              </label>
              <button id="btn-demo-pdf-import" class="glass-button" style="padding: 9px 16px;">
                <i data-lucide="sparkles" style="color: var(--primary); width: 15px; height: 15px;"></i> Dùng PDF mẫu
              </button>
            </div>
          </div>
        </div>
      `;
    } else if (this.activeTab === 'excel') {
      tabContentHtml = `
        <div style="text-align: center;">
          <div style="border: 2px dashed rgba(16,185,129,0.35); background: rgba(255,255,255,0.6); border-radius: var(--radius-lg); padding: 32px 18px; cursor: pointer;" id="drop-zone-excel">
            <div style="width: 56px; height: 56px; border-radius: 50%; background: rgba(16,185,129,0.12); display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; color: #10B981;">
              <i data-lucide="file-spreadsheet" style="width: 28px; height: 28px;"></i>
            </div>
            <h4 style="font-size: 1.05rem; font-weight: 600; color: var(--text-main);">Nhập từ file Excel / CSV (.xlsx, .csv)</h4>
            <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 3px; line-height: 1.4;">
              Tự động nhận diện tiêu đề cột Thứ, Tiết, Môn, Giáo viên, Phòng học
            </p>
            <div style="display: flex; justify-content: center; gap: 10px; margin-top: 14px;">
              <label class="glass-button glass-button-primary" style="cursor: pointer; padding: 9px 16px;">
                <i data-lucide="upload" style="width: 15px; height: 15px;"></i> Chọn file Excel
                <input type="file" id="input-file-excel" accept=".xlsx, .xls, .csv" style="display: none;">
              </label>
              <button id="btn-demo-excel-import" class="glass-button" style="padding: 9px 16px;">
                <i data-lucide="sparkles" style="color: var(--primary); width: 15px; height: 15px;"></i> Dùng Excel mẫu
              </button>
            </div>
          </div>
        </div>
      `;
    } else if (this.activeTab === 'link') {
      tabContentHtml = `
        <div style="padding: 16px; background: rgba(255,255,255,0.7); border-radius: var(--radius-md); border: 1px solid var(--glass-border);">
          <label style="font-size: 0.78rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 6px; display: block;">
            DÁN ĐƯỜNG DẪN (URL) TRANG THỜI KHÓA BIỂU CÔNG KHAI
          </label>
          <div style="display: flex; gap: 8px;">
            <input type="url" id="input-tkb-link" class="glass-input" placeholder="https://thpt-donganh.edu.vn/tkb-11a2" value="${isTHPT ? 'https://thpt-donganh.edu.vn/tkb-11a2' : 'https://qldt.haui.edu.vn/tkb-sinh-vien'}">
            <button id="btn-fetch-link" class="glass-button glass-button-primary" style="white-space: nowrap;">
              <i data-lucide="download-cloud" style="width: 15px; height: 15px;"></i> Đọc TKB
            </button>
          </div>
          <p style="font-size: 0.76rem; color: var(--text-secondary); margin-top: 8px; line-height: 1.4;">
            * Hệ thống sẽ tự động tải trang và phân tích bảng thời khóa biểu trực tuyến.
          </p>
        </div>
      `;
    } else if (this.activeTab === 'code') {
      tabContentHtml = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <!-- Enter Share Code -->
          <div style="background: var(--color-card-background); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--color-glass-border); text-align: center;">
            <div style="width: 44px; height: 44px; border-radius: 50%; background: var(--primary-light); display: flex; align-items: center; justify-content: center; margin: 0 auto 8px; color: var(--color-primary);">
              <i data-lucide="tag" style="width: 22px; height: 22px;"></i>
            </div>
            <h4 style="font-size: 0.92rem; font-weight: 600; color: var(--color-text);">Nhập mã chia sẻ</h4>
            <p style="font-size: 0.74rem; color: var(--color-text-secondary); margin-top: 2px;">Nhận mã do bạn cùng lớp hoặc lớp trưởng chia sẻ</p>
            <div style="margin-top: 10px; display: flex; gap: 6px;">
              <input type="text" id="input-share-code" class="glass-input" placeholder="VD: DA-11A2-W03" value="${isTHPT ? 'DA-11A2-W03' : 'HAUI-CNTT-W01'}" style="text-align: center; font-weight: 700; text-transform: uppercase;">
              <button id="btn-submit-share-code" class="glass-button glass-button-primary">Nhập</button>
            </div>
          </div>

          <!-- QR Code scan simulation -->
          <div style="background: var(--color-card-background); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--color-glass-border); text-align: center; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="width: 44px; height: 44px; border-radius: 50%; background: rgba(59,130,246,0.12); display: flex; align-items: center; justify-content: center; margin: 0 auto 8px; color: #3B82F6;">
                <i data-lucide="qr-code" style="width: 22px; height: 22px;"></i>
              </div>
              <h4 style="font-size: 0.92rem; font-weight: 600; color: var(--color-text);">Quét mã QR</h4>
              <p style="font-size: 0.74rem; color: var(--color-text-secondary); margin-top: 2px;">Dùng camera để quét mã QR từ điện thoại bạn bè</p>
            </div>
            <button id="btn-scan-qr-demo" class="glass-button" style="margin-top: 10px; width: 100%;">
              <i data-lucide="camera" style="width: 14px; height: 14px;"></i> Quét mã QR
            </button>
          </div>
        </div>
      `;
    }

    const targetUserBanner = isTHPT
      ? `Đang nhập TKB cho: <strong>${user.name || 'Nguyễn Doãn Uy Vũ'}</strong> · ${user.school || 'THPT Đông Anh'} · Lớp <strong>${this.selectedClass}</strong>`
      : `Đang nhập TKB cho: <strong>${user.name || 'Nguyễn Doãn Tuấn Hưng'}</strong> · ${user.university || 'HaUI'} · Khóa <strong>${user.cohort || '20'}</strong> (MSV: ${user.studentId || '2025601062'})`;

    this.backdrop.innerHTML = `
      <div class="modal-window" style="max-width: 700px;">
        <div class="modal-header">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div class="logo-icon-wrap" style="width: 38px; height: 38px;">
              <i data-lucide="sparkles" style="width: 20px; height: 20px;"></i>
            </div>
            <div>
              <h3 class="modal-title">Nhập Thời khóa biểu tự động</h3>
              <p style="font-size: 0.78rem; color: var(--color-text-secondary); font-weight: 500;">
                “Chụp TKB. Phần còn lại để app lo.”
              </p>
            </div>
          </div>
          <button id="import-close-x" class="icon-btn" style="width: 30px; height: 30px; font-size: 0.85rem;" aria-label="Đóng">&times;</button>
        </div>

        <!-- Target User & Class Banner -->
        <div style="padding: 12px 22px 0;">
          <div style="background: var(--primary-light); border-left: 3px solid var(--color-primary); border-radius: var(--radius-sm); padding: 8px 12px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 6px;">
            <div style="font-size: 0.78rem; color: var(--text-main);">
              ${targetUserBanner}
            </div>
            ${isTHPT ? `
              <div style="display: flex; align-items: center; gap: 6px;">
                <label style="font-size: 0.72rem; font-weight: 600; color: var(--text-secondary);">LỚP:</label>
                <select id="import-target-class-select" class="glass-input" style="padding: 3px 8px; font-size: 0.78rem; font-weight: 600; width: auto;">
                  <option value="11A2" ${this.selectedClass === '11A2' ? 'selected' : ''}>11A2 (Mặc định)</option>
                  <option value="11A1" ${this.selectedClass === '11A1' ? 'selected' : ''}>11A1</option>
                  <option value="12A1" ${this.selectedClass === '12A1' ? 'selected' : ''}>12A1</option>
                  <option value="12A2" ${this.selectedClass === '12A2' ? 'selected' : ''}>12A2</option>
                  <option value="12A3" ${this.selectedClass === '12A3' ? 'selected' : ''}>12A3</option>
                </select>
              </div>
            ` : ''}
          </div>
        </div>

        <!-- Tab Switcher Bar -->
        <div style="padding: 10px 22px 4px; display: flex; gap: 6px; flex-wrap: wrap;">
          ${tabButtonsHtml}
        </div>

        <div class="modal-body" style="padding: 14px 22px;">
          ${tabContentHtml}
        </div>

        <div class="modal-footer">
          <button id="btn-import-cancel" class="glass-button">Đóng</button>
        </div>
      </div>
    `;

    this.bindEvents();
    if (window.lucide) window.lucide.createIcons();
  },

  bindEvents() {
    document.getElementById('import-close-x')?.addEventListener('click', () => this.close());
    document.getElementById('btn-import-cancel')?.addEventListener('click', () => this.close());

    document.getElementById('import-target-class-select')?.addEventListener('change', (e) => {
      this.selectedClass = e.target.value;
    });

    this.backdrop.querySelectorAll('.btn-import-tab').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.activeTab = e.currentTarget.getAttribute('data-tab');
        this.renderUI();
      });
    });

    const triggerProcessing = async (type) => {
      const cls = document.getElementById('import-target-class-select')?.value || this.selectedClass;
      this.close();
      const result = OCREngine.parseMultiClassMatrix(cls);
      if (this.callbacks.onParsed) {
        this.callbacks.onParsed(result);
      }
    };

    document.getElementById('btn-demo-photo-import')?.addEventListener('click', () => triggerProcessing('photo'));
    document.getElementById('input-file-photo')?.addEventListener('change', () => triggerProcessing('photo'));

    document.getElementById('btn-demo-pdf-import')?.addEventListener('click', () => triggerProcessing('pdf'));
    document.getElementById('input-file-pdf')?.addEventListener('change', () => triggerProcessing('pdf'));

    document.getElementById('btn-demo-excel-import')?.addEventListener('click', () => triggerProcessing('excel'));
    document.getElementById('input-file-excel')?.addEventListener('change', () => triggerProcessing('excel'));

    document.getElementById('btn-fetch-link')?.addEventListener('click', () => triggerProcessing('link'));

    document.getElementById('btn-submit-share-code')?.addEventListener('click', async () => {
      const code = document.getElementById('input-share-code')?.value.trim();
      const res = await ShareEngine.loadByClassCode(code);
      if (res.success) {
        this.close();
        if (this.callbacks.onShareCodeImported) {
          this.callbacks.onShareCodeImported(res);
        }
      } else {
        alert(res.error);
      }
    });

    document.getElementById('btn-scan-qr-demo')?.addEventListener('click', async () => {
      const res = await ShareEngine.loadByClassCode('DA-11A2-W03');
      this.close();
      if (this.callbacks.onShareCodeImported) {
        this.callbacks.onShareCodeImported(res);
      }
    });
  },

  open() {
    if (this.backdrop) this.backdrop.classList.add('open');
  },

  close() {
    if (this.backdrop) this.backdrop.classList.remove('open');
  }
};
