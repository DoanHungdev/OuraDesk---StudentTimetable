/**
 * SplashScreen Component — OuraDesk High-Precision Motion Intro
 * Recreated 1:1 from the Reference Video ("Video Project.mp4"):
 * - Initial Coral square growing and rotating like a diamond (45deg)
 * - Settling and shifting left as the OuraDesk Logo Mark (with "T" slit and corner-fold peel) materializes
 * - Wordmark "OuraDesk" sliding out smoothly from the right of the logo mark
 * - Tagline "Chụp TKB. App lo." centered under the wordmark
 * - 3D Neumorphic pill progress bar with glowing coral-orange gradient and embedded percentage text
 * - Seamless transition into the main web application
 */

export const SplashScreen = {
  container: null,
  isCompleted: false,
  startTime: 0,
  minDuration: 4200, // Matching 4.2s video timeline

  init(onComplete) {
    this.onComplete = onComplete;
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

    // Allow user to click anywhere or press Esc/Space to skip immediately if they want
    this.container.onclick = () => this.finish();
    const keyHandler = (e) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        this.finish();
        window.removeEventListener('keydown', keyHandler);
      }
    };
    window.addEventListener('keydown', keyHandler);

    this.container.innerHTML = `
      <div class="splash-stage">
        <!-- Center Stage: Logo Lockup Container -->
        <div class="splash-lockup-wrapper" id="splash-lockup">
          
          <!-- Logo Mark Box -->
          <div class="splash-mark-container" id="splash-mark-box">
            <!-- Warm Diffuse Ambient Shadow -->
            <div class="splash-mark-shadow" id="splash-shadow"></div>

            <!-- Morphing Diamond / Square Shape -->
            <div class="splash-initial-square" id="splash-square"></div>

            <!-- Full Vector OuraDesk Brand Mark -->
            <div class="splash-svg-mark" id="splash-svg-mark">
              <svg viewBox="0 0 100 100" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <!-- Top Bar Gradient -->
                  <linearGradient id="spTopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#F16C6C" />
                    <stop offset="100%" stop-color="#F59E72" />
                  </linearGradient>
                  
                  <!-- Bottom Left Gradient -->
                  <linearGradient id="spBottomLeftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#E85D75" />
                    <stop offset="60%" stop-color="#F16C6C" />
                    <stop offset="100%" stop-color="#F59E72" />
                  </linearGradient>

                  <!-- Right Pillar Gradient -->
                  <linearGradient id="spRightGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#F59E72" />
                    <stop offset="100%" stop-color="#F16C6C" />
                  </linearGradient>

                  <!-- Page Fold Peel Gradient -->
                  <linearGradient id="spFoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#FFDDD4" />
                    <stop offset="50%" stop-color="#FFBBAA" />
                    <stop offset="100%" stop-color="#FFA085" />
                  </linearGradient>

                  <filter id="spFoldShadow" x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="-1.5" dy="-1.5" stdDeviation="2" flood-color="#6B1D0E" flood-opacity="0.3" />
                  </filter>
                </defs>

                <!-- Part 1: Top Bar (Rounded Top-Left & Top-Right) -->
                <path class="sp-part sp-part-top" d="M 12 10 L 88 10 A 14 14 0 0 1 100 24 L 100 38 L 62 38 L 62 44 L 10 44 L 10 24 A 14 14 0 0 1 24 10 Z" fill="url(#spTopGrad)" />

                <!-- Part 2: Bottom-Left Polygon (Chamfered Top-Right) -->
                <path class="sp-part sp-part-bl" d="M 10 50 L 26 50 L 48 72 L 48 90 L 24 90 A 14 14 0 0 1 10 76 Z" fill="url(#spBottomLeftGrad)" />

                <!-- Part 3: Right Vertical Pillar / Stem -->
                <path class="sp-part sp-part-right" d="M 54 44 L 100 44 L 100 68 L 76 90 L 54 90 Z" fill="url(#spRightGrad)" />

                <!-- Part 4: Folded Page Corner (Peel Effect) -->
                <path class="sp-part sp-part-fold" d="M 76 90 L 100 68 L 76 68 Z" fill="url(#spFoldGrad)" filter="url(#spFoldShadow)" />
              </svg>
            </div>
          </div>

          <!-- Typography Box: Wordmark + Tagline -->
          <div class="splash-typography" id="splash-typo">
            <h1 class="splash-wordmark" id="splash-wordmark">OuraDesk</h1>
            <p class="splash-tagline" id="splash-tagline">Chụp TKB. App lo.</p>
          </div>
        </div>

        <!-- 3D Pill Loading Progress Bar Section -->
        <div class="splash-progress-wrapper" id="splash-progress-box">
          <div class="splash-pill-track">
            <div class="splash-pill-fill" id="splash-progress-fill">
              <span class="splash-percent-text" id="splash-percent-label"></span>
            </div>
          </div>
        </div>
      </div>
    `;

    // Developer convenience helpers
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
      setTimeout(() => this.finish(), 800);
      return;
    }

    // Timeline matching reference video:
    
    // T = 0.05s: Initial small coral dot appears
    setTimeout(() => {
      this.container?.classList.add('step-dot-appear');
    }, 50);

    // T = 0.20s: Diamond Grow & Rotation (scale up, rotates 45deg, diffuse shadow expands)
    setTimeout(() => {
      this.container?.classList.add('step-square-grow');
    }, 200);

    // T = 1.00s: Settle and Morph into OuraDesk Logo Mark (splits + corner fold)
    setTimeout(() => {
      this.container?.classList.add('step-logo-morph');
    }, 1000);

    // T = 1.20s: Wordmark "OuraDesk" slides out from the logo
    setTimeout(() => {
      this.container?.classList.add('step-wordmark-reveal');
    }, 1200);

    // T = 1.60s: Tagline "Chụp TKB. App lo." reveals underneath
    setTimeout(() => {
      this.container?.classList.add('step-tagline-reveal');
    }, 1600);

    // T = 2.00s: 3D Pill Progress Bar appears & animates
    setTimeout(() => {
      this.container?.classList.add('step-progress-appear');
      this.runProgressAnimation();
    }, 2000);
  },

  runProgressAnimation() {
    const progressFill = document.getElementById('splash-progress-fill');
    const percentLabel = document.getElementById('splash-percent-label');

    // Smooth organic steps matching video duration (2.0s -> 3.9s):
    const keyframes = [
      { delay: 100, percent: 15 },
      { delay: 400, percent: 35 },
      { delay: 800, percent: 65 },
      { delay: 1200, percent: 88 },
      { delay: 1600, percent: 98 },
      { delay: 1900, percent: 100 }
    ];

    keyframes.forEach(step => {
      setTimeout(() => {
        if (progressFill && !this.isCompleted) {
          progressFill.style.width = `${step.percent}%`;
          if (percentLabel && step.percent >= 90) {
            percentLabel.textContent = `${step.percent}%`;
            percentLabel.style.opacity = '1';
          }
        }
      }, step.delay);
    });

    // T = 4.20s (2200ms after progress starts): Transition Out to App
    setTimeout(() => {
      this.finish();
    }, 2200);
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
      }, 420);
    } else {
      if (this.onComplete) this.onComplete();
    }
  }
};
