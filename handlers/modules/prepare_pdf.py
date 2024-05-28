from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import random


def generate_random_coordinates():
    # Generate random latitude and longitude
    lat = round(random.uniform(-90.0, 90.0), 6)
    lon = round(random.uniform(-180.0, 180.0), 6)
    return lat, lon


def prepare_pdf(detections, output_path):
    c = canvas.Canvas(filename=output_path, pagesize=letter)
    c.setFont("Helvetica", 12)
    c.drawString(100, 750, "Inference Results")
    c.drawString(100, 730, "-----------------")

    y_position = 700

    
    for detection in detections:
        
        if y_position < 40:
            c.showPage()
            c.setFont("Helvetica", 12)
            y_position = 750

        lat, lon = generate_random_coordinates()

        c.drawString(100, y_position, f"ID: {detection['id']}")
        y_position -= 20
        c.drawString(100, y_position, f"Image Path: {detection['image_path']}")
        y_position -= 20
        c.drawString(100, y_position, f"Detections: {detection['detections']}")
        y_position -= 20
        c.drawString(100, y_position, f"Coordinates: ({lat}, {lon})")
        y_position -= 30
    c.save()
