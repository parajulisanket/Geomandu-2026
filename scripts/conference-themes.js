document.addEventListener("DOMContentLoaded", () => {
  // Helpers
  const openPanel = (panel) => {
    panel.dataset.open = "true";
    panel.style.maxHeight = panel.scrollHeight + "px";
  };
  const closePanel = (panel) => {
    panel.style.maxHeight = panel.scrollHeight + "px";
    requestAnimationFrame(() => {
      panel.dataset.open = "false";
      panel.style.maxHeight = "0px";
    });
  };

  // Setup
  document.querySelectorAll(".capsule").forEach((item) => {
    const btn = item.querySelector(".capsule-toggle");
    const panel = item.querySelector(".capsule-panel");
    const icon = item.querySelector(".fa-solid");

    // Force CLOSED initial state
    btn.setAttribute("aria-expanded", "false");
    panel.dataset.open = "false";
    panel.style.maxHeight = "0px";

    btn.addEventListener("click", () => {
      const isOpen = btn.getAttribute("aria-expanded") === "true";
      if (isOpen) {
        btn.setAttribute("aria-expanded", "false");
        icon.classList.remove("fa-minus");
        icon.classList.add("fa-plus");
        closePanel(panel);
      } else {
        btn.setAttribute("aria-expanded", "true");
        icon.classList.remove("fa-plus");
        icon.classList.add("fa-minus");
        openPanel(panel);
      }
    });

    window.addEventListener("resize", () => {
      if (btn.getAttribute("aria-expanded") === "true") {
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  });
});
