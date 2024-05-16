from flask import Flask, send_from_directory, request, jsonify
import base64
import cv2
import asyncio
from PIL import Image
import os
from ultralytics import YOLO
import numpy as np
from flask_cors import CORS
import boto3
from dotenv import load_dotenv, dotenv_values
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import datetime


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
db = SQLAlchemy(app)


CORS(app)
migrate = Migrate(app, db)


# Models


class Mission(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    mission_status = db.Column(db.String(50), nullable=False)
    mission_start_date = db.Column(db.DateTime, nullable=False)

    def __repr__(self):
        return f"<Mission {self.mission_name}>"


def perform_inference(image_path, model):
    try:
        # Load the image
        image = cv2.imread(image_path)
        results = model(image)
        annotated_frame = results[0].plot()
        _, buffer = cv2.imencode(".jpg", annotated_frame)

        # Encode the image data to base64
        encoded_image = base64.b64encode(buffer)

        return encoded_image
    except Exception as e:
        # If an error occurs during inference, print the error
        print(f"Error in performing inference: {e}")
        return None


async def image_feed(websocket, path):
    try:
        model = YOLO("yolov8n.pt")
        image_path = await websocket.recv()
        annotated_image = perform_inference(image_path, model)
        if annotated_image:
            await websocket.send(annotated_image)
    except Exception as e:
        print(f"Error in sending annotated image: {e}")


def run_yolo_inference(input_image, index):
    # Load the input image
    image = Image.open(input_image)
    print("Received", input_image)

    # Convert image to numpy array
    image_array = np.array(image)
    image_rgb = cv2.cvtColor(image_array, cv2.COLOR_BGR2RGB)

    # Load YOLO model
    model_path = os.path.join("model", "md.pt")
    model = YOLO(model_path)

    # Perform inference
    result = model(image_rgb, conf=0.5)
    detections = result[0].plot()

    # Save the result image
    result_dir = "result"
    if not os.path.exists(result_dir):
        os.makedirs(result_dir)

    temp_output_path = os.path.join(result_dir, f"temp_image_{index}.jpg")
    cv2.imwrite(temp_output_path, detections)

    return temp_output_path


@app.route("/image_feed", methods=["POST"])
def image_feed_route():
    annotated_images = []

    image_file = False
    print(request.files, "Recieved")
    # Ensure that request.files is not empty
    if image_file is None:
        return jsonify({"error": "No files uploaded"}, 400)
    else:
        for index in range(len(request.files)):
            file_key = f"file{index}"
            image_file = request.files[file_key]

            # Save the image to a temporary file
            image_path = f"temp_image_{index}.jpg"
            image_file.save(os.path.join("tmp", image_path))

            # Run YOLO inference
            try:
                annotated_image_path = run_yolo_inference(
                    os.path.join("tmp", image_path), index
                )
                annotated_images.append(annotated_image_path)
                s3.upload_fileobj(image_file, "ainference", f"temp_image_{index}.jpg")
            except Exception as e:
                print(f"Error processing image {image_path}: {e}")
                annotated_images.append(
                    image_path
                )  # Send original image if inference fails

            # Remove the temporary image file

    # Return annotated images or paths as a response
    return jsonify(annotated_images)


@app.route("/result/<path:filename>")
def get_result(filename):
    return send_from_directory("result", filename)


@app.route("/missions/create/", methods=["POST"])
def create_mission():
    data = request.get_json()
    title = data.get("title")
    if not title:
        return jsonify({"error": "Title is required"}), 400
    mission_start_date = data.get("mission_start_date")

    if not mission_start_date:
        data.update({"mission_start_date": datetime.now()})
        
    new_mission = Mission(
        title=title,
        mission_status=data.get("mission_status"),
        mission_start_date=data.get("mission_start_date"),
    )
    db.session.add(new_mission)
    db.session.commit()
    return (
        jsonify(
            {"message": "Mission created successfully", "mission_id": new_mission.id}
        ),
        201,
    )


if __name__ == "__main__":
    app.run(debug=True, port=5000)
