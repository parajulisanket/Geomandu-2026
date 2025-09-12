const profiles = [
  {
    img: "./assets/dhundi-pathak.jpg",
    name: "Dr. Dhundi Raj Pathak (Convener)",
    desc: `With great excitement, I invite you to GeoMandu 2026, an international conference organized by the Nepal Geotechnical Society from 25–28 November 2026 under the theme “Geotechnics for Mountain Infrastructure.” This theme reflects both Nepal’s priorities and global mountain challenges. We welcome submissions on climate-resilient geotechnics, seismic safety, sustainable slopes, and digital innovations. Accepted papers will be published in peer-reviewed Springer proceedings indexed in Scopus and EI Compendex. This is an opportunity to bridge research and practice.`,
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
const sliderRoot = document.getElementById("sliderRoot");

// Make sure the stage clips slides
sliderRoot.classList.add("overflow-hidden", "relative");

// ---- State ----
let idx = 0;
let animating = false;

// ---- Utils ----
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

function applyProfileTo(container, i) {
  const p = profiles[i];
  container.querySelector("#personImage").src = p.img;
  container.querySelector("#personName").textContent = p.name;
  container.querySelector("#personDesc").textContent = p.desc;
}

function cloneWrap() {
  const clone = wrap.cloneNode(true);
  // Ensure unique IDs aren’t duplicated in DOM queries:
  // we won’t query by ID inside the DOM after inserting the clone,
  // only via clone.querySelector scoped lookups (works fine even with same IDs).
  return clone;
}

/**
 * Slide to nextIdx
 * @param {number} nextIdx
 * @param {number} dir +1 for right->left (next), -1 for left<-right (prev)
 */
async function slideProfile(nextIdx, dir = 1) {
  if (animating || nextIdx === idx) return;
  animating = true;

  const next = profiles[nextIdx];
  await preload(next.img);

  // Lock container height to prevent jump during absolute positioning
  const stageHeight = wrap.offsetHeight;
  sliderRoot.style.height = stageHeight + "px";

  // Prepare current and incoming panels
  const currentPanel = wrap;
  const incomingPanel = cloneWrap();
  applyProfileTo(incomingPanel, nextIdx);

  // Position panels for slide
  // Current: at 0; Incoming: off-screen (dir * 100%)
  currentPanel.style.transform = "translateX(0%)";
  incomingPanel.style.transform = `translateX(${dir * 100}%)`;

  // Make both absolutely stacked
  Object.assign(currentPanel.style, {
    position: "absolute",
    inset: "0",
    transition: "transform 500ms ease-out",
    willChange: "transform",
  });
  Object.assign(incomingPanel.style, {
    position: "absolute",
    inset: "0",
    transition: "transform 500ms ease-out",
    willChange: "transform",
  });

  // Insert incoming on top
  sliderRoot.appendChild(incomingPanel);

  // Force reflow to ensure transitions apply
  void currentPanel.offsetWidth;

  // Animate: move current out, incoming in
  currentPanel.style.transform = `translateX(${-dir * 100}%)`;
  incomingPanel.style.transform = "translateX(0%)";

  function cleanup() {
    applyProfile(nextIdx);

    currentPanel.style.transition = "none";
    currentPanel.style.transform = "translateX(0%)";

    incomingPanel.remove();

    void currentPanel.offsetWidth;

    currentPanel.style.position = "";
    currentPanel.style.inset = "";
    currentPanel.style.willChange = "";
    currentPanel.style.transition = "";
    currentPanel.style.transform = "";
    sliderRoot.style.height = "";

    idx = nextIdx;
    animating = false;
  }

  // Listen for the incoming panel transition end
  const onEnd = (e) => {
    if (e.propertyName !== "transform") return;
    incomingPanel.removeEventListener("transitionend", onEnd);
    cleanup();
  };
  incomingPanel.addEventListener("transitionend", onEnd);
}

function applyProfile(i) {
  // Apply into the canonical wrap (the one in the DOM initially)
  const p = profiles[i];
  imgEl.src = p.img;
  nameEl.textContent = p.name;
  descEl.textContent = p.desc;
}

function next() {
  slideProfile((idx + 1) % profiles.length, +1);
}

function prev() {
  slideProfile((idx - 1 + profiles.length) % profiles.length, -1);
}

// ---- Autoplay with hover pause ----
const INTERVAL_MS = 3000;
let timerId = null;

function startAuto() {
  stopAuto();
  timerId = setInterval(next, INTERVAL_MS);
}

function stopAuto() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
}

// Hover pause
sliderRoot.addEventListener("mouseenter", stopAuto);
sliderRoot.addEventListener("mouseleave", startAuto);

// Tab visibility pause
document.addEventListener("visibilitychange", () => {
  if (document.hidden) stopAuto();
  else startAuto();
});

function nudgeAutoAfterManual() {
  stopAuto();
  startAuto();
}

// Controls
leftBtn.addEventListener("click", () => {
  prev();
  nudgeAutoAfterManual();
});

rightBtn.addEventListener("click", () => {
  next();
  nudgeAutoAfterManual();
});

// ---- Init ----
(async function init() {
  await Promise.allSettled(profiles.map((p) => preload(p.img)));
  applyProfile(0);
  startAuto();
})();

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
