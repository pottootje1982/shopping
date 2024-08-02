import React, { useEffect, useRef, useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  Grid,
  ImageList,
  ImageListItem,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
  Button as MuiButton,
  Link,
  Select,
  MenuItem
} from '@material-ui/core'
import { Button } from '../styled'
import RecipeContext, {
  Ingredient,
  Product
} from '../collection/RecipeProvider'
import ServerContext from '../../server-context'

const styles = makeStyles(() => ({
  input: {
    height: 36,
    marginRight: 4,
    marginTop: 3
  }
}))

interface ProductSearchProps {
  selectedIngredient: Ingredient
  setSelectedIngredient: (value: Ingredient) => void
  searchProducts: (ingredient?: Ingredient, search?: string) => Promise<void>
  products: Product[]
}

export default function ProductSearch({
  selectedIngredient,
  setSelectedIngredient,
  searchProducts,
  products
}: ProductSearchProps) {
  const { server } = useContext(ServerContext)
  const classes = styles()
  const searchRef = useRef<HTMLInputElement>(null)
  const bareIngredient = selectedIngredient.ingredient
  const { product } = selectedIngredient

  const { supermarket, supermarkets, setSupermarket } =
    useContext(RecipeContext)

  useEffect(doSearch, [selectedIngredient])

  function doSearch() {
    searchProducts(selectedIngredient)
  }

  function selectProduct(completeProduct: Product) {
    const { id, title, ignore, notAvailable } = completeProduct
    const newProduct = {
      id,
      title,
      ignore,
      notAvailable
    }
    setSelectedIngredient({ ...selectedIngredient, product: newProduct })

    server().post(
      `products/choose`,
      {
        ingredient: bareIngredient,
        product: newProduct
      },
      { params: { supermarket: supermarket?.key } }
    )
  }

  function textFieldSearch(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.code === 'Enter') {
      searchProducts(undefined, event.currentTarget.value)
    }
  }

  function search(value: string) {
    if (searchRef.current) {
      searchRef.current.value = value
      searchProducts(undefined, value)
    }
  }

  function ignoreIngredient(checked: boolean) {
    product.ignore = checked
    product.notAvailable = false
    selectProduct(product)
  }

  function notAvailableIngredient(checked: boolean) {
    product.notAvailable = checked
    product.ignore = false
    selectProduct(product)
  }

  function changeSupermarket(e: React.ChangeEvent<{ value: unknown }>) {
    const supermarket = supermarkets.find((s) => s.key === e.target.value)
    if (!supermarket) return
    setSupermarket(supermarket)
  }

  return (
    <Grid
      container
      item
      xs={6}
      key={bareIngredient}
      alignItems="stretch"
      spacing={1}
    >
      {bareIngredient.split(' ').map((item, i) => (
        <Button key={i} variant="outlined" onClick={() => search(item)}>
          {item}
        </Button>
      ))}
      <TextField
        InputProps={{
          className: classes.input
        }}
        inputRef={searchRef}
        defaultValue={bareIngredient}
        onKeyDown={(e) =>
          textFieldSearch(e as React.KeyboardEvent<HTMLInputElement>)
        }
        variant="outlined"
      />
      <FormControlLabel
        control={
          <Checkbox
            color="primary"
            onChange={(_e, checked) => ignoreIngredient(checked)}
            checked={product && product.ignore}
          ></Checkbox>
        }
        label="Ignore ingredient"
      />
      <FormControlLabel
        control={
          <Checkbox
            color="primary"
            onChange={(_e, checked) => notAvailableIngredient(checked)}
            checked={product && product.notAvailable}
          ></Checkbox>
        }
        label="Not available"
      />
      <Select
        onChange={changeSupermarket}
        style={{ marginLeft: 5 }}
        value={supermarket?.key}
      >
        {supermarkets.map((supermarket) => (
          <MenuItem key={supermarket.key} value={supermarket.key}>
            {supermarket.name}
          </MenuItem>
        ))}
      </Select>
      <Grid item xs={12}>
        {products.length === 0 ? (
          <Typography color="secondary" style={{ paddingTop: 20 }}>
            No products found
          </Typography>
        ) : (
          <ImageList
            cols={3}
            rowHeight="auto"
            style={{ maxHeight: '78vh', overflow: 'auto' }}
          >
            {products.map((item) => (
              <ImageListItem key={item.id}>
                <MuiButton
                  color="primary"
                  onClick={() => selectProduct(item)}
                  style={{
                    textTransform: 'none',
                    border: product?.id === item.id ? '2px solid' : ''
                  }}
                  title={item.title}
                >
                  <div>
                    <img src={item.image} alt={item.title} />
                    <Link
                      href={`https://www.ah.nl${item.link}`}
                      target="_blank"
                    >
                      {item.title} ({item?.price?.unitSize}) €
                      {item?.price?.now && item.price.now}
                    </Link>
                  </div>
                </MuiButton>
              </ImageListItem>
            ))}
          </ImageList>
        )}
      </Grid>
    </Grid>
  )
}
