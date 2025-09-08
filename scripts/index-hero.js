const slides = document.querySelectorAll(".slide");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

let currentSlide = 0;
let isAnimating = false;

function showSlide(index) {
  if (isAnimating) return;
  isAnimating = true;

  const activeSlide = slides[currentSlide];
  activeSlide.classList.add("opacity-0");
  activeSlide.classList.remove("opacity-100");

  setTimeout(() => {
    activeSlide.classList.add("hidden");
    activeSlide.classList.remove("active");

    currentSlide = (index + slides.length) % slides.length;
    const nextSlide = slides[currentSlide];

    nextSlide.classList.remove("hidden");
    nextSlide.classList.add("opacity-0");

    void nextSlide.offsetWidth;

    nextSlide.classList.add("active", "opacity-100");
    nextSlide.classList.remove("opacity-0");

    setTimeout(() => {
      isAnimating = false;
    }, 500);
  }, 500);
}

prevBtn.addEventListener("click", () => {
  showSlide(currentSlide - 1);
});

nextBtn.addEventListener("click", () => {
  showSlide(currentSlide + 1);
});
