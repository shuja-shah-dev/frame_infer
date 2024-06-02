from flask import Blueprint, request, jsonify
from models.inference import InferedResult
import os
import sys
from shutil import copyfileobj

from .modules.run_yolo import run_yolo_inference
from core_config.db import db
import boto3
from dotenv import load_dotenv

inference_controller = Blueprint("inference_handler", __name__)


load_dotenv()

ACCESS_KEY = os.getenv("ACCESS_KEY")
SECRET_KEY = os.getenv("SECRET_KEY")

s3 = boto3.client(
    "s3",
    aws_access_key_id=ACCESS_KEY,
    aws_secret_access_key=SECRET_KEY,
    region_name="ap-southeast-4",
)


@inference_controller.route("/inference/create/", methods=["POST"])
def create():
    annotated_images = []

    mission_id = request.form.get("mission_id")
    image_file = False
    print(request.files, "Recieved")
    if image_file is None:
        return jsonify({"error": "No files uploaded"}, 400)
    else:
        for index in range(len(request.files)):
            file_key = f"file{index}"
            image_file = request.files[file_key]

            image_path = f"temp_image_{index}.jpg"
            temp_path = os.path.join(
                os.path.dirname(os.path.abspath(sys.argv[0])), "tmp"
            )
            if not os.path.exists(temp_path):
                os.makedirs(temp_path)

            with open(os.path.join(temp_path, image_path), "wb") as f:

                copyfileobj(image_file, f)

            try:
                yolo = run_yolo_inference(
                    os.path.join(temp_path, image_path),
                    index,
                    mission_title=f"mission_{mission_id}",
                )
                annotated_image_path = yolo["annotated_image_path"]
                detections = yolo["detections"]
                annotated_images.append(annotated_image_path)
                
                # {'detections': '(no detections), ', 'speed': {'preprocess': 21.993398666381836, 'inference': 418.86401176452637, 'postprocess': 1518.674373626709}, 'names': {0: 'anomaly'}}, '1')

                new_result = InferedResult(
                    image_path=annotated_image_path,
                    detections=detections["detections"],
                    mission_id=mission_id,
                )

                db.session.add(new_result)
                db.session.commit()

                # s3.upload_fileobj(image_file, "ainference", f"temp_image_{index}.jpg")
                with open(os.path.join(temp_path, image_path), "rb") as f:
                    s3.upload_fileobj(
                        f, "ainference", f"mission{mission_id}_image_{index}.jpg"
                    )
            except Exception as e:
                print(f"Error processing image {image_path}: {e}")
                annotated_images.append(image_path)

    return jsonify(annotated_images)


@inference_controller.route("/inference/list/", methods=["GET"])
def list_inference():
    results = InferedResult.query.all()
    return jsonify([result.serialize() for result in results])


@inference_controller.route("/inference/delete/all/", methods=["DELETE"])
def delete_all():
    InferedResult.query.delete()
    db.session.commit()
    return jsonify({"message": "All results deleted"})
