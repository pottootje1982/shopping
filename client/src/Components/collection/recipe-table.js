import React, { useContext, useEffect, useMemo } from 'react'
import blue from '@material-ui/core/colors/blue'
import green from '@material-ui/core/colors/green'
import {
  TableFooter,
  TablePagination,
  Checkbox,
  TableContainer,
  ThemeProvider
} from '@material-ui/core'
import { createMuiTheme } from '@material-ui/core/styles'
import MaUTable from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableToolbar from './TableToolbar'
import TablePaginationActions from './TablePaginationActions'
import RecipeContext from './RecipeProvider'
import PropTypes from 'prop-types'

import {
  useTable,
  useRowSelect,
  usePagination,
  useFilters,
  useGlobalFilter
} from 'react-table'

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef()
    const resolvedRef = ref || defaultRef

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate
    }, [resolvedRef, indeterminate])

    return (
      <>
        <Checkbox ref={resolvedRef} {...rest} />
      </>
    )
  }
)
IndeterminateCheckbox.displayName = 'IndeterminateCheckbox'

export default function RecipeTable() {
  const theme = createMuiTheme({
    overrides: {
      MuiTableCell: {
        root: {
          // This can be referred from Material UI API documentation.
          padding: '4px 8px'
        }
      }
    }
  })

  const {
    recipes,
    setSelectedRecipe,
    setSelectedRecipes,
    selectedRecipe,
    selectedCategory,
    selectedOrder
  } = useContext(RecipeContext)

  function clickRow(row) {
    const uid = row.values.uid
    const _recipes = selectedOrder?.recipes || recipes
    const recipe = _recipes.find((r) => r.uid === uid)
    setSelectedRecipe(recipe)
  }

  const columns = useMemo(
    () => [
      {
        accessor: 'uid',
        show: false
      },
      {
        Header: 'Name',
        accessor: 'name'
      },
      { Header: 'Created', accessor: 'created' },
      {
        Header: 'Categories',
        accessor: 'categoryNames',
        Cell: ({ value }) => <span>{value?.join(',')}</span> //eslint-disable-line
      },
      { accessor: 'mappings' },
      { accessor: 'parsedIngredients' },
      { accessor: 'categories' }
    ],
    []
  )

  columns[3].Cell.propTypes = {
    value: PropTypes.array
  }

  function determineRowColor(row) {
    const values = row.values
    const ingredients = values.parsedIngredients || []
    const selectedOffset =
      values.uid === (selectedRecipe && selectedRecipe.uid) ? 100 : 0

    const allChosen = ingredients.every(({ product }) => product?.id)
    return {
      maxHeight: 10,
      backgroundColor: allChosen
        ? green[100 + selectedOffset]
        : blue[50 + selectedOffset]
    }
  }

  const handleChangePage = (_event, newPage) => {
    gotoPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setPageSize(Number(event.target.value))
  }

  const globalFilterFunc = (rows, _cols, filterValue = {}) => {
    return rows.filter((row) => {
      const { value, showSelected } = filterValue
      const { name, categories, uid } = row.values

      let show = true
      if (selectedOrder) {
        const orderedRecipes = selectedOrder.recipes.map((r) => r.uid)
        show &= orderedRecipes.includes(uid)
      }
      if (selectedCategory) {
        show &= categories
          .map((c) => c.toLowerCase())
          .includes(selectedCategory.uid.toLowerCase())
      }
      if (showSelected) show &= row.isSelected
      return (
        show &&
        (value && name
          ? name.toLowerCase().includes(value.toLowerCase())
          : true)
      )
    })
  }

  const {
    getTableProps,
    headerGroups,
    page,
    prepareRow,
    gotoPage,
    setPageSize,
    setGlobalFilter,
    preGlobalFilteredRows,
    state: { pageIndex, pageSize, selectedRowIds, globalFilter }
  } = useTable(
    {
      columns,
      data: recipes,
      initialState: {
        hiddenColumns: [
          'uid',
          'mappings',
          'parsedIngredients',
          'categories',
          'created'
        ],
        pageSize: 15
      },
      globalFilter: globalFilterFunc
    },
    useFilters,
    useGlobalFilter,
    usePagination,
    useRowSelect,
    /* eslint-disable */
    (hooks) => {
      hooks.allColumns.push((columns) => [
        {
          id: 'selection',
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          )
        },
        ...columns
      ]) /* eslint-enable */
    }
  )

  useEffect(() => {
    setSelectedRecipes(recipes.filter((_r, i) => selectedRowIds[i]))
  }, [selectedRowIds, setSelectedRecipes, recipes])

  useEffect(() => {
    setGlobalFilter((filter) => ({ ...filter, value: undefined }))
  }, [selectedCategory, selectedOrder, setGlobalFilter])

  return (
    recipes && (
      <TableContainer>
        <TableToolbar
          numSelected={Object.keys(selectedRowIds).length}
          preGlobalFilteredRows={preGlobalFilteredRows}
          setGlobalFilter={setGlobalFilter}
          globalFilter={globalFilter}
        />
        <ThemeProvider theme={theme}>
          <MaUTable {...getTableProps()} style={{ minHeight: '78vh' }}>
            <TableHead>
              {headerGroups.map((headerGroup, i) => (
                <TableRow key={i} {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column, j) => (
                    <TableCell key={j} {...column.getHeaderProps()}>
                      {column.render('Header')}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody>
              {page.map((row, i) => {
                prepareRow(row)
                return (
                  <TableRow
                    key={i}
                    {...row.getRowProps()}
                    onClick={() => clickRow(row)}
                    style={determineRowColor(row)}
                  >
                    {row.cells.map((cell, j) => {
                      return (
                        <TableCell key={j} {...cell.getCellProps()}>
                          {cell.render('Cell')}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                )
              })}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[
                    5,
                    10,
                    15,
                    25,
                    { label: 'All', value: recipes.length }
                  ]}
                  colSpan={3}
                  count={recipes.length}
                  rowsPerPage={pageSize}
                  page={pageIndex}
                  SelectProps={{
                    inputProps: { 'aria-label': 'rows per page' },
                    native: true
                  }}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </MaUTable>
        </ThemeProvider>
      </TableContainer>
    )
  )
}

IndeterminateCheckbox.propTypes = {
  indeterminate: PropTypes.bool.isRequired
}
