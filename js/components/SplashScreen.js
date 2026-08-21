/**
 * SplashScreen Component — OuraDesk Fullscreen Immersive Motion Intro
 * Plays the 1080p 60FPS motion video in full screen (edge-to-edge object-fit: cover).
 * - Fullscreen cover with zero letterbox / borders
 * - Mandatory playback: No skip button, must watch until completed
 * - Smooth transition directly into dashboard upon video completion
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
        <!-- Fullscreen Immersive Video Player -->
        <video 
          id="ouradesk-intro-video" 
          class="splash-video-player"
          src="assets/intro.mp4" 
          autoplay 
          muted 
          playsinline 
          preload="auto"
        ></video>
      </div>
    `;

    this.videoEl = document.getElementById('ouradesk-intro-video');

    // Global developer APIs for manual testing
    window.ouradeskReplayIntro = () => {
      sessionStorage.removeItem('ouradesk.introPlayed');
      window.location.reload();
    };
  },

  startPlayback() {
    if (!this.videoEl) return;

    const onFinish = () => this.finish();

    this.videoEl.addEventListener('ended', onFinish);

    this.videoEl.addEventListener('timeupdate', () => {
      if (this.videoEl && this.videoEl.duration > 0) {
        if (this.videoEl.currentTime >= this.videoEl.duration - 0.25) {
          this.finish();
        }
      }
    });

    this.videoEl.addEventListener('loadedmetadata', () => {
      const dur = this.videoEl.duration || 5.83;
      if (this.fallbackTimer) clearTimeout(this.fallbackTimer);
      this.fallbackTimer = setTimeout(onFinish, Math.round((dur + 0.1) * 1000));
    });

    this.videoEl.play().catch(err => {
      console.warn('Autoplay prevented, will play on interaction:', err);
    });

    // Default safety fallback (5.9s)
    this.fallbackTimer = setTimeout(onFinish, 5950);
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
