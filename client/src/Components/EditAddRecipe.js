import React, { useRef } from "react"
import { Typography, TextField, Grid, Button } from "@material-ui/core"
import server from "./server"

export default function EditAddRecipe({ selectedRecipe }) {
  const nameRef = useRef(null)
  const ingredientsRef = useRef(null)
  const directionsRef = useRef(null)

  function saveRecipeClick() {
    console.log(nameRef)
    const name = nameRef.current.value
    const uid = selectedRecipe.uid
    const created = new Date().toLocaleString("en-GB").replace(/\//g, "-")
    const ingredients = ingredientsRef.current.value
    const directions = directionsRef.current.value
    server.put("recipes", { name, uid, created, ingredients, directions })
  }

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
            inputRef={nameRef}
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
            inputRef={ingredientsRef}
          />
        </Grid>
        <Grid item>
          <TextField
            fullWidth
            label="Directions"
            multiline
            variant="outlined"
            defaultValue={selectedRecipe.directions}
            inputRef={directionsRef}
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
