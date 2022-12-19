from flask import jsonify, make_response
from flask_login import login_required, current_user

from riot_buddy import app, twilio_client, twilio_account_sid, twilio_api_key_sid, twilio_api_key_secret

from twilio.base.exceptions import TwilioRestException
from twilio.jwt.access_token import AccessToken
from twilio.jwt.access_token.grants import ChatGrant

@login_required
@app.route('/api/v1/chat', methods=['GET'])
def login_chat():

  user_role_sid = None

  # make chat user if doesnt exist
  for role in twilio_client.conversations.roles.list():
    if role.friendly_name == 'user':
      user_role_sid = role.sid
    try:
      twilio_client.conversations.users.create(identity=current_user.username, role_sid=user_role_sid)
    except TwilioRestException as exc:
      if exc.status != 409:
         return make_response(jsonify(error=f"chat error: {exc.msg}"), 200)

  # add user to each conversation with users they've matched with
  conversations = twilio_client.conversations.conversations.list()
  for conversation in conversations:
    try:
      conversation.participants.create(identity=current_user.username)
    except TwilioRestException as exc:
     if exc.status != 409:
      return make_response(jsonify(error=f"chat error: {exc.msg}"), 200)

  # grant access tokens
  service_sid = conversations[0].chat_service_sid
  token = AccessToken(twilio_account_sid, twilio_api_key_sid,
                      twilio_api_key_secret, identity=current_user.username)

  token.add_grant(ChatGrant(service_sid=service_sid))

  return make_response(jsonify(
    error="",
    chatrooms=[[conversation.friendly_name, conversation.sid] for conversation in conversations],
    token=token.to_jwt()), 200)
