import React, { useRef } from "react"
import { Typography, Grid, Link } from "@material-ui/core"
import server from "./server"
import getDateString from "./date"
import { TextField, Button } from "./Styled"
const uuidv1 = require("uuid/v1")

export default function EditAddRecipe({
  selectedRecipe,
  setSelectedRecipe,
  setEditOrAddRecipe
}) {
  const nameRef = useRef(null)
  const ingredientsRef = useRef(null)
  const directionsRef = useRef(null)
  const urlRef = useRef(null)
  const edit = selectedRecipe.name !== undefined
  const title = edit ? "Edit Recipe" : "Add Recipe"

  async function saveRecipeClick() {
    const name = nameRef.current.value
    const uid = selectedRecipe.uid || uuidv1()
    const created = getDateString()
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

  function cancelClick() {
    setEditOrAddRecipe(false)
  }

  return (
    <Grid item xs={6}>
      <Grid container spacing={1} alignItems="stretch" direction="column">
        <Grid item>
          <Typography variant="h5">{title}</Typography>
        </Grid>
        <Grid item>
          <TextField
            label="Title"
            defaultValue={selectedRecipe.name}
            inputRef={nameRef}
          />
        </Grid>
        <Grid item>
          <TextField
            InputProps={{
              readOnly: true
            }}
            label="Created"
            readOnly
            defaultValue={selectedRecipe.created}
          />
        </Grid>
        <Grid item>
          <TextField
            label="Ingredients"
            multiline
            defaultValue={selectedRecipe.ingredients
              .map(i => i.full)
              .join("\n")}
            inputRef={ingredientsRef}
          />
        </Grid>
        <Grid item>
          <TextField
            label="Directions"
            multiline
            defaultValue={selectedRecipe.directions}
            inputRef={directionsRef}
          />
        </Grid>
        <Grid item>
          <TextField
            label="Source Url"
            multiline
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
          <Button onClick={saveRecipeClick}>Save</Button>
          <Button onClick={cancelClick}>Cancel</Button>
        </Grid>
      </Grid>
    </Grid>
  )
}
