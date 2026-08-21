/**
 * SplashScreen Component — OuraDesk High-Precision Motion Intro
 * Plays the exact 1080p 60FPS motion video provided in the reference (intro.mp4).
 * Features:
 * - 100% frame fidelity, exact 3D physics, specular highlights, and motion blur
 * - Responsive object-fit layout blending seamlessly into #F6F6F4 canvas
 * - Smooth fade-out transition into dashboard upon video completion
 * - Click / Escape / Space / Skip Button to bypass instantly
 * - Developer APIs: window.ouradeskReplayIntro() and window.ouradeskSkipIntro()
 */

export const SplashScreen = {
  container: null,
  videoEl: null,
  isCompleted: false,
  fallbackTimer: null,

  init(onComplete) {
    this.onComplete = onComplete;
    this.mount();
    this.startPlayback();
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
      <div class="splash-video-stage">
        <!-- Exact 1080p Motion Intro Video -->
        <video 
          id="ouradesk-intro-video" 
          class="splash-video-player"
          src="assets/intro.mp4" 
          autoplay 
          muted 
          playsinline 
          preload="auto"
        ></video>

        <!-- Subtle Top-Right Skip Button -->
        <button class="splash-skip-btn" id="splash-skip-btn" title="Bỏ qua intro (Phím Space/Esc)">
          Bỏ qua <span class="splash-skip-key">Esc</span>
        </button>
      </div>
    `;

    this.videoEl = document.getElementById('ouradesk-intro-video');

    // Skip button click handler
    const skipBtn = document.getElementById('splash-skip-btn');
    if (skipBtn) {
      skipBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.finish();
      });
    }

    // Click anywhere on splash screen to skip
    this.container.onclick = () => this.finish();

    // Keyboard shortcuts to skip (Esc, Space, Enter)
    const keyHandler = (e) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        this.finish();
        window.removeEventListener('keydown', keyHandler);
      }
    };
    window.addEventListener('keydown', keyHandler);

    // Global developer APIs
    window.ouradeskReplayIntro = () => {
      sessionStorage.removeItem('ouradesk.introPlayed');
      window.location.reload();
    };
    window.ouradeskSkipIntro = () => {
      this.finish();
    };
  },

  startPlayback() {
    if (!this.videoEl) return;

    // When video ends naturally, transition out smoothly
    this.videoEl.onended = () => {
      this.finish();
    };

    // When video is almost finished (around 5.5s), trigger smooth exit
    this.videoEl.ontimeupdate = () => {
      if (this.videoEl && this.videoEl.duration > 0) {
        if (this.videoEl.currentTime >= this.videoEl.duration - 0.25) {
          this.finish();
        }
      }
    };

    // In case browser autoplay policy delays playback or user is on low-power mode
    this.videoEl.play().catch(err => {
      console.warn('Autoplay prevented, ready for user interaction:', err);
    });

    // Safety fallback timer (max 6.2s)
    this.fallbackTimer = setTimeout(() => {
      this.finish();
    }, 6200);
  },

  finish() {
    if (this.isCompleted) return;
    this.isCompleted = true;

    if (this.fallbackTimer) {
      clearTimeout(this.fallbackTimer);
      this.fallbackTimer = null;
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
      }, 450);
    } else {
      if (this.onComplete) this.onComplete();
    }
  }
};
