from flask import request, jsonify, make_response
from email_validator import validate_email, EmailNotValidError
from datetime import datetime
import string
from flask_login import login_user

from sqlalchemy.exc import IntegrityError

from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

from werkzeug.security import generate_password_hash

from riot_buddy import app, db, sg_api_key, sg_sender, sg_enabled
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

  # config option so we don't spam ourselves during development
  if sg_enabled:
    message = Mail(
      from_email=sg_sender,
      to_emails=email,
      subject=f'Welcome to Riot Buddy, {username}!',
      plain_text_content=f'Thank you for signing up for Riot Buddy, {username}! We are glad to have you! \nNext, you should set up your profile so you can start matchmaking with other members! \n\nHave fun, \nRiot Buddy Team')
    try:
        sg = SendGridAPIClient(sg_api_key)
        response = sg.send(message)
        print(response.status_code)
    except Exception as e:
        print(e.message)

  return make_response(jsonify(error=""), 200)
