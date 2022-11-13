import os
from flask import Flask, send_from_directory, make_response, jsonify
from flask_cors import CORS
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
login_manager = LoginManager()

def create_app():
  app = Flask(__name__, static_folder='../build')
  app.secret_key = "hackbright"

  db_name = "testing"
  app.config["SQLALCHEMY_DATABASE_URI"] = f"postgresql:///{db_name}"
  app.config["SQLALCHEMY_ECHO"] = False
  app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

  CORS(app)
  db.init_app(app)
  login_manager.init_app(app)

  return app

app = create_app()

import riot_buddy.create_account, riot_buddy.login, riot_buddy.logout, riot_buddy.whoami, riot_buddy.profile_create, riot_buddy.profile_retrieve, riot_buddy.edit_profile

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def welcomepage(path):
  if path != "" and os.path.exists(app.static_folder + '/' + path):
    return send_from_directory(app.static_folder, path)
  else:
    return send_from_directory(app.static_folder, 'index.html')

@app.errorhandler(500)
def server_error(e):
  return make_response(jsonify(error="oops... internal server error!"), 500)

@app.errorhandler(401)
def unauthorized_error(e):
  return make_response(jsonify(error="unauthorized... are you logged in?"), 401)


if __name__ == '__main__':
  # with app.app_context():
  #   db.create_all()
  app.run(use_reloader=True, port=5000, threaded=True)