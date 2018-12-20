from db import db
from passlib.hash import pbkdf2_sha256 as sha256

class UserModel(db.Model):
  __tablename__ = 'users'

  id = db.Column(db.Integer, primary_key=True)
  email = db.Column(db.String(80), unique=True, nullable=False)
  password = db.Column(db.String(100))
  name = db.Column(db.String(25), nullable=False)
  phone = db.Column(db.String(15))
  holes = db.relationship('HolesModel', secondary='scores',
                          backref=db.backref('hole', lazy='dynamic'))
  players = db.relationship(
      'PlayersModel',  backref='players', lazy='dynamic')
  games = db.relationship(
      'GameModel', secondary='scores', backref=db.backref('game', lazy='dynamic'))

  def __init__(self, email, password, phone, name):
    self.email = email
    self.password = password
    self.phone = phone
    self.name = name

  def save_to_db(self):
    db.session.add(self)
    db.session.commit()

  @classmethod
  def find_by_email(cls, email):
    print(email)
    return cls.query.filter_by(email=email).first()

  @classmethod
  def find_by_id(cls, _id):
    return cls.query.filter_by(id=_id)

  @staticmethod
  def generate_hash(password):
    return sha256.hash(password)
  
  @staticmethod
  def verify_hash(password, hash):
    return sha256.verify(password, hash)


class RevokedTokenModel(db.Model):
    __tablename__ = 'revoked_tokens'
    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(120))

    def add(self):
        db.session.add(self)
        db.session.commit()

    @classmethod
    def is_jti_blacklisted(cls, jti):
        query = cls.query.filter_by(jti=jti).first()
        return bool(query)
