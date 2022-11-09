"""Server for Riot Buddy"""

import os
from flask import Flask, send_from_directory, request, jsonify, make_response
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import IntegrityError
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
from flask_login import LoginManager, login_user, UserMixin, current_user, login_required, logout_user
from email_validator import validate_email, EmailNotValidError
import string

app = Flask(__name__, static_folder='./build')
app.secret_key = "hackbright"


db_name = "testing"
app.config["SQLALCHEMY_DATABASE_URI"] = f"postgresql:///{db_name}"
app.config["SQLALCHEMY_ECHO"] = False
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

CORS(app)

login_manager = LoginManager()
login_manager.init_app(app)

@login_manager.user_loader
def load_user(user_id):
  return User.query.get(int(user_id))

class Interaction(db.Model):
    __tablename__ = 'Interaction'

    interaction_id = db.Column(db.Integer, primary_key=True)

    member = db.relationship('InteractionMember', back_populates='interaction')
    messages = db.relationship('Message', back_populates='interaction')


class InteractionMember(db.Model):
    __tablename__ = 'InteractionMember'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.ForeignKey('Users.id'), nullable=False)
    interaction_id = db.Column(db.ForeignKey('Interaction.interaction_id'), nullable=False)
    has_accepted = db.Column(db.Boolean, nullable=False)
    match_time = db.Column(db.DateTime, nullable=False)
    has_blocked = db.Column(db.Boolean, nullable=False)
    block_reason = db.Column(db.Text, nullable=False)
    time_blocked = db.Column(db.DateTime, nullable=False)

    interaction = db.relationship('Interaction', back_populates='member')
    user = db.relationship('User', back_populates='interactions')


class Message(db.Model):
    __tablename__ = 'Messages'

    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.ForeignKey('Users.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    sent_at = db.Column(db.DateTime, nullable=False)
    interaction_id = db.Column(db.ForeignKey('Interaction.interaction_id'), nullable=False)

    sender = db.relationship('User', back_populates='messages')
    interaction = db.relationship('Interaction', back_populates='messages')
    


class Photo(db.Model):
    __tablename__ = 'Photos'

    id = db.Column(db.ForeignKey('Profiles.id'), primary_key=True)
    type = db.Column(db.Integer, nullable=False)
    url = db.Column(db.String(255), nullable=False)
    uploaded = db.Column(db.DateTime, nullable=False)

    profile = db.relationship('Profile', back_populates='photos')


class Profile(db.Model):
    __tablename__ = 'Profiles'

    id = db.Column(db.ForeignKey('Users.id'), primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    pronouns = db.Column(db.String(255), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    bio = db.Column(db.Text, nullable=False)
    casual_competitive_score = db.Column(db.Integer, nullable=False)
    availability = db.Column(db.String(255), nullable=False)

    user = db.relationship('User', back_populates='profile')
    photos = db.relationship('Photo', back_populates='profile')


class Stat(db.Model):
    __tablename__ = 'Stats'

    id = db.Column(db.ForeignKey('Users.id'), primary_key=True)
    game_id = db.Column(db.Integer, nullable=False)
    rank = db.Column(db.String(255), nullable=False)
    activity = db.Column(db.String(255), nullable=False)
    enabled = db.Column(db.Boolean, nullable=False)

    user = db.relationship('User', back_populates='stats')


class User(UserMixin, db.Model):
    __tablename__ = 'Users'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    created_at = db.Column(db.DateTime)
    username = db.Column(db.String(255), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)
    last_login = db.Column(db.DateTime, nullable=False)

    profile = db.relationship('Profile', back_populates='user')
    stats = db.relationship('Stat', back_populates='user')
    interactions = db.relationship('InteractionMember', back_populates='user')
    messages = db.relationship('Message', back_populates='sender')
  
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def welcomepage(path):
  """View homepage"""

  if path != "" and os.path.exists(app.static_folder + '/' + path):
    return send_from_directory(app.static_folder, path)
  else:
    return send_from_directory(app.static_folder, 'index.html')


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

@app.route('/api/v1/login', methods=['POST'])
def login_account():

  data = request.get_json()
  user = User.query.filter_by(username=data['username']).first()

  if not user or not check_password_hash(user.password, data['password']):
    return make_response(jsonify(error="invalid username or password"), 200)

  login_user(user, remember=True)
  return make_response(jsonify(error=""), 200)

@app.route('/api/v1/whoami', methods=['GET'])
@login_required
def whoami():
  return make_response(jsonify(username=current_user.username), 200)

@app.route('/api/v1/logout', methods=['GET'])
@login_required
def logout():
    logout_user()
    return make_response(jsonify(error=""), 200)

if __name__ == '__main__':
  app.run(use_reloader=True, port=5000, threaded=True)