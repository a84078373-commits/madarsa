import os

from app import create_app

app = create_app()

if __name__ == "__main__":
    # Local only. On Render use gunicorn (see render.yaml) — Render already provides HTTPS.
    # Adhoc SSL lets phone browsers allow camera on a LAN IP.
    use_ssl = os.environ.get("MADAR_LOCAL_SSL", "1") != "0"
    app.run(
        host="0.0.0.0",
        port=int(os.environ.get("PORT", "5000")),
        debug=True,
        ssl_context="adhoc" if use_ssl else None,
    )
