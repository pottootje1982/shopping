import React from "react"
import { Typography, TextField, Grid, Button } from "@material-ui/core"

export default function EditAddRecipe({ selectedRecipe }) {
  function saveRecipeClick() {}

  return (
    <Grid item xs={6}>
      <Grid
        container
        spacing={1}
        alignItems="stretch"
        direction="column"
        key={selectedRecipe.uid}
      >
        <Grid item>
          <Typography variant="h5">Edit Recipe</Typography>
        </Grid>
        <Grid item>
          <TextField
            fullWidth
            label="Title"
            defaultValue={selectedRecipe.name}
            variant="outlined"
          />
        </Grid>
        <Grid item>
          <TextField
            fullWidth
            label="Ceated"
            readOnly
            defaultValue={selectedRecipe.created}
            variant="outlined"
          />
        </Grid>
        <Grid item>
          <TextField
            fullWidth
            label="Ingredients"
            multiline
            variant="outlined"
            defaultValue={selectedRecipe.ingredients
              .map(i => i.ingredient)
              .join("\n")}
          />
        </Grid>
        <Grid item>
          <TextField
            fullWidth
            label="Directions"
            multiline
            variant="outlined"
            defaultValue={selectedRecipe.directions}
          />
        </Grid>

        <Grid item>
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
    </Grid>
  )
}
