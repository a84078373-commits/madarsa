from app import create_app

app = create_app()

if __name__ == "__main__":
    # HTTPS needed so phone browsers allow camera access on LAN IP.
    # First visit may show a certificate warning — choose Advanced → Continue.
    app.run(host="0.0.0.0", port=5000, debug=True, ssl_context="adhoc")
