import React, { useRef } from "react"
import { Typography, TextField, Grid, Button, Link } from "@material-ui/core"
import server from "./server"
const uuidv1 = require("uuid/v1")

export default function EditAddRecipe({ selectedRecipe, setSelectedRecipe }) {
  const nameRef = useRef(null)
  const ingredientsRef = useRef(null)
  const directionsRef = useRef(null)
  const urlRef = useRef(null)
  const edit = selectedRecipe.name !== undefined
  const title = edit ? "Edit Recipe" : "Add Recipe"

  async function saveRecipeClick() {
    const name = nameRef.current.value
    const uid = selectedRecipe.uid || uuidv1()
    const created = new Date().toLocaleString("en-GB").replace(/\//g, "-")
    const ingredients = ingredientsRef.current.value
    const directions = directionsRef.current.value
    const source_url = urlRef.current.value
    let recipe = {
      name,
      uid,
      created,
      ingredients,
      directions,
      source_url
    }
    const res = edit
      ? await server.put("recipes", recipe)
      : await server.post("recipes", recipe)
    setSelectedRecipe(res.data)
  }

  return (
    <Grid item xs={6}>
      <Grid container spacing={1} alignItems="stretch" direction="column">
        <Grid item>
          <Typography variant="h5">{title}</Typography>
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
            label="Created"
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
              .map(i => i.full)
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
          <TextField
            fullWidth
            label="Source Url"
            multiline
            variant="outlined"
            defaultValue={selectedRecipe.source_url}
            inputRef={urlRef}
          />
        </Grid>
        <Grid item>
          <Link href={selectedRecipe.source_url}>
            {selectedRecipe.source_url}
          </Link>
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
