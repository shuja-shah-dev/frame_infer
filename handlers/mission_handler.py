from flask import Blueprint, request, jsonify
from models.mission import Mission
from models.inference import InferedResult
from core_config.db import db


mission_controller = Blueprint("mission_handler", __name__)


@mission_controller.route("/mission/create/", methods=["POST"])
def create_mission():
    data = request.get_json()
    title = data.get("title")
    if not title:
        return jsonify({"error": "Title is required"}), 400

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


@mission_controller.route("/mission/list/", methods=["GET"])
def list_missions():
    missions = Mission.query.all()
    return jsonify([mission.serialize() for mission in missions])


@mission_controller.route("/mission/<int:mission_id>/update/", methods=["PUT"])
def update_mission(mission_id):
    data = request.get_json()
    mission = Mission.query.get(mission_id)
    if not mission:
        return jsonify({"error": "Mission not found"}), 404

    mission.title = data.get("title")
    mission.mission_status = data.get("mission_status")
    mission.mission_start_date = data.get("mission_start_date")
    db.session.commit()
    return jsonify({"message": "Mission updated successfully"})


@mission_controller.route("/mission/<int:mission_id>/inference/list/", methods=["GET"])
def List_inference(mission_id):
    mission = Mission.query.get(mission_id)
    if not mission:
        return jsonify({"error": "Mission not found"}), 404

    results = InferedResult.query.filter_by(mission_id=mission_id).all()
    return jsonify([result.serialize() for result in results])


@mission_controller.route("/mission/<int:mission_id>/delete/", methods=["DELETE"])
def delete_mission(mission_id):
    mission = Mission.query.get(mission_id)
    if not mission:
        return jsonify({"error": "Mission not found"}), 404
    results = InferedResult.query.filter_by(mission_id=mission_id).all()
    if results:
        for result in results:
            db.session.delete(result)

    db.session.delete(mission)
    db.session.commit()
    return jsonify({"message": "Mission deleted successfully"})
