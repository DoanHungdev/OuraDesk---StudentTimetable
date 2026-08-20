/**
 * AvatarModal Component: Interactive Profile Avatar Selector & Customizer
 * Modes:
 * 1. 🌟 Emoji & Mascots (Sinh viên, Linh vật Cute, Năng động)
 * 2. 🔤 Initials Generator (Tùy chỉnh chữ cái + Bảng màu Gradient)
 * 3. 🖼️ Upload Photo / URL (Tải ảnh từ máy, nén ảnh tự động lưu localStorage)
 */
import { AVATAR_GRADIENTS, AVATAR_EMOJI_GROUPS, AvatarHelper } from '../utils/avatarHelper.js';
import { Storage } from '../utils/storage.js';

export const AvatarModal = {
  backdrop: null,
  callbacks: {},
  currentUser: null,
  activeTab: 'emoji', // 'emoji' | 'initials' | 'upload'
  selectedAvatar: '🎓',
  selectedGradient: AVATAR_GRADIENTS[0].value,
  customInitials: 'TH',

  init(callbacks = {}) {
    this.callbacks = callbacks;
    this.renderContainer();
  },

  renderContainer() {
    let el = document.getElementById('avatar-modal-backdrop');
    if (!el) {
      el = document.createElement('div');
      el.id = 'avatar-modal-backdrop';
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

  openModal(user = {}) {
    this.currentUser = user || Storage.getUser();
    this.selectedAvatar = this.currentUser.avatar || (this.currentUser.mode === 'high_school' ? 'UV' : 'TH');
    this.selectedGradient = this.currentUser.avatarGradient || AVATAR_GRADIENTS[0].value;
    this.customInitials = AvatarHelper.getInitialsFromName(this.currentUser.name);
    this.activeTab = 'emoji';

    this.renderUI();
    this.open();
  },

  renderUI() {
    // 1. Emoji Grid HTML
    const emojiSectionsHtml = AVATAR_EMOJI_GROUPS.map(group => `
      <div style="margin-bottom: 12px;">
        <label style="font-size: 0.74rem; font-weight: 700; color: var(--color-text-secondary); text-transform: uppercase; margin-bottom: 6px; display: block;">
          ${group.title}
        </label>
        <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px;">
          ${group.emojis.map(em => {
            const isSel = this.selectedAvatar === em;
            return `
              <button type="button" class="avatar-emoji-btn glass-card ${isSel ? 'active-border' : ''}" data-emoji="${em}" style="font-size: 1.5rem; height: 50px; display: flex; align-items: center; justify-content: center; cursor: pointer; border-radius: var(--radius-md); transition: all 0.15s ease; ${isSel ? 'border: 2px solid var(--color-primary); background: var(--primary-light);' : ''}">
                ${em}
              </button>
            `;
          }).join('')}
        </div>
      </div>
    `).join('');

    // 2. Gradient Color Pills HTML
    const gradientsHtml = AVATAR_GRADIENTS.map(g => {
      const isSel = this.selectedGradient === g.value;
      return `
        <button type="button" class="avatar-gradient-pill ${isSel ? 'active-gradient' : ''}" data-gradient="${g.value}" style="cursor: pointer; width: 36px; height: 36px; border-radius: 50%; background: ${g.value}; border: ${isSel ? '3px solid var(--color-primary)' : '2px solid rgba(255,255,255,0.8)'}; box-shadow: 0 2px 6px rgba(0,0,0,0.15); transition: transform 0.15s ease;" title="${g.name}">
        </button>
      `;
    }).join('');

    // 3. Temporary preview user
    const previewUser = {
      ...this.currentUser,
      avatar: this.selectedAvatar,
      avatarGradient: this.selectedGradient
    };
    const avatarPreviewHtml = AvatarHelper.renderAvatarHtml(previewUser, 76);

    this.backdrop.innerHTML = `
      <div class="modal-window fade-in-lift" style="max-width: 520px; border-radius: var(--radius-xl); overflow: hidden; border: 1px solid var(--color-glass-border); box-shadow: 0 20px 48px var(--color-shadow);">
        <!-- Header -->
        <div class="modal-header" style="background: linear-gradient(135deg, var(--primary-light) 0%, var(--color-glass) 100%); padding: 18px 24px; border-bottom: 1px solid var(--color-glass-border);">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 44px; height: 44px; border-radius: var(--radius-md); background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 1.3rem; box-shadow: 0 4px 12px var(--primary-glow); flex-shrink: 0;">
              ✨
            </div>
            <div>
              <h3 class="modal-title" style="font-size: 1.18rem; font-weight: 700; color: var(--color-text); line-height: 1.25;">Chọn Avatar cá nhân</h3>
              <p style="font-size: 0.78rem; color: var(--color-text-secondary); margin-top: 2px;">
                Tùy chỉnh ảnh đại diện hiển thị trên Sidebar và góc học tập
              </p>
            </div>
          </div>
          <button id="avatar-modal-close-x" class="icon-btn" style="width: 32px; height: 32px; font-size: 1rem;" aria-label="Đóng">&times;</button>
        </div>

        <!-- Live Avatar Preview Card -->
        <div style="padding: 16px 24px; background: var(--color-glass); border-bottom: 1px solid var(--color-glass-border); display: flex; align-items: center; gap: 16px;">
          <div id="avatar-live-preview-box">
            ${avatarPreviewHtml}
          </div>
          <div>
            <span style="font-size: 0.72rem; font-weight: 700; color: var(--color-primary); text-transform: uppercase;">XEM TRƯỚC HIỂN THỊ</span>
            <h4 style="font-size: 1.05rem; font-weight: 700; color: var(--color-text); margin-top: 1px;">
              ${this.currentUser.name || 'Sinh viên'}
            </h4>
            <p style="font-size: 0.76rem; color: var(--color-text-secondary); margin-top: 2px;">
              ${this.currentUser.mode === 'high_school' ? (this.currentUser.school || 'THPT Đông Anh') : (this.currentUser.university || 'Đại học Công nghiệp Hà Nội')}
            </p>
          </div>
        </div>

        <!-- Mode switcher tabs -->
        <div style="padding: 0 24px; padding-top: 10px; display: flex; gap: 6px; border-bottom: 1px solid var(--color-glass-border); background: var(--color-glass);">
          <button id="tab-btn-av-emoji" class="glass-pill ${this.activeTab === 'emoji' ? 'active' : ''}" style="cursor: pointer; border-bottom-left-radius: 0; border-bottom-right-radius: 0; ${this.activeTab === 'emoji' ? 'background: var(--color-primary); color: white;' : ''}">
            <i data-lucide="smile" style="width: 14px; height: 14px;"></i> 🌟 Emoji & Linh vật
          </button>
          <button id="tab-btn-av-initials" class="glass-pill ${this.activeTab === 'initials' ? 'active' : ''}" style="cursor: pointer; border-bottom-left-radius: 0; border-bottom-right-radius: 0; ${this.activeTab === 'initials' ? 'background: var(--color-primary); color: white;' : ''}">
            <i data-lucide="type" style="width: 14px; height: 14px;"></i> 🔤 Chữ viết tắt
          </button>
          <button id="tab-btn-av-upload" class="glass-pill ${this.activeTab === 'upload' ? 'active' : ''}" style="cursor: pointer; border-bottom-left-radius: 0; border-bottom-right-radius: 0; ${this.activeTab === 'upload' ? 'background: var(--color-primary); color: white;' : ''}">
            <i data-lucide="image" style="width: 14px; height: 14px;"></i> 🖼️ Tải ảnh từ máy
          </button>
        </div>

        <!-- Body -->
        <div class="modal-body custom-scroll" style="padding: 16px 24px; max-height: 52vh; overflow-y: auto;">
          ${this.activeTab === 'emoji' ? `
            <!-- Background Gradient Selection -->
            <div style="margin-bottom: 14px; padding-bottom: 12px; border-bottom: 1px dashed var(--color-glass-border);">
              <label style="font-size: 0.74rem; font-weight: 700; color: var(--color-text-secondary); text-transform: uppercase; margin-bottom: 8px; display: block;">
                MÀU NỀN GRADIENT
              </label>
              <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                ${gradientsHtml}
              </div>
            </div>

            <!-- Emoji Groups -->
            ${emojiSectionsHtml}
          ` : (this.activeTab === 'initials' ? `
            <!-- Initials Form -->
            <div style="display: flex; flex-direction: column; gap: 14px;">
              <div>
                <label style="font-size: 0.74rem; font-weight: 700; color: var(--color-text-secondary); text-transform: uppercase; margin-bottom: 6px; display: block;">
                  CHỮ CÁI VIẾT TẮT (1 – 3 KÝ TỰ)
                </label>
                <input type="text" id="avatar-initials-input" class="glass-input" maxlength="3" value="${this.customInitials}" style="font-size: 1.1rem; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; text-align: center; width: 120px;">
              </div>

              <div>
                <label style="font-size: 0.74rem; font-weight: 700; color: var(--color-text-secondary); text-transform: uppercase; margin-bottom: 8px; display: block;">
                  MÀU NỀN GRADIENT
                </label>
                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                  ${gradientsHtml}
                </div>
              </div>
            </div>
          ` : `
            <!-- Photo Upload Form -->
            <div style="display: flex; flex-direction: column; gap: 14px;">
              <!-- File dropzone -->
              <div id="avatar-dropzone" style="border: 2px dashed var(--color-primary); background: var(--primary-light); border-radius: var(--radius-md); padding: 24px; text-align: center; cursor: pointer; transition: all 0.2s ease;">
                <input type="file" id="avatar-file-input" accept="image/*" style="display: none;">
                <i data-lucide="upload-cloud" style="width: 36px; height: 36px; color: var(--color-primary); margin-bottom: 6px;"></i>
                <h4 style="font-size: 0.94rem; font-weight: 700; color: var(--color-text);">Chọn ảnh từ máy tính / điện thoại</h4>
                <p style="font-size: 0.76rem; color: var(--color-text-secondary); margin-top: 3px;">
                  Hỗ trợ JPG, PNG, WebP (Tối ưu tự động)
                </p>
              </div>

              <!-- Or Paste Image URL -->
              <div>
                <label style="font-size: 0.74rem; font-weight: 700; color: var(--color-text-secondary); text-transform: uppercase; margin-bottom: 4px; display: block;">
                  HOẶC DÁN ĐƯỜNG DẪN ẢNH (URL)
                </label>
                <div style="display: flex; gap: 8px;">
                  <input type="url" id="avatar-url-input" class="glass-input" placeholder="https://example.com/avatar.jpg" value="${this.selectedAvatar.startsWith('http') ? this.selectedAvatar : ''}">
                  <button type="button" id="btn-apply-avatar-url" class="glass-button" style="white-space: nowrap;">Áp dụng</button>
                </div>
              </div>
            </div>
          `)}
        </div>

        <!-- Footer -->
        <div class="modal-footer" style="padding: 14px 24px; background: var(--color-glass); border-top: 1px solid var(--color-glass-border); display: flex; justify-content: space-between; align-items: center;">
          <button id="btn-avatar-cancel" class="glass-button" style="padding: 8px 16px;">Hủy</button>
          <button id="btn-avatar-save" class="glass-button glass-button-primary" style="padding: 8px 22px; font-weight: 700;">
            <i data-lucide="check" style="width: 15px; height: 15px;"></i> Lưu Avatar này
          </button>
        </div>
      </div>
    `;

    this.bindEvents();
    if (window.lucide) window.lucide.createIcons();
  },

  bindEvents() {
    this.backdrop.querySelector('#avatar-modal-close-x')?.addEventListener('click', () => this.close());
    this.backdrop.querySelector('#btn-avatar-cancel')?.addEventListener('click', () => this.close());

    // Switch Tabs
    this.backdrop.querySelector('#tab-btn-av-emoji')?.addEventListener('click', () => {
      this.activeTab = 'emoji';
      if (!/\p{Extended_Pictographic}/u.test(this.selectedAvatar)) {
        this.selectedAvatar = '🎓';
      }
      this.renderUI();
    });

    this.backdrop.querySelector('#tab-btn-av-initials')?.addEventListener('click', () => {
      this.activeTab = 'initials';
      this.selectedAvatar = this.customInitials || AvatarHelper.getInitialsFromName(this.currentUser.name);
      this.renderUI();
    });

    this.backdrop.querySelector('#tab-btn-av-upload')?.addEventListener('click', () => {
      this.activeTab = 'upload';
      this.renderUI();
    });

    // Emoji click: dynamic selection without DOM destruction
    this.backdrop.querySelectorAll('.avatar-emoji-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const emoji = e.currentTarget.getAttribute('data-emoji');
        this.selectedAvatar = emoji;
        this.backdrop.querySelectorAll('.avatar-emoji-btn').forEach(b => {
          b.style.border = '1px solid var(--color-glass-border)';
          b.style.background = 'var(--color-card-background)';
        });
        e.currentTarget.style.border = '2px solid var(--color-primary)';
        e.currentTarget.style.background = 'var(--primary-light)';
        this.updateLivePreview();
      });
    });

    // Gradient click: dynamic selection without DOM destruction
    this.backdrop.querySelectorAll('.avatar-gradient-pill').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const gradient = e.currentTarget.getAttribute('data-gradient');
        this.selectedGradient = gradient;
        this.backdrop.querySelectorAll('.avatar-gradient-pill').forEach(b => {
          b.style.border = '2px solid rgba(255,255,255,0.8)';
        });
        e.currentTarget.style.border = '3px solid var(--color-primary)';
        this.updateLivePreview();
      });
    });

    // Initials input
    const initialsInput = this.backdrop.querySelector('#avatar-initials-input');
    initialsInput?.addEventListener('input', (e) => {
      this.customInitials = e.target.value.trim().toUpperCase() || 'ST';
      this.selectedAvatar = this.customInitials;
      this.updateLivePreview();
    });

    // File Dropzone & Upload
    const dropzone = this.backdrop.querySelector('#avatar-dropzone');
    const fileInput = this.backdrop.querySelector('#avatar-file-input');

    dropzone?.addEventListener('click', () => {
      fileInput?.click();
    });

    fileInput?.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // Resize & compress to lightweight square thumbnail
          const canvas = document.createElement('canvas');
          const maxDim = 200;
          let w = img.width;
          let h = img.height;
          const minDim = Math.min(w, h);
          const sx = (w - minDim) / 2;
          const sy = (h - minDim) / 2;

          canvas.width = maxDim;
          canvas.height = maxDim;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, maxDim, maxDim);

          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.85);
          this.selectedAvatar = compressedBase64;
          this.updateLivePreview();
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });

    // Apply URL
    this.backdrop.querySelector('#btn-apply-avatar-url')?.addEventListener('click', () => {
      const urlInput = this.backdrop.querySelector('#avatar-url-input');
      if (urlInput && urlInput.value.trim()) {
        this.selectedAvatar = urlInput.value.trim();
        this.updateLivePreview();
      }
    });

    // Save
    this.backdrop.querySelector('#btn-avatar-save')?.addEventListener('click', () => {
      this.saveAvatar();
    });
  },

  updateLivePreview() {
    const box = this.backdrop.querySelector('#avatar-live-preview-box');
    if (!box) return;

    const previewUser = {
      ...this.currentUser,
      avatar: this.selectedAvatar,
      avatarGradient: this.selectedGradient
    };
    box.innerHTML = AvatarHelper.renderAvatarHtml(previewUser, 76);
  },

  saveAvatar() {
    const updated = {
      ...this.currentUser,
      avatar: this.selectedAvatar,
      avatarGradient: this.selectedGradient
    };

    Storage.saveUser(updated);
    this.close();

    if (this.callbacks.onAvatarSaved) {
      this.callbacks.onAvatarSaved(updated);
    }
  },

  open() {
    if (this.backdrop) {
      this.backdrop.classList.add('open');
    }
  },

  close() {
    if (this.backdrop) {
      this.backdrop.classList.remove('open');
    }
  }
};
