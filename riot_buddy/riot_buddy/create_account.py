from flask import request, jsonify, make_response
from email_validator import validate_email, EmailNotValidError
from datetime import datetime
import string
from flask_login import login_user

from sqlalchemy.exc import IntegrityError

from werkzeug.security import generate_password_hash

from riot_buddy import app, db
from .models import User

@app.route('/api/v1/create-account', methods=['POST'])
def create_account():
  """Create an account"""
  data = request.get_json()

  # email validation
  try:
    validation = validate_email(data['email'], check_deliverability=False)
    email = validation.email
  except EmailNotValidError as e:
    return make_response(jsonify(error=f"{e}"), 200)

  # username validation
  username = data['username']

  if ' ' in username:
    return make_response(jsonify(error="Username cannot contain spaces"), 200)

  if len(username) > 20:
    return make_response(jsonify(error="Username cannot be longer than 20 characters"), 200)
  
  if len(username) < 3:
    return make_response(jsonify(error="Username cannot be shorter than 3 characters"), 200)
  
  for char in username:
    if char not in string.ascii_letters + string.digits:
      return make_response(jsonify(error="Username must only contain letters and numbers"), 200)

  # TODO: password validation...

  new_user = User(
    username=username,
    email=email,
    password=generate_password_hash(data['password'], method='sha256'),
    created_at=datetime.utcnow(),
    last_login=datetime.utcnow())
  
  # check if account already exists or not
  try:
    db.session.add(new_user)
    db.session.commit()
  except IntegrityError:
    db.session.rollback()
    return make_response(jsonify(error="Email or username already has an account associated with it"), 200)

  # login to new account
  user = User.query.filter_by(username=username).first()
  login_user(user, remember=True)

  return make_response(jsonify(error=""), 200)