 

// Box Bound Cursors
const boxes = document.querySelectorAll('.boxes .box');

for (let i = 0; i < boxes.length; i++) {
	const box = boxes[i];
	const cursor = box.querySelector('.custom-cursor');

	box.addEventListener('mouseenter', () => {
		site_wide_cursor.style.display = 'none';
	});

	box.addEventListener('mouseleave', () => {
		site_wide_cursor.style.display = 'block';
	});

	document.addEventListener('mousemove', TrackBoxCursor.bind(box));

	document.addEventListener('mousedown', () => cursor.classList.add('active'));
	document.addEventListener('mouseup', () => cursor.classList.remove('active'));
}

function TrackBoxCursor (evt) {
	const box = this;
	const cursor = box.querySelector('.custom-cursor');

	const boxRect = box.getBoundingClientRect();

	const x = evt.clientX - boxRect.left;
	const y = evt.clientY - boxRect.top;

	cursor.style.transform = `translate(${x}px, ${y}px)`;
}






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


 

let currentIndex = 0;

const carousel = document.getElementById('carousel');
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

function moveSlide(direction) {
    currentIndex += direction;

    // Loop back to the first slide if at the end
    if (currentIndex >= totalSlides - 2) {
        currentIndex = 0;
        carousel.style.transition = 'none';
        carousel.style.transform = `translateX(0)`;
        setTimeout(() => {
            carousel.style.transition = 'transform 0.5s ease-in-out';
            currentIndex++;
            updateCarousel();
        }, 20);
        updateIndicators();
        return;
    }

    // Loop back to the last slide if at the beginning
    if (currentIndex < 0) {
        currentIndex = totalSlides - 3;
        carousel.style.transition = 'none';
        carousel.style.transform = `translateX(-${currentIndex * (100 / 3)}%)`;
        setTimeout(() => {
            carousel.style.transition = 'transform 0.5s ease-in-out';
            updateCarousel();
        }, 20);
        updateIndicators();
        return;
    }

    updateCarousel();
    updateIndicators();
}

function updateCarousel() {
    carousel.style.transform = `translateX(-${currentIndex * (100 / 3)}%)`;
}

function updateIndicators() {
    const indicators = document.querySelectorAll('.page-indicator');
    indicators.forEach((indicator, index) => {
        indicator.classList.remove('active');
        if (index === currentIndex) {
            indicator.classList.add('active');
        }
    });
}

function goToSlide(index) {
    currentIndex = index;
    updateCarousel();
    updateIndicators();
}

// Drag functionality
let startX, isDragging = false;

carousel.addEventListener('mousedown', (e) => {
    startX = e.pageX - carousel.offsetLeft;
    isDragging = true;
    document.body.classList.add('dragging');
});

carousel.addEventListener('mouseleave', () => {
    isDragging = false;
    document.body.classList.remove('dragging');
});

carousel.addEventListener('mouseup', () => {
    isDragging = false;
    document.body.classList.remove('dragging');
});

carousel.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const x = e.pageX - carousel.offsetLeft;

    const walk = (x - startX);

    if (walk > 50) {
        moveSlide(-1);
        isDragging = false;
        document.body.classList.remove('dragging');
    } else if (walk < -50) {
        moveSlide(1);
        isDragging = false;
        document.body.classList.remove('dragging');
    }
});









