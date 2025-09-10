const profiles = [
  {
    img: "./assets/dhundi-pathak.jpg",
    name: "Dr. Dhundi Raj Pathak (Convener)",
    desc: `As Convener of GeoMandu 2026, I am honored to welcome you to the third international conference of the Nepal Geotechnical Society, taking place in Kathmandu from November 25–28, 2026. Under the theme “Geotechnics for Mountain Infrastructure,” the event will explore the challenges of building resilient infrastructure in mountainous regions shaped by geohazards and complex geology. GeoMandu 2026 provides a platform to share knowledge, discuss emerging trends, and strengthen collaboration between research and practice. I warmly welcome you to Kathmandu and look forward to an inspiring and productive conference.`,
  },
  {
    img: "./assets/er-rajan-kc.jpeg",
    name: "Er. Rajan KC (Youth Convener)",
    desc: `As Youth Convener of GeoMandu 2026, I am honored to welcome you to the international conference of the Nepal Geotechnical Society, taking place from November 25–28, 2026 in Kathmandu. Our theme, “Geotechnics for Mountain Infrastructure,” reflects the urgent need for innovative solutions to landslides, earthquakes, and fragile terrain in Nepal and other mountain regions. This event offers young engineers and students a valuable opportunity to engage with global experts, share ideas, and contribute to building resilient and sustainable infrastructure.`,
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

// highlight video part

(function () {
  const list = document.getElementById("videoList");
  const player = document.getElementById("mainPlayer");
  if (!list || !player) return;

  // Optional: mark active item
  function setActive(btn) {
    list.querySelectorAll(".videoItem").forEach((el) => {
      el.classList.remove("ring-2", "ring-[#0474c4]", "bg-gray-50");
    });
    btn.classList.add("ring-2", "ring-[#0474c4]", "bg-gray-50");
  }

  list.addEventListener("click", (e) => {
    const btn = e.target.closest(".videoItem");
    if (!btn) return;
    const id = btn.getAttribute("data-video");
    const title = btn.getAttribute("data-title") || "GeoMandu Video";

    // Swap the main iframe to the selected video (autoplay)
    player.src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
    player.title = title;

    setActive(btn);
  });
})();

// popup banner
window.addEventListener("load", () => {
  const popup = document.getElementById("popup-banner");
  const closeBtn = document.getElementById("close-popup");

  setTimeout(() => {
    popup.classList.remove("hidden");
  }, 5000);

  // Close popup on click
  closeBtn.addEventListener("click", () => {
    popup.classList.add("hidden");
  });
});
