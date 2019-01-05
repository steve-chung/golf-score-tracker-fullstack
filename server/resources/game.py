from flask_restful import Resource, reqparse
from flask import jsonify
from flask_jwt_extended import get_jwt_identity, jwt_refresh_token_required, jwt_required
from models.user import UserModel
from models.games import GameModel
from ast import literal_eval

class PlayGame(Resource):

  @jwt_required
  def get(self):
    user_email = get_jwt_identity()
    user = UserModel.find_by_email(user_email)
    play_game = GameModel.find_by_latest(user.id)
    print(play_game)
    if play_game:
      return {
        'game_id': play_game.id,
        'date': play_game.date.__str__(),
        'course': play_game.course
      }
    return {
      'message': 'Something has gone wrong!'
    }, 500
