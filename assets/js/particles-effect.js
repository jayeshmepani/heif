/* Fixed particles-effect.js with robust 2D fallback and WebGL availability check */

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
    sensitivity: 0.2,  // Mouse influence on rotation
  },
  fallback: {
    speedMultiplier: 10, // Speed factor for 2D fallback
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
    const createStars = (count, size, spread, opacity) => {
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(count * 3);
      for (let i = 0; i < count * 3; i++)
        pos[i] = (Math.random() - 0.5) * spread;
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      return new THREE.Points(
        geo,
        new THREE.PointsMaterial({
          size,
          color: 0xffffff,
          transparent: true,
          opacity,
          sizeAttenuation: true,
        }),
      );
    };
    this.stars = [
      createStars(1500, 0.05, 80, 0.9),
      createStars(1000, 0.08, 120, 0.6),
      createStars(500, 0.12, 150, 0.3),
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
    this.mouseX = 0;
    this.mouseY = 0;
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

    if (this.stars) {
      // Layer 1
      this.stars[0].rotation.y =
        elapsed * state.starSpeedMultiplier * AnimationSettings.layers.speeds[0] + this.mouseX * AnimationSettings.mouse.sensitivity;
      this.stars[0].rotation.x = this.mouseY * (AnimationSettings.mouse.sensitivity * 0.66);

      // Layer 2
      this.stars[1].rotation.y =
        elapsed * state.starSpeedMultiplier * AnimationSettings.layers.speeds[1] + this.mouseX * (AnimationSettings.mouse.sensitivity * 0.66);
      this.stars[1].rotation.x = this.mouseY * (AnimationSettings.mouse.sensitivity * 0.53);

      // Layer 3
      this.stars[2].rotation.y =
        elapsed * state.starSpeedMultiplier * AnimationSettings.layers.speeds[2] + this.mouseX * (AnimationSettings.mouse.sensitivity * 0.33);
    }

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => this.animate());
  },

  initFallback(canvas) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', resize);
    resize();

    // Increased star count and added opacity for better effect
    const stars = Array.from({ length: 400 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.5 + 0.5,
      speed: Math.random() * 0.3 + 0.1,
      opacity: Math.random() * 0.7 + 0.3
    }));

    const animate2D = () => {
      ctx.clearRect(0, 0, width, height);

      stars.forEach(star => {
        star.y -= star.speed * (state.starSpeedMultiplier * AnimationSettings.fallback.speedMultiplier); // Sync speed somewhat with scroll state
        if (star.y < 0) {
          star.y = height;
          star.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
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