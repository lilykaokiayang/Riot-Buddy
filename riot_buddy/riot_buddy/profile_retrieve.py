from flask import make_response, jsonify, request
from flask_login import login_required, current_user

from riot_buddy import app
from .models import Profile, Photo

@app.route('/api/v1/profile', methods=['GET'])
@login_required
def getprofile():

  id = request.args.get('id', current_user.id)

  profile = Profile.query.filter_by(id=id).first()

  if profile:
    profile_data = {
      "id": profile.id,
      "name": profile.name,
      "bio": profile.bio,
      "pronouns": profile.pronouns,
      "age": profile.age,
      "competitiveness": profile.casual_competitive_score
    }

    # if user has uploaded a profile picture, add its url to the response
    photo = Photo.query.filter_by(id=id).first()
    if photo:
      profile_data['photo_url'] = photo.url

    return make_response(jsonify(error="", profile=profile_data), 200)

  # if id is self and profile was not found, user has account but no profile
  if id == current_user.id:
    return make_response(jsonify(error="profile not set up", profile={}), 200)

  return make_response(jsonify(error="profile not found", profile={}), 200)
