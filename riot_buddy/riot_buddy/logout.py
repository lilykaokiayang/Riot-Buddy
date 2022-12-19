from flask import make_response, jsonify
from flask_login import login_required, logout_user

from riot_buddy import app

@app.route('/api/v1/logout', methods=['GET'])
@login_required
def logout():
    logout_user()
    return make_response(jsonify(error=""), 200)
