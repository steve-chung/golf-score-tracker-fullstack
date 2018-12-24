from db import db
from sqlalchemy.exc import SQLAlchemyError

class StatModel(db.Model):
  __tablename__= 'stat'

  id = db.Column(db.Integer, primary_key=True)
  first_club = db.Column(db.String(15), nullable = False)
  first_distance = db.Column(db.Integer, nullable = False)
  second_club = db.Column(db.String(15), nullable = False)
  second_distance = db.Column(db.Integer, nullable = False)
  stroks_green = db.Column(db.Integer, nullable = False)
  total_shot = db.Column(db.Integer, nullable=False)
  score = db.relationship('ScoresModel', backref='scores', lazy='dynamic')

  def __init__(self, firstClub, firstDistance, secondClub, secondDistance, stroksGreen, totalShot):
    self.first_club = firstClub
    self.first_distance =  firstDistance
    self.second_club = secondClub
    self.second_distance = secondDistance
    self.stroks_green = stroksGreen
    self.total_shot = totalShot
  
  @classmethod
  def find_by_id(cls, stat_id):
    return cls.query.filter_by(id=stat_id).first()


  def json(self):
    return {'firstClub': self.first_club,
            'firstDistance': self.first_distance, 'secondClub': self.second_club,
            'secondDistance': self.second_distance, 'stroksGreen': self.stroks_green,
            'totalShot': self.total_shot}
  
  def save_to_db(self):
    db.session.add(self)
    db.session.commit()

  @classmethod
  def update_stat(cls, stat_id, firstClub, firstDistance,
                  secondClub, secondDistance, stroksGreen, totalShot):
    try: 
      updated_stat = cls.query.filter_by(id=stat_id).first()
      updated_stat.first_club = firstClub
      updated_stat.first_distance = firstDistance
      updated_stat.second_club = secondClub
      updated_stat.second_distance = secondDistance
      updated_stat.stroks_green = stroksGreen
      updated_stat.total_shot = totalShot
      db.session.commit()
    except SQLAlchemyError as e:
      db.session.rollback()
      print (e) 

  
