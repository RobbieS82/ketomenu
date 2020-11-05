import React, {useState, useEffect} from 'react';
import API from './apiendpoints'
import Meal from './comps/Meal';
import Menu from './comps/Menu';
import AddIcon from '@material-ui/icons/Add';
import {
	Grid,
	AppBar,
	Toolbar,
	Typography,
	Fab,
	Dialog,
	DialogActions,
	DialogTitle,
	DialogContent,
	TextField,
	Button,
	Drawer
} from '@material-ui/core';

async function getMealData(endpoint) {
	const xhr = await fetch(endpoint, {
		method: "GET",
		mode: 'cors'
	});

	if(!xhr.ok){
		alert("Error querying meals from service")
		return [];
	}

	let json = await xhr.json();

	return json;
}

function App() {
	const [mealData, setMealData] = useState([])
	const [menu, setMenu] = useState([])
	const [menuOpen, setMenuOpen] = useState(false)
	const [newMealDialogOpen, setNewMealDialogOpen] = useState(false);
	const [mealName, setMealName] = useState('');
	const handleAddNewMealDialog = e => setNewMealDialogOpen(prev => !prev);
	const handleMealNameChange = e => setMealName(e.target.value);

	async function initMeals(deleteFunc){
		const meals = await getMealData(API.meals);
		setMealData(prev => {
			return meals.map( ({id, title, ings}) => <Meal ings={ings} key={id} id={id} title={title} deleteMealFunc={deleteFunc} />);
		});
	}

	async function generateMenu(){
		console.log("generateMenu called");
		const meals = await getMealData(API.menu);
		setMenu(prev => {
			return meals.map( ({id, title, ings}) => <Menu ings={ings} key={id} id={id} title={title} />);
		});
	}

	async function handleGenerateMenu(){
		console.log("handleGenerateMenu called");
		await generateMenu();
		console.log("menu generated called");
		setMenuOpen(true)
		console.log("menu opened");
	}

	async function deleteMeal(id){
		let fd = `id=${ encodeURI(id) }`;

		let xhr = await fetch(API.meals, {
			method: "DELETE",
			headers: {
		        "Content-Type": "application/x-www-form-urlencoded",
		    },
			body: fd
		});

		if(!xhr.ok)
			return;

		const json = await xhr.json()

		if(!json.ok){
			alert("Application failed to delete meal");
			setNewMealDialogOpen(false);
			return false;
		}

		setMealData( prev => {
			let components = [...prev]; // make a copy of the array
			// examine the key property of the Ingredient component stored in each [component] and match it with the id
			const i = components.findIndex( ({key}) => -key === -id );
			components.splice(i,1);
			return components;
		});

		setNewMealDialogOpen(false);
	}

	const handleSubmitNewMeal = async (e) => {
		const postdata = `title=${ encodeURI(mealName) }`

		const xhr = await fetch(API.meals, {
			method: "POST",
			headers: {
		        "Content-Type": "application/x-www-form-urlencoded",
		    },
			body: postdata
		});

		setNewMealDialogOpen(false);

		if(!xhr.ok){
			alert("Error while communicating with Meals server");
			return;
		}

		const json = await xhr.json();

		if(!json.ok){
			alert("Application failed to create meal");
			return;
		}

		let newMeal = <Meal key={json.id} id={json.id} title={json.title} ings={[]} deleteMealFunc={deleteMeal} />;

		setMealData(prev => {
			return [...prev, newMeal]
		});
	}

	function CreateMealGridItems(){
		if( Array.isArray(mealData) ){
			let meals = mealData.map(
				meal => (
					<Grid item xs={12} sm={6} lg={3} key={meal.id}>
						{meal}
					</Grid>
				)
			)
			return meals;
		}
	}

	useEffect(
		()=>{
			initMeals(deleteMeal);
		},
		[]
	);

	return (
		<main>
			<AppBar position="static" style={{
				marginBottom: "28px"
			}}>
				<Toolbar>
					<Typography variant="h5">
						Keto Menu &amp; Shopping List
					</Typography>

					<Button onClick={handleGenerateMenu}>Generate Menu</Button>
				</Toolbar>
			</AppBar>

			<Grid container spacing={2}>
				{ CreateMealGridItems() }
			</Grid>

			<Drawer anchor="right" open={menuOpen} onClose={() => setMenuOpen(false)} className="menuDrawer">
				<div className="menu">
					{menu}
				</div>
			</Drawer>

			<Dialog open={newMealDialogOpen}>
				<DialogTitle>Add Meal</DialogTitle>
				<DialogContent>
					<TextField autoFocus margin="dense" id="mealname" label="Meal name" type="text" fullWidth onChange={handleMealNameChange} />
				</DialogContent>

				<DialogActions>
					<Button onClick={handleAddNewMealDialog} color="secondary">Cancel</Button>
					<Button onClick={handleSubmitNewMeal} color="primary">Save</Button>
				</DialogActions>
			</Dialog>

			<div className="fabzone">
				<Fab color="primary" aria-label="add" onClick={handleAddNewMealDialog}>
					<AddIcon />
				</Fab>
			</div>
		</main>



	);
}

export default App;
