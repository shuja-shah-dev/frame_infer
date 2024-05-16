from core_config.db import db


class Mission(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    mission_status = db.Column(db.String(50), nullable=True, default="in-active")
    mission_start_date = db.Column(
        db.DateTime, nullable=True, default=db.func.current_timestamp()
    )

    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "mission_status": self.mission_status,
            "mission_start_date": self.mission_start_date,
        }

    def __repr__(self):
        return f"<Mission {self.mission_name}>"
