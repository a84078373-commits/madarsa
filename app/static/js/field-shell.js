(() => {
  const body = document.body;
  const btn = document.getElementById("fieldMenuBtn");
  const closeBtn = document.getElementById("fieldMenuClose");
  const backdrop = document.getElementById("fieldNavBackdrop");
  const side = document.getElementById("fieldSideNav");
  if (!btn || !side) return;

  function setOpen(open) {
    body.classList.toggle("field-nav-open", open);
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    side.setAttribute("aria-hidden", open ? "false" : "true");
    if (backdrop) backdrop.hidden = !open;
  }

  btn.addEventListener("click", () => setOpen(!body.classList.contains("field-nav-open")));
  closeBtn?.addEventListener("click", () => setOpen(false));
  backdrop?.addEventListener("click", () => setOpen(false));
  side.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });
  window.addEventListener("resize", () => {
    if (window.matchMedia("(min-width: 861px)").matches) setOpen(false);
  });
})();
