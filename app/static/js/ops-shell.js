(() => {
  const body = document.body;
  const btn = document.getElementById("opsMenuBtn");
  const closeBtn = document.getElementById("opsMenuClose");
  const backdrop = document.getElementById("opsNavBackdrop");
  if (!btn) return;

  function setOpen(open) {
    body.classList.toggle("ops-nav-open", open);
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    if (backdrop) backdrop.hidden = !open;
  }

  btn.addEventListener("click", () => setOpen(!body.classList.contains("ops-nav-open")));
  closeBtn?.addEventListener("click", () => setOpen(false));
  backdrop?.addEventListener("click", () => setOpen(false));
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });
  window.addEventListener("resize", () => {
    if (window.matchMedia("(min-width: 1101px)").matches) setOpen(false);
  });
})();
