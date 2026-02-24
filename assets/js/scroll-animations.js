// Premium Lenis Smooth Scroll Configuration (Accelerated and Smooth)
const lenis = new Lenis({
    duration: 1.8,
    easing: (t) => 1 - Math.pow(1 - t, 4),
    direction: "vertical",
    smooth: true,
    smoothTouch: true,
    touchMultiplier: 1.5,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Intersection Observer for Reveal Animations
const revealElements = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
        } else {
            // Remove the class when scrolled out of view to allow re-animation on scroll up/down
            entry.target.classList.remove("visible");
        }
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