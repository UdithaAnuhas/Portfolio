// ============================================================
// guns.lol-Style Link Page — Interactive Logic (Redesigned)
// Author: Uditha Anuhas (Aries)
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ═════════════════════════════════════════════
  // 1. PARTICLE SYSTEM (Subtle floating dots)
  // ═════════════════════════════════════════════
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const PARTICLE_COUNT = 40;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.3;
        this.speedX = (Math.random() - 0.5) * 0.25;
        this.speedY = (Math.random() - 0.5) * 0.25;
        this.opacity = Math.random() * 0.35 + 0.1;
        this.baseOpacity = this.opacity;
        this.pulsePhase = Math.random() * Math.PI * 2;
      }

      update(time) {
        this.x += this.speedX;
        this.y += this.speedY;
        this.opacity = this.baseOpacity + Math.sin(time * 0.01 + this.pulsePhase) * 0.1;

        if (this.x < -10) this.x = canvas.width + 10;
        if (this.x > canvas.width + 10) this.x = -10;
        if (this.y < -10) this.y = canvas.height + 10;
        if (this.y > canvas.height + 10) this.y = -10;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, this.opacity)})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }

    let animTime = 0;
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      animTime++;
      particles.forEach(p => {
        p.update(animTime);
        p.draw();
      });
      requestAnimationFrame(animate);
    }
    animate();
  }

  // ═════════════════════════════════════════════
  // 2. TYPEWRITER EFFECT
  // ═════════════════════════════════════════════
  const bioTextEl = document.getElementById('bio-text');
  if (bioTextEl) {
    const phrases = [
      'Student Developer 🚀',
      'Passionate Gamer 🎮',
      'Learning Python & Pascal 🐍',
      'Web Dev ⚡',
      'Publishing Works & Data 📊',
    ];
    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    function typeWriter() {
      const currentPhrase = phrases[phraseIdx];
      if (isDeleting) {
        bioTextEl.textContent = currentPhrase.substring(0, charIdx - 1);
        charIdx--;
      } else {
        bioTextEl.textContent = currentPhrase.substring(0, charIdx + 1);
        charIdx++;
      }

      let speed = isDeleting ? 40 : 80;

      if (!isDeleting && charIdx === currentPhrase.length) {
        speed = 2200;
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        speed = 400;
      }

      setTimeout(typeWriter, speed);
    }
    typeWriter();
  }

  // ═════════════════════════════════════════════
  // 3. DISCORD STATUS (Real — Lanyard API)
  // ═════════════════════════════════════════════
  const DISCORD_USER_ID = '1445792800699584677';
  const discordActivityEl = document.getElementById('discord-activity');
  const discordDot = document.getElementById('discord-dot');

  const statusColors = {
    online: '#22c55e',
    idle: '#f59e0b',
    dnd: '#ef4444',
    offline: '#6b7280',
  };

  const discordAvatarImg = document.getElementById('discord-avatar-img');
  const discordUsername = document.getElementById('discord-username');
  const discordStatusBadge = document.getElementById('discord-status-badge');

  const statusBadgeStyles = {
    online:  { bg: 'rgba(34, 197, 94, 0.18)', border: 'rgba(34, 197, 94, 0.35)', color: '#4ade80', label: 'Online' },
    idle:    { bg: 'rgba(245, 158, 11, 0.18)', border: 'rgba(245, 158, 11, 0.35)', color: '#fbbf24', label: 'Idle' },
    dnd:     { bg: 'rgba(239, 68, 68, 0.18)', border: 'rgba(239, 68, 68, 0.35)', color: '#f87171', label: 'DND' },
    offline: { bg: 'rgba(107, 114, 128, 0.18)', border: 'rgba(107, 114, 128, 0.35)', color: '#9ca3af', label: 'Offline' }
  };

  function updateDiscordUI(data) {
    if (!discordActivityEl) return;

    const status = data.discord_status || 'offline';
    const color = statusColors[status] || statusColors.offline;
    const badgeStyle = statusBadgeStyles[status] || statusBadgeStyles.offline;

    // Always keep local avatar — don't override with Discord CDN

    // Update username if provided
    if (data.discord_user && discordUsername) {
      discordUsername.textContent = data.discord_user.global_name || data.discord_user.username || 'Aries';
    }

    // Update status badge pill
    if (discordStatusBadge) {
      discordStatusBadge.textContent = badgeStyle.label;
      discordStatusBadge.style.background = badgeStyle.bg;
      discordStatusBadge.style.borderColor = badgeStyle.border;
      discordStatusBadge.style.color = badgeStyle.color;
    }

    // Update status dot color
    if (discordDot) {
      discordDot.style.background = color;
      discordDot.style.boxShadow = `0 0 8px ${color}A0`;
    }

    // Update activity
    const activities = data.activities || [];
    const gameActivity = activities.find(a => a.type === 0);
    const customStatus = activities.find(a => a.type === 4);
    const codeActivity = activities.find(a => a.name === 'Visual Studio Code' || a.name === 'Code');

    if (data.listening_to_spotify && data.spotify) {
      discordActivityEl.innerHTML = `<i class="fa-brands fa-spotify" style="color:#1DB954; font-size: 0.9rem;"></i> <span style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${data.spotify.song} — ${data.spotify.artist}</span>`;
    } else if (customStatus && customStatus.state) {
      // Build emoji: use Discord CDN for custom emojis, or Unicode name directly
      let emojiHTML = '';
      if (customStatus.emoji) {
        if (customStatus.emoji.id) {
          // Custom Discord emoji — render as image
          emojiHTML = `<img src="https://cdn.discordapp.com/emojis/${customStatus.emoji.id}.webp?size=20" alt="${customStatus.emoji.name}" style="width:18px;height:18px;vertical-align:middle;margin-right:4px;">`;
        } else {
          // Unicode emoji
          emojiHTML = customStatus.emoji.name + ' ';
        }
      }
      discordActivityEl.innerHTML = `${emojiHTML}<span style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${customStatus.state}</span>`;
    } else if (gameActivity) {
      discordActivityEl.innerHTML = `<i class="fa-solid fa-gamepad"></i> <span style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">Playing ${gameActivity.name}</span>`;
    } else if (codeActivity) {
      const details = codeActivity.details ? ` — ${codeActivity.details}` : '';
      discordActivityEl.innerHTML = `<i class="fa-solid fa-code"></i> <span style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${codeActivity.name}${details}</span>`;
    } else {
      const labels = { online: 'Online', idle: 'Away', dnd: 'Do Not Disturb', offline: 'Offline' };
      discordActivityEl.innerHTML = `${labels[status] || 'Offline'}`;
    }
  }

  // Fallback
  const fallbackActivities = [
    { icon: 'fa-solid fa-gamepad', text: 'Playing Valorant' },
    { icon: 'fa-brands fa-spotify', text: 'Listening to Spotify' },
    { icon: 'fa-solid fa-code', text: 'Coding in VS Code' },
  ];
  let fallbackIdx = 0;

  function startFallback() {
    if (!discordActivityEl) return;
    function rotate() {
      const a = fallbackActivities[fallbackIdx];
      discordActivityEl.innerHTML = `<i class="${a.icon}"></i> ${a.text}`;
      fallbackIdx = (fallbackIdx + 1) % fallbackActivities.length;
    }
    rotate();
    setInterval(rotate, 8000);
  }

  // Lanyard WebSocket
  function connectLanyard() {
    try {
      const ws = new WebSocket('wss://api.lanyard.rest/socket');
      let heartbeat;

      ws.onopen = () => {
        ws.send(JSON.stringify({ op: 2, d: { subscribe_to_id: DISCORD_USER_ID } }));
      };

      ws.onmessage = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.op === 1) {
          heartbeat = setInterval(() => ws.send(JSON.stringify({ op: 3 })), msg.d.heartbeat_interval);
        }
        if (msg.op === 0 && (msg.t === 'INIT_STATE' || msg.t === 'PRESENCE_UPDATE')) {
          updateDiscordUI(msg.d);
        }
      };

      ws.onerror = () => fetchLanyardREST();
      ws.onclose = () => { clearInterval(heartbeat); setTimeout(connectLanyard, 5000); };
    } catch (e) {
      fetchLanyardREST();
    }
  }

  function fetchLanyardREST() {
    fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`)
      .then(r => r.json())
      .then(j => {
        if (j.success) {
          updateDiscordUI(j.data);
          setInterval(() => {
            fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`)
              .then(r => r.json())
              .then(j => { if (j.success) updateDiscordUI(j.data); })
              .catch(() => {});
          }, 30000);
        } else {
          startFallback();
        }
      })
      .catch(() => startFallback());
  }

  connectLanyard();

  // ═════════════════════════════════════════════
  // 4. AUDIO & CLICK-TO-ENTER OVERLAY
  // ═════════════════════════════════════════════
  const audioToggle = document.getElementById('audio-toggle');
  const audioIcon = document.getElementById('audio-icon');
  const bgVideo = document.getElementById('bg-video');
  const enterOverlay = document.getElementById('enter-overlay');

  if (bgVideo) {
    // Video starts muted for initial autoplay compatibility
    bgVideo.muted = true;
    bgVideo.volume = 0.5;

    function enableSound() {
      if (bgVideo) {
        bgVideo.muted = false;
        bgVideo.play().catch(() => {});
      }
      if (audioIcon) audioIcon.className = 'fa-solid fa-volume-high';
      if (audioToggle) audioToggle.classList.add('playing');
      if (enterOverlay) enterOverlay.classList.add('hidden');
    }

    function disableSound() {
      if (bgVideo) bgVideo.muted = true;
      if (audioIcon) audioIcon.className = 'fa-solid fa-volume-xmark';
      if (audioToggle) audioToggle.classList.remove('playing');
    }

    // Dismiss overlay & enable sound on click anywhere on overlay
    if (enterOverlay) {
      enterOverlay.addEventListener('click', () => {
        enableSound();
      });
    }

    // Manual audio toggle button
    if (audioToggle) {
      audioToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (bgVideo.muted) {
          enableSound();
        } else {
          disableSound();
        }
      });
    }
  }

  // ═════════════════════════════════════════════
  // 5. VISITOR COUNTER (Real Global Counter API)
  // ═════════════════════════════════════════════
  const counterEl = document.getElementById('visitor-count');
  if (counterEl) {
    function animateCountTo(targetCount) {
      const duration = 1200;
      const startTime = performance.now();
      function step(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        counterEl.textContent = Math.floor(targetCount * eased).toLocaleString();
        if (progress < 1) requestAnimationFrame(step);
        else counterEl.textContent = targetCount.toLocaleString();
      }
      requestAnimationFrame(step);
    }

    // Try global counter API
    const sessionKey = 'aries-global-viewed';
    const isNewSession = !sessionStorage.getItem(sessionKey);
    if (isNewSession) {
      sessionStorage.setItem(sessionKey, '1');
    }

    // Call CounterAPI up (increment) or get (view)
    const endpoint = isNewSession
      ? 'https://api.counterapi.dev/v1/udithaanuhas-aries-portfolio/views/up'
      : 'https://api.counterapi.dev/v1/udithaanuhas-aries-portfolio/views/';

    fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        if (data && typeof data.count === 'number') {
          localStorage.setItem('aries-link-views-global', data.count.toString());
          animateCountTo(data.count);
        } else {
          fallbackLocalCounter();
        }
      })
      .catch(() => {
        fallbackLocalCounter();
      });

    function fallbackLocalCounter() {
      let count = parseInt(localStorage.getItem('aries-link-views-global') || localStorage.getItem('aries-link-views') || '1', 10);
      if (isNewSession) {
        count++;
        localStorage.setItem('aries-link-views-global', count.toString());
      }
      animateCountTo(count);
    }
  }

  // ═════════════════════════════════════════════
  // 6. ADMIN BACKGROUND CONTROLS
  // ═════════════════════════════════════════════
  // Separate password for links page background controls (password: 0000)
  const LINKS_ADMIN_HASH = '9af15b336e6a9619928537df30b2e6a2376569fcf9d7e773eccede65606529a0';
  const LINKS_SESSION_KEY = 'aries-links-admin-session';

  const adminBtn = document.getElementById('admin-btn');
  const adminModal = document.getElementById('admin-modal');
  const adminModalClose = document.getElementById('admin-modal-close');
  const adminLoginView = document.getElementById('admin-login-view');
  const adminControlsView = document.getElementById('admin-controls-view');
  const adminPassInput = document.getElementById('admin-pass-input');
  const adminLoginBtn = document.getElementById('admin-login-btn');
  const adminLoginErr = document.getElementById('admin-login-err');
  const bgPresetSelect = document.getElementById('bg-preset-select');
  const customUrlWrapper = document.getElementById('custom-url-wrapper');
  const customVideoUrlInput = document.getElementById('custom-video-url');
  const bgRotationSelect = document.getElementById('bg-rotation-select');
  const adminSaveBgBtn = document.getElementById('admin-save-bg-btn');
  const adminSaveMsg = document.getElementById('admin-save-msg');

  // SHA256 helper
  async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  function isAdminLoggedIn() {
    return localStorage.getItem(LINKS_SESSION_KEY) === LINKS_ADMIN_HASH;
  }

  // Apply saved background on page load
  function applySavedBackground() {
    const savedVideo = localStorage.getItem('aries-bg-video-url');
    const savedRotation = localStorage.getItem('aries-bg-rotation');

    if (bgVideo) {
      if (savedVideo) {
        const source = bgVideo.querySelector('source');
        if (source && source.src !== savedVideo) {
          source.src = savedVideo;
          bgVideo.load();
          bgVideo.play().catch(() => {});
        }
      }
      if (savedRotation) {
        bgVideo.style.transform = `translate(-50%, -50%) rotate(${savedRotation})`;
      }
    }
  }

  applySavedBackground();

  if (bgVideo) {
    bgVideo.addEventListener('error', () => {
      const source = bgVideo.querySelector('source');
      if (source) {
        source.src = 'https://github.com/UdithaAnuhas/Portfolio/releases/download/v1.0/Anime.Nature.mp4';
        bgVideo.load();
        bgVideo.play().catch(() => {});
      }
    }, true);
  }

  // Open modal - Stays unlocked for current session until page refresh
  if (adminBtn && adminModal) {
    adminBtn.addEventListener('click', () => {
      adminModal.classList.add('open');
      if (sessionStorage.getItem('aries-links-unlocked') === 'true') {
        adminLoginView.style.display = 'none';
        adminControlsView.style.display = 'block';
        populateCurrentSettings();
      } else {
        adminPassInput.value = '';
        adminLoginErr.textContent = '';
        adminLoginView.style.display = 'block';
        adminControlsView.style.display = 'none';
        adminPassInput.focus();
      }
    });
  }

  // Pre-populate dropdowns with active saved background settings
  function populateCurrentSettings() {
    const savedVideo = localStorage.getItem('aries-bg-video-url');
    const savedRotation = localStorage.getItem('aries-bg-rotation');

    if (savedVideo && bgPresetSelect) {
      let optionExists = Array.from(bgPresetSelect.options).some(opt => opt.value === savedVideo);
      if (optionExists) {
        bgPresetSelect.value = savedVideo;
        if (customUrlWrapper) customUrlWrapper.style.display = 'none';
      } else {
        bgPresetSelect.value = 'custom';
        if (customUrlWrapper) customUrlWrapper.style.display = 'block';
        if (customVideoUrlInput) customVideoUrlInput.value = savedVideo;
      }
    }
    if (savedRotation && bgRotationSelect) {
      bgRotationSelect.value = savedRotation;
    }
  }

  // Close modal on X or clicking backdrop outside modal content
  if (adminModalClose && adminModal) {
    adminModalClose.addEventListener('click', () => {
      adminModal.classList.remove('open');
    });
  }
  if (adminModal) {
    adminModal.addEventListener('click', (e) => {
      if (e.target === adminModal) {
        adminModal.classList.remove('open');
      }
    });
  }

  // Admin login check (Password: 0000)
  async function performAdminLogin() {
    const pass = adminPassInput.value.trim();
    if (!pass) return;
    const hash = await sha256(pass);
    if (hash === LINKS_ADMIN_HASH) {
      sessionStorage.setItem('aries-links-unlocked', 'true');
      adminLoginErr.textContent = '';
      adminLoginView.style.display = 'none';
      adminControlsView.style.display = 'block';
      populateCurrentSettings();
    } else {
      adminLoginErr.textContent = 'Invalid password!';
    }
  }

  if (adminLoginBtn) {
    adminLoginBtn.addEventListener('click', performAdminLogin);
  }
  if (adminPassInput) {
    adminPassInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') performAdminLogin();
    });
  }

  // Preset dropdown toggle
  if (bgPresetSelect && customUrlWrapper) {
    bgPresetSelect.addEventListener('change', () => {
      if (bgPresetSelect.value === 'custom') {
        customUrlWrapper.style.display = 'block';
      } else {
        customUrlWrapper.style.display = 'none';
      }
    });
  }

  // Save & Apply background
  if (adminSaveBgBtn) {
    adminSaveBgBtn.addEventListener('click', () => {
      let videoUrl = bgPresetSelect.value;
      if (videoUrl === 'custom') {
        videoUrl = customVideoUrlInput.value.trim();
      }
      const rotation = bgRotationSelect.value;

      if (!videoUrl) {
        adminSaveMsg.style.color = '#ef4444';
        adminSaveMsg.textContent = 'Please select or enter a video URL!';
        return;
      }

      localStorage.setItem('aries-bg-video-url', videoUrl);
      localStorage.setItem('aries-bg-rotation', rotation);

      applySavedBackground();

      adminSaveMsg.style.color = '#4ade80';
      adminSaveMsg.textContent = 'Background updated live & saved!';
      setTimeout(() => {
        adminSaveMsg.textContent = '';
        if (adminModal) adminModal.classList.remove('open');
      }, 500);
    });
  }

});
