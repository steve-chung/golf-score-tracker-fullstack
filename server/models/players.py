from db import db
from sqlalchemy.exc import SQLAlchemyError

class PlayersModel(db.Model):
  __tablename__ = 'players'
  id = db.Column(db.Integer, primary_key=True)
  user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
  user = db.relationship('UserModel')
  email = db.Column(db.String(80), nullable=False)
  name = db.Column(db.String(25), nullable=False)
  aveScore = db.Column(db.Integer)

  def __init__(self, user_id, email, name, aveScore):
    self.user_id = user_id
    self.email = email 
    self.name = name 
    self.aveScore = aveScore

  def save_to_db(self):
    try: 
      db.session.add(self)
      db.session.commit()
    except SQLAlchemyError as e:
      print('error here at player')
      print(e)

  @classmethod
  def find_by_email(cls, email, user_id):
    return cls.query.filter_by(email=email, user_id = user_id).first()
