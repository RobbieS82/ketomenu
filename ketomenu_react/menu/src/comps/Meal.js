import React, {useState} from 'react';
import API from '../apiendpoints';
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Ingredient from "./Ingredient";
import {
  List,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField
} from "@material-ui/core";

//-----------------------------------
// returns an array of <Ingredient>
//-----------------------------------
const initIngs = function(ings, myCallback) {
	return ings.map( ({id,title}) => <Ingredient title={title} id={id} key={id} deleteIngFunc={myCallback} /> )
}

function Meal(props){
	const [ingDialogOpen, setIngDialogOpen] = useState(false);
	const [ingArray, setIngArray] = useState( initIngs(props.ings, handleDeleteIng) );
	const [newIngText, setNewIngText] = useState('new ingredients');
	const handleIngDialogOpen = () => setIngDialogOpen(true);
	const handleIngDialogClose = () => setIngDialogOpen(false);
	const handleIngInput = e => setNewIngText(e.target.value);

	// argument 'id' is passed in through the onClick handler in <Ingredient>
	async function handleDeleteIng(id){
		let fd = `id=${ encodeURI(id) }`;

		let xhr = await fetch(API.ings, {
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
			alert("Application failed to delete ingredient");
			handleIngDialogClose();
			return false;
		}

		setIngArray( prev => {
			let components = [...prev]; // make a copy of the array
			// examine the key property of the Ingredient component stored in each [component] and match it with the id
			const i = components.findIndex( ({key}) => -key === -id );
			components.splice(i,1);
			return components;
		});
	}


	function updateIngs(newIngObject){
		let newIng = <Ingredient key={newIngObject.id} id={newIngObject.id} title={newIngObject.title} deleteIngFunc={handleDeleteIng}  />
		setIngArray(prev => [...prev, newIng]);
	}


	async function handleSaveIngredient(){
		let fd = `title=${ encodeURI(newIngText) }&meal_id=${ encodeURI(props.id) }`

		let xhr = await fetch(API.ings, {
			method: "POST",
			headers: {
		        "Content-Type": "application/x-www-form-urlencoded",
		    },
			body: fd
		});

		if(!xhr.ok)
			return;

		const json = await xhr.json()

		if(!json.ok){
			alert("Application failed to save ingredient");
			handleIngDialogClose();
			return false;
		}

		updateIngs(json);

		handleIngDialogClose();
	}

	return (
		<div>
			<Accordion className="mealAccordion">
				<AccordionSummary expandIcon={<ExpandMoreIcon />}>
					<Typography variant="h6">
						{props.title}
					</Typography>
				</AccordionSummary>

				<AccordionDetails style={{
					flexFlow: "column nowrap"
				}}>
					<List component="ul">{ingArray}</List>

					<Button variant="contained" color="primary" onClick={handleIngDialogOpen}>
						Add Ingredients
					</Button>

					<Button className="deleteMealButton" onClick={() => props.deleteMealFunc(props.id)}>
						Delete Meal
					</Button>
				</AccordionDetails>
			</Accordion>

			<Dialog open={ingDialogOpen} onClose={handleIngDialogClose}>
				<DialogTitle id="form-dialog-title">Add ingredient</DialogTitle>

				<DialogContent>
					<DialogContentText>
						<TextField autoFocus margin="dense" id="name" label="ingredient" type="text" fullWidth onChange={handleIngInput} />
					</DialogContentText>
				</DialogContent>

				<DialogActions>
					<Button onClick={handleIngDialogClose} color="primary">Cancel</Button>
					<Button color="primary" onClick={handleSaveIngredient}>Save</Button>
				</DialogActions>
			</Dialog>
		</div>
	)
}

export default Meal