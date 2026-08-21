/**
 * SplashScreen Component — OuraDesk High-Precision Motion Intro (5.8s Timeline)
 * Recreates the exact choreography, timing, spacing, and transition from reference specification.
 * 
 * Timeline Architecture:
 * 0.00s       : Clean #F7F7F5 background
 * 0.00–0.20s  : 12px Coral square appears at exact center
 * 0.20–1.20s  : Square scales up (12px -> 84px), subtle rotation (-12deg -> 10deg -> -3deg -> 0deg), soft shadow expands
 * 1.20–1.70s  : Square settles and transforms into OuraDesk geometric logo mark (cut paths & page-fold peel)
 * 1.70–2.30s  : Wordmark "OuraDesk" slides in to the right of the logo mark
 * 2.30–2.90s  : Full horizontal logo lockup completes
 * 2.70–3.10s  : Tagline "Chụp TKB. App lo." fades in below wordmark
 * 3.10–3.60s  : Loading bar track appears below the lockup
 * 3.60–5.40s  : Organic progress loading (5% -> 20% -> 55% -> 85% -> 100%)
 * 5.40–5.80s  : Progress hits 100% with soft highlight
 * 5.80s       : Transition out (scale 1 -> 0.98, opacity 1 -> 0) revealing the main dashboard
 */

export const SplashScreen = {
  container: null,
  isCompleted: false,
  startTime: 0,
  progressValue: 0,
  minDuration: 5800, // 5.8 seconds

  init(onComplete) {
    this.onComplete = onComplete;
    
    // Check if intro has already played in this browser session
    const hasPlayed = sessionStorage.getItem('ouradesk.introPlayed');
    if (hasPlayed === 'true') {
      if (this.onComplete) this.onComplete();
      return;
    }

    this.mount();
    this.startAnimation();
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
      <div class="splash-stage">
        <!-- Center Stage: Logo Lockup Container -->
        <div class="splash-lockup-wrapper" id="splash-lockup">
          
          <!-- Logo Mark + Morphing Square -->
          <div class="splash-mark-container" id="splash-mark-box">
            <!-- Dynamic Soft Shadow under the square/logo -->
            <div class="splash-mark-shadow" id="splash-shadow"></div>

            <!-- The Initial 12px Coral Square that expands and morphs -->
            <div class="splash-initial-square" id="splash-square"></div>

            <!-- SVG Vector Logo Mark (Revealed as square morphs) -->
            <div class="splash-svg-mark" id="splash-svg-mark">
              <svg viewBox="0 0 100 100" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="spTopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#F16C6C" />
                    <stop offset="100%" stop-color="#F59E72" />
                  </linearGradient>
                  <linearGradient id="spBottomLeftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#E85D75" />
                    <stop offset="60%" stop-color="#F16C6C" />
                    <stop offset="100%" stop-color="#F59E72" />
                  </linearGradient>
                  <linearGradient id="spRightGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#F59E72" />
                    <stop offset="100%" stop-color="#F16C6C" />
                  </linearGradient>
                  <linearGradient id="spFoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#FFDDD4" />
                    <stop offset="50%" stop-color="#FFBBAA" />
                    <stop offset="100%" stop-color="#FFA085" />
                  </linearGradient>
                  <filter id="spFoldShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="-1" dy="-1" stdDeviation="1.5" flood-color="#7A2210" flood-opacity="0.25" />
                  </filter>
                </defs>

                <!-- Part 1: Top Bar -->
                <path class="sp-part sp-part-top" d="M 12 10 L 88 10 A 14 14 0 0 1 100 24 L 100 38 L 62 38 L 62 44 L 10 44 L 10 24 A 14 14 0 0 1 24 10 Z" fill="url(#spTopGrad)" />

                <!-- Part 2: Bottom-Left Polygon -->
                <path class="sp-part sp-part-bl" d="M 10 50 L 26 50 L 48 72 L 48 90 L 24 90 A 14 14 0 0 1 10 76 Z" fill="url(#spBottomLeftGrad)" />

                <!-- Part 3: Right Pillar -->
                <path class="sp-part sp-part-right" d="M 54 44 L 100 44 L 100 68 L 76 90 L 54 90 Z" fill="url(#spRightGrad)" />

                <!-- Part 4: Folded Corner -->
                <path class="sp-part sp-part-fold" d="M 76 90 L 100 68 L 76 68 Z" fill="url(#spFoldGrad)" filter="url(#spFoldShadow)" />
              </svg>
            </div>
          </div>

          <!-- Typography Box (Wordmark + Tagline) -->
          <div class="splash-typography" id="splash-typo">
            <h1 class="splash-wordmark" id="splash-wordmark">OuraDesk</h1>
            <p class="splash-tagline" id="splash-tagline">Chụp TKB. App lo.</p>
          </div>
        </div>

        <!-- Loading Bar Section -->
        <div class="splash-progress-wrapper" id="splash-progress-box">
          <div class="splash-progress-track">
            <div class="splash-progress-fill" id="splash-progress-fill">
              <div class="splash-progress-glow"></div>
            </div>
          </div>
          <div class="splash-loading-text" id="splash-loading-text">Đang tải thời khóa biểu...</div>
        </div>
      </div>
    `;

    // Global developer helper functions
    window.ouradeskReplayIntro = () => {
      sessionStorage.removeItem('ouradesk.introPlayed');
      window.location.reload();
    };
    window.ouradeskSkipIntro = () => {
      this.finish();
    };
  },

  startAnimation() {
    this.startTime = performance.now();
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      // Reduced motion: simplified quick fade
      setTimeout(() => this.finish(), 1200);
      return;
    }

    // Step-by-step Class Triggering matching the exact reference timeline:
    
    // T = 0.05s: Initial 12px dot appears
    setTimeout(() => {
      this.container?.classList.add('step-dot-appear');
    }, 50);

    // T = 0.20s: Square grows from 12px -> 84px with rotation (-12deg -> 10deg -> -3deg -> 0deg)
    setTimeout(() => {
      this.container?.classList.add('step-square-grow');
    }, 200);

    // T = 1.20s: Settle and Morph into OuraDesk Logo Mark
    setTimeout(() => {
      this.container?.classList.add('step-logo-morph');
    }, 1200);

    // T = 1.70s: Wordmark reveals to the right of logo mark
    setTimeout(() => {
      this.container?.classList.add('step-wordmark-reveal');
    }, 1700);

    // T = 2.70s: Tagline "Chụp TKB. App lo." reveals
    setTimeout(() => {
      this.container?.classList.add('step-tagline-reveal');
    }, 2700);

    // T = 3.10s: Progress bar track appears
    setTimeout(() => {
      this.container?.classList.add('step-progress-appear');
      this.runProgressAnimation();
    }, 3100);
  },

  runProgressAnimation() {
    const progressFill = document.getElementById('splash-progress-fill');
    const loadingText = document.getElementById('splash-loading-text');

    // Milestones from app start (0ms):
    const keyframes = [
      { totalTime: 3500, percent: 12, text: 'Đang tải dữ liệu trường học...' },
      { totalTime: 4000, percent: 28, text: 'Xác thực chương trình đào tạo...' },
      { totalTime: 4600, percent: 58, text: 'Đồng bộ thời khóa biểu sinh viên...' },
      { totalTime: 5100, percent: 84, text: 'Kiểm tra deadline & bài tập...' },
      { totalTime: 5500, percent: 98, text: 'Hoàn tất cấu hình giao diện...' },
      { totalTime: 5750, percent: 100, text: 'Sẵn sàng!' }
    ];

    keyframes.forEach(step => {
      const delay = Math.max(0, step.totalTime - 3100);
      setTimeout(() => {
        if (progressFill && !this.isCompleted) {
          progressFill.style.width = `${step.percent}%`;
        }
        if (loadingText && !this.isCompleted && step.text) {
          loadingText.textContent = step.text;
        }
      }, delay);
    });

    // T = 5.80s (2700ms after 3.10s): Trigger Exit Transition
    setTimeout(() => {
      this.finish();
    }, Math.max(0, this.minDuration - 3100));
  },

  finish() {
    if (this.isCompleted) return;
    this.isCompleted = true;

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
      }, 480);
    } else {
      if (this.onComplete) this.onComplete();
    }
  }
};
