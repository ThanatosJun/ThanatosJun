/* ═══════════════════════════════════════════
   Thanatos Portfolio — Main JavaScript
   ✦ 星空粒子 · 流星 · 滾動動畫 · 音樂控制
   ═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initStarfield();
  initMusicPlayer();
  initMusicOverlay();
  initSmoothScroll();
  initNavbarScroll();
  loadAbout();
  loadProjects();
  loadVideos();
  loadPoems();
});

/* ───────── 星空粒子背景 ───────── */
function initStarfield() {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height, stars;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function createStars(count = 200) {
    stars = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.3,
        alpha: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.5 + 0.1,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleOffset: Math.random() * Math.PI * 2,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // 深空漸層背景
    const gradient = ctx.createRadialGradient(
      width / 2, height / 2, 0,
      width / 2, height / 2, Math.max(width, height) / 1.5
    );
    gradient.addColorStop(0, '#0f0f2d');
    gradient.addColorStop(0.5, '#0a0a1a');
    gradient.addColorStop(1, '#050510');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    const time = Date.now() * 0.001;

    stars.forEach(star => {
      // 閃爍效果
      const twinkle = Math.sin(time * star.twinkleSpeed * 10 + star.twinkleOffset);
      const alpha = star.alpha * (0.6 + 0.4 * twinkle);

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 210, 255, ${alpha})`;
      ctx.fill();

      // 較亮的星星加光暈
      if (star.radius > 1) {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(108, 92, 231, ${alpha * 0.15})`;
        ctx.fill();
      }

      // 緩慢飄移
      star.y += star.speed * 0.1;
      if (star.y > height + 5) {
        star.y = -5;
        star.x = Math.random() * width;
      }
    });

    requestAnimationFrame(draw);
  }

  resize();
  createStars();
  draw();

  window.addEventListener('resize', () => {
    resize();
    createStars();
  });
}

/* ───────── 滾動動畫（卡片淡入） ───────── */
function initScrollAnimations() {
  const cards = document.querySelectorAll('.project-card');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // 延遲交錯動畫
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, index * 150);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  cards.forEach(card => observer.observe(card));
}

/* ───────── 背景音樂控制 ───────── */
let isMusicPlaying = false;

function initMusicPlayer() {
  const btn = document.getElementById('music-toggle');
  const audio = document.getElementById('bg-music');
  const statusEl = btn?.querySelector('.music-status');

  if (!btn || !audio) return;

  btn.addEventListener('click', () => {
    if (isMusicPlaying) {
      audio.pause();
      btn.classList.remove('playing');
      if (statusEl) statusEl.textContent = 'OFF';
    } else {
      audio.volume = 0.3;
      audio.play().catch(() => {});
      btn.classList.add('playing');
      if (statusEl) statusEl.textContent = 'ON';
    }
    isMusicPlaying = !isMusicPlaying;
  });
}

/* ───────── 點擊畫面觸發音樂播放 ───────── */
function initMusicOverlay() {
  const audio = document.getElementById('bg-music');
  const musicBtn = document.getElementById('music-toggle');
  const statusEl = musicBtn?.querySelector('.music-status');
  if (!audio) return;

  const overlay = document.createElement('div');
  overlay.className = 'music-overlay';
  overlay.innerHTML = '<div class="music-overlay-text">🎵 點擊畫面開啟音樂</div>';
  document.body.appendChild(overlay);

  overlay.addEventListener('click', () => {
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.4s ease';
    setTimeout(() => overlay.remove(), 400);

    audio.volume = 0.3;
    audio.play().catch(() => {});
    isMusicPlaying = true;
    if (musicBtn) musicBtn.classList.add('playing');
    if (statusEl) statusEl.textContent = 'ON';
  });
}

/* ───────── 平滑滾動 ───────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ───────── Navbar 滾動效果 ───────── */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.style.background = 'rgba(10, 10, 26, 0.95)';
      navbar.style.borderBottomColor = 'rgba(108, 92, 231, 0.3)';
    } else {
      navbar.style.background = 'rgba(10, 10, 26, 0.85)';
      navbar.style.borderBottomColor = 'rgba(108, 92, 231, 0.15)';
    }
  });
}

/* ───────── 影片播放時自動暫停背景音樂 ───────── */
function initVideoMusicToggle() {
  const bgMusic = document.getElementById('bg-music');
  const musicBtn = document.getElementById('music-toggle');
  const statusEl = musicBtn?.querySelector('.music-status');
  const videos = document.querySelectorAll('video');

  if (!bgMusic || videos.length === 0) return;

  let wasMusicPlaying = false;

  videos.forEach(video => {
    video.addEventListener('play', () => {
      if (!bgMusic.paused) {
        wasMusicPlaying = true;
        bgMusic.pause();
        if (musicBtn) musicBtn.classList.remove('playing');
        if (statusEl) statusEl.textContent = 'OFF';
      }
    });

    video.addEventListener('pause', () => {
      if (wasMusicPlaying && video.paused && !video.ended) return;
    });

    video.addEventListener('ended', () => {
      if (wasMusicPlaying) {
        wasMusicPlaying = false;
        bgMusic.play().catch(() => {});
        if (musicBtn) musicBtn.classList.add('playing');
        if (statusEl) statusEl.textContent = 'ON';
      }
    });
  });
}

/* ───────── 從 JSON 動態載入詩作 ───────── */
function loadPoems() {
  const grid = document.getElementById('poetry-grid');
  if (!grid) return;

  fetch('data/poems.json')
    .then(res => res.json())
    .then(poems => {
      grid.innerHTML = poems.map(poem => {
        const stanzas = poem.stanzas.map(s => {
          const cls = s.indent ? ' class="poem-indent"' : '';
          return `<p${cls}>${s.lines.join('\n')}</p>`;
        }).join('\n          ');

        return `
      <article class="poem-card">
        <h3 class="poem-title">${poem.title}</h3>
        <div class="poem-body">
          ${stanzas}
        </div>
      </article>`;
      }).join('\n');
    })
    .catch(err => console.warn('詩作載入失敗:', err));
}

/* ───────── 從 JSON 動態載入專案卡片 ───────── */
function loadProjects() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  fetch('data/projects.json')
    .then(res => res.json())
    .then(data => {
      const projects = data.projects;
      grid.innerHTML = projects.map(p => {
        // 圖片區
        let imageHtml;
        if (p.images && p.images.length > 1) {
          imageHtml = `<div class="card-image card-image-dual">${p.images.map(img =>
            `<img src="${img.src}" alt="${img.alt}" loading="lazy" />`).join('')}</div>`;
        } else if (p.images && p.images.length === 1) {
          imageHtml = `<div class="card-image"><img src="${p.images[0].src}" alt="${p.images[0].alt}" loading="lazy" /></div>`;
        } else {
          imageHtml = `<div class="card-image"><div class="card-image-placeholder">${p.placeholder || ''}</div></div>`;
        }

        // 標籤
        const tagsHtml = p.tags.map(t => `<span>${t}</span>`).join('');

        // 連結
        const linksHtml = p.links.map(l =>
          `<a href="${l.url}" target="_blank" class="card-link">${l.label}</a>`).join('');

        // QR Code
        const qrHtml = p.qr ? `<div class="card-qr"><a href="${p.qr.url}" target="_blank"><img src="${p.qr.src}" alt="${p.qr.alt}" /></a></div>` : '';

        return `
      <div class="project-card" data-aos="fade-up">
        ${imageHtml}
        <div class="card-content">
          <h3>${p.title}</h3>
          <p>${p.description}</p>
          <div class="card-tags">${tagsHtml}</div>
          <div class="card-links">${linksHtml}</div>
          ${qrHtml}
        </div>
      </div>`;
      }).join('');

      // 重新綁定滾動動畫
      initScrollAnimations();
    })
    .catch(err => console.warn('專案載入失敗:', err));
}

/* ───────── 從 JSON 動態載入影片 ───────── */
function loadVideos() {
  const showcase = document.getElementById('video-showcase');
  if (!showcase) return;

  fetch('data/projects.json')
    .then(res => res.json())
    .then(data => {
      const videos = data.videos;
      if (!videos || videos.length === 0) return;

      showcase.innerHTML = videos.map(v => `
      <div class="video-card">
        <div class="video-wrapper">
          <video controls preload="metadata"${v.poster ? ` poster="${v.poster}"` : ''}>
            <source src="${v.src}" type="video/mp4" />
            您的瀏覽器不支援影片播放。
          </video>
        </div>
        <div class="video-info">
          <h3>${v.title}</h3>
          <p>${v.description}</p>
        </div>
      </div>`).join('');

      // 重新綁定影片音樂切換
      initVideoMusicToggle();
    })
    .catch(err => console.warn('影片載入失敗:', err));
}

/* ───────── 從 JSON 動態載入個人介紹 ───────── */
function loadAbout() {
  const container = document.getElementById('about-content');
  if (!container) return;

  fetch('data/about.json')
    .then(res => res.json())
    .then(data => {
      const interestsHtml = data.interests.map(i =>
        `<div class="interest-chip">
          <span class="interest-icon">${i.icon}</span>
          <span>${i.label}</span>
        </div>`
      ).join('');

      container.innerHTML = `
        <p class="about-tagline">${data.tagline}</p>
        <div class="about-interests">${interestsHtml}</div>
      `;
    })
    .catch(err => console.warn('個人介紹載入失敗:', err));
}
