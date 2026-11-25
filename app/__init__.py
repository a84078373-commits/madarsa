import os
import secrets
from pathlib import Path

from flask import Flask
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
login_manager = LoginManager()
login_manager.login_view = "auth.login"
login_manager.login_message = "الرجاء تسجيل الدخول للوصول إلى هذه الصفحة."
login_manager.login_message_category = "warning"


def create_app():
    app = Flask(__name__)
    base = Path(__file__).resolve().parent.parent
    app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY") or secrets.token_hex(32)
    app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{base / 'madar_amney.db'}"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["UPLOAD_FOLDER"] = str(base / "uploads")

    # Render / reverse proxies terminate TLS; trust X-Forwarded-* so HTTPS + cookies work.
    if os.environ.get("RENDER") or os.environ.get("FORCE_HTTPS"):
        from werkzeug.middleware.proxy_fix import ProxyFix

        app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1)
        app.config["PREFERRED_URL_SCHEME"] = "https"
        app.config["SESSION_COOKIE_SECURE"] = True

    Path(app.config["UPLOAD_FOLDER"]).mkdir(parents=True, exist_ok=True)

    db.init_app(app)
    login_manager.init_app(app)

    from app.models import User
    from app.auth import auth_bp
    from app.routes import main_bp

    @login_manager.user_loader
    def load_user(user_id):
        return db.session.get(User, int(user_id))

    app.register_blueprint(auth_bp)
    app.register_blueprint(main_bp)

    @app.context_processor
    def inject_ops_globals():
        from app.models import Alert
        try:
            count = Alert.query.filter(Alert.status.in_(["open", "acknowledged"])).count()
        except Exception:
            count = 0
        return {"alerts_count": count}

    with app.app_context():
        db.create_all()
        from app.seed import seed_database
        from app.geo_fix import apply_realistic_geo

        seed_database()
        apply_realistic_geo()

    return app
