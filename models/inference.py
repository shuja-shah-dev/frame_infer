from core_config.db import db


class InferedResult(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    image_path = db.Column(db.String(100), nullable=False)
    detections = db.Column(db.String(1000), nullable=False, default="No detections")
    mission_id = db.Column(db.Integer, db.ForeignKey("mission.id"), nullable=False)
    mission = db.relationship('Mission', backref=db.backref('infered_results', lazy=True))
    def serialize(self):
        return {
            "id": self.id,
            "image_path": self.image_path,
            "detections": self.detections,
            "mission_id": self.mission_id,
        }

    def __repr__(self):
        return f"<InferedResult {self.image_path}>"
