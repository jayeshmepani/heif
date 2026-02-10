/*
  particles.js — cleaned 3-layer depth starfield
  Single implementation: toned down density/brightness and placed behind hover previews.
*/
(function () {
  // If the preferred Three.js Scene is initialized elsewhere (or the Scene3D definition exists), do nothing here.
  if (window.__HEIF_SCENE_INITIALIZED === true || typeof window.Scene3D !== 'undefined') return;
  const mount = document.querySelector('.stars-layer .stars-extra') || document.body;

  // helpers for hover fade and safe z-index
  function makeMountCanvas(zIndex) {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = String(zIndex);
    canvas.style.transition = 'opacity 180ms ease';
    canvas.style.opacity = '1';
    mount.appendChild(canvas);
    return canvas;
  }

  // hide/show controls used elsewhere
  function attachHoverFade(element, canvas) {
    function hide() {
      canvas.style.opacity = '0';
    }
    function show() {
      canvas.style.opacity = '1';
    }
    document.querySelectorAll('.hover-text, .hover-image').forEach((el) => {
      el.addEventListener('mouseenter', hide);
      el.addEventListener('mouseleave', show);
    });
    document.addEventListener('mouseover', (e) => { if (e.target.closest && e.target.closest('.hover-text')) hide(); });
    document.addEventListener('mouseout', (e) => { if (e.target.closest && e.target.closest('.hover-text')) show(); });
  }

  // Try Three.js implementation first; fallback to 2D canvas if unavailable
  if (typeof window.THREE !== 'undefined' && window.THREE) {
    try {
      // Three.js starfield
      const canvas = makeMountCanvas(-9999);
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'low-power' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
      camera.position.z = 7;

      function resize() {
        const w = mount.clientWidth || window.innerWidth;
        const h = mount.clientHeight || window.innerHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      }
      resize();
      window.addEventListener('resize', resize);

      const stateRef = window.state || { starSpeedMultiplier: 0.05 };
      // color from rgb(58,214,37) => hex 0x3AD625
      const starColor = 0x3ad625;

      function createStars(count, size, spread, opacity) {
        const geo = new THREE.BufferGeometry();
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count * 3; i++) pos[i] = (Math.random() - 0.5) * spread;
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        const mat = new THREE.PointsMaterial({ size, color: starColor, transparent: true, opacity, sizeAttenuation: true });
        return new THREE.Points(geo, mat);
      }

      const stars = [
        createStars(1200, 0.05, 80, 0.6),
        createStars(800, 0.08, 120, 0.4),
        createStars(400, 0.12, 150, 0.2),
      ];
      scene.add(...stars);

      // mouse-driven parallax
      let mouseX = 0, mouseY = 0;
      window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
      });

      const clock = new THREE.Clock();
      function animate() {
        const elapsed = clock.getElapsedTime();
        const m = stateRef.starSpeedMultiplier || 0.05;
        stars[0].rotation.y = elapsed * m + mouseX * 0.15;
        stars[0].rotation.x = mouseY * 0.08;
        stars[1].rotation.y = elapsed * m * 0.7 + mouseX * 0.1;
        stars[1].rotation.x = mouseY * 0.06;
        stars[2].rotation.y = elapsed * m * 0.4 + mouseX * 0.05;

        // gentle twinkle by modulating opacity slightly
        const pulse = (Math.sin(elapsed * 2) + 1) * 0.5;
        stars.forEach((s, i) => {
          const mat = s.material;
          mat.opacity = Math.max(0.05, mat.opacity * (0.85 + pulse * 0.15));
        });

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      }
      animate();

      attachHoverFade(document, canvas);
      // done
      return;
    } catch (e) {
      console.warn("Particles.js: WebGL initialization failed, falling back to 2D canvas.", e);
      // Ensure any created canvas does not stick around if we failed partway
      const badCanvas = mount.querySelector('canvas[style*="z-index: -9999"]');
      if (badCanvas) badCanvas.remove();
    }
  }

  // Fallback: 2D canvas starfield (lighter, safe)
  const canvas2 = makeMountCanvas(-9999);
  const ctx = canvas2.getContext('2d');
  let w = 0, h = 0;
  function resize2() {
    w = canvas2.width = (mount.clientWidth || window.innerWidth) * (window.devicePixelRatio || 1);
    h = canvas2.height = (mount.clientHeight || window.innerHeight) * (window.devicePixelRatio || 1);
    canvas2.style.width = (mount.clientWidth || window.innerWidth) + 'px';
    canvas2.style.height = (mount.clientHeight || window.innerHeight) + 'px';
    ctx.setTransform(window.devicePixelRatio || 1, 0, 0, window.devicePixelRatio || 1, 0, 0);
  }
  resize2();
  window.addEventListener('resize', resize2);

  attachHoverFade(document, canvas2);

  const cfg2 = { count: 700, twinkleSpeed: 2, parallax: 0.02 };
  const particles = [];
  for (let i = 0; i < cfg2.count; i++) particles.push({ x: Math.random() * (w / (window.devicePixelRatio || 1)), y: Math.random() * (h / (window.devicePixelRatio || 1)), z: Math.random() * 200 + 10, phase: Math.random() * Math.PI * 2, r: Math.random() * 1.8 + 0.2 });

  let mx = 0, my = 0; window.addEventListener('mousemove', (e) => { mx = (e.clientX / (window.innerWidth) - 0.5) * 2; my = (e.clientY / (window.innerHeight) - 0.5) * 2; });

  function draw2(now) {
    ctx.clearRect(0, 0, w, h);
    const t = now / 1000;
    const centerX = (w / (window.devicePixelRatio || 1)) / 2;
    const centerY = (h / (window.devicePixelRatio || 1)) / 2;
    const speedMultiplier = (window.state && typeof window.state.starSpeedMultiplier === 'number') ? window.state.starSpeedMultiplier : 0.05;
    for (let p of particles) {
      const parallaxX = mx * (p.z / 300) * cfg2.parallax * 200;
      const parallaxY = my * (p.z / 300) * cfg2.parallax * 200;
      const x = p.x + parallaxX + Math.sin(t + p.phase) * 0.3 * (p.z / 300);
      const y = p.y + parallaxY + Math.cos(t + p.phase) * 0.3 * (p.z / 300);
      const scale = 200 / (200 + p.z);
      const size = Math.max(0.2, p.r * scale * 2);
      const tw = 0.5 + 0.5 * Math.sin(t * cfg2.twinkleSpeed + p.phase);
      ctx.beginPath();
      ctx.fillStyle = `rgba(58,214,37,${(0.25 * tw * (1 - p.z / 400)).toFixed(3)})`;
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(draw2);
  }
  requestAnimationFrame(draw2);

})();
