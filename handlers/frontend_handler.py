from flask import Blueprint, request, jsonify, send_from_directory
import os

frontend_controller = Blueprint("frontend_handler", __name__)

react_folder = "frontend"
directory = os.getcwd() + f"/{react_folder}/build/static"


@frontend_controller.route("/")
def index():
    path = os.getcwd() + f"/{react_folder}/build"
    print(path)
    return send_from_directory(directory=path, path="index.html")


@frontend_controller.route("/results/<path:folder>/<path:filename>")
def get_results(folder, filename):
    return send_from_directory(f"results/{folder}", filename)


@frontend_controller.route("/static/<path:filename>")
def get_static(filename):
    return send_from_directory(directory=directory, path=filename)


@frontend_controller.route("/static/<path:foldername>/<path:filename>")
def get_static_folder(foldername, filename):
    return send_from_directory(
        directory=os.getcwd() + f"/{react_folder}/build/static/{foldername}",
        path=filename,
    )


@frontend_controller.route("/<path:filename>")
def get_root(filename):
    return send_from_directory(
        directory=os.getcwd() + f"/{react_folder}/build", path=filename
    )
