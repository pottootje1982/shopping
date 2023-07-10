import React, { useRef } from 'react'
import { Typography, Grid, Link, List, ListItem } from '@material-ui/core'
import server from '../server'
import getDateString from '../date'
import { TextField, Button, Fab } from '../styled'
import DownloadIcon from '@material-ui/icons/GetApp'
import PropTypes from 'prop-types'
const { v1: uuidv1 } = require('uuid');

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
  const title = edit ? 'Edit Recipe' : 'Add Recipe'

  async function saveRecipeClick() {
    const name = nameRef.current.value
    const uid = selectedRecipe.uid || uuidv1()
    const ingredients = ingredientsRef.current.value
    const directions = directionsRef.current.value
    const sourceUrl = urlRef.current.value
    let recipe = {
      name,
      uid,
      ingredients,
      directions,
      source_url: sourceUrl
    }
    if (!edit) {
      recipe.created = getDateString()
    }
    let res
    if (edit) {
      res = await server.put('recipes', recipe)
    } else {
      recipe = { ...selectedRecipe, ...recipe }
      delete recipe.parsedIngredients
      res = await server.post('recipes', recipe)
    }
    setSelectedRecipe(res.data)
  }

  function cancelClick() {
    setEditOrAddRecipe(false)
  }

  async function downloadRecipe() {
    const sourceUrl = urlRef.current.value
    const res = await server.post('recipes/download', { url: sourceUrl })
    if (res.data) {
      setSelectedRecipe(res.data)
    } else {
      alert('Recipe could not be downloaded from url')
    }
  }

  return (
    <Grid item xs={6}>
      <div>
        <Button onClick={saveRecipeClick}>Save</Button>
        <Button onClick={cancelClick}>Cancel</Button>
      </div>
      <Typography variant="h5">{title}</Typography>
      <List padding={1} style={{ maxHeight: '70vh', overflow: 'auto' }}>
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
            {selectedRecipe.source_url || ''}
          </Link>
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
            defaultValue={selectedRecipe.ingredients}
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
      </List>
    </Grid>
  )
}

EditAddRecipe.propTypes = {
  selectedRecipe: PropTypes.object.isRequired,
  setSelectedRecipe: PropTypes.func.isRequired,
  setEditOrAddRecipe: PropTypes.func.isRequired
}
