from db import db
from flask_restful import Resource, reqparse
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.engine import reflection
from ast import literal_eval
from flask_jwt_extended import get_jwt_identity,  jwt_required
from flask import jsonify

metadata = db.MetaData(db.engine)
def init_table(name):
  return db.Table(name, metadata, autoload = True, schema='public')

class StatView(Resource):
  @jwt_required
  def get(self, user_id):
    insp = reflection.Inspector.from_engine(db.engine) 
    print(insp.get_view_names())
    res_stat = []
    MyView = db.Table("stat_by_date", metadata,
                      db.Column("score_id", db.Integer, primary_key=True), 
                      extend_existing=True, autoload=True)
    try:
      query = MyView.select().order_by(MyView.c.date).where(MyView.c.user_id == user_id)
      results = db.engine.execute(query)
      if not results:
        return {
            'message': 'The record is empty'
        }, 204
      for result in results:
        # res_stat.append(result)
        stat = {}
        for key, val in result.items():
          if key == 'date':
            print(val)
            val = val.strftime('%b %d, %Y')
          stat[key] = val
        res_stat.append(stat)
      return res_stat, 200
    except Exception as e :
      print(e)
      return {
        'message': 'Something went wrong!'
      }, 501
