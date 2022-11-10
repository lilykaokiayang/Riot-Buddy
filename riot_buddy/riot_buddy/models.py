from riot_buddy import db, login_manager
from flask_login import UserMixin

@login_manager.user_loader
def load_user(user_id):
  return User.query.get(int(user_id))

class Interaction(db.Model):
    __tablename__ = 'Interaction'

    interaction_id = db.Column(db.Integer, primary_key=True)

    member = db.relationship('InteractionMember', back_populates='interaction')
    messages = db.relationship('Message', back_populates='interaction')


class InteractionMember(db.Model):
    __tablename__ = 'InteractionMember'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.ForeignKey('Users.id'), nullable=False)
    interaction_id = db.Column(db.ForeignKey('Interaction.interaction_id'), nullable=False)
    has_accepted = db.Column(db.Boolean, nullable=False)
    match_time = db.Column(db.DateTime, nullable=False)
    has_blocked = db.Column(db.Boolean, nullable=False)
    block_reason = db.Column(db.Text, nullable=False)
    time_blocked = db.Column(db.DateTime, nullable=False)

    interaction = db.relationship('Interaction', back_populates='member')
    user = db.relationship('User', back_populates='interactions')


class Message(db.Model):
    __tablename__ = 'Messages'

    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.ForeignKey('Users.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    sent_at = db.Column(db.DateTime, nullable=False)
    interaction_id = db.Column(db.ForeignKey('Interaction.interaction_id'), nullable=False)

    sender = db.relationship('User', back_populates='messages')
    interaction = db.relationship('Interaction', back_populates='messages')
    


class Photo(db.Model):
    __tablename__ = 'Photos'

    id = db.Column(db.ForeignKey('Profiles.id'), primary_key=True)
    type = db.Column(db.Integer, nullable=False)
    url = db.Column(db.String(255), nullable=False)
    uploaded = db.Column(db.DateTime, nullable=False)

    profile = db.relationship('Profile', back_populates='photos')


class Profile(db.Model):
    __tablename__ = 'Profiles'

    id = db.Column(db.ForeignKey('Users.id'), primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    pronouns = db.Column(db.String(255), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    bio = db.Column(db.Text, nullable=False)
    casual_competitive_score = db.Column(db.Integer, nullable=False)

    user = db.relationship('User', back_populates='profile')
    photos = db.relationship('Photo', back_populates='profile')


class Stat(db.Model):
    __tablename__ = 'Stats'

    id = db.Column(db.ForeignKey('Users.id'), primary_key=True)
    game_id = db.Column(db.Integer, nullable=False)
    rank = db.Column(db.String(255), nullable=False)
    activity = db.Column(db.String(255), nullable=False)
    enabled = db.Column(db.Boolean, nullable=False)

    user = db.relationship('User', back_populates='stats')


class User(UserMixin, db.Model):
    __tablename__ = 'Users'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    created_at = db.Column(db.DateTime)
    username = db.Column(db.String(255), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)
    last_login = db.Column(db.DateTime, nullable=False)

    profile = db.relationship('Profile', back_populates='user')
    stats = db.relationship('Stat', back_populates='user')
    interactions = db.relationship('InteractionMember', back_populates='user')
    messages = db.relationship('Message', back_populates='sender')