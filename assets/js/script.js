const hoverTexts = document.querySelectorAll('.hover-text');
const hoverImage1 = document.getElementById('hover-image-1');
const hoverImage2 = document.getElementById('hover-image-2');
const hoverImage3 = document.getElementById('hover-image-3');

hoverTexts.forEach((text, index) => {
  const hoverImage = index === 0 ? hoverImage1 : (index === 1 ? hoverImage2 : hoverImage3);

  text.addEventListener('mouseenter', () => {
    hoverImage.style.display = 'block';
  });

  text.addEventListener('mousemove', (e) => {
    hoverImage.style.left = `${e.pageX + 10}px`;
    hoverImage.style.top = `${e.pageY + 10}px`;
  });

  text.addEventListener('mouseleave', () => {
    hoverImage.style.display = 'none';
  });
});


 


// Optional: Pause the rotation on hover
const rotatingText = document.querySelector('.rotating-text');

rotatingText.addEventListener('mouseover', () => {
    rotatingText.style.animationPlayState = 'paused';
});

rotatingText.addEventListener('mouseout', () => {
    rotatingText.style.animationPlayState = 'running';
});









let currentIndex = 0;

const carousel = document.getElementById('carousel');
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

function moveSlide(direction) {
   currentIndex += direction;

   // Loop back to the first slide if at the end
   if (currentIndex >= totalSlides) {
       currentIndex = totalSlides - 1; // Prevent going out of bounds
   }

   // Loop back to the last slide if at the beginning
   if (currentIndex < 0) {
       currentIndex = 0; // Prevent going out of bounds
   }

   updateCarousel();
}

function updateCarousel() {
   carousel.style.transform = `translateX(-${currentIndex * (100 / totalSlides)}%)`;
}

// Add event listeners for buttons
document.querySelector('.prev').addEventListener('click', () => moveSlide(-1));
document.querySelector('.next').addEventListener('click', () => moveSlide(1));











document.addEventListener("DOMContentLoaded", () => {
  const sliders = document.querySelectorAll('.progress');

  sliders.forEach(slider => {
    // Set initial width to 0 (already done in CSS)
    const percentage = slider.getAttribute('data-percentage'); // Get the target percentage from the attribute

    setTimeout(() => {
      slider.style.width = percentage + '%'; // Animate to the target percentage
    }, 500); // Delay slightly to make it smoother
  });
});





(function () {
  "use strict";
  /*
   * Form Validation
   */

  // Fetch all the forms we want to apply custom validation styles to
  const forms = document.querySelectorAll(".needs-validation");
  const result = document.getElementById("result");
  // Loop over them and prevent submission
  Array.prototype.slice.call(forms).forEach(function (form) {
    form.addEventListener(
      "submit",
      function (event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();

          form.querySelectorAll(":invalid")[0].focus();
        } else {
          /*
           * Form Submission using fetch()
           */

          const formData = new FormData(form);
          event.preventDefault();
          event.stopPropagation();
          const object = {};
          formData.forEach((value, key) => {
            object[key] = value;
          });
          const json = JSON.stringify(object);
          result.innerHTML = "Please wait...";

          fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json"
            },
            body: json
          })
            .then(async (response) => {
              let json = await response.json();
              if (response.status == 200) {
                result.innerHTML = json.message;
                result.classList.remove("text-gray-500");
                result.classList.add("text-green-500");
              } else {
                console.log(response);
                result.innerHTML = json.message;
                result.classList.remove("text-gray-500");
                result.classList.add("text-red-500");
              }
            })
            .catch((error) => {
              console.log(error);
              result.innerHTML = "Something went wrong!";
            })
            .then(function () {
              form.reset();
              form.classList.remove("was-validated");
              setTimeout(() => {
                result.style.display = "none";
              }, 5000);
            });
        }
        form.classList.add("was-validated");
      },
      false
    );
  });
})();































 
