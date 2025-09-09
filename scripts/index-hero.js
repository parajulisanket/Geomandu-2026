const slides = document.querySelectorAll(".slide");
const bgSlides = document.querySelectorAll(".bg-slide"); // NEW: background slides
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

let currentSlide = 0;
let isAnimating = false;

function showSlide(index) {
  if (isAnimating) return;
  isAnimating = true;

  const oldIndex = currentSlide;
  const nextIndex = (index + slides.length) % slides.length;

  // fade out: text
  const activeSlide = slides[oldIndex];
  activeSlide.classList.add("opacity-0");
  activeSlide.classList.remove("opacity-100");

  // fade out: background (if present)
  const activeBg = bgSlides[oldIndex];
  if (activeBg) {
    activeBg.classList.add("opacity-0");
    activeBg.classList.remove("opacity-100");
  }

  // wait for fade-out
  setTimeout(() => {
    // hide old
    activeSlide.classList.add("hidden");
    activeSlide.classList.remove("active");
    if (activeBg) activeBg.classList.add("hidden");

    // compute new
    currentSlide = nextIndex;

    // prepare next text
    const nextSlide = slides[currentSlide];
    nextSlide.classList.remove("hidden");
    nextSlide.classList.add("opacity-0"); // start transparent

    // prepare next bg
    const nextBg = bgSlides[currentSlide];
    if (nextBg) {
      nextBg.classList.remove("hidden");
      nextBg.classList.add("opacity-0"); // start transparent
    }

    // force reflow so the fade-in runs
    void nextSlide.offsetWidth;

    // fade in: text
    nextSlide.classList.add("active", "opacity-100");
    nextSlide.classList.remove("opacity-0");

    // fade in: background
    if (nextBg) {
      nextBg.classList.add("opacity-100");
      nextBg.classList.remove("opacity-0");
    }

    // end animation after fade-in
    setTimeout(() => {
      isAnimating = false;
    }, 300); // match Tailwind duration-500
  }, 300); // match Tailwind duration-500
}

prevBtn.addEventListener("click", () => showSlide(currentSlide - 1));
nextBtn.addEventListener("click", () => showSlide(currentSlide + 1));
