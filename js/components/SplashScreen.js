/**
 * SplashScreen Component — OuraDesk Pure Code High-Precision Motion Intro
 * 100% Code-based animation (SVG + CSS GPU Transforms + Fluid Timeline)
 * Continuous frame-to-frame flow matching reference:
 * 1. [0.0s - 0.9s] Diamond Scale & Rotation: Coral-orange rounded square grows at center, rotating 45° with ambient shadow
 * 2. [0.9s - 1.8s] Unrotate & Glide Left: Rotates 45° -> 0° while gliding to the left to form the lockup
 * 3. [1.2s - 2.2s] Logo Morph & Wordmark Reveal: White T-slit cuts in, 3D corner-fold peels up, "OuraDesk" slides out from behind logo
 * 4. [2.0s - 2.8s] Tagline Glide: "Chụp TKB. App lo." fades and glides up under OuraDesk
 * 5. [2.8s - 5.0s] 3D Pill Progress Bar: 3D capsule track appears and smoothly fills 0% -> 100% with percentage text
 * 6. [5.2s - 5.8s] Seamless Exit Transition: Smooth scale-fade into the main dashboard
 */

export const SplashScreen = {
  container: null,
  isCompleted: false,
  timelineTimer: null,
  rafId: null,

  init(onComplete) {
    this.onComplete = onComplete;
    this.mount();
    this.startTimeline();
  },

  mount() {
    let el = document.getElementById('ouradesk-splash');
    if (!el) {
      el = document.createElement('div');
      el.id = 'ouradesk-splash';
      el.className = 'ouradesk-splash-screen';
      document.body.appendChild(el);
    }
    this.container = el;

    this.container.innerHTML = `
      <div class="pure-splash-stage" id="splash-stage">
        <!-- Master Lockup Row -->
        <div class="pure-splash-lockup" id="splash-lockup">
          
          <!-- Logo Mark Anchor (Moves from center to left) -->
          <div class="pure-mark-anchor" id="splash-mark-anchor">
            
            <!-- Dynamic Diffuse Shadow -->
            <div class="pure-mark-shadow" id="splash-shadow"></div>

            <!-- Morphing Logo Graphic Container -->
            <div class="pure-mark-shape" id="splash-mark-shape">
              <svg viewBox="0 0 100 100" width="100%" height="100%" class="pure-logo-svg" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <!-- Top Bar Gradient -->
                  <linearGradient id="codeTopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#F16C6C" />
                    <stop offset="100%" stop-color="#F59E72" />
                  </linearGradient>
                  
                  <!-- Bottom Left Gradient -->
                  <linearGradient id="codeBLGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#E85D75" />
                    <stop offset="50%" stop-color="#F16C6C" />
                    <stop offset="100%" stop-color="#F59E72" />
                  </linearGradient>

                  <!-- Right Vertical Pillar Gradient -->
                  <linearGradient id="codeRightGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#F59E72" />
                    <stop offset="100%" stop-color="#F16C6C" />
                  </linearGradient>

                  <!-- 3D Page Fold Peel Gradient -->
                  <linearGradient id="codeFoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#FFE8E0" />
                    <stop offset="50%" stop-color="#FFBBAA" />
                    <stop offset="100%" stop-color="#FFA085" />
                  </linearGradient>

                  <!-- Realistic Drop Shadow for Corner Peel -->
                  <filter id="codeFoldShadow" x="-40%" y="-40%" width="180%" height="180%">
                    <feDropShadow dx="-2" dy="-2" stdDeviation="2.5" flood-color="#551206" flood-opacity="0.35" />
                  </filter>
                </defs>

                <!-- Initial Solid Rounded Square (fades out as cuts reveal) -->
                <rect class="pure-solid-bg" x="10" y="10" width="80" height="80" rx="18" fill="url(#codeTopGrad)" />

                <!-- Cutout Part 1: Top Bar -->
                <path class="pure-part pure-part-top" d="M 12 10 L 88 10 A 14 14 0 0 1 100 24 L 100 38 L 62 38 L 62 44 L 10 44 L 10 24 A 14 14 0 0 1 24 10 Z" fill="url(#codeTopGrad)" />

                <!-- Cutout Part 2: Bottom-Left Chamfered Polygon -->
                <path class="pure-part pure-part-bl" d="M 10 50 L 26 50 L 48 72 L 48 90 L 24 90 A 14 14 0 0 1 10 76 Z" fill="url(#codeBLGrad)" />

                <!-- Cutout Part 3: Right Pillar -->
                <path class="pure-part pure-part-right" d="M 54 44 L 100 44 L 100 68 L 76 90 L 54 90 Z" fill="url(#codeRightGrad)" />

                <!-- Cutout Part 4: 3D Corner Peel -->
                <path class="pure-part pure-part-fold" d="M 76 90 L 100 68 L 76 68 Z" fill="url(#codeFoldGrad)" filter="url(#codeFoldShadow)" />
              </svg>
            </div>
          </div>

          <!-- Typography Mask Container (Slides out from behind logo) -->
          <div class="pure-typo-mask" id="splash-typo-mask">
            <div class="pure-typo-content" id="splash-typo-content">
              <div class="pure-wordmark">OuraDesk</div>
              <div class="pure-tagline">Chụp TKB. App lo.</div>
            </div>
          </div>
        </div>

        <!-- 3D Pill Progress Bar -->
        <div class="pure-progress-container" id="splash-progress-container">
          <div class="pure-progress-track">
            <div class="pure-progress-fill" id="splash-progress-bar">
              <span class="pure-progress-text" id="splash-progress-label"></span>
            </div>
          </div>
        </div>
      </div>
    `;

    // Global developer APIs
    window.ouradeskReplayIntro = () => {
      sessionStorage.removeItem('ouradesk.introPlayed');
      window.location.reload();
    };
  },

  startTimeline() {
    const startTime = performance.now();
    const stage = this.container;
    const progressBar = document.getElementById('splash-progress-bar');
    const progressLabel = document.getElementById('splash-progress-label');

    // Trigger main master class which drives continuous synchronized CSS keyframes
    requestAnimationFrame(() => {
      stage?.classList.add('pure-animate');
    });

    // Smooth numerical progress interpolation (2.8s -> 4.9s)
    const progressStart = 2800;
    const progressDuration = 2100;

    const updateFrame = (now) => {
      if (this.isCompleted) return;
      const elapsed = now - startTime;

      if (elapsed >= progressStart && elapsed <= progressStart + progressDuration + 100) {
        const t = Math.min(1, Math.max(0, (elapsed - progressStart) / progressDuration));
        // Ease-in-out quint
        const ease = t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;
        const percent = Math.round(ease * 100);

        if (progressBar) {
          progressBar.style.width = `${percent}%`;
        }
        if (progressLabel) {
          if (percent >= 85) {
            progressLabel.textContent = `${percent}%`;
            progressLabel.style.opacity = '1';
          } else {
            progressLabel.style.opacity = '0';
          }
        }
      } else if (elapsed > progressStart + progressDuration + 100) {
        if (progressBar) progressBar.style.width = '100%';
        if (progressLabel) {
          progressLabel.textContent = '100%';
          progressLabel.style.opacity = '1';
        }
      }

      // Exit transition at 5.3s
      if (elapsed >= 5300 && !this.isCompleted) {
        this.finish();
        return;
      }

      this.rafId = requestAnimationFrame(updateFrame);
    };

    this.rafId = requestAnimationFrame(updateFrame);
  },

  finish() {
    if (this.isCompleted) return;
    this.isCompleted = true;

    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    sessionStorage.setItem('ouradesk.introPlayed', 'true');

    if (this.container) {
      this.container.classList.add('step-splash-exit');
      
      setTimeout(() => {
        if (this.container && this.container.parentNode) {
          this.container.parentNode.removeChild(this.container);
        }
        if (this.onComplete) {
          this.onComplete();
        }
      }, 500);
    } else {
      if (this.onComplete) this.onComplete();
    }
  }
};
