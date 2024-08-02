import React, {
  useContext,
  useEffect,
  useMemo,
  useCallback,
  ForwardedRef
} from 'react'
import blue from '@material-ui/core/colors/blue'
import green from '@material-ui/core/colors/green'
import {
  TableFooter,
  TablePagination,
  Checkbox,
  TableContainer,
  ThemeProvider
} from '@material-ui/core'
import { createTheme } from '@material-ui/core/styles'
import MaUTable from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableToolbar from './TableToolbar'
import TablePaginationActions from './TablePaginationActions'
import RecipeContext, { Recipe } from './RecipeProvider'

import {
  useTable,
  useRowSelect,
  usePagination,
  useFilters,
  useSortBy,
  useGlobalFilter,
  Row,
  Column,
  IdType
} from 'react-table'

export interface Filter {
  value?: string
  showSelected?: boolean
}

type InterdeminateCheckbox = HTMLButtonElement & { indeterminate?: boolean }

const IndeterminateCheckbox = React.forwardRef<
  InterdeminateCheckbox,
  { indeterminate?: boolean }
>(({ indeterminate, ...rest }, ref: ForwardedRef<InterdeminateCheckbox>) => {
  const defaultRef = React.useRef<InterdeminateCheckbox>(null)
  const resolvedRef = ref || defaultRef

  React.useEffect(() => {
    if ('current' in resolvedRef && resolvedRef.current)
      resolvedRef.current.indeterminate = indeterminate
  }, [resolvedRef, indeterminate])

  return (
    <>
      <Checkbox ref={resolvedRef} {...rest} />
    </>
  )
})
IndeterminateCheckbox.displayName = 'IndeterminateCheckbox'

interface RecipeTableProps {
  clearSelection: object
}

export default function RecipeTable({ clearSelection }: RecipeTableProps) {
  const theme = createTheme({
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

  function clickRow(row: Row<Recipe>) {
    const uid = row.values.uid
    const recipe = recipes.find((r) => r.uid === uid)
    setSelectedRecipe(recipe)
  }

  const columns = useMemo(
    (): Column<Recipe>[] => [
      {
        accessor: 'uid'
      },
      {
        Header: 'Name',
        accessor: 'name'
      },
      { Header: 'Created', accessor: 'created' },
      {
        Header: 'Categories',
        accessor: 'categoryNames',
        Cell: ({ value }: { value: string[] | undefined }) => (
          <span>{value?.join(',')}</span>
        ) //eslint-disable-line
      },
      { accessor: 'parsedIngredients' },
      { accessor: 'category' }
    ],
    []
  )

  function color(selected: boolean, allChosen: boolean) {
    if (allChosen) return green[selected ? 200 : 100]
    return blue[selected ? 100 : 50]
  }

  function determineRowColor(row: Row<Recipe>) {
    const recipe = row.original
    const ingredients = recipe.parsedIngredients || []

    const allChosen = ingredients.every(
      ({ product }) => product?.id || product?.ignore || product?.notAvailable
    )

    const backgroundColor: string = color(
      recipe.uid === selectedRecipe?.uid,
      allChosen
    )

    return {
      maxHeight: 10,
      backgroundColor
    }
  }

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    gotoPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPageSize(Number(event.target.value))
  }

  const globalFilterFunc = (
    rows: Array<Row<Recipe>>,
    _cols: Array<IdType<Recipe>>,
    filterValue: Filter = {}
  ) => {
    return rows.filter((row) => {
      const { value: searchString, showSelected } = filterValue
      const { name, categories, uid } = row.values

      let show = true
      if (selectedOrder) {
        const orderedRecipes = selectedOrder.recipes.map((r) => r.uid)
        show = show && orderedRecipes.includes(uid)
      }
      if (selectedCategory?.uid) {
        show =
          show &&
          categories
            .map((c: string) => c.toLowerCase())
            .includes(selectedCategory.uid.toLowerCase())
      }
      if (showSelected) show &&= row.isSelected
      return (
        show &&
        (searchString && name
          ? name.toLowerCase().includes(searchString.toLowerCase())
          : true)
      )
    })
  }

  const {
    getTableProps,
    headerGroups,
    page,
    prepareRow,
    // selectedFlatRows,
    // toggleRowSelected,
    toggleAllRowsSelected,
    gotoPage,
    setPageSize,
    setGlobalFilter,
    preGlobalFilteredRows,
    state: { pageIndex, pageSize, selectedRowIds, globalFilter }
  } = useTable<Recipe>(
    {
      columns,
      data: recipes,
      initialState: {
        hiddenColumns: ['uid', 'parsedIngredients', 'categories', 'created'],
        selectedRowIds: JSON.parse(
          localStorage.getItem('selectedRowIds') ?? '{}'
        ),
        pageSize: 15
      },
      getRowId: useCallback((row: Recipe) => row.uid, []),
      globalFilter: globalFilterFunc
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
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
    toggleAllRowsSelected(false)
  }, [clearSelection])

  useEffect(() => {
    localStorage.setItem('selectedRowIds', JSON.stringify(selectedRowIds))
    setSelectedRecipes(
      recipes.filter((r) => Object.keys(selectedRowIds).includes(r.uid))
    )
  }, [selectedRowIds, setSelectedRecipes, recipes])

  useEffect(() => {
    setGlobalFilter((filter: Filter) => ({ ...filter, value: undefined }))
  }, [selectedCategory, selectedOrder, setGlobalFilter, recipes])

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
                <TableRow {...headerGroup.getHeaderGroupProps()} key={i}>
                  {headerGroup.headers.map((column, j) => (
                    <TableCell
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      key={j}
                    >
                      {column.render(`Header`) as React.ReactNode}
                      <span>
                        {column.isSorted
                          ? column.isSortedDesc
                            ? ' 🔽'
                            : ' 🔼'
                          : ''}
                      </span>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody>
              {page.map((row: Row<Recipe>, i: number) => {
                prepareRow(row)
                return (
                  <TableRow
                    {...row.getRowProps()}
                    key={i}
                    onClick={() => clickRow(row)}
                    style={determineRowColor(row)}
                  >
                    {row.cells.map((cell, j) => {
                      return (
                        <TableCell {...cell.getCellProps()} key={j}>
                          {cell.render('Cell') as React.ReactNode}
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
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
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
