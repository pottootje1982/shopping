import React, { useState, useEffect } from "react"
import blue from "@material-ui/core/colors/blue"
import green from "@material-ui/core/colors/green"
import MaterialTable, { MTableToolbar } from "material-table"
import { Checkbox, FormControlLabel, Grid, Link } from "@material-ui/core"

export default function Recipes({
  recipes,
  setSelectedRecipe,
  setSelectedRecipes,
  selectedRecipe
}) {
  let [visibleRecipes, setVisibleRecipes] = useState(recipes)
  let [showSelectedRecipes, setShowSelectedRecipe] = useState(false)

  useEffect(() => {
    const filtered = showSelectedRecipes
      ? recipes.filter(r => r.tableData && r.tableData.checked)
      : recipes
    setVisibleRecipes(filtered)
  }, [showSelectedRecipes, recipes])

  function clickRow(_event, row) {
    const recipe = recipes.find(r => r.uid === row.uid)
    setSelectedRecipe(recipe)
  }

  function onSelectionChange(selRecipes) {
    setSelectedRecipes(selRecipes)
  }

  const columns = [
    { field: "uid", hidden: true },
    {
      field: "photo_url",
      render: rowData =>
        rowData.photo_url && (
          <img
            src={rowData.photo_url && rowData.photo_url.split("?")[0]}
            alt={rowData.name}
            style={{ width: 50, backgroundColor: "#fff", padding: 2 }}
          />
        )
    },
    {
      title: "Name",
      field: "name",
      cellStyle: {
        maxHeight: 10
      },
      render: rowData =>
        rowData.source_url ? (
          <Link href={rowData.source_url} target="_blank">
            {rowData.name}
          </Link>
        ) : (
          rowData.name
        )
    },
    { title: "Created", field: "created", type: "date" }
  ]

  function determineRowColor(rowData) {
    const selectedOffset =
      rowData.uid === (selectedRecipe && selectedRecipe.uid) ? 100 : 0
    return {
      maxHeight: 10,
      backgroundColor: rowData.parsedIngredients.every(i => {
        const mapping = rowData.mappings && rowData.mappings[i.ingredient]
        return (
          mapping &&
          (mapping.id !== undefined || mapping.notAvailable || mapping.ignore)
        )
      })
        ? green[100 + selectedOffset]
        : blue[50 + selectedOffset]
    }
  }

  function filterOnSelected(e, checked) {
    setShowSelectedRecipe(checked)
  }

  return (
    recipes && (
      <MaterialTable
        dense={true}
        onRowClick={clickRow}
        title="Recipes"
        style={{ maxHeight: "75vh", minHeight: "75vh", overflow: "auto" }}
        columns={columns}
        data={visibleRecipes}
        onSelectionChange={onSelectionChange}
        options={{
          pageSize: 50,
          pageSizeOptions: [10, 50, 100, 200],
          selection: true,
          rowStyle: determineRowColor
        }}
        components={{
          Toolbar: props => (
            <Grid container alignItems="flex-start">
              <MTableToolbar {...props} />
              <FormControlLabel
                style={{ marginLeft: 0 }}
                onChange={filterOnSelected}
                checked={showSelectedRecipes}
                control={<Checkbox label="Show selected"></Checkbox>}
                label="Show selected"
              />
            </Grid>
          )
        }}
      ></MaterialTable>
    )
  )
}
