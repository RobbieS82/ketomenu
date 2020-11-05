from flask import abort, Blueprint, request, Response, jsonify
from sqlalchemy import func
from flask_cors import CORS
from application.models import Meal
from application import db
import json

bp = Blueprint('meals', __name__, static_folder="static", template_folder="templates")

CORS(bp)

@bp.route("/", methods=['GET','POST','PUT','DELETE'])
def crud_meals():
	if request.method=="GET":
		return list_meals()

	elif request.method=="POST":
		return save_meals()

	elif request.method=="PUT":
		return update_meals()

	elif request.method=="DELETE":
		return delete_meals()


@bp.route("/generate<int:numMeals>", methods=['GET'])
def generate_meals(numMeals=1):
	meals = Meal.query.order_by(func.random()).limit(numMeals).all()

	return jsonify(
		[m.to_dict() for m in meals]
	)


@bp.route("/<int:meal_id>", methods=['GET'])
def get_meal_and_ings(meal_id=None):
	if meal_id==None:
		abort(404)

	meal = Meal.query.get(meal_id)



def list_meals():
	meals = Meal.query.order_by(Meal.title).all()

	return jsonify(
		[m.to_dict() for m in meals]
	)





def save_meals():
	meal = Meal(title=request.form['title'])
	db.session.add(meal)
	db.session.commit()

	jdump = meal.to_dict()
	jdump["ok"] = True

	return Response(
		json.dumps(jdump),
		mimetype="application/json"
	)


def delete_meals():
	id = request.form["id"]

	if id==None:
		abort(400)

	meal = Meal.query.get(id)

	if meal==None:
		abort(404)

	db.session.delete(meal)
	db.session.commit()

	jdump = {"ok":True}

	return Response(json.dumps(jdump), mimetype="application/json")