from flask import Blueprint, request, jsonify
from models.inference import InferedResult
import os
import sys 
from shutil import copyfileobj

from .modules.run_yolo import run_yolo_inference
from core_config.db import db

inference_controller = Blueprint("inference_handler", __name__)


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
            temp_path = os.path.join(os.path.dirname(os.path.abspath(sys.argv[0])), "tmp")
            if not os.path.exists(temp_path):
                os.makedirs(temp_path)

            with open(os.path.join(temp_path, image_path), 'wb') as f:
            
                copyfileobj(image_file, f)

            try:
                annotated_image_path = run_yolo_inference(
                    os.path.join(temp_path, image_path),
                    index,
                    mission_title=f"mission_{mission_id}",
                )
                annotated_images.append(annotated_image_path)
                new_result = InferedResult(
                    image_path=image_path,
                    detections="",
                    mission_id=mission_id,
                )

                db.session.add(new_result)
                db.session.commit()

                # s3.upload_fileobj(image_file, "ainference", f"temp_image_{index}.jpg")
            except Exception as e:
                print(f"Error processing image {image_path}: {e}")
                annotated_images.append(image_path)

    return jsonify(annotated_images)


@inference_controller.route("/inference/list/", methods=["GET"])
def list_inference():
    results = InferedResult.query.all()
    return jsonify([result.serialize() for result in results])
