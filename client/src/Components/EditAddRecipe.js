import React, { useRef } from "react"
import { Typography, Grid, Link, List, ListItem } from "@material-ui/core"
import server from "./server"
import getDateString from "./date"
import { TextField, Button, Fab } from "./Styled"
import DownloadIcon from "@material-ui/icons/GetApp"
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
  const edit = selectedRecipe.uid !== undefined
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

  async function downloadRecipe() {
    const source_url = urlRef.current.value
    const res = await server.post("recipes/download", { url: source_url })
    setSelectedRecipe(res.data)
  }

  return (
    <Grid item xs={6}>
      <List padding={1} style={{ maxHeight: "80vh", overflow: "auto" }}>
        <ListItem>
          <Typography variant="h5">{title}</Typography>
        </ListItem>
        <ListItem>
          <TextField
            label="Title"
            defaultValue={selectedRecipe.name}
            inputRef={nameRef}
          />
        </ListItem>
        <ListItem>
          <TextField
            InputProps={{
              readOnly: true
            }}
            label="Created"
            readOnly
            defaultValue={selectedRecipe.created}
          />
        </ListItem>
        <ListItem>
          <TextField
            label="Ingredients"
            multiline
            defaultValue={selectedRecipe.ingredients
              .map(i => i.full)
              .join("\n")}
            inputRef={ingredientsRef}
          />
        </ListItem>
        <ListItem>
          <TextField
            label="Directions"
            multiline
            defaultValue={selectedRecipe.directions}
            inputRef={directionsRef}
          />
        </ListItem>
        <ListItem>
          <TextField
            label="Source Url"
            multiline
            defaultValue={selectedRecipe.source_url}
            inputRef={urlRef}
          />
          <Fab onClick={downloadRecipe}>
            <DownloadIcon />
          </Fab>
        </ListItem>
        <ListItem>
          <Link href={selectedRecipe.source_url}>
            {selectedRecipe.source_url}
          </Link>
        </ListItem>

        <ListItem>
          <Button onClick={saveRecipeClick}>Save</Button>
          <Button onClick={cancelClick}>Cancel</Button>
        </ListItem>
      </List>
    </Grid>
  )
}
