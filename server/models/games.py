from db import db
from sqlalchemy.exc import SQLAlchemyError



class GameModel(db.Model):
  __tablename__ = 'games'

  id = db.Column(db.Integer, primary_key=True)
  date = db.Column(db.Date)
  user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
  player_id = db.Column(db.Integer, db.ForeignKey('players.id'))
  course = db.Column(db.String(30), nullable=False)
  total_score = db.Column(db.Integer, nullable=False)


  def __init__(self, user_id, course, date, player_id, total_score):
    self.course = course
    self.user_id = user_id
    self.player_id = player_id
    self.date = date
    self.total_score = total_score

  def save_to_db(self):
    try:
      db.session.add(self)
      db.session.commit()
      return {'message': 'successfully insert players'}
    except SQLAlchemyError as e:
      print(e)

  @classmethod
  def find_by_id(cls, _id):
    return cls.query.filter_by(id = _id).first()

  @classmethod
  def find_by_latest(cls, user_id):
    date = cls.date
    return cls.query.filter_by(user_id = user_id).\
           order_by(date.desc()).first()
