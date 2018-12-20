from db import db
from sqlalchemy.exc import SQLAlchemyError
from ast import literal_eval

class ScoresModel(db.Model):
  __tablename__ = 'scores'

  id = db.Column(db.Integer, primary_key=True)
  hole_id = db.Column(db.Integer, db.ForeignKey('holes.id'))
  user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
  stat_id = db.Column(db.Integer, db.ForeignKey('stat.id'))
  game_id = db.Column(db.Integer, db.ForeignKey('games.id'))

  def __init__(self, hole_id, user_id, game_id, stat_id):
    self.game_id = game_id
    self.hole_id = hole_id
    self.user_id = user_id
    self.stat_id = stat_id

  def save_to_db(self):
    try:
      db.session.add(self)
      db.session.commit(self)
      return {'message': 'successfully insert score'}
    except SQLAlchemyError as e:
      print (e)

  @classmethod
  def find_by_id(cls, _id):
    return cls.query.filter_by(id = _id).first() 
  
  @classmethod
  def find_by_game_id(cls, user_id, game_id):
    return cls.query.filter(cls.user_id == user_id, cls.game_id == game_id, cls.hole_id != None )\
          .first()

  @classmethod
  def find_by_hole_id(cls, hole_id, game_id):
    return cls.query.filter(cls.hole_id == hole_id, cls.game_id == game_id)\
            .first()

  @classmethod
  def update_stat_id(cls, user_id, game_id, stat_id, hole_id):
    try:
      print(type(user_id))
      updated_score = cls.query.filter(cls.user_id == user_id, cls.game_id == game_id, cls.hole_id == hole_id).first()
      print(stat_id)
      updated_score.stat_id = stat_id
      db.session.commit()
      return {'message': 'successfully updated score stat.id'}
    except SQLAlchemyError as e:
      db.session.rollback()
      print (e)

