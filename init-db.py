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
    password=f"sha256${hashlib.sha256('password'.encode()).hexdigest()}",
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
