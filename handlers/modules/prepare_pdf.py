from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas


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

        c.drawString(100, y_position, f"ID: {detection['id']}")
        y_position -= 20
        c.drawString(100, y_position, f"Image Path: {detection['image_path']}")
        y_position -= 20
        c.drawString(100, y_position, f"Detections: {detection['detections']}")
        y_position -= 30

    c.save()
