/* ==========================================================================
   🎂 BIRTHDAY SURPRISE - MAIN APPLICATION LOGIC
   ========================================================================== */

(function () {
  'use strict';

  // Read config with safe fallbacks
  const CONFIG = window.SURPRISE_CONFIG || {
    TARGET_BIRTHDAY_DATE: new Date(Date.now() + 60000).toISOString(),
    BIRTHDAY_PERSON: "babyy",
    YOUR_NAME: "Nikhil",
    AUDIO_URL: "",
    REASONS: [],
    MEMORIES: [],
    LETTER: { greeting: "Dearest,", paragraphs: [], closing: "Love,", signature: "Me" },
    REAL_GIFT: { badge: "VOUCHER", title: "Gift", subtitle: "", couponCode: "LOVE" },
    BOUQUET: { subtitle: "", completionText: "Happy Birthday", flowers: [] },
    SOUNDTRACK: { songTitle: "Our Song", artist: "Us", audioUrl: "", lyrics: [] }
  };

  // State variables
  let currentStep = 1;
  let countdownInterval = null;
  let isPreviewMode = new URLSearchParams(window.location.search).get('preview') === 'true';
  let poppedBalloons = new Set();
  let bloomedFlowers = new Set();
  let isAudioPlaying = false;
  let audioContext = null;
  let scratchCardInitialized = false;
  let bouquetInitialized = false;
  let soundtrackInitialized = false;
  let musicNotesInterval = null;

  // DOM Elements for all 9 screens
  const screens = {
    1: document.getElementById('screen-gatekeeper'),
    2: document.getElementById('screen-cake'),
    3: document.getElementById('screen-balloons'),
    4: document.getElementById('screen-gallery'),
    5: document.getElementById('screen-letter'),
    6: document.getElementById('screen-scratch'),
    7: document.getElementById('screen-bouquet'),
    8: document.getElementById('screen-soundtrack'),
    9: document.getElementById('screen-video')
  };

  const audioEl = document.getElementById('bg-audio');
  const audioToggleBtn = document.getElementById('audio-toggle-btn');
  const audioEqualizer = document.getElementById('audio-equalizer');
  const previewBadge = document.getElementById('preview-badge');

  // ==========================================================================
  // 🔊 WEB AUDIO API SOUND EFFECTS (Zero-dependency acoustic feedback)
  // ==========================================================================
  function initAudioContext() {
    if (!audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        audioContext = new AudioCtx();
      }
    }
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume();
    }
  }

  // Play realistic balloon pop sound
  function playPopSound() {
    try {
      initAudioContext();
      if (!audioContext) return;
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160, audioContext.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, audioContext.currentTime + 0.08);

      gain.gain.setValueAtTime(0.7, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(audioContext.destination);

      osc.start();
      osc.stop(audioContext.currentTime + 0.08);
    } catch (e) {
      console.warn("AudioContext pop error:", e);
    }
  }

  // Play magical chime when candle is blown or flowers bloom
  function playMagicChime() {
    try {
      initAudioContext();
      if (!audioContext) return;
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
      notes.forEach((freq, idx) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioContext.currentTime + idx * 0.09);

        gain.gain.setValueAtTime(0.2, audioContext.currentTime + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + idx * 0.09 + 0.5);

        osc.connect(gain);
        gain.connect(audioContext.destination);

        osc.start(audioContext.currentTime + idx * 0.09);
        osc.stop(audioContext.currentTime + idx * 0.09 + 0.5);
      });
    } catch (e) {
      console.warn("AudioContext chime error:", e);
    }
  }

  // ==========================================================================
  // 🎵 BACKGROUND MUSIC CONTROLLER
  // ==========================================================================
  function initMusic() {
    if (CONFIG.AUDIO_URL && audioEl) {
      audioEl.src = CONFIG.AUDIO_URL;
      audioEl.volume = 0.55;
    }

    if (audioToggleBtn) {
      audioToggleBtn.addEventListener('click', toggleMusic);
    }
  }

  function playMusic(trackUrl = null) {
    if (!audioEl) return;
    initAudioContext();
    if (trackUrl && audioEl.src !== trackUrl) {
      audioEl.src = trackUrl;
    }
    audioEl.play().then(() => {
      isAudioPlaying = true;
      if (audioEqualizer) audioEqualizer.classList.remove('paused');
    }).catch(err => {
      console.log("Audio autoplay restricted. User gesture required.", err);
    });
  }

  function pauseMusic() {
    if (!audioEl) return;
    audioEl.pause();
    isAudioPlaying = false;
    if (audioEqualizer) audioEqualizer.classList.add('paused');
  }

  function toggleMusic() {
    if (!audioEl) return;
    if (audioEl.paused) {
      playMusic();
    } else {
      pauseMusic();
    }
  }

  // ==========================================================================
  // 🎊 CONFETTI HELPER (canvas-confetti with fallback)
  // ==========================================================================
  function launchConfetti(originX = 0.5, originY = 0.5) {
    if (window.confetti) {
      window.confetti({
        particleCount: 90,
        spread: 80,
        origin: { x: originX, y: originY },
        colors: ['#ff758f', '#ffd700', '#70d6ff', '#ff9770', '#e0aaff', '#ffffff'],
        disableForReducedMotion: true
      });
    }
  }

  function launchContinuousConfetti(durationMs = 2500) {
    if (!window.confetti) return;
    const animationEnd = Date.now() + durationMs;
    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      window.confetti({
        particleCount: 30,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
      window.confetti({
        particleCount: 30,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });
    }, 250);
  }

  // ==========================================================================
  // 🧭 SECTION NAVIGATION & STATE MACHINE
  // ==========================================================================
  function goToStep(stepNumber) {
    if (stepNumber < 1 || stepNumber > 9) return;
    
    // Pause video if playing when navigating to another section
    const bVideo = document.getElementById('birthday-video');
    if (bVideo && !bVideo.paused) {
      bVideo.pause();
    }

    // Hide all screens
    Object.values(screens).forEach(screen => {
      if (screen) {
        screen.classList.remove('active');
      }
    });

    // Activate selected screen
    currentStep = stepNumber;
    const targetScreen = screens[currentStep];
    if (targetScreen) {
      targetScreen.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Step-specific trigger hooks
    if (currentStep === 2) {
      launchConfetti(0.5, 0.4);
    } else if (currentStep === 3) {
      initBalloonsSection();
    } else if (currentStep === 4) {
      initGallerySection();
    } else if (currentStep === 5) {
      initLetterSection();
    } else if (currentStep === 6) {
      initScratchSection();
    } else if (currentStep === 7) {
      initBouquetSection();
    } else if (currentStep === 8) {
      initSoundtrackSection();
    } else if (currentStep === 9) {
      initVideoSection();
    }
  }

  // ==========================================================================
  // ⏳ SECTION 1: THE GATEKEEPER & COUNTDOWN
  // ==========================================================================
  function initGatekeeper() {
    const targetDate = new Date(CONFIG.TARGET_BIRTHDAY_DATE).getTime();
    const countdownContainer = document.getElementById('gatekeeper-countdown-state');
    const unlockedContainer = document.getElementById('gatekeeper-unlocked-state');
    const openSurpriseBtn = document.getElementById('btn-open-surprise');

    // Update Celebrant Name across UI
    const nameSpans = document.querySelectorAll('.celebrant-name');
    nameSpans.forEach(el => el.textContent = CONFIG.BIRTHDAY_PERSON);

    function updateCountdown() {
      const now = new Date().getTime();
      const distance = targetDate - now;

      // Check if unlocked (either time passed OR preview mode is active)
      if (distance <= 0 || isPreviewMode) {
        if (countdownInterval) clearInterval(countdownInterval);
        if (countdownContainer) countdownContainer.classList.add('hidden');
        if (unlockedContainer) {
          unlockedContainer.classList.remove('hidden');
          unlockedContainer.classList.add('flex');
        }
        return;
      }

      // Still locked (State A)
      if (countdownContainer) countdownContainer.classList.remove('hidden');
      if (unlockedContainer) {
        unlockedContainer.classList.add('hidden');
        unlockedContainer.classList.remove('flex');
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      const dEl = document.getElementById('cd-days');
      const hEl = document.getElementById('cd-hours');
      const mEl = document.getElementById('cd-minutes');
      const sEl = document.getElementById('cd-seconds');

      if (dEl) dEl.textContent = String(days).padStart(2, '0');
      if (hEl) hEl.textContent = String(hours).padStart(2, '0');
      if (mEl) mEl.textContent = String(minutes).padStart(2, '0');
      if (sEl) sEl.textContent = String(seconds).padStart(2, '0');
    }

    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);

    // Setup Dev Preview Toggle Badge
    if (previewBadge) {
      if (isPreviewMode) {
        previewBadge.classList.add('bg-emerald-500/30', 'text-emerald-300', 'border-emerald-400/40');
        previewBadge.textContent = "Preview Mode: ON (Unlocked)";
      }
      previewBadge.addEventListener('click', () => {
        isPreviewMode = !isPreviewMode;
        if (isPreviewMode) {
          previewBadge.classList.add('bg-emerald-500/30', 'text-emerald-300', 'border-emerald-400/40');
          previewBadge.textContent = "Preview Mode: ON (Unlocked)";
        } else {
          previewBadge.classList.remove('bg-emerald-500/30', 'text-emerald-300', 'border-emerald-400/40');
          previewBadge.textContent = "Preview Mode: OFF (Live Date)";
        }
        updateCountdown();
      });
    }

    // Open Surprise Button Click
    if (openSurpriseBtn) {
      openSurpriseBtn.addEventListener('click', () => {
        playMusic();
        launchConfetti(0.5, 0.5);
        setTimeout(() => {
          goToStep(2);
        }, 500);
      });
    }
  }

  // ==========================================================================
  // 🎂 SECTION 2: MAKE A WISH (CAKE & CANDLE)
  // ==========================================================================
  function initCakeSection() {
    const candleFlame = document.getElementById('candle-flame');
    const candleWrapper = document.getElementById('candle-wrapper');
    const smokeWisp = document.getElementById('smoke-wisp');
    const cakeWishPrompt = document.getElementById('cake-wish-prompt');
    const cakeSuccess = document.getElementById('cake-success');
    const btnCakeContinue = document.getElementById('btn-cake-continue');
    let isBlownOut = false;

    if (candleWrapper) {
      candleWrapper.addEventListener('click', extinguishCandle);
    } else if (candleFlame) {
      candleFlame.addEventListener('click', extinguishCandle);
    }

    function extinguishCandle() {
      if (isBlownOut) return;
      isBlownOut = true;

      candleFlame.classList.add('extinguished');
      if (smokeWisp) smokeWisp.classList.add('active');

      playMagicChime();
      launchConfetti(0.5, 0.45);

      if (cakeWishPrompt) cakeWishPrompt.classList.add('opacity-0');
      setTimeout(() => {
        if (cakeWishPrompt) cakeWishPrompt.classList.add('hidden');
        if (cakeSuccess) {
          cakeSuccess.classList.remove('hidden');
          cakeSuccess.classList.add('flex');
          setTimeout(() => {
            cakeSuccess.classList.remove('opacity-0');
            if (btnCakeContinue) {
              btnCakeContinue.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 150);
        }
      }, 400);
    }

    if (btnCakeContinue) {
      btnCakeContinue.addEventListener('click', () => {
        goToStep(3);
      });
    }
  }

  // ==========================================================================
  // 🎈 SECTION 3: POP THE BALLOONS
  // ==========================================================================
  function initBalloonsSection() {
    const grid = document.getElementById('balloons-container');
    const modal = document.getElementById('reason-modal');
    const modalTitle = document.getElementById('modal-reason-title');
    const modalText = document.getElementById('modal-reason-text');
    const modalClose = document.getElementById('modal-reason-close');
    const progressText = document.getElementById('balloons-progress-text');
    const btnBalloonsContinue = document.getElementById('btn-balloons-continue');

    if (!grid) return;
    grid.innerHTML = '';
    poppedBalloons.clear();

    const colors = [
      { bg: 'radial-gradient(circle at 30% 30%, #ff9aa2, #e63946)', border: '#d90429' },
      { bg: 'radial-gradient(circle at 30% 30%, #b5ead7, #2a9d8f)', border: '#21867a' },
      { bg: 'radial-gradient(circle at 30% 30%, #ffdac1, #f4a261)', border: '#e76f51' },
      { bg: 'radial-gradient(circle at 30% 30%, #c7ceea, #6a4c93)', border: '#5a3d7e' },
      { bg: 'radial-gradient(circle at 30% 30%, #ffd166, #f39c12)', border: '#d68910' },
      { bg: 'radial-gradient(circle at 30% 30%, #ff8fab, #fb6f92)', border: '#e24e75' }
    ];

    const reasons = CONFIG.REASONS || [];
    updateBalloonProgress();

    reasons.forEach((reason, idx) => {
      const color = colors[idx % colors.length];
      const floatClass = `float-${(idx % 6) + 1}`;

      const wrapper = document.createElement('div');
      wrapper.className = `balloon-wrapper ${floatClass} p-3 focus:outline-none`;
      wrapper.setAttribute('role', 'button');
      wrapper.setAttribute('tabindex', '0');
      wrapper.setAttribute('aria-label', `Pop balloon ${idx + 1}`);

      wrapper.innerHTML = `
        <div class="balloon-body" style="background: ${color.bg};">
          <div class="balloon-highlight"></div>
        </div>
        <div class="balloon-knot" style="background: ${color.border};"></div>
        <div class="balloon-string"></div>
        <span class="mt-2 text-xs font-semibold tracking-wider text-pink-200/90 drop-shadow">#${idx + 1}</span>
      `;

      wrapper.addEventListener('click', (e) => {
        if (poppedBalloons.has(idx)) return;
        popBalloon(idx, wrapper, reason, e);
      });

      wrapper.addEventListener('keydown', (e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !poppedBalloons.has(idx)) {
          popBalloon(idx, wrapper, reason, e);
        }
      });

      grid.appendChild(wrapper);
    });

    function popBalloon(idx, wrapperEl, reasonObj, event) {
      poppedBalloons.add(idx);
      wrapperEl.classList.add('popped');
      playPopSound();

      const rect = wrapperEl.getBoundingClientRect();
      const originX = (rect.left + rect.width / 2) / window.innerWidth;
      const originY = (rect.top + rect.height / 2) / window.innerHeight;
      launchConfetti(originX, originY);

      updateBalloonProgress();

      setTimeout(() => {
        if (modal && modalTitle && modalText) {
          modalTitle.textContent = reasonObj.title || `Reason #${idx + 1}`;
          modalText.textContent = reasonObj.text || "";
          modal.classList.remove('hidden');
          modal.classList.add('flex');
        }
      }, 300);
    }

    function updateBalloonProgress() {
      const total = reasons.length;
      const count = poppedBalloons.size;
      if (progressText) {
        progressText.textContent = `${count} of ${total} popped`;
      }

      if (count === total && total > 0) {
        if (btnBalloonsContinue) {
          btnBalloonsContinue.classList.remove('hidden');
          btnBalloonsContinue.classList.add('flex');
          setTimeout(() => {
            btnBalloonsContinue.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 400);
        }
        launchContinuousConfetti(1500);
      }
    }

    if (modalClose && modal) {
      modalClose.addEventListener('click', () => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        if (poppedBalloons.size === reasons.length && btnBalloonsContinue) {
          btnBalloonsContinue.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.add('hidden');
          modal.classList.remove('flex');
          if (poppedBalloons.size === reasons.length && btnBalloonsContinue) {
            btnBalloonsContinue.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      });
    }

    if (btnBalloonsContinue) {
      btnBalloonsContinue.addEventListener('click', () => {
        goToStep(4);
      });
    }
  }

  // ==========================================================================
  // 📷 SECTION 4: A WALK DOWN MEMORY LANE (POLAROID GALLERY)
  // ==========================================================================
  // ==========================================================================
  // 📷 SECTION 4: A WALK DOWN MEMORY LANE (POLAROID GALLERY - 25 MEMORIES)
  // ==========================================================================
  let currentLightboxIndex = 0;
  function initGallerySection() {
    const galleryGrid = document.getElementById('polaroid-gallery-grid');
    const galleryCountText = document.getElementById('gallery-count-text');
    const btnGalleryContinue = document.getElementById('btn-gallery-continue');

    // Lightbox elements
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxCounter = document.getElementById('lightbox-counter');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    const memories = CONFIG.MEMORIES || [];
    if (galleryCountText) {
      galleryCountText.textContent = `${memories.length} Memories Captured`;
    }

    if (!galleryGrid) return;
    galleryGrid.innerHTML = '';

    const rotations = [-2.5, 2, -1.5, 2.5, -2, 1.8, -1.2, 2.2];

    // Helper to generate a Polaroid card for Scrapbook Grid
    function createPolaroidCard(item, index) {
      const rot = rotations[index % rotations.length];
      const card = document.createElement('div');
      card.className = "polaroid-grid-item focus:outline-none";

      card.innerHTML = `
        <div class="polaroid-frame rounded-sm" style="transform: rotate(${rot}deg);" tabindex="0">
          <div class="washi-tape"></div>
          <div class="aspect-square w-full overflow-hidden rounded-xs bg-slate-900/10 shadow-inner">
            <img 
              src="${item.image}" 
              alt="${item.caption || 'Memory'}" 
              loading="lazy" 
              class="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
          <div class="mt-2.5 sm:mt-3 text-center px-1">
            <p class="font-serif text-slate-800 text-sm sm:text-base font-semibold leading-snug line-clamp-2">${item.caption || ''}</p>
            ${item.date ? `<p class="font-sans text-[10px] sm:text-xs text-slate-400 mt-1 uppercase tracking-wider">${item.date}</p>` : ''}
          </div>
        </div>
      `;

      card.addEventListener('click', () => {
        openLightboxAt(index);
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          openLightboxAt(index);
        }
      });

      return card;
    }

    // Populate Polaroid Scrapbook Grid with all 25 memories
    memories.forEach((item, index) => {
      galleryGrid.appendChild(createPolaroidCard(item, index));
    });

    // Lightbox navigation functions
    function openLightboxAt(index) {
      if (!lightboxModal) return;
      currentLightboxIndex = index;
      renderLightboxCurrent();
      lightboxModal.classList.remove('hidden');
      lightboxModal.classList.add('flex');
    }

    function renderLightboxCurrent() {
      if (!memories.length) return;
      if (currentLightboxIndex < 0) currentLightboxIndex = memories.length - 1;
      if (currentLightboxIndex >= memories.length) currentLightboxIndex = 0;

      const item = memories[currentLightboxIndex];
      if (lightboxImg) lightboxImg.src = item.image;
      if (lightboxCaption) {
        lightboxCaption.innerHTML = `
          <span class="font-semibold text-lg text-slate-900">${item.caption || ''}</span>
          ${item.date ? `<span class="block text-sm text-slate-500 mt-1">${item.date}</span>` : ''}
        `;
      }
      if (lightboxCounter) {
        lightboxCounter.textContent = `Memory ${currentLightboxIndex + 1} of ${memories.length}`;
      }
    }

    function closeLightbox() {
      if (!lightboxModal) return;
      lightboxModal.classList.add('hidden');
      lightboxModal.classList.remove('flex');
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) {
      lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        currentLightboxIndex--;
        renderLightboxCurrent();
      });
    }
    if (lightboxNext) {
      lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        currentLightboxIndex++;
        renderLightboxCurrent();
      });
    }

    // Close on clicking backdrop
    if (lightboxModal) {
      lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) {
          closeLightbox();
        }
      });
    }

    // Keyboard navigation (Arrow keys + Esc)
    window.addEventListener('keydown', (e) => {
      if (!lightboxModal || lightboxModal.classList.contains('hidden')) return;
      if (e.key === 'ArrowLeft') {
        currentLightboxIndex--;
        renderLightboxCurrent();
      } else if (e.key === 'ArrowRight') {
        currentLightboxIndex++;
        renderLightboxCurrent();
      } else if (e.key === 'Escape') {
        closeLightbox();
      }
    });

    // Touch swipe navigation for mobile Lightbox
    let touchStartX = 0;
    if (lightboxModal) {
      lightboxModal.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
      }, { passive: true });

      lightboxModal.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const diffX = touchEndX - touchStartX;
        if (diffX > 45) {
          currentLightboxIndex--; // Swipe right -> Previous
          renderLightboxCurrent();
        } else if (diffX < -45) {
          currentLightboxIndex++; // Swipe left -> Next
          renderLightboxCurrent();
        }
      }, { passive: true });
    }

    if (btnGalleryContinue) {
      btnGalleryContinue.addEventListener('click', () => {
        goToStep(5);
      });
    }
  }

  // ==========================================================================
  // 💌 SECTION 5: THE FINAL SURPRISE (THE BIRTHDAY LETTER)
  // ==========================================================================
  function initLetterSection() {
    const envelope = document.getElementById('digital-envelope');
    const waxSeal = document.getElementById('wax-seal');
    const parchmentContainer = document.getElementById('parchment-letter-container');
    const letterGreeting = document.getElementById('letter-greeting');
    const letterBody = document.getElementById('letter-body');
    const letterClosing = document.getElementById('letter-closing');
    const letterSignature = document.getElementById('letter-signature');
    const btnLetterContinue = document.getElementById('btn-letter-continue');
    const heartsBg = document.getElementById('floating-hearts-bg');

    const letter = CONFIG.LETTER || {};
    if (letterGreeting) letterGreeting.textContent = letter.greeting || `Dearest ${CONFIG.BIRTHDAY_PERSON},`;
    if (waxSeal && CONFIG.BIRTHDAY_PERSON) {
      const sealSpan = waxSeal.querySelector('span');
      if (sealSpan) sealSpan.textContent = CONFIG.BIRTHDAY_PERSON.charAt(0).toUpperCase();
    }
    
    if (letterBody) {
      letterBody.innerHTML = '';
      const paragraphs = letter.paragraphs || [];
      paragraphs.forEach(p => {
        const pEl = document.createElement('p');
        pEl.className = "mb-4 text-slate-800 leading-relaxed font-serif text-lg sm:text-xl text-justify";
        pEl.textContent = p;
        letterBody.appendChild(pEl);
      });
    }

    if (letterClosing) letterClosing.textContent = letter.closing || "Forever & always yours,";
    if (letterSignature) letterSignature.textContent = letter.signature || CONFIG.YOUR_NAME || "Nikhil";

    let isEnvelopeOpened = false;
    function openEnvelope() {
      if (isEnvelopeOpened) return;
      isEnvelopeOpened = true;

      playMagicChime();
      if (envelope) envelope.classList.add('open');

      setTimeout(() => {
        launchContinuousConfetti(1800);
      }, 500);

      setTimeout(() => {
        if (parchmentContainer) {
          parchmentContainer.classList.remove('hidden');
          parchmentContainer.classList.add('flex');
          parchmentContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 700);
    }

    if (envelope) envelope.addEventListener('click', openEnvelope);
    if (waxSeal) waxSeal.addEventListener('click', openEnvelope);

    if (heartsBg && heartsBg.children.length === 0) {
      const heartSymbols = ['💖', '✨', '💛', '🌸', '🎈', '💕'];
      for (let i = 0; i < 22; i++) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = heartSymbols[i % heartSymbols.length];
        heart.style.left = `${Math.random() * 95}%`;
        heart.style.animationDuration = `${5 + Math.random() * 6}s`;
        heart.style.animationDelay = `${Math.random() * 4}s`;
        heart.style.fontSize = `${1 + Math.random() * 1.2}rem`;
        heartsBg.appendChild(heart);
      }
    }

    if (btnLetterContinue) {
      btnLetterContinue.addEventListener('click', () => {
        goToStep(6);
      });
    }
  }

  // ==========================================================================
  // 🎫 SECTION 6: THE SCRATCH CARD (THE REAL GIFT REVEAL)
  // ==========================================================================
  function initScratchSection() {
    const canvas = document.getElementById('scratch-canvas');
    const btnScratchContinue = document.getElementById('btn-scratch-continue');
    const progressEl = document.getElementById('scratch-progress');
    const voucherBadge = document.getElementById('voucher-badge');
    const voucherTitle = document.getElementById('voucher-title');
    const voucherSubtitle = document.getElementById('voucher-subtitle');
    const voucherCode = document.getElementById('voucher-code');
    const voucherFinePrint = document.getElementById('voucher-fine-print');

    // Populate coupon text from config
    const gift = CONFIG.REAL_GIFT || {};
    if (voucherBadge) voucherBadge.textContent = gift.badge || "OFFICIAL BIRTHDAY VOUCHER";
    if (voucherTitle) voucherTitle.textContent = gift.title || "A Special Surprise 🎫";
    if (voucherSubtitle) voucherSubtitle.textContent = gift.subtitle || "A real-world gift for you!";
    if (voucherCode) voucherCode.textContent = gift.couponCode || "LOVE-2026";
    if (voucherFinePrint) voucherFinePrint.textContent = gift.finePrint || "No expiration date • Redeemable anytime";

    if (!canvas) return;
    if (scratchCardInitialized) return;
    scratchCardInitialized = true;

    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Draw metallic scratch surface
    function drawScratchCover() {
      // Metallic gradient
      const grad = ctx.createLinearGradient(0, 0, rect.width, rect.height);
      grad.addColorStop(0, '#a1a1aa');
      grad.addColorStop(0.25, '#e4e4e7');
      grad.addColorStop(0.5, '#71717a');
      grad.addColorStop(0.75, '#f4f4f5');
      grad.addColorStop(1, '#a1a1aa');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, rect.width, rect.height);

      // Gold shimmer border overlay
      ctx.strokeStyle = '#ffd700';
      ctx.lineWidth = 4;
      ctx.strokeRect(6, 6, rect.width - 12, rect.height - 12);

      // Stamp text on top of scratch card
      ctx.fillStyle = '#3f3f46';
      ctx.font = 'bold 15px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🪙 SCRATCH WITH FINGER OR MOUSE ✨', rect.width / 2, rect.height / 2 - 8);

      ctx.font = '12px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = '#71717a';
      ctx.fillText('Scratch here to reveal your real gift!', rect.width / 2, rect.height / 2 + 16);
    }

    drawScratchCover();

    let isScratching = false;
    let isFullyRevealed = false;
    let scratchCount = 0;

    function scratch(x, y) {
      if (isFullyRevealed) return;
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 22, 0, Math.PI * 2);
      ctx.fill();

      scratchCount++;
      if (scratchCount % 8 === 0) {
        checkScratchPercentage();
      }
    }

    function checkScratchPercentage() {
      if (isFullyRevealed) return;
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imgData.data;
      const totalPixels = pixels.length / 4;
      let clearPixels = 0;

      // Sample every 16th pixel for performance
      const stride = 16;
      let sampled = 0;
      for (let i = 3; i < pixels.length; i += 4 * stride) {
        sampled++;
        if (pixels[i] === 0) {
          clearPixels++;
        }
      }

      const percent = Math.min(100, Math.round((clearPixels / sampled) * 100));
      if (progressEl) {
        progressEl.textContent = `${percent}% scratched`;
      }

      // Automatically reveal at 70%
      if (percent >= 70) {
        revealEntireCard();
      }
    }

    function revealEntireCard() {
      if (isFullyRevealed) return;
      isFullyRevealed = true;

      canvas.classList.add('revealed');
      playMagicChime();
      launchContinuousConfetti(2200);

      if (progressEl) {
        progressEl.innerHTML = `🎉 <strong>100% Revealed!</strong>`;
      }

      if (btnScratchContinue) {
        btnScratchContinue.classList.remove('hidden');
        btnScratchContinue.classList.add('flex');
        setTimeout(() => {
          btnScratchContinue.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
    }

    function getPos(e) {
      const cRect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - cRect.left,
        y: clientY - cRect.top
      };
    }

    // Mouse Events
    canvas.addEventListener('mousedown', (e) => {
      isScratching = true;
      const pos = getPos(e);
      scratch(pos.x, pos.y);
    });
    window.addEventListener('mouseup', () => { isScratching = false; });
    canvas.addEventListener('mousemove', (e) => {
      if (!isScratching) return;
      const pos = getPos(e);
      scratch(pos.x, pos.y);
    });

    // Touch Events for Mobile
    canvas.addEventListener('touchstart', (e) => {
      isScratching = true;
      const pos = getPos(e);
      scratch(pos.x, pos.y);
      e.preventDefault();
    }, { passive: false });

    canvas.addEventListener('touchmove', (e) => {
      if (!isScratching) return;
      const pos = getPos(e);
      scratch(pos.x, pos.y);
      e.preventDefault();
    }, { passive: false });

    window.addEventListener('touchend', () => { isScratching = false; });

    if (btnScratchContinue) {
      btnScratchContinue.addEventListener('click', () => {
        goToStep(7);
      });
    }
  }

  // ==========================================================================
  // 🌸 SECTION 7: THE VIRTUAL BOUQUET
  // ==========================================================================
  function initBouquetSection() {
    const gardenBed = document.getElementById('garden-bed');
    const bouquetPrompt = document.getElementById('bouquet-subtitle');
    const bouquetProgress = document.getElementById('bouquet-progress');
    const bouquetCompletion = document.getElementById('bouquet-completion');
    const btnBouquetContinue = document.getElementById('btn-bouquet-continue');

    const bouquetConfig = CONFIG.BOUQUET || { flowers: [] };
    if (bouquetPrompt && bouquetConfig.subtitle) {
      bouquetPrompt.textContent = bouquetConfig.subtitle;
    }

    if (!gardenBed) return;
    if (bouquetInitialized) return;
    bouquetInitialized = true;

    gardenBed.innerHTML = '<div class="garden-soil-line"></div>';
    bloomedFlowers.clear();

    const flowers = bouquetConfig.flowers || [];
    updateBouquetProgress();

    flowers.forEach((flower, idx) => {
      const pot = document.createElement('div');
      pot.className = 'flower-pot';
      pot.setAttribute('role', 'button');
      pot.setAttribute('tabindex', '0');
      pot.setAttribute('aria-label', `Plant and bloom ${flower.name}`);

      pot.innerHTML = `
        <!-- Flower Bloom (Blossom) -->
        <div class="flower-bloom" style="color: ${flower.color};">
          <svg class="w-16 h-16 filter drop-shadow-md" viewBox="0 0 100 100" fill="currentColor">
            <!-- 8-Petal Blossom with Golden Core -->
            <circle cx="50" cy="24" r="16" opacity="0.9" />
            <circle cx="76" cy="50" r="16" opacity="0.9" />
            <circle cx="50" cy="76" r="16" opacity="0.9" />
            <circle cx="24" cy="50" r="16" opacity="0.9" />
            <circle cx="68" cy="32" r="14" opacity="0.85" />
            <circle cx="68" cy="68" r="14" opacity="0.85" />
            <circle cx="32" cy="68" r="14" opacity="0.85" />
            <circle cx="32" cy="32" r="14" opacity="0.85" />
            <!-- Golden Floral Center -->
            <circle cx="50" cy="50" r="11" fill="#fef08a" />
            <circle cx="50" cy="50" r="6" fill="#ca8a04" />
          </svg>
        </div>

        <!-- Growing Stem with Leaves -->
        <div class="flower-stem" id="stem-${idx}">
          <div class="flower-leaf-left"></div>
          <div class="flower-leaf-right"></div>
        </div>

        <!-- Glowing Interactive Seed -->
        <div class="flower-seed" title="Tap to plant!"></div>

        <!-- Flower Name Label -->
        <span class="text-[11px] font-medium text-pink-200/90 mt-2 text-center tracking-wide">${flower.name}</span>
      `;

      function triggerBloom() {
        if (bloomedFlowers.has(idx)) return;
        bloomedFlowers.add(idx);

        const seedEl = pot.querySelector('.flower-seed');
        const stemEl = pot.querySelector('.flower-stem');

        seedEl.classList.add('planted');
        stemEl.style.height = `${flower.stemHeight || 115}px`;
        pot.classList.add('bloomed');

        playMagicChime();

        // Confetti over flower
        const rect = pot.getBoundingClientRect();
        launchConfetti(
          (rect.left + rect.width / 2) / window.innerWidth,
          (rect.top + 30) / window.innerHeight
        );

        updateBouquetProgress();
      }

      pot.addEventListener('click', triggerBloom);
      pot.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          triggerBloom();
        }
      });

      gardenBed.appendChild(pot);
    });

    function updateBouquetProgress() {
      const total = flowers.length;
      const count = bloomedFlowers.size;

      if (bouquetProgress) {
        bouquetProgress.textContent = `${count} of ${total} flowers bloomed`;
      }

      if (count === total && total > 0) {
        setTimeout(() => {
          if (bouquetCompletion) {
            bouquetCompletion.classList.remove('hidden');
            bouquetCompletion.classList.add('flex');
          }
          if (btnBouquetContinue) {
            btnBouquetContinue.classList.remove('hidden');
            btnBouquetContinue.classList.add('flex');
            setTimeout(() => {
              btnBouquetContinue.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
          }
          launchContinuousConfetti(2500);
        }, 1200);
      }
    }

    if (btnBouquetContinue) {
      btnBouquetContinue.addEventListener('click', () => {
        goToStep(8);
      });
    }
  }

  // ==========================================================================
  // 🎵 SECTION 8: OUR SOUNDTRACK (RETRO VINYL RECORD PLAYER)
  // ==========================================================================
  function initSoundtrackSection() {
    const vinylDisc = document.getElementById('vinyl-disc');
    const tonearm = document.getElementById('tonearm');
    const btnVinylPlay = document.getElementById('btn-vinyl-play');
    const lyricsList = document.getElementById('soundtrack-lyrics-list');
    const trackTitle = document.getElementById('soundtrack-title');
    const trackArtist = document.getElementById('soundtrack-artist');
    const btnReplayAll = document.getElementById('btn-replay-all');
    const notesContainer = document.getElementById('music-notes-container');

    const soundtrack = CONFIG.SOUNDTRACK || {};
    if (trackTitle) trackTitle.textContent = soundtrack.songTitle || "Our Song";
    if (trackArtist) trackArtist.textContent = soundtrack.artist || `${CONFIG.YOUR_NAME} & ${CONFIG.BIRTHDAY_PERSON}`;

    if (!soundtrackInitialized) {
      soundtrackInitialized = true;

      // Populate romantic story lyrics
      if (lyricsList && soundtrack.lyrics) {
        lyricsList.innerHTML = '';
        soundtrack.lyrics.forEach((line, index) => {
          const item = document.createElement('div');
          item.className = "p-3 rounded-xl bg-white/5 border border-white/10 text-slate-200 font-serif text-base sm:text-lg leading-relaxed text-center shadow-sm";
          item.innerHTML = `<span class="text-pink-300 mr-2">✦</span>${line}`;
          lyricsList.appendChild(item);
        });
      }

      let isPlayingVinyl = false;

      function toggleVinylPlayer() {
        isPlayingVinyl = !isPlayingVinyl;

        if (isPlayingVinyl) {
          // Needle moves onto record, vinyl spins
          if (tonearm) tonearm.classList.add('playing');
          if (vinylDisc) vinylDisc.classList.add('spinning');
          if (btnVinylPlay) {
            btnVinylPlay.innerHTML = `<span>⏸ Pause Our Song</span>`;
          }

          // Play specific soundtrack audio if defined
          const track = soundtrack.audioUrl || CONFIG.AUDIO_URL;
          playMusic(track);

          // Start floating musical notes
          startMusicNotes();
        } else {
          // Needle moves off, vinyl stops
          if (tonearm) tonearm.classList.remove('playing');
          if (vinylDisc) vinylDisc.classList.remove('spinning');
          if (btnVinylPlay) {
            btnVinylPlay.innerHTML = `<span>▶ Play Our Song</span>`;
          }
          pauseMusic();
          stopMusicNotes();
        }
      }

      if (vinylDisc) vinylDisc.addEventListener('click', toggleVinylPlayer);
      if (tonearm) tonearm.addEventListener('click', toggleVinylPlayer);
      if (btnVinylPlay) btnVinylPlay.addEventListener('click', toggleVinylPlayer);

      function startMusicNotes() {
        stopMusicNotes();
        const noteSymbols = ['♪', '♫', '♬', '♩', '✨'];
        musicNotesInterval = setInterval(() => {
          if (!notesContainer) return;
          const note = document.createElement('div');
          note.className = 'music-note';
          note.textContent = noteSymbols[Math.floor(Math.random() * noteSymbols.length)];
          note.style.left = `${35 + Math.random() * 30}%`;
          note.style.bottom = '80px';
          notesContainer.appendChild(note);

          setTimeout(() => {
            note.remove();
          }, 3500);
        }, 600);
      }

      function stopMusicNotes() {
        if (musicNotesInterval) {
          clearInterval(musicNotesInterval);
          musicNotesInterval = null;
        }
      }
      const btnSoundtrackContinue = document.getElementById('btn-soundtrack-continue');
      if (btnSoundtrackContinue) {
        btnSoundtrackContinue.addEventListener('click', () => {
          goToStep(9);
        });
      }
    }
  }

  // ==========================================================================
  // 🐾 SECTION 9: A SPECIAL GUEST (THE VIDEO MESSAGE)
  // ==========================================================================
  let videoSectionInitialized = false;
  function initVideoSection() {
    const videoEl = document.getElementById('birthday-video');
    const videoWrapper = document.getElementById('video-wrapper');
    const videoOverlay = document.getElementById('video-overlay');
    const videoTagline = document.getElementById('video-tagline');
    const videoCaption = document.getElementById('video-caption');
    const btnReplayAll = document.getElementById('btn-replay-all');

    const videoConfig = CONFIG.VIDEO_MESSAGE || {};
    if (videoTagline && videoConfig.tagline) {
      videoTagline.textContent = videoConfig.tagline;
    }
    if (videoCaption && videoConfig.caption) {
      videoCaption.textContent = videoConfig.caption;
    }

    if (!videoSectionInitialized) {
      videoSectionInitialized = true;

      // Ensure video source points to configured videoUrl
      if (videoConfig.videoUrl && videoEl) {
        const sourceEl = videoEl.querySelector('source');
        if (sourceEl && sourceEl.getAttribute('src') !== videoConfig.videoUrl) {
          sourceEl.src = videoConfig.videoUrl;
          videoEl.load();
        }
      }

      function startVideoPlayback() {
        if (!videoEl) return;
        pauseMusic(); // Pause background audio so video audio is clear
        if (videoOverlay) videoOverlay.classList.add('hidden-overlay');
        if (videoWrapper) videoWrapper.classList.add('playing');
        videoEl.controls = true;
        videoEl.play().catch(err => {
          console.log("Video playback handled:", err);
        });
      }

      if (videoOverlay) {
        videoOverlay.addEventListener('click', startVideoPlayback);
      }

      if (videoEl) {
        videoEl.addEventListener('play', () => {
          pauseMusic();
          if (videoOverlay) videoOverlay.classList.add('hidden-overlay');
          if (videoWrapper) videoWrapper.classList.add('playing');
        });

        videoEl.addEventListener('pause', () => {
          if (videoWrapper) videoWrapper.classList.remove('playing');
        });

        videoEl.addEventListener('ended', () => {
          launchContinuousConfetti(2200);
          if (videoWrapper) videoWrapper.classList.remove('playing');
          if (videoOverlay) {
            videoOverlay.classList.remove('hidden-overlay');
            const overlayText = videoOverlay.querySelector('p');
            if (overlayText) {
              overlayText.innerHTML = `<span>Replay Video</span> <span>🐾</span>`;
            }
          }
          if (btnReplayAll) {
            setTimeout(() => {
              btnReplayAll.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
          }
        });
      }

      if (btnReplayAll) {
        btnReplayAll.addEventListener('click', () => {
          if (videoEl) {
            videoEl.pause();
            videoEl.currentTime = 0;
          }
          goToStep(1);
        });
      }
    }
  }

  // ==========================================================================
  // 🚀 INITIALIZATION
  // ==========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    initMusic();
    initGatekeeper();
    initCakeSection();

    // Global listener for first user tap to permit sound effects & audio
    document.body.addEventListener('click', () => {
      initAudioContext();
    }, { once: true });
  });

})();
