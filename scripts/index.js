const profiles = [
  {
    img: "./assets/chair-man.jpg",
    name: "Netra Prakash Bhandary (Prof. Dr.)",
    desc: `Dear Participants and International Delegates: As the GeoMandu2024 Organizing Chair, I would first like to warmly welcome you to
Kathmandu during this best season of the country. Welcome!
GeoMandu 2024, the second international event of Nepal
Geotechnical Society is being organized this time with more than
350 participants.`,
  },
  {
    img: "./assets/message-img2.jpg",
    name: "Mandip Subedi, PhD",
    desc: `It is a great honor to welcome you all to GeoMandu 2024, the second edition of the biennial international conference organized by the Nepal Geotechnical Society (NGS). This year, we unite under the theme “Geotechnics for Sustainable Infrastructure,” addressing how geotechnical engineering can advance the development of resilient and environmentally sustainable infrastructure.`,
  },
];

// ---- Elements ----
const imgEl = document.getElementById("personImage");
const nameEl = document.getElementById("personName");
const descEl = document.getElementById("personDesc");
const wrap = document.getElementById("profileWrap");
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");

wrap.classList.add("transition-opacity", "duration-500");

let idx = 0;
let animating = false;

async function preload(src) {
  const img = new Image();
  img.src = src;
  try {
    if (img.decode) await img.decode();
    else
      await new Promise((res, rej) => {
        img.onload = res;
        img.onerror = rej;
      });
  } catch (_) {}
}

function swapProfile(nextIdx) {
  if (animating || nextIdx === idx) return;
  animating = true;

  // Start fade out
  wrap.classList.add("opacity-0");

  // When fade-out finishes, swap content, then fade-in
  wrap.addEventListener(
    "transitionend",
    async function handleOut(e) {
      if (e.propertyName !== "opacity") return;
      wrap.removeEventListener("transitionend", handleOut);

      const next = profiles[nextIdx];

      // Preload next image to prevent flashes
      await preload(next.img);

      // Swap content
      imgEl.src = next.img;
      nameEl.textContent = next.name;
      descEl.textContent = next.desc;

      // Force reflow so the next opacity change animates
      void wrap.offsetWidth;

      // Fade in
      wrap.classList.remove("opacity-0");

      wrap.addEventListener(
        "transitionend",
        function handleIn(ev) {
          if (ev.propertyName !== "opacity") return;
          wrap.removeEventListener("transitionend", handleIn);
          idx = nextIdx;
          animating = false;
        },
        { once: true }
      );
    },
    { once: true }
  );
}

leftBtn.addEventListener("click", () => {
  swapProfile((idx - 1 + profiles.length) % profiles.length);
});

rightBtn.addEventListener("click", () => {
  swapProfile((idx + 1) % profiles.length);
});

// counter part js code
document.addEventListener("DOMContentLoaded", () => {
  function animateCount(el, end, suffix = "", duration = 1400) {
    let start = 0;
    let startTime = null;
    function update(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const value = Math.floor(progress * (end - start) + start);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = end + suffix;
    }
    requestAnimationFrame(update);
  }

  const counters = document.querySelectorAll(".counter");
  let animated = false;
  function onScroll() {
    const section = counters[0]?.closest("section");
    if (!section) return;
    const rect = section.getBoundingClientRect();
    if (!animated && rect.top < window.innerHeight - 100) {
      animated = true;
      counters.forEach((el) => {
        const target = parseInt(el.getAttribute("data-target"));
        const isPercent =
          el.textContent.includes("%") ||
          el.getAttribute("data-target") === "100";
        animateCount(el, target, isPercent ? "%" : "");
      });
      window.removeEventListener("scroll", onScroll);
    }
  }
  window.addEventListener("scroll", onScroll);
  // If section already in view on page load
  onScroll();
});

// Get the "Back to Top" button
const backToTopButton = document.getElementById("backToTop");
window.addEventListener("scroll", () => {
  if (window.scrollY > 700) {
    backToTopButton.style.display = "block";
  } else {
    backToTopButton.style.display = "none";
  }
});
backToTopButton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// stay connected
function animateOnScroll() {
  document.querySelectorAll(".animate-on-scroll").forEach((el) => {
    const rect = el.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight - 100 && rect.bottom > 100;
    if (isVisible) {
      el.classList.add("opacity-100", "translate-y-0");
      el.classList.remove("opacity-0", "translate-y-32");
    } else {
      el.classList.remove("opacity-100", "translate-y-0");
      el.classList.add("opacity-0", "translate-y-32");
    }
  });
}
window.addEventListener("scroll", animateOnScroll);
window.addEventListener("load", animateOnScroll);
