import React, { useState, useContext } from 'react'

import clsx from 'clsx'
import DeleteIcon from '@material-ui/icons/Delete'
import GlobalFilter from './GlobalFilter'
import { lighten, makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import ConfirmationDialog from './confirmation-dialog'
import { Fab } from '../styled'
import { Add } from '@material-ui/icons'
import getDateString from '../date'
import server from '../server'
import RecipeContext from './RecipeProvider'

import {
  Toolbar,
  FormControlLabel,
  Checkbox,
  Typography,
  Tooltip,
  IconButton
} from '@material-ui/core'

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1)
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85)
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark
        },
  title: {
    flex: '1 1 100%'
  }
}))

const TableToolbar = ({
  numSelected,
  preGlobalFilteredRows,
  setGlobalFilter,
  globalFilter
}) => {
  const classes = useToolbarStyles()
  const [deletionDialogOpen, setDeletionDialogOpen] = useState(false)
  const {
    recipes,
    setRecipes,
    selectedRecipe,
    setSelectedRecipe,
    selectedRecipes
  } = useContext(RecipeContext)

  function addRecipe() {
    const created = getDateString()
    setSelectedRecipe({
      parsedIngredients: [],
      mappings: [],
      created
    })
  }

  async function removeRecipes() {
    if (selectedRecipes.length > 0) {
      const { data: success } = await server.delete('recipes', {
        data: selectedRecipes
      })
      if (success) {
        const index = recipes.indexOf(selectedRecipe)
        const {
          data: { recipes: newRecipes = [] }
        } = (await server.get('recipes')) || {}
        setRecipes(newRecipes)
        const newIndex = Math.min(index, newRecipes.length - 1)
        setSelectedRecipe(newRecipes[newIndex])
      }
    }
  }

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0
      })}
    >
      <Fab onClick={addRecipe}>
        <Add />
      </Fab>
      {numSelected > 0
        ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
        >
          {numSelected} selected
        </Typography>
          )
        : (
        <Typography className={classes.title} variant="h6" id="tableTitle">
          Recipes
        </Typography>
          )}

      {numSelected > 0
        ? (
        <>
          <Tooltip title="Delete">
            <IconButton
              aria-label="delete"
              onClick={() => setDeletionDialogOpen(true)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          <ConfirmationDialog
            dialogOpen={deletionDialogOpen}
            setDialogOpen={setDeletionDialogOpen}
            title={'Remove recipe'}
            message={`Are you sure you want to remove ${selectedRecipes
              .map((r) => `"${r.name}"`)
              .join(', ')}?`}
            onOk={removeRecipes}
          />
        </>
          )
        : (
        <GlobalFilter
          preGlobalFilteredRows={preGlobalFilteredRows}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
          )}

      {numSelected > 0 && (
        <FormControlLabel
          style={{ minWidth: 150 }}
          control={
            <Checkbox
              color="primary"
              onChange={(_e, checked) =>
                setGlobalFilter((prev) => ({ ...prev, showSelected: checked }))
              }
            ></Checkbox>
          }
          label="Show selected"
        />
      )}
    </Toolbar>
  )
}

TableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  setGlobalFilter: PropTypes.func.isRequired,
  preGlobalFilteredRows: PropTypes.array.isRequired,
  globalFilter: PropTypes.object
}

export default TableToolbar
