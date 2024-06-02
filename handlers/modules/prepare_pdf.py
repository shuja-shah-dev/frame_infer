from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
import random
import base64
import io
from PIL import Image
import os


def generate_random_coordinates():
    # Generate random latitude and longitude
    lat = round(random.uniform(-90.0, 90.0), 6)
    lon = round(random.uniform(-180.0, 180.0), 6)
    return lat, lon



def add_header(c, logo_path):
    # Set initial y position for header content
    y_position = 750
    logo_width = 50

    # Load and draw the logo
    logo = Image.open(logo_path)
    aspect_ratio = logo.width / logo.height
    logo_height = int(logo_width / aspect_ratio)
    logo = logo.resize((logo_width, logo_height), Image.Resampling.LANCZOS)

    buffered = io.BytesIO()
    logo.save(buffered, format="PNG")
    buffered.seek(0)
    logo_reader = ImageReader(buffered)

    # c.drawImage(logo_reader, 50, y_position - logo_height, width=logo_width, height=logo_height)

    # Draw the text next to the logo
    c.setFont("Helvetica-Bold", 16)
    c.drawString(120, y_position, "Anomaly Detection Report")
    c.setFont("Helvetica", 12)
    # c.drawString(120, y_position - 20, "-----------------")



# def prepare_pdf(detections, output_path):
#     c = canvas.Canvas(filename=output_path, pagesize=letter)
#     c.setFont("Helvetica", 12)
#     c.drawString(100, 750, "Inference Results")
#     c.drawString(100, 730, "-----------------")

#     y_position = 700

#     for detection in detections:
#         if y_position < 150: 
#             c.showPage()
#             c.setFont("Helvetica", 12)
#             y_position = 750

#         lat, lon = generate_random_coordinates()

#         c.drawString(100, y_position, f"ID: {detection['id']}")
#         y_position -= 20
#         c.drawString(100, y_position, f"Image Path: {detection['image_path']}")
#         y_position -= 20
#         c.drawString(100, y_position, f"Detections: {detection['detections']}")
#         y_position -= 20
#         c.drawString(100, y_position, f"Coordinates: ({lat}, {lon})")
#         y_position -= 20

#         # Load and resize the image
#         image = Image.open(detection["image_path"])
#         aspect_ratio = image.width / image.height
#         thumbnail_width = 250
#         thumbnail_height = int(thumbnail_width / aspect_ratio)
#         image = image.resize(
#             (thumbnail_width, thumbnail_height), Image.Resampling.LANCZOS
#         )

#         buffered = io.BytesIO()
#         image.save(buffered, format="PNG")
#         buffered.seek(0)
#         image_reader = ImageReader(buffered)

#         c.drawImage(
#             image_reader,
#             100,
#             y_position - thumbnail_height,
#             width=thumbnail_width,
#             height=thumbnail_height,
#         )
#         y_position -= thumbnail_height + 30

#     c.save()

def prepare_pdf(detections, output_path):
    # Define the logo path relative to the current script's directory
    current_dir = os.path.dirname(os.path.abspath(__file__))
    logo_path = os.path.join(current_dir, 'logo.jpg')
    
    c = canvas.Canvas(filename=output_path, pagesize=letter)
    add_header(c, logo_path)
    y_position = 700

    for detection in detections:
        if y_position < 150:
            c.showPage()
            add_header(c, logo_path)
            y_position = 700

        lat, lon = generate_random_coordinates()

        c.setFont("Helvetica", 12)
        c.drawString(100, y_position, f"ID: {detection['id']}")
        y_position -= 20
        c.drawString(100, y_position, f"Image Path: {detection['image_path']}")
        y_position -= 20
        c.drawString(100, y_position, f"Detections: {detection['detections']}")
        y_position -= 20
        c.drawString(100, y_position, f"Coordinates: ({lat}, {lon})")
        y_position -= 20

        # Load and resize the image
        image = Image.open(detection["image_path"])
        aspect_ratio = image.width / image.height
        thumbnail_width = 250
        thumbnail_height = int(thumbnail_width / aspect_ratio)
        image = image.resize((thumbnail_width, thumbnail_height), Image.Resampling.LANCZOS)

        buffered = io.BytesIO()
        image.save(buffered, format="PNG")
        buffered.seek(0)
        image_reader = ImageReader(buffered)

        c.drawImage(image_reader, 100, y_position - thumbnail_height, width=thumbnail_width, height=thumbnail_height)
        y_position -= thumbnail_height + 30

    c.save()