/*
  particles.js — starfield background
  Inspired by your `script.min.js` Scene3D stars idea but implemented as a lightweight 2D canvas
  This draws and animates many small stars in the `.stars-layer .stars-extra` element.
*/
(function () {
  const layer = document.querySelector('.stars-layer');
  const extra = layer ? layer.querySelector('.stars-extra') : null;
  const mount = extra || layer || document.body;

  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '-1';
  mount.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let w = (canvas.width = window.innerWidth);
  let h = (canvas.height = window.innerHeight);

  const cfg = {
    density: 0.00008, // particles per px
    maxParticles: 900,
    speed: 0.02,
    twinkleSpeed: 3,
    parallax: 0.02,
  };

  let particles = [];
  const mouse = { x: null, y: null };

  function initParticles() {
    particles = [];
    const count = Math.min(cfg.maxParticles, Math.round(w * h * cfg.density));
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.4 + 0.3,
        vx: (Math.random() - 0.5) * cfg.speed,
        vy: (Math.random() - 0.5) * cfg.speed,
        phase: Math.random() * Math.PI * 2,
      });
    }
  }

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    initParticles();
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  let last = performance.now();
  function draw(now) {
    const dt = (now - last) / 1000;
    last = now;
    ctx.clearRect(0, 0, w, h);
    const t = now / 1000;

    const centerX = w / 2;
    const centerY = h / 2;
    const mx = mouse.x == null ? 0 : (mouse.x - centerX) * cfg.parallax;
    const my = mouse.y == null ? 0 : (mouse.y - centerY) * cfg.parallax;

    for (let p of particles) {
      // position update
      p.x += p.vx * (1 + Math.sin(t + p.phase) * 0.5);
      p.y += p.vy * (1 + Math.cos(t + p.phase) * 0.5);

      // wrap around
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10;
      if (p.y > h + 10) p.y = -10;

      // twinkle
      const tw = 0.5 + 0.5 * Math.sin(t * cfg.twinkleSpeed + p.phase);
      const alpha = Math.max(0.15, Math.min(1, tw));

      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.arc(p.x + mx, p.y + my, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  // init
  initParticles();
  requestAnimationFrame(draw);
})();

// Custom cursor elements (keep cursor UI/hover effects)
(function () {
  try {
    const cursor = document.createElement('div');
    cursor.id = 'custom-cursor';
    document.body.appendChild(cursor);

    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    document.body.appendChild(trail);

    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
      trail.style.left = e.clientX + 'px';
      trail.style.top = e.clientY + 'px';
    });

    document.addEventListener('mouseover', (evt) => {
      const t = evt.target;
      if (
        t.tagName === 'A' ||
        t.tagName === 'BUTTON' ||
        t.classList.contains('hover-text') ||
        t.classList.contains('hover-link')
      ) {
        document.body.classList.add('hovering');
      }
    });

    document.addEventListener('mouseout', (evt) => {
      const t = evt.target;
      if (
        t.tagName === 'A' ||
        t.tagName === 'BUTTON' ||
        t.classList.contains('hover-text') ||
        t.classList.contains('hover-link')
      ) {
        document.body.classList.remove('hovering');
      }
    });
  } catch (e) {
    // fail silently
  }
})();
