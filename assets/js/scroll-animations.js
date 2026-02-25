// Premium Lenis Smooth Scroll Configuration (Accelerated and Smooth)
const lenis = new Lenis({
    duration: 1.8,
    easing: (t) => 1 - Math.pow(1 - t, 4),
    direction: "vertical",
    smooth: true,
    smoothTouch: true,
    touchMultiplier: 1.5,
});

// 1. Tell ScrollTrigger to update every time Lenis scrolls
lenis.on('scroll', ScrollTrigger.update);

// 2. Add Lenis's requestAnimationFrame to GSAP's ticker
gsap.ticker.add((time) => {
    lenis.raf(time * 1000); // Convert GSAP's time (seconds) to Lenis's time (ms)
});

// 3. Prevent GSAP from lagging behind the scroll
gsap.ticker.lagSmoothing(0);

// Intersection Observer for Reveal Animations
const revealElements = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
        }
        // Removed else block to prevent jitter from Intersection Observer thrashing
    });
}, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

revealElements.forEach((el) => revealObserver.observe(el));

// Auto-add 'reveal' class to various UI elements on DOM load
document.addEventListener("DOMContentLoaded", () => {
    const selectors = [
        ".skill-item", ".contact-item", ".video-item", ".image-item",
        ".thumbnail", ".hero h1", ".hero p", ".skills-title",
        ".contact-title", ".page-title__title"
    ];

    selectors.forEach((selector) => {
        document.querySelectorAll(selector).forEach((el, index) => {
            if (!el.classList.contains("reveal")) {
                el.classList.add("reveal");
                el.style.transitionDelay = (0.1 * index) + "s";
                revealObserver.observe(el);
            }
        });
    });
});