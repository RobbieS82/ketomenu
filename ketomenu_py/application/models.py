from . import db
from flask import escape, jsonify

class Meal(db.Model):
	id = db.Column(db.Integer, primary_key=True, autoincrement=True)
	title = db.Column(db.String(256), nullable=False)
	ingredients = db.relationship("Ingredient", backref="meal", cascade="delete", lazy=True)

	def __repr__(self):
		return f'<MenuItem id={self.id} title={self.title}>'

	def to_dict(self):
		return {
			'id': escape(str(self.id)),
			'title': escape(self.title),
			'ings': [e.to_dict() for e in self.ingredients]
		}

class Ingredient(db.Model):
	id = db.Column(db.Integer, primary_key=True, autoincrement=True)
	title = db.Column(db.String(256), nullable=False)
	meal_id = db.Column(db.Integer, db.ForeignKey('meal.id'), nullable=False)

	def __repr__(self):
		return f'<Ingredient id={self.id} title={self.title}>'

	def to_dict(self):
		return {
			'id': self.id,
			'title': escape(self.title),
			'meal_id': self.meal_id
		}