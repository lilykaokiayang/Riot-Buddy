from faker import Faker
from riot_buddy import app, db
from riot_buddy.models import User, Profile
from datetime import datetime, date
import random
import hashlib

fake = Faker()


with app.app_context():
  db.drop_all()
  db.create_all()


# adds 100 random users and profiles to the database
for i in range(1, 101):
  fakeuser = fake.simple_profile()

  if fakeuser['sex'] == 'M':
    pronouns = "he/him"
  else:
    pronouns = "she/her"

  age = date.today().year - fakeuser['birthdate'].year - 40
  if age < 18:
    age = 18

  user = User(
    created_at=datetime.utcnow(),
    username=fakeuser['username'],
    email=fakeuser['mail'],
    password=f"sha256${hashlib.sha256('password'.encode()).hexdigest()}",
    last_login=datetime.utcnow(),
  )

  profile = Profile(
    id=i,
    name=fakeuser['name'],
    pronouns=pronouns,
    age=age,
    bio=fake.job(),
    casual_competitive_score=random.randint(1, 10),
  )

  with app.app_context():
    db.session.add(user)
    db.session.add(profile)
    db.session.commit()
