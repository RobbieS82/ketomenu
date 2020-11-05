import React, {useState} from 'react';
import Ingredient from "./Ingredient";
import {
  List,
  Typography
} from "@material-ui/core";

//-----------------------------------
// returns an array of <Ingredient>
//-----------------------------------
const initIngs = function(ings, myCallback) {
	return ings.map( ({id,title}) => <Ingredient title={title} id={id} key={id} /> )
}

function Menu(props){
	const [ingArray, setIngArray] = useState( initIngs(props.ings, handleDeleteIng) );

	// argument 'id' is passed in through the onClick handler in <Ingredient>
	async function handleDeleteIng(id){
		setIngArray( prev => {
			let components = [...prev]; // make a copy of the array
			// examine the key property of the Ingredient component stored in each [component] and match it with the id
			const i = components.findIndex( ({key}) => -key === -id );
			components.splice(i,1);
			return components;
		});
	}

	return (
		<div className="menuItem">
			<Typography variant="h6">
				{props.title}
			</Typography>

			<List component="ul" style={{
				listStyleType: "square"
			}}>{ingArray}</List>
		</div>
	)
}

export default Menu