import os
import nanoid
import boto3
from dotenv import load_dotenv

from flask import Flask, send_from_directory, make_response, jsonify
from flask_cors import CORS
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy
from flask.cli import AppGroup

import click

from twilio.rest import Client

db = SQLAlchemy()
login_manager = LoginManager()

load_dotenv()

twilio_client = Client()

s3 = boto3.client('s3',
  aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
  aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'))

cf = boto3.client('cloudfront',
  aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
  aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'))

bucket_name = os.getenv('PFP_BUCKET_NAME', 'riot-buddy-photos')
region = os.getenv('AWS_REGION', 'us-east-2')

db_name = os.getenv('DB_NAME', 'riot_buddy')
db_port = os.getenv('DB_PORT', 5432)
db_host = os.getenv('DB_HOST', 'localhost')

max_mb = os.getenv('MAX_FILE_SIZE_IN_MB', 16)

sg_api_key = os.getenv('SENDGRID_API_KEY')
sg_sender = os.getenv('SENDGRID_SENDER')
sg_enabled = (os.getenv('SENDGRID_ENABLED') in ['true', 'True', 'TRUE', 'yes', 'Yes', 'YES'])

twilio_account_sid = os.environ.get('TWILIO_ACCOUNT_SID')
twilio_api_key_sid = os.environ.get('TWILIO_API_KEY_SID')
twilio_api_key_secret = os.environ.get('TWILIO_API_KEY_SECRET')

# get list of s3 bucket names, if pfp bucket doesnt exist, dont start
buckets = []
for bucket in s3.list_buckets()['Buckets']:
  buckets.append(bucket['Name'])
if bucket_name not in buckets:
  print('bucket not found! did you run init.py first?')
  exit()

# get list of cloudfront distributions and check if one exists for s3 bucket
distributions = []
origin_url = f'{bucket_name}.s3.{region}.amazonaws.com'

for item in cf.list_distributions()['DistributionList']['Items']:
  for origin in item['Origins']['Items']:
    distributions.append(origin['DomainName'])
    # get the cloudfront distribution url
    if f'{bucket_name}.s3.{region}.amazonaws.com' == origin['DomainName']:
      cloudfront_url = item['DomainName']
if origin_url not in distributions:
  print('missing CloudFront distribution! did you run init.py first?')
  exit()

print(f'got {cloudfront_url} distribution for {bucket_name} bucket')

def create_app():
  app = Flask(__name__, static_folder='../../build')
  app.secret_key = os.getenv('APP_SECRET_KEY', nanoid.generate(size=32))

  app.config["SQLALCHEMY_DATABASE_URI"] = f"postgresql://{db_host}:{db_port}/{db_name}"
  app.config["SQLALCHEMY_ECHO"] = False
  app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

  app.config['MAX_CONTENT_LENGTH'] = int(max_mb) * 1000 * 1000

  CORS(app)
  db.init_app(app)
  login_manager.init_app(app)

  return app

app = create_app()

from riot_buddy import (
  create_account,
  login,
  logout,
  whoami,
  profile_create,
  profile_retrieve,
  edit_profile,
  photo_upload,
  chat
)

chatrooms_cli = AppGroup('chatrooms', help='Manage your chat rooms.')
app.cli.add_command(chatrooms_cli)

@chatrooms_cli.command('create', help='create a chat room')
@click.argument('name')
def create(name):
    conversation = None
    for conv in twilio_client.conversations.conversations.list():
        if conv.friendly_name == name:
            conversation = conv
            break
    if conversation is not None:
        print('Chat room already exists')
    else:
        twilio_client.conversations.conversations.create(friendly_name=name)

@chatrooms_cli.command('delete', help='delete a chat room')
@click.argument('name')
def delete(name):
    conversation = None
    for conv in twilio_client.conversations.conversations.list():
        if conv.friendly_name == name:
            conversation = conv
            break
    if conversation is None:
        print('Chat room not found')
    else:
        conversation.delete()

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def welcomepage(path):
  if path != "" and os.path.exists(app.static_folder + '/' + path):
    return send_from_directory(app.static_folder, path)
  else:
    return send_from_directory(app.static_folder, 'index.html')

@app.errorhandler(500)
def server_error(e):
  return make_response(jsonify(error="oops... internal server error!"), 500)

@app.errorhandler(401)
def unauthorized_error(e):
  return make_response(jsonify(error="unauthorized... are you logged in?"), 401)

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True, port=5000)
