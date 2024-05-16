from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Mission(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    mission_status = db.Column(db.String(50), nullable=False)
    mission_start_date = db.Column(db.DateTime, nullable=False)

    def __repr__(self):
        return f"<Mission {self.mission_name}>"
