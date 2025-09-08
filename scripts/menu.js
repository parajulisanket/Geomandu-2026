const toggleBtn = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");

toggleBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});

// for nav dropdown
document.addEventListener("DOMContentLoaded", function () {
  const toggleBtn = document.getElementById("conferenceToggle");
  const dropdown = document.getElementById("conferenceDropdown");

  toggleBtn.addEventListener("click", function (e) {
    e.preventDefault();
    dropdown.classList.toggle("hidden");
  });

  // Optional: close dropdown when clicking outside
  document.addEventListener("click", function (e) {
    if (!toggleBtn.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.add("hidden");
    }
  });
});
