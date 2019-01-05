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
    'totalShots', help='This field cannot be blank', required=True)
parser.add_argument(
    'totalScore', help='This field cannot be blank', required=True)
parser.add_argument(
    'stat_id', help='This field cannot be blank', required=False)


class Stat(Resource):

  def get(self, stat_id):
    stat = StatModel.find_by_id(stat_id)
    # game = GameModel.find_by_id(game_id)

    if stat:
      return {
        'firstClub': stat.first_club,
        'firstDistance': stat.first_distance,
        'secondClub': stat.second_club,
        'secondDistance': stat.second_distance,
        'stroksGreen': stat.stroks_green,
        'totalShot': stat.total_shot
      }
    return {'message': 'Stat not found'}

class StatPut(Resource):
    
  @jwt_required
  def put(self, stat_id):
    data = parser.parse_args()
    game_id = data['game_id']
    firstClub = data['firstClub']
    firstDistance = data['firstDistance']
    secondClub = data['secondClub']
    secondDistance = data['secondDistance']
    stroksGreen = data['stroksGreen']
    totalShots = data['totalShots']
    total_score = data['totalScore']
    try: 
        # data = parse.parse_args()
        stat_id = data['stat_id']
        game = GameModel.find_by_id(game_id)
        game.total_score = total_score
        StatModel.update_stat(stat_id=stat_id, firstClub=firstClub, firstDistance=firstDistance,
                            secondClub=secondClub, secondDistance=secondDistance, stroksGreen=stroksGreen,
                            totalShot=totalShots)
        db.session.commit()
        return {'message': 'successfully update a stat {}'.format(stat_id),
                'stat_id': stat_id}
    except Exception as e:
        print(e)
        return {'message': 'something went wrong'}

class StatPost(Resource):
  @jwt_required
  def post(self):
    data = parser.parse_args()
    user_email = get_jwt_identity()
    user = UserModel.find_by_email(user_email)
    hole_id = data['hole_id']
    game_id = data['game_id']
    print('hole_id {}, game_id {}'.format(hole_id, game_id))
    found_stat = ScoresModel.find_by_hole_id(hole_id, game_id)
    new_game = GameModel.find_by_id(game_id)
    print(found_stat)
    if found_stat.stat_id != None :
      return {'message': 'Stat {} is already exists.'.format(found_stat.stat_id)}, 500
    firstClub = data['firstClub']
    firstDistance = data['firstDistance']
    secondClub = data['secondClub']
    secondDistance = data['secondDistance']
    stroksGreen = data['stroksGreen']
    totalShots = data['totalShots']
    totalScore = data['totalScore']
    try:
      new_stat = StatModel(firstClub=firstClub, firstDistance=firstDistance,
                           secondClub=secondClub, secondDistance=secondDistance, stroksGreen=stroksGreen,
                           totalShot=totalShots)
      new_stat.save_to_db()
      print(new_stat.id)
      ScoresModel.update_stat_id(
        user_id=user.id, game_id=game_id, hole_id=hole_id, stat_id=new_stat.id)
      print(new_game.total_score)
      print(totalScore)
      new_game.total_score = totalScore
    
      db.session.commit()
      return {'message': 'successfully add hole {}'.format(hole_id),
              'stat_id': new_stat.id,
              'firstClub': new_stat.first_club,
              'firstDistance': new_stat.first_distance,
              'secondClub': new_stat.second_club,
              'secondDistance': new_stat.second_distance,
              'stroksGreen': new_stat.stroks_green,
              'totalShots': new_stat.total_shot,
              'totalScore': new_game.total_score}
    except Exception as e:
      print(e)
      return {'message': 'something went wrong'}, 500
