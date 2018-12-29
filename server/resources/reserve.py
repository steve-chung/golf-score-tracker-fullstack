from flask_restful import Resource, reqparse
from db import db
from flask import jsonify
from flask_jwt_extended import get_jwt_identity,  jwt_required
from models.user import UserModel
from models.games import GameModel
from models.players import PlayersModel
from ast import literal_eval


parser = reqparse.RequestParser()
parser.add_argument(
    'date', help='This field cannot be blank', required=True)
parser.add_argument(
    'course', help='This field cannot be blank', required=True)
parser.add_argument(
    'players', action='append', help='This field cannot be blank', required=True)
parser.add_argument(
    'totalScores', action='append', help='This field cannot be blank', required=True)
class reserveCourse(Resource):
  @jwt_required
  def post(self):
    data = parser.parse_args()
    print(data)
    user_email = get_jwt_identity()
    user = UserModel.find_by_email(user_email)
    players = data['players']
    
    try:
      for player in players:
        convert_player = literal_eval(player)
        # new_player = None
        print(convert_player['email'])
        new_player = PlayersModel.find_by_email(
            convert_player['email'], user.id)
        if new_player == None: 
          print(convert_player)
          print (user.id)
          new_player = PlayersModel(
            user_id=user.id,
            email=convert_player['email'],
            name=convert_player['name'],
            aveScore=convert_player['avgScore']
          )
          print (new_player)
          new_player.save_to_db()
        new_games = GameModel(
          course = data['course'],
          date = data['date'],
          user_id = user.id,
          player_id = new_player.id,
          total_score=int(data['totalScores'][0])
        )
        new_games.save_to_db()
        new_games.game.append(user)
        db.session.commit()
      
      return {
        'message': 'Course {} was scheduled for {}'.format(data['course'], data['date']),
        'id': new_games.id
      }, 200

    except Exception as e:
      print(e)
      return {'message': 'Something went wrong'}, 500

