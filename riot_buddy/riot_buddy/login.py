from flask_login import login_user
from flask import make_response, jsonify, request
from werkzeug.security import check_password_hash
from datetime import datetime

from riot_buddy import app, db
from .models import User


@app.route('/api/v1/login', methods=['POST'])
def login_account():

  data = request.get_json()
  user = User.query.filter_by(username=data['username']).first()

  if not user or not check_password_hash(user.password, data['password']):
    return make_response(jsonify(error="invalid username or password"), 200)

  login_user(user, remember=True)
  user.last_login = datetime.utcnow()

  db.session.add(user)
  db.session.commit()

  return make_response(jsonify(error=""), 200)
