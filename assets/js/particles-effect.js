/* Enhanced particles-effect.js with rich mouse interactivity */

const Config = {
  selectors: {
    canvas: "#webgl-canvas",
  },
};

// Centralized Animation Settings
const AnimationSettings = {
  rotation: {
    baseSpeed: 0.05,    // Normal rotation speed
    scrollSpeed: 0.15,   // Fast rotation when scrolling to footer
  },
  layers: {
    // Speed multipliers for each star layer (inner to outer)
    speeds: [1.0, 0.7, 0.4],
  },
  mouse: {
    sensitivity: 0.35,     // Mouse influence on rotation (increased from 0.2)
    repulsionRadius: 2.5,  // Radius of mouse repulsion effect (world units)
    repulsionStrength: 0.8, // How strongly stars push away
    cameraShift: 0.8,      // How much the camera shifts toward the mouse
    smoothing: 0.2,       // Lerp factor for smooth mouse following
    velocityInfluence: 0.4, // How much mouse speed affects the effect
  },
  fallback: {
    speedMultiplier: 10,    // Speed factor for 2D fallback
    mouseRadius: 120,       // Pixel radius for 2D mouse repulsion
    mouseStrength: 3,       // 2D repulsion strength
  }
};

const state = {
  starSpeedMultiplier: AnimationSettings.rotation.baseSpeed,
};

// Helper to check if WebGL is available without throwing excessive errors
function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch (e) {
    return false;
  }
}

const Scene3D = {
  init() {
    const canvas = document.querySelector(Config.selectors.canvas);
    if (!canvas) return;

    // Ensure canvas has size if CSS loaded late
    if (canvas.width === 0 || canvas.height === 0) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    // Check WebGL availability first to avoid Three.js console errors
    if (!isWebGLAvailable()) {
      console.warn("WebGL not available, using 2D fallback");
      this.initFallback(canvas);
      return;
    }

    try {
      this.clock = new THREE.Clock();
      this.scene = new THREE.Scene();
      this.scene.fog = new THREE.FogExp2(0x0f0017, 0.002);
      this.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000,
      );
      this.camera.position.z = 7;

      this.renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance"
      });

      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.createObjects();
      this.initAnimations();
      this.bindEvents();
      this.animate();

    } catch (e) {
      console.warn("Scene3D WebGL Init Failed, switching to 2D fallback", e);
      this.initFallback(canvas);
    }
  },

  createObjects() {
    // Generate a soft circle texture to replace default square points
    const circleTexture = (() => {
      const size = 69;
      const cnv = document.createElement('canvas');
      cnv.width = size;
      cnv.height = size;
      const ctx = cnv.getContext('2d');
      const half = size / 2;
      const gradient = ctx.createRadialGradient(half, half, 0, half, half, half);
      gradient.addColorStop(0, 'rgba(255,255,255,1)');
      gradient.addColorStop(0.3, 'rgba(255,255,255,0.8)');
      gradient.addColorStop(0.7, 'rgba(255,255,255,0.15)');
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);
      const tex = new THREE.CanvasTexture(cnv);
      tex.needsUpdate = true;
      return tex;
    })();

    const createStars = (count, size, spread, opacity) => {
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(count * 3);
      // Store original positions for repulsion effect
      const origPos = new Float32Array(count * 3);
      for (let i = 0; i < count * 3; i++) {
        const val = (Math.random() - 0.5) * spread;
        pos[i] = val;
        origPos[i] = val;
      }
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      // Store originals as a custom attribute for reference
      geo.userData = { originalPositions: origPos, spread };
      const points = new THREE.Points(
        geo,
        new THREE.PointsMaterial({
          size,
          color: 0xffffff,
          transparent: true,
          opacity,
          sizeAttenuation: true,
          alphaMap: circleTexture,
          blending: THREE.AdditiveBlending,
        }),
      );
      return points;
    };
    this.stars = [
      createStars(2000, 0.05, 80, 0.41),
      createStars(1500, 0.07, 120, 0.41),
      createStars(777, 0.13, 160, 0.3),
      createStars(75, 0.17, 320, 0.17),
      createStars(15, 0.2, 800, 0.05),
    ];
    this.scene.add(...this.stars);
  },

  initAnimations() {
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.create({
        trigger: "footer",
        start: "top bottom",
        onEnter: () => gsap.to(state, { starSpeedMultiplier: AnimationSettings.rotation.scrollSpeed, duration: 1 }),
        onLeaveBack: () =>
          gsap.to(state, { starSpeedMultiplier: AnimationSettings.rotation.baseSpeed, duration: 2 }),
      });
    }
  },

  bindEvents() {
    // Raw mouse position (normalized -1 to 1)
    this.mouseX = 0;
    this.mouseY = 0;
    // Smoothed mouse position for fluid animation
    this.smoothMouseX = 0;
    this.smoothMouseY = 0;
    // Mouse velocity for dynamic effects
    this.mouseVelX = 0;
    this.mouseVelY = 0;
    this.prevMouseX = 0;
    this.prevMouseY = 0;
    // Mouse world-space position for repulsion (projected onto a plane)
    this.mouseWorldX = 0;
    this.mouseWorldY = 0;

    window.addEventListener("mousemove", (e) => {
      this.mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      this.mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    window.addEventListener("resize", () => {
      if (this.camera && this.renderer) {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
      }
    });
  },

  animate() {
    if (!this.renderer) return;
    const elapsed = this.clock.getElapsedTime();
    const ms = AnimationSettings.mouse;

    // Smooth the mouse position for fluid camera/rotation
    this.smoothMouseX += (this.mouseX - this.smoothMouseX) * ms.smoothing;
    this.smoothMouseY += (this.mouseY - this.smoothMouseY) * ms.smoothing;

    // Calculate mouse velocity (for dynamic effects)
    this.mouseVelX = (this.smoothMouseX - this.prevMouseX) * 60; // ~frame-rate normalized
    this.mouseVelY = (this.smoothMouseY - this.prevMouseY) * 60;
    this.prevMouseX = this.smoothMouseX;
    this.prevMouseY = this.smoothMouseY;

    const mouseSpeed = Math.sqrt(this.mouseVelX * this.mouseVelX + this.mouseVelY * this.mouseVelY);
    const velocityBoost = 1 + Math.min(mouseSpeed * ms.velocityInfluence, 2.0);

    // Subtle camera shift toward mouse for depth feeling
    if (this.camera) {
      this.camera.position.x += (this.smoothMouseX * ms.cameraShift - this.camera.position.x) * 0.05;
      this.camera.position.y += (-this.smoothMouseY * ms.cameraShift - this.camera.position.y) * 0.05;
      this.camera.lookAt(this.scene.position);
    }

    // Convert smoothed mouse to a rough world-space position for repulsion
    // (approximate: project mouse coords onto a flat plane at z=0)
    this.mouseWorldX = this.smoothMouseX * 12;   // scale to match star spread
    this.mouseWorldY = -this.smoothMouseY * 12;

    if (this.stars) {
      const repRadius = ms.repulsionRadius * velocityBoost;
      const repStrength = ms.repulsionStrength * velocityBoost;

      // Layer 1 — closest, most reactive
      this.stars[0].rotation.y =
        elapsed * state.starSpeedMultiplier * AnimationSettings.layers.speeds[0]
        + this.smoothMouseX * ms.sensitivity;
      this.stars[0].rotation.x = this.smoothMouseY * (ms.sensitivity * 0.66);

      // Layer 2
      this.stars[1].rotation.y =
        elapsed * state.starSpeedMultiplier * AnimationSettings.layers.speeds[1]
        + this.smoothMouseX * (ms.sensitivity * 0.75);
      this.stars[1].rotation.x = this.smoothMouseY * (ms.sensitivity * 0.53);

      // Layer 3
      this.stars[2].rotation.y =
        elapsed * state.starSpeedMultiplier * AnimationSettings.layers.speeds[2]
        + this.smoothMouseX * (ms.sensitivity * 0.5);
      this.stars[2].rotation.x = this.smoothMouseY * (ms.sensitivity * 0.35);

      // Layer 4 — subtle
      if (this.stars[3]) {
        this.stars[3].rotation.y =
          elapsed * state.starSpeedMultiplier * 0.25
          + this.smoothMouseX * (ms.sensitivity * 0.25);
        this.stars[3].rotation.x = this.smoothMouseY * (ms.sensitivity * 0.2);
      }

      // Layer 5 — barely moves
      if (this.stars[4]) {
        this.stars[4].rotation.y =
          elapsed * state.starSpeedMultiplier * 0.1
          + this.smoothMouseX * (ms.sensitivity * 0.1);
      }

      // Apply repulsion to the closest two layers for a "parting" effect
      this._applyRepulsion(this.stars[0], repRadius * 0.6, repStrength * 0.4);
      this._applyRepulsion(this.stars[1], repRadius * 0.4, repStrength * 0.25);
    }

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => this.animate());
  },

  /**
   * Nudge star positions away from the mouse in world space.
   * Only affects stars within `radius` of the projected mouse position.
   * Stars smoothly return to their original positions.
   */
  _applyRepulsion(pointCloud, radius, strength) {
    const geo = pointCloud.geometry;
    const posAttr = geo.getAttribute('position');
    const posArray = posAttr.array;
    const origArray = geo.userData.originalPositions;
    if (!origArray) return;

    const count = posAttr.count;
    const rSq = radius * radius;
    let needsUpdate = false;

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const iy = i * 3 + 1;
      const iz = i * 3 + 2;

      // Original position
      const ox = origArray[ix];
      const oy = origArray[iy];
      const oz = origArray[iz];

      // Distance from mouse (XY plane, ignore Z for simplicity)
      const dx = ox - this.mouseWorldX;
      const dy = oy - this.mouseWorldY;
      const distSq = dx * dx + dy * dy;

      if (distSq < rSq && distSq > 0.001) {
        const dist = Math.sqrt(distSq);
        const factor = (1 - dist / radius) * strength;
        const nx = dx / dist;
        const ny = dy / dist;

        // Push outward
        const targetX = ox + nx * factor;
        const targetY = oy + ny * factor;

        // Lerp to target
        posArray[ix] += (targetX - posArray[ix]) * 0.15;
        posArray[iy] += (targetY - posArray[iy]) * 0.15;
        needsUpdate = true;
      } else {
        // Lerp back to original
        const returnSpeed = 0.03;
        const dxR = ox - posArray[ix];
        const dyR = oy - posArray[iy];
        const dzR = oz - posArray[iz];
        if (Math.abs(dxR) > 0.001 || Math.abs(dyR) > 0.001 || Math.abs(dzR) > 0.001) {
          posArray[ix] += dxR * returnSpeed;
          posArray[iy] += dyR * returnSpeed;
          posArray[iz] += dzR * returnSpeed;
          needsUpdate = true;
        }
      }
    }

    if (needsUpdate) {
      posAttr.needsUpdate = true;
    }
  },

  initFallback(canvas) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let mouseX = width / 2;
    let mouseY = height / 2;
    let smoothMouseX = width / 2;
    let smoothMouseY = height / 2;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', resize);
    resize();

    // Track mouse for 2D interactive effects
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    const fb = AnimationSettings.fallback;

    // Increased star count and added opacity for better effect
    const stars = Array.from({ length: 400 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      baseX: 0, // Will be set per-frame for drift
      baseY: 0,
      size: Math.random() * 1.5 + 0.5,
      speed: Math.random() * 0.3 + 0.1,
      opacity: Math.random() * 0.7 + 0.3,
      offsetX: 0, // repulsion offset
      offsetY: 0,
    }));

    const animate2D = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth the mouse
      smoothMouseX += (mouseX - smoothMouseX) * 0.08;
      smoothMouseY += (mouseY - smoothMouseY) * 0.08;

      stars.forEach(star => {
        star.y -= star.speed * (state.starSpeedMultiplier * fb.speedMultiplier);
        if (star.y < 0) {
          star.y = height;
          star.x = Math.random() * width;
        }

        // Mouse repulsion in 2D
        const dx = star.x + star.offsetX - smoothMouseX;
        const dy = star.y + star.offsetY - smoothMouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < fb.mouseRadius && dist > 1) {
          const factor = (1 - dist / fb.mouseRadius) * fb.mouseStrength;
          const nx = dx / dist;
          const ny = dy / dist;
          star.offsetX += nx * factor;
          star.offsetY += ny * factor;
        }

        // Decay the offset back to 0
        star.offsetX *= 0.92;
        star.offsetY *= 0.92;

        const drawX = star.x + star.offsetX;
        const drawY = star.y + star.offsetY;

        // Glow near mouse
        const glowDist = Math.sqrt(
          (drawX - smoothMouseX) ** 2 + (drawY - smoothMouseY) ** 2
        );
        const glowFactor = Math.max(0, 1 - glowDist / (fb.mouseRadius * 1.5));
        const finalOpacity = Math.min(1, star.opacity + glowFactor * 0.4);
        const finalSize = star.size + glowFactor * 1.5;

        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${finalOpacity})`;
        ctx.arc(drawX, drawY, finalSize, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(animate2D);
    };
    animate2D();
  }
};

// Auto-init
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => Scene3D.init());
} else {
  Scene3D.init();
}