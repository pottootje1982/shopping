import server from './server'
import React from 'react'
import {
  Grid,
  GridList,
  GridListTile,
  ListSubheader,
  Button
} from '@material-ui/core'

export default class ProductSearch extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.clickProduct = this.clickProduct.bind(this)
  }

  clickProduct(productId) {
    const mappings = this.props.mappings
    let selectedIngredient = this.props.selectedIngredient
    mappings[selectedIngredient] = productId
    this.setState({ mappings })

    server.post('choose', {
      ingredient: this.props.selectedIngredient,
      product: productId
    })
    this.forceUpdate()
  }

  render() {
    const selectedIngredient = this.props.selectedIngredient
    const mappings = this.props.mappings
    return (
      <Grid item xs={6}>
        <GridList cols={3} cellHeight="auto">
          <GridListTile cols={3} key="Subheader" style={{ height: 'auto' }}>
            <ListSubheader component="div">
              {this.props.selectedIngredient}
            </ListSubheader>
          </GridListTile>
          {this.props.products.map((item, i) => (
            <GridListTile key={item.id} xs={4}>
              <Button
                color="primary"
                onClick={() => this.clickProduct(item.id)}
                style={{
                  textTransform: 'none',
                  border:
                    mappings[selectedIngredient] === item.id ? '2px solid' : ''
                }}
                title={item.title}
              >
                <div>
                  <img
                    src={
                      item.images.length > 0 ? item.images[0].url : undefined
                    }
                    alt={item.title}
                  />
                  <div>{item.title}</div>
                </div>
              </Button>
            </GridListTile>
          ))}
        </GridList>
      </Grid>
    )
  }
}
