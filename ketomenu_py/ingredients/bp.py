from flask import abort, Blueprint, request, Response, jsonify
from flask_cors import CORS
from application.models import Ingredient
from application import db
import json

bp = Blueprint('ingredients', __name__, static_folder="static", template_folder="templates")

CORS(bp)

@bp.route("/", methods=['GET','POST','PUT','DELETE'])
def crud_ingredients():
	if request.method=="GET":
		return list_ing()

	elif request.method=="POST":
		return save_ing()

	elif request.method=="PUT":
		return update_ing()

	elif request.method=="DELETE":
		return delete_ing()

#@bp.route("/list", methods=['GET'])
def list_ing():
	ingredients = Ingredient.query.all()

	return jsonify(
		[m.to_dict() for m in ingredients]
	)


#@bp.route("/save", methods=['POST'])
def save_ing():
	ing = Ingredient(title=request.form['title'], meal_id=request.form['meal_id'])
	db.session.add(ing)
	db.session.commit()

	jdump = ing.to_dict()

	jdump["ok"] = True

	return Response(
		json.dumps(jdump),
		mimetype="application/json"
	)

#@bp.route("/delete", methods=['DELETE'])
def delete_ing():
	jdump = {'ok': False}

	id = request.form["id"]

	if id==None:
		return Response(json.dumps(jdump), mimetype="application/json")

	ing = Ingredient.query.get(id)

	if ing==None:
		return Response(jdump, mimetype="application/json")

	db.session.delete(ing)
	db.session.commit()

	jdump["ok"] = True

	return Response(json.dumps(jdump), mimetype="application/json")