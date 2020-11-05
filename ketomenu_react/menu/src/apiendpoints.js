const API = {
	base: "https://your.pythonanywhere.com/",

	get ings() {
		return `${this.base}i/`
	},

	get meals() {
		return `${this.base}m/`
	},

	get menu() {
		return `${this.base}m/generate7`
	}
}

export default API;