import React, { Fragment } from "react"
import { Typography, TextField, Grid, Button } from "@material-ui/core"

export default function EditAddRecipe({ selectedRecipe }) {
  function saveRecipeClick() {}

  return (
    <Grid container xs={6}>
      <Typography variant="h4">Edit Recipe</Typography>
      <Grid item xs={12}>
        <TextField
          label="title"
          defaultValue={selectedRecipe.name}
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="created"
          readonly
          defaultValue={selectedRecipe.created}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="ingredients"
          multiline
          variant="outlined"
          defaultValue={selectedRecipe.ingredients
            .map(i => i.ingredient)
            .join("\n")}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="directions"
          multiline
          variant="outlined"
          defaultValue={selectedRecipe.directions}
        />
      </Grid>

      <Grid item xs={12}>
        <Button
          color="secondary"
          variant="contained"
          style={{
            margin: 5,
            textTransform: "none"
          }}
          onClick={saveRecipeClick}
        >
          Save
        </Button>
      </Grid>
    </Grid>
  )
}
