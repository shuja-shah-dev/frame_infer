from flask import Flask, send_from_directory, request, jsonify

import os
from flask_cors import CORS
import boto3
from dotenv import load_dotenv
from flask_migrate import Migrate
from core_config.db import db, init_db
from handlers.mission_handler import mission_controller
from handlers.inference_handler import inference_controller


load_dotenv()

ACCESS_KEY = os.getenv("ACCESS_KEY")
SECRET_KEY = os.getenv("SECRET_KEY")

s3 = boto3.client(
    "s3",
    aws_access_key_id=ACCESS_KEY,
    aws_secret_access_key=SECRET_KEY,
    region_name="ap-southeast-4",
)
app = Flask(__name__)

app.config["UPLOAD_FOLDER"] = "uploads"
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db.sqlite"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = True
init_db(app)

CORS(app)


app.register_blueprint(inference_controller)
app.register_blueprint(mission_controller)
migrate = Migrate(app, db)
# def perform_inference(image_path, model):
#     try:
#         # Load the image
#         image = cv2.imread(image_path)
#         results = model(image)
#         annotated_frame = results[0].plot()
#         _, buffer = cv2.imencode(".jpg", annotated_frame)

#         # Encode the image data to base64
#         encoded_image = base64.b64encode(buffer)

#         return encoded_image
#     except Exception as e:
#         # If an error occurs during inference, print the error
#         print(f"Error in performing inference: {e}")
#         return None


# async def image_feed(websocket, path):
#     try:
#         model = YOLO("yolov8n.pt")
#         image_path = await websocket.recv()
#         annotated_image = perform_inference(image_path, model)
#         if annotated_image:
#             await websocket.send(annotated_image)
#     except Exception as e:
#         print(f"Error in sending annotated image: {e}")


# @app.route("/result/<path:filename>")
# def get_result(filename):
#     return send_from_directory("result", filename)


@app.route("/results/<path:folder>/<path:filename>")
def get_results(folder, filename):
    return send_from_directory(f"results/{folder}", filename)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
