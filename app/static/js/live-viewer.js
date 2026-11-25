(() => {
  const tiles = document.querySelectorAll("[data-live-camera]");
  if (!tiles.length) return;

  const liveIds = new Set();

  const viewers = Array.from(tiles).map((tile) => {
    const id = Number(tile.getAttribute("data-live-camera"));
    if (!id) return null;
    let img = tile.querySelector("img.live-frame");
    if (!img) {
      img = document.createElement("img");
      img.className = "live-frame";
      img.alt = "Live";
      tile.insertBefore(img, tile.firstChild);
    }
    return { id, tile, img };
  }).filter(Boolean);

  function markLive(viewer, on) {
    viewer.tile.classList.toggle("on", on);
    viewer.tile.classList.toggle("off", !on);
    const tag = viewer.tile.querySelector(".live-tag");
    if (tag) {
      tag.innerHTML = on
        ? '<i class="fa-solid fa-circle"></i> مباشر'
        : "غير متصل";
    }
    const visual = viewer.tile.querySelector(".live-visual");
    if (on) {
      viewer.img.style.display = "block";
      if (visual) visual.style.display = "none";
    } else {
      viewer.img.removeAttribute("src");
      viewer.img.style.display = "none";
      if (visual) visual.style.display = "";
    }
  }

  async function tick() {
    try {
      const res = await fetch("/api/stream/status", { credentials: "same-origin" });
      if (res.ok) {
        const data = await res.json();
        liveIds.clear();
        (data.active || []).forEach((id) => liveIds.add(Number(id)));
      }
    } catch (_) {}

    viewers.forEach((v) => {
      const on = liveIds.has(v.id);
      markLive(v, on);
      if (on) v.img.src = "/api/stream/latest/" + v.id + "?t=" + Date.now();
    });
  }

  tick();
  setInterval(tick, 900);
})();
