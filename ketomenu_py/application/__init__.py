from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_wtf.csrf import CSRFProtect, CSRFError

db = SQLAlchemy()

csrf = CSRFProtect()

def create_app():

	app = Flask(__name__)

	CORS(app)

	app.config.from_object('application.appsettings')

	db.init_app(app)

	csrf.init_app(app)

	with app.app_context():
		from meals.bp import bp as bp_meals
		from ingredients.bp import bp as bp_ingredients
		from application.models import Meal, Ingredient

		app.register_blueprint(bp_meals, url_prefix="/m")
		app.register_blueprint(bp_ingredients, url_prefix="/i")

		return app