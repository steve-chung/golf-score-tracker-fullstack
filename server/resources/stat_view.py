from db import db
from flask_restful import Resource, reqparse
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.engine import reflection
from ast import literal_eval
from flask_jwt_extended import get_jwt_identity,  jwt_required
from flask import jsonify
from models.user import UserModel

metadata = db.MetaData(db.engine)
def init_table(name):
  return db.Table(name, metadata, autoload = True, schema='public')

class StatView(Resource):
  @jwt_required
  def get(self):
    insp = reflection.Inspector.from_engine(db.engine) 
    print(insp.get_view_names())
    user_email = get_jwt_identity()
    user = UserModel.find_by_email(user_email)
    res_stat = []
    perform_stat = []
    results_set = []
    date_stat = {}
    
    MyView = db.Table("stat_by_date", metadata,
                      db.Column("score_id", db.Integer, primary_key=True), 
                      extend_existing=True, autoload=True)
    try:
      query = MyView.select().order_by(MyView.c.date).where(MyView.c.user_id == user.id)
      results = db.engine.execute(query)
      if not results:
        return {
            'message': 'The record is empty'
        }, 204
      for row in results:
        results_set.append(dict(row))
      for idx, result in enumerate(results_set):
        # res_stat.append(result)
        stat = {}
        date = result['date'].strftime('%b %d, %Y')
        if idx > 0 and result['date'] != results_set[idx-1]['date']:
          date = result['date'].strftime('%b %d, %Y')
          res_stat=[]
      
        for key, val in result.items():
          if key != 'date' and key != 'user_id':
            stat[key] = val
        res_stat.append(stat)
        if idx == len(results_set)-1 or result['date'] != results_set[idx+1]['date']:
          date_stat = {'date': date,
                      'stats': res_stat}
          perform_stat.append(date_stat)
        print('perform_stat: {}'.format(perform_stat))
        response = jsonify(perform_stat)
        response.status_code = 200
      return response
    except Exception as e :
      print(e)
      return {
        'message': 'Something went wrong!'
      }, 501
