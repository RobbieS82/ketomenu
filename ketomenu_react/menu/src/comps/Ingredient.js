import React from 'react';
import CancelIcon from '@material-ui/icons/Cancel';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

function Ingredient(props){
	return (
		<li className="ingredient-listitem">
			<Typography className="ingredient-text" component="span">{props.title}</Typography>

			<IconButton onClick={() => props.deleteIngFunc(props.id)}>
				<CancelIcon></CancelIcon>
			</IconButton>
		</li>
	)
}

export default Ingredient;