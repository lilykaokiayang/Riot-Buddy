from flask import make_response, jsonify
from flask_login import login_required, current_user

from riot_buddy import app

@app.route('/api/v1/whoami', methods=['GET'])
@login_required
def whoami():
  return make_response(jsonify(username=current_user.username), 200)