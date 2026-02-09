const hoverTexts = document.querySelectorAll(".hover-text"),
  hoverImage1 = document.getElementById("hover-image-1"),
  hoverImage2 = document.getElementById("hover-image-2"),
  hoverImage3 = document.getElementById("hover-image-3");

if (hoverTexts.length > 0) {
  hoverTexts.forEach((e, t) => {
    const n = 0 === t ? hoverImage1 : 1 === t ? hoverImage2 : hoverImage3;
    if (n) {
      e.addEventListener("mouseenter", () => {
        n.style.display = "block";
      });
      e.addEventListener("mousemove", (ev) => {
        // Anchor the image by its top-center to the cursor
        n.style.display = 'block';
        const imgW = n.offsetWidth || n.clientWidth;
        const imgH = n.offsetHeight || n.clientHeight;
        const padding = 8; // keep some gap from viewport edges
        // Use page coordinates (include scrolling)
        let left = ev.pageX - imgW / 2;
        let top = ev.pageY; // top-center anchored to cursor

        // If overflow on the left, anchor to left edge
        if (left < padding) left = padding;
        // If overflow on the right, anchor to right edge
        if (left + imgW > window.innerWidth - padding)
          left = window.innerWidth - imgW - padding;

        n.style.left = `${left}px`;
        n.style.top = `${top}px`;
      });
      e.addEventListener("mouseleave", () => {
        n.style.display = "none";
      });
    }
  });
}

const rotatingText = document.querySelector(".rotating-text");
if (rotatingText) {
  rotatingText.addEventListener("mouseover", () => {
    rotatingText.style.animationPlayState = "paused";
  });
  rotatingText.addEventListener("mouseout", () => {
    rotatingText.style.animationPlayState = "running";
  });
}
let currentIndex = 0;
const carousel = document.getElementById("carousel"),
  slides = document.querySelectorAll(".slide"),
  totalSlides = slides.length;

if (carousel) {
  function moveSlide(e) {
    currentIndex += e;
    if (currentIndex >= totalSlides) currentIndex = totalSlides - 1;
    if (currentIndex < 0) currentIndex = 0;
    updateCarousel();
  }

  function updateCarousel() {
    carousel.style.transform = `translateX(-${currentIndex * (100 / totalSlides)}%)`;
  }

  const prevBtn = document.querySelector(".prev");
  const nextBtn = document.querySelector(".next");

  if (prevBtn) prevBtn.addEventListener("click", () => moveSlide(-1));
  if (nextBtn) nextBtn.addEventListener("click", () => moveSlide(1));
}
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".progress").forEach((e) => {
    const t = e.getAttribute("data-percentage");
    setTimeout(() => {
      e.style.width = t + "%";
    }, 500);
  });
});
(function () {
  "use strict";
  const e = document.querySelectorAll(".needs-validation"),
    t = document.getElementById("result");
  Array.prototype.slice.call(e).forEach(function (e) {
    e.addEventListener(
      "submit",
      function (n) {
        if (e.checkValidity()) {
          const o = new FormData(e);
          (n.preventDefault(), n.stopPropagation());
          const a = {};
          o.forEach((e, t) => {
            a[t] = e;
          });
          const r = JSON.stringify(a);
          ((t.innerHTML = "Please wait..."),
            fetch("https://api.web3forms.com/submit", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              body: r,
            })
              .then(async (e) => {
                let n = await e.json();
                200 == e.status
                  ? ((t.innerHTML = n.message),
                    t.classList.remove("text-gray-500"),
                    t.classList.add("text-green-500"))
                  : ((t.innerHTML = n.message),
                    t.classList.remove("text-gray-500"),
                    t.classList.add("text-red-500"));
              })
              .catch((e) => {
                t.innerHTML = "Something went wrong!";
              })
              .then(function () {
                (e.reset(),
                  e.classList.remove("was-validated"),
                  setTimeout(() => {
                    t.style.display = "none";
                  }, 5e3));
              }));
        } else
          (n.preventDefault(),
            n.stopPropagation(),
            e.querySelectorAll(":invalid")[0].focus());
        e.classList.add("was-validated");
      },
      !1,
    );
  });
})();
const navToggle = document.querySelector(".nav-toggle"),
  navMenu = document.querySelector("header nav ul");
navToggle &&
  navToggle.addEventListener("click", (e) => {
    e.preventDefault();
    navToggle.classList.toggle("active");
    navMenu.classList.toggle("active");
  });
