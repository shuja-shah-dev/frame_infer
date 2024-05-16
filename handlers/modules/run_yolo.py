import cv2
from PIL import Image
import numpy as np
from ultralytics import YOLO

import os
import sys


def run_yolo_inference(input_image, index, mission_title="mission"):
    image = Image.open(input_image)
    print("Received", input_image)
    image_array = np.array(image)
    image_rgb = cv2.cvtColor(image_array, cv2.COLOR_BGR2RGB)
    model_path = os.path.join(os.path.dirname(__file__), "model", "md.pt")
    model = YOLO(model_path)
    result = model(image_rgb, conf=0.5)

    # detections_info = []
    # for detection in result[0].predictions:
    #     label = detection.label
    #     confidence = detection.confidence
    #     bounding_box = detection.box
    #     detections_info.append(
    #         {"label": label, "confidence": confidence, "bounding_box": bounding_box}
    #     )

    detections_info = {
        "detections": result[0].verbose(),  
        "speed": result[0].speed,           
        "names": result[0].names,
          
    }
    detections = result[0].plot()
    result_dir = os.path.join(
        os.path.dirname(os.path.abspath(sys.argv[0])), "results", mission_title
    )
    if not os.path.exists(result_dir):
        os.makedirs(result_dir)

    temp_output_path = os.path.join(result_dir, f"temp_image_{index}.jpg")
    cv2.imwrite(temp_output_path, detections)

    return temp_output_path
