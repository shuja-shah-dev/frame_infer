from flask import Flask

import os
from flask_cors import CORS

from flask_migrate import Migrate
from core_config.db import db, init_db
from handlers.mission_handler import mission_controller
from handlers.inference_handler import inference_controller
from handlers.frontend_handler import frontend_controller


app = Flask(__name__)

app.config["UPLOAD_FOLDER"] = "uploads"
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db.sqlite"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = True

init_db(app)
CORS(app)
migrate = Migrate(app, db)

app.register_blueprint(inference_controller)
app.register_blueprint(mission_controller)
app.register_blueprint(frontend_controller)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
