const lenis = new Lenis({
  duration: 1.2,
  easing: (e) => Math.min(1, 1.001 - Math.pow(2, -10 * e)),
  orientation: "vertical",
  smoothWheel: !0,
});
function raf(e) {
  (lenis.raf(e), requestAnimationFrame(raf));
}
requestAnimationFrame(raf);
const revealElements = document.querySelectorAll(".reveal"),
  revealObserver = new IntersectionObserver(
    (e) => {
      e.forEach((e) => {
        e.isIntersecting && e.target.classList.add("visible");
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
  );
(revealElements.forEach((e) => revealObserver.observe(e)),
  document.addEventListener("DOMContentLoaded", () => {
    [
      ".skill-item",
      ".contact-item",
      ".video-item",
      ".image-item",
      ".thumbnail",
      ".hero h1",
      ".hero p",
      ".skills-title",
      ".contact-title",
      ".page-title__title",
    ].forEach((e) => {
      document.querySelectorAll(e).forEach((e, t) => {
        e.classList.contains("reveal") ||
          (e.classList.add("reveal"),
          (e.style.transitionDelay = 0.1 * t + "s"),
          revealObserver.observe(e));
      });
    });
  }));
