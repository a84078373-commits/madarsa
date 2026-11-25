(() => {
  const cfg = window.MADAR_STREAM;
  if (!cfg || !cfg.active) return;

  const video = document.getElementById("fieldCamPreview");
  const canvas = document.getElementById("fieldCamCanvas");
  const placeholder = document.getElementById("fieldCamPlaceholder");
  const statusEl = document.getElementById("fieldCamStatus");
  let stream = null;
  let timer = null;
  let uploading = false;

  function setStatus(msg, ok) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.className = "stream-status " + (ok ? "ok" : "err");
  }

  async function startCamera() {
    if (!window.isSecureContext) {
      setStatus("الكاميرا تحتاج HTTPS. افتح الموقع برابط https:// وليس http://", false);
      return;
    }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setStatus("المتصفح لا يدعم الكاميرا", false);
      return;
    }
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 960 },
          height: { ideal: 720 },
        },
      });
      video.srcObject = stream;
      await video.play();
      if (placeholder) placeholder.classList.add("hidden");
      setStatus("الكاميرا تعمل — يُرسل البث لغرفة العمليات", true);
      timer = setInterval(pushFrame, 280);
    } catch (err) {
      setStatus("ارفض/فشل إذن الكاميرا: " + (err && err.message ? err.message : err), false);
    }
  }

  function pushFrame() {
    if (!stream || uploading || video.readyState < 2) return;
    const w = video.videoWidth || 640;
    const h = video.videoHeight || 480;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, w, h);
    canvas.toBlob(
      async (blob) => {
        if (!blob) return;
        uploading = true;
        try {
          const res = await fetch(cfg.uploadUrl, {
            method: "POST",
            credentials: "same-origin",
            headers: { "Content-Type": "image/jpeg" },
            body: blob,
          });
          if (!res.ok) {
            setStatus("تعذر إرسال الإطار (" + res.status + ")", false);
          }
        } catch (_) {
          setStatus("انقطع الاتصال بالسيرفر", false);
        } finally {
          uploading = false;
        }
      },
      "image/jpeg",
      0.62
    );
  }

  function stopCamera() {
    if (timer) clearInterval(timer);
    timer = null;
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      stream = null;
    }
    if (video) video.srcObject = null;
  }

  window.addEventListener("pagehide", stopCamera);
  document.getElementById("stopStreamBtn")?.addEventListener("click", stopCamera);
  startCamera();
})();
