import React, { useContext, useRef } from 'react'
import { Typography, Grid, Link, List, ListItem } from '@material-ui/core'
import getDateString from '../date'
import { TextField, Button, Fab } from '../styled'
import DownloadIcon from '@material-ui/icons/GetApp'
import ServerContext from '../../server-context'
import { Recipe } from '../collection/RecipeProvider'

import { v1 } from 'uuid'

interface EditAddRecipeProps {
  selectedRecipe: any
  setSelectedRecipe: (selectedRecipe: any) => void
  setEditOrAddRecipe: (editOrAddRecipe: boolean) => void
}

export default function EditAddRecipe({
  selectedRecipe,
  setSelectedRecipe,
  setEditOrAddRecipe
}: EditAddRecipeProps) {
  const { server } = useContext(ServerContext)
  const nameRef = useRef<HTMLInputElement>(null)
  const ingredientsRef = useRef<HTMLInputElement>()
  const directionsRef = useRef<HTMLInputElement>(null)
  const urlRef = useRef<HTMLInputElement>(null)
  const edit = selectedRecipe.uid !== undefined
  const title = edit ? 'Edit Recipe' : 'Add Recipe'

  async function saveRecipeClick() {
    if (
      !nameRef?.current ||
      !ingredientsRef.current ||
      !directionsRef.current ||
      !urlRef.current
    )
      return
    const name = nameRef.current.value
    const uid = selectedRecipe.uid || v1()
    const ingredients = ingredientsRef.current.value
    const directions = directionsRef.current.value
    const sourceUrl = urlRef.current.value
    let recipe: Recipe = {
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
      res = await server().put('recipes', recipe)
    } else {
      recipe = { ...selectedRecipe, ...recipe }
      delete recipe.parsedIngredients
      res = await server().post('recipes', recipe)
    }
    setSelectedRecipe(res.data)
  }

  function cancelClick() {
    setEditOrAddRecipe(false)
  }

  async function downloadRecipe() {
    if (!urlRef.current) return
    const sourceUrl = urlRef.current.value
    const res = await server().post('recipes/download', { url: sourceUrl })
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
      <List style={{ maxHeight: '70vh', overflow: 'auto', padding: 1 }}>
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
