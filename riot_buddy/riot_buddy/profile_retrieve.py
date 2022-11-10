from flask import make_response, jsonify, request
from flask_login import login_required, current_user

from riot_buddy import app
from .models import Profile

@app.route('/api/v1/profile', methods=['GET'])
@login_required
def getprofile():

  id = request.args.get('id', current_user.id)

  profile = Profile.query.filter_by(id=id).first()

  if profile:
    pd = {
      "name": profile.name,
      "bio": profile.bio,
      "pronouns": profile.pronouns,
      "age": profile.age,
      "competitiveness": profile.casual_competitive_score
    }
    return make_response(jsonify(error="", profile=pd), 200)

  return make_response(jsonify(error="profile not found", profile={}), 200)