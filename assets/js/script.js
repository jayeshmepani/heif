const hoverTexts = document.querySelectorAll(".hover-text"),
  hoverImage1 = document.getElementById("hover-image-1"),
  hoverImage2 = document.getElementById("hover-image-2"),
  hoverImage3 = document.getElementById("hover-image-3");
hoverTexts.forEach((e, t) => {
  const n = 0 === t ? hoverImage1 : 1 === t ? hoverImage2 : hoverImage3;
  (e.addEventListener("mouseenter", () => {
    n.style.display = "block";
  }),
    e.addEventListener("mousemove", (e) => {
      ((n.style.left = `${e.pageX + 10}px`),
        (n.style.top = `${e.pageY + 10}px`));
    }),
    e.addEventListener("mouseleave", () => {
      n.style.display = "none";
    }));
});
const rotatingText = document.querySelector(".rotating-text");
(rotatingText.addEventListener("mouseover", () => {
  rotatingText.style.animationPlayState = "paused";
}),
  rotatingText.addEventListener("mouseout", () => {
    rotatingText.style.animationPlayState = "running";
  }));
let currentIndex = 0;
const carousel = document.getElementById("carousel"),
  slides = document.querySelectorAll(".slide"),
  totalSlides = slides.length;
function moveSlide(e) {
  ((currentIndex += e),
    currentIndex >= totalSlides && (currentIndex = totalSlides - 1),
    currentIndex < 0 && (currentIndex = 0),
    updateCarousel());
}
function updateCarousel() {
  carousel.style.transform = `translateX(-${currentIndex * (100 / totalSlides)}%)`;
}
(document.querySelector(".prev").addEventListener("click", () => moveSlide(-1)),
  document.querySelector(".next").addEventListener("click", () => moveSlide(1)),
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".progress").forEach((e) => {
      const t = e.getAttribute("data-percentage");
      setTimeout(() => {
        e.style.width = t + "%";
      }, 500);
    });
  }),
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
  })());
const navToggle = document.querySelector(".nav-toggle"),
  navMenu = document.querySelector("header nav ul");
navToggle &&
  navToggle.addEventListener("click", (e) => {
    (e.preventDefault(), navMenu.classList.toggle("active"));
  });
