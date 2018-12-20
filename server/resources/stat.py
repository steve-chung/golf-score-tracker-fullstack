from flask_restful import Resource, reqparse
from db import db
from flask import jsonify
from flask_jwt_extended import jwt_required, fresh_jwt_required, get_jwt_identity
from models.user import UserModel
from models.games import GameModel
from models.holes import HolesModel
from models.score import ScoresModel
from models.stat import StatModel
from ast import literal_eval


parser = reqparse.RequestParser()
parser.add_argument(
    'game_id', help='This field cannot be blank', required=False)
parser.add_argument(
    'hole_id', help='This field cannot be blank', required=False)
parser.add_argument(
    'firstClub', help='This field cannot be blank', required=True)
parser.add_argument(
    'firstDistance', help='This field cannot be blank', required=True)
parser.add_argument(
    'secondClub', help='This field cannot be blank', required=True)
parser.add_argument(
    'secondDistance', help='This field cannot be blank', required=True)
parser.add_argument(
    'stroksGreen', help='This field cannot be blank', required=True)
parser.add_argument(
    'totalShot', help='This field cannot be blank', required=True)
parser.add_argument(
    'stat_id', help='This field cannot be blank', required=False)


class Stat(Resource):

  def get(self, stat_id):
    stat = StatModel.find_by_id(stat_id)
    if stat:
      return stat.json()
    return {'message': 'Stat not found'}

  
    
  @fresh_jwt_required
  def put(self, stat_id):
    data = parser.parse_args()
    firstClub = data['firstClub']
    firstDistance = data['firstDistance']
    secondClub = data['secondClub']
    secondDistance = data['secondDistance']
    stroksGreen = data['stroksGreen']
    totalShot = data['totalShot']
    found_stat = StatModel.find_by_id(stat_id)
    try: 
        # data = parse.parse_args()
        stat_id = data['stat_id']
        StatModel.update_stat(stat_id=stat_id, firstClub=firstClub, firstDistance=firstDistance,
                            secondClub=secondClub, secondDistance=secondDistance, stroksGreen=stroksGreen,
                            totalShot=totalShot)
        return {'message': 'successfully update a stat {}'.format(stat_id),
                'stat_id': '{}'.format(stat_id)}
    except Exception as e:
        print(e)
        return {'message': 'something went wrong'}

class StatPost(Resource):
  @fresh_jwt_required
  def post(self):
    data = parser.parse_args()
    user_email = get_jwt_identity()
    user = UserModel.find_by_email(user_email)
    hole_id = data['hole_id']
    game_id = data['game_id']
    found_stat = ScoresModel.find_by_hole_id(hole_id, game_id)
    if found_stat.stat_id != None :
        return {'message': 'Stat {} is already exists.'.format(found_stat.stat_id)}, 500
    firstClub = data['firstClub']
    firstDistance = data['firstDistance']
    secondClub = data['secondClub']
    secondDistance = data['secondDistance']
    stroksGreen = data['stroksGreen']
    totalShot = data['totalShot']
    try:
      new_stat = StatModel(firstClub=firstClub, firstDistance=firstDistance,
                           secondClub=secondClub, secondDistance=secondDistance, stroksGreen=stroksGreen,
                           totalShot=totalShot)
      new_stat.save_to_db()
      print(new_stat.id)
      ScoresModel.update_stat_id(
          user_id=user.id, game_id=game_id, hole_id=hole_id, stat_id=new_stat.id)
      return {'message': 'successfully add hole {}'.format(hole_id),
              'stat_id': '{}'.format(new_stat.id)}
    except Exception as e:
      print(e)
      return {'message': 'something went wrong'}, 500
