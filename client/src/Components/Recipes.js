import React from "react"
import blue from "@material-ui/core/colors/blue"
import green from "@material-ui/core/colors/green"
import MaterialTable from "material-table"

export default function Recipes({
  recipes,
  setSelectedRecipe,
  setSelectedRecipes,
  selectedRecipe
}) {
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
            style={{ width: 50, backgroundColor: "#fff", padding: 2 }}
          />
        )
    },
    {
      title: "Name",
      field: "name",
      cellStyle: {
        maxHeight: 10
      }
    },
    { title: "Created", field: "created", type: "date" }
  ]

  function determineRowColor(rowData) {
    const selectedOffset =
      rowData.uid === (selectedRecipe && selectedRecipe.uid) ? 100 : 0
    return {
      maxHeight: 10,
      backgroundColor: rowData.ingredients.every(
        i => rowData.mappings && rowData.mappings[i.ingredient] !== undefined
      )
        ? green[100 + selectedOffset]
        : blue[50 + selectedOffset]
    }
  }

  return (
    recipes && (
      <MaterialTable
        dense={true}
        onRowClick={clickRow}
        title="Recipes"
        style={{ maxHeight: "75vh", minHeight: "75vh", overflow: "auto" }}
        columns={columns}
        data={recipes}
        onSelectionChange={onSelectionChange}
        options={{
          pageSize: 6,
          pageSizeOptions: [6, 12, 24],
          selection: true,
          rowStyle: determineRowColor
        }}
      ></MaterialTable>
    )
  )
}
