import nanoid
import json
import time
import boto3

import subprocess
from faker import Faker
from datetime import datetime, date
import random

from riot_buddy.models import User, Profile
from riot_buddy import (
  app,
  db,
  s3,
  cf,
  bucket_name,
  region,
  db_name,
  db_host,
  db_port,
  origin_url,
)

def init_aws():
  for item in cf.list_distributions()['DistributionList']['Items']:
    for origin in item['Origins']['Items']:
      # get the cloudfront distribution url and id
      if f'{bucket_name}.s3.{region}.amazonaws.com' == origin['DomainName']:
        cloudfront_url = item['DomainName']
        cloudfront_id = item['Id']

  # retrieve current distribution config
  if cloudfront_id:
    config = cf.get_distribution_config(Id=cloudfront_id)
    print(f'retrieved config for {cloudfront_url} distribution with id {cloudfront_id}')

    # disabling distribution (this may take a while to deploy)
    config['DistributionConfig']['Enabled'] = False

    cf.update_distribution(
      DistributionConfig=config['DistributionConfig'],
      Id=cloudfront_id,
      IfMatch=config['ETag'])
    print(f"updating config for {cloudfront_url} distribution with id {cloudfront_id}...")

    # check if distribution was deployed
    deployed = False
    etag = ''
    while not deployed:
      status=cf.get_distribution(Id=cloudfront_id)
      if (status['Distribution']['DistributionConfig']['Enabled'] == False and status['Distribution']['Status'] == 'Deployed'):
          etag=status['ETag']
          deployed=True

      print(f'distribution update for {cloudfront_id} not fully deployed yet, checking again in 15 seconds...')
      time.sleep(15)

    print('done!')

    # actually delete the distribution
    cf.delete_distribution(Id=cloudfront_id, IfMatch=etag)
    print(f'deleted {cloudfront_url} distribution with id {cloudfront_id}')

    # remove old oac if exists
    oacs = cf.list_origin_access_controls()['OriginAccessControlList']['Items']
    for oac in oacs:
      if oac['Name'] == f'{bucket_name}_oac':
        etag = cf.get_origin_access_control(Id=oac['Id'])['ETag']
        cf.delete_origin_access_control(Id=oac['Id'], IfMatch=etag)
        print(f"deleted origin access control with id {oac['Id']}")

  # check if bucket exists
  for bucket in s3.list_buckets()['Buckets']:
    if bucket['Name'] == bucket_name:
       # delete all objects in bucket
      s3r = boto3.resource('s3')
      s3r.Bucket(bucket_name).objects.all().delete()
      print(f"deleted all objects in {bucket_name} bucket")

      # delete the bucket itself
      s3.delete_bucket(Bucket=bucket_name)
      print(f'deleted {bucket_name} bucket')

  # create s3 bucket
  s3.create_bucket(Bucket=bucket_name, CreateBucketConfiguration={'LocationConstraint': region})
  print(f'created {bucket_name} bucket in region {region}')

  # create oac and get id
  oac_id = cf.create_origin_access_control(
    OriginAccessControlConfig={
      'Name': f'{bucket_name}_oac',
      'Description': '',
      'SigningProtocol': 'sigv4',
      'SigningBehavior': 'always',
      'OriginAccessControlOriginType': 's3'
    }
  )['OriginAccessControl']['Id']
  print(f'created origin access control {bucket_name}_oac with id {oac_id}')

  # create distribution
  response = cf.create_distribution(
    DistributionConfig={
      'CallerReference': nanoid.generate(),
      'Aliases': {'Quantity': 0},
      'Origins': {
        'Quantity': 1,
        'Items': [{
            'Id': origin_url,
            'DomainName': origin_url,
            'CustomHeaders': {'Quantity': 0},
            'S3OriginConfig': {'OriginAccessIdentity': ''},
            'OriginShield': {'Enabled': False},
            'OriginAccessControlId': oac_id
        }]
      },
      'OriginGroups': {'Quantity': 0},
      'DefaultCacheBehavior': {
        'TargetOriginId': origin_url,
        'ViewerProtocolPolicy': 'redirect-to-https',
        'AllowedMethods': {
          'Quantity': 2,
          'Items': ['HEAD', 'GET'],
          'CachedMethods': {'Quantity': 2, 'Items': ['HEAD', 'GET']}
        },
        'CachePolicyId': '658327ea-f89d-4fab-a63d-7e88639e58f6',
        'Compress': True,
      },
      'CacheBehaviors': {'Quantity': 0},
      'CustomErrorResponses': {'Quantity': 0},
      'Enabled': True,
      'Comment': '',
      'PriceClass': 'PriceClass_100'
    }
  )
  cloudfront_id = response['Distribution']['Id']
  cloudfront_url = response['Distribution']['DomainName']
  distribution_arn = response['Distribution']['ARN']
  print(f'created distribution for {origin_url}: {cloudfront_url} ({cloudfront_id})')

  # add the policy to the bucket
  s3.put_bucket_policy(
    Bucket=bucket_name,
    Policy=json.dumps({
      "Version": "2012-10-17",
      "Statement": {
          "Sid": "AllowCloudFrontServicePrincipalReadOnly",
          "Effect": "Allow",
          "Principal": {"Service": "cloudfront.amazonaws.com"},
          "Action": "s3:GetObject",
          "Resource": f"arn:aws:s3:::{bucket_name}/*",
          "Condition": {"StringEquals": { "AWS:SourceArn": distribution_arn}}
      }
    }))
  print(f'updated {bucket_name} bucket with policy for distribution id {cloudfront_id}')

  # check if distribution was deployed
  deployed = False
  while not deployed:
    status=cf.get_distribution(Id=cloudfront_id)
    if (status['Distribution']['DistributionConfig']['Enabled'] == True and status['Distribution']['Status'] == 'Deployed'):
        deployed=True

    print(f'distribution {cloudfront_id} not fully deployed yet, checking again in 15 seconds...')
    time.sleep(15)

  print('all done!')

def init_db():
  fake = Faker()



  output = subprocess.run(['dropdb', '-h', db_host, '-p', db_port, db_name], capture_output=True)
  print(f'dropped {db_name} database: {output.stderr}')

  output = subprocess.run(['createdb', '-h', db_host, '-p', db_port, db_name], capture_output=True)
  print(f'created {db_name} database: {output.stderr}')

  with app.app_context():
    db.drop_all()
    db.create_all()

  print(f'initialized {db_name} database tables')

  users = []
  profiles = []

  n = 100

  # adds 100 random users and profiles to the database
  for i in range(1, n+1):
    fakeuser = fake.simple_profile()

    if fakeuser['sex'] == 'M':
      pronouns = "he/him"
    else:
      pronouns = "she/her"

    age = date.today().year - fakeuser['birthdate'].year - 40
    if age < 18:
      age = 18

    users.append(User(
      created_at=datetime.utcnow(),
      username=fakeuser['username'],
      email=fakeuser['mail'],
      password=f"sha256$password",
      last_login=datetime.utcnow(),
    ))

    profiles.append(Profile(
      id=i,
      name=fakeuser['name'],
      pronouns=pronouns,
      age=age,
      bio=fake.job(),
      casual_competitive_score=random.randint(1, 10),
    ))

  with app.app_context():
    db.session.add_all(users)
    db.session.add_all(profiles)
    db.session.commit()

  print(f"seeded database with {len(users)} users and {len(profiles)} profiles")


print('this may take a while... go get your coffee!')
init_db()
init_aws()
