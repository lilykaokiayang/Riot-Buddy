from flask import make_response, jsonify, request
import string
from flask_login import login_required, current_user

from riot_buddy import app, db
from .models import Profile


@app.route('/api/v1/profile', methods=['POST'])
@login_required
def createprofile():

  data = request.get_json()

  # name validation
  name = data['name']

  if name == "":
    return make_response(jsonify(error="Name cannot be blank"), 200)

  if len(name) > 50:
    return make_response(jsonify(error="Name cannot be longer than 50 characters"), 200)
  
  for char in name:
    if char not in string.ascii_letters:
      return make_response(jsonify(error="Name must only contain letters"), 200)

  if len(name) < 2:
    return make_response(jsonify(error="Name cannot be shorter than 2 characters"), 200)
  
  # pronoun validation
  pronouns = data['pronouns']

  for char in pronouns:
    if char not in string.ascii_letters + '/':
      return make_response(jsonify(error="Pronouns must only contain letters and '/'"), 200)

  if len(pronouns) < 2:
    return make_response(jsonify(error="Pronouns cannot be shorter than 2 characters"), 200)

  # bio validation
  bio = data['bio']
  
  if len(bio) > 300:
    return make_response(jsonify(error="Bio cannot be longer than 300 characters"), 200)
  
  # age validation 
  age = data['age']

  if not isinstance(age, int):
    return make_response(jsonify(error="Age must be a number"), 200)

  if age < 18:
    return make_response(jsonify(error="You need to be 18+ to register"), 200)

  profile = Profile(
    id=current_user.id,
    name=name,
    pronouns=pronouns,
    age=age,
    bio=bio,
    casual_competitive_score=data['competitiveness']
  )

  db.session.add(profile)
  db.session.commit()

  return make_response(jsonify(error=""), 200)
