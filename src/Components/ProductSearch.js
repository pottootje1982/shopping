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
    this.setState({ selectedProduct: productId })
  }

  render() {
    return (
      <Grid item xs={6}>
        <GridList cols={4} cellHeight="auto">
          <GridListTile key="Subheader" cols={4} style={{ height: 'auto' }}>
            <ListSubheader component="div">
              {this.props.selectedProduct}
            </ListSubheader>
          </GridListTile>
          {this.props.products.map((item, i) => (
            <GridListTile key={item.id} xs={3}>
              <div>
                <img
                  src={item.images.length > 0 ? item.images[0].url : undefined}
                  alt={item.title}
                />
              </div>
              <Button
                variant={
                  this.state.selectedProduct === item.id
                    ? 'contained'
                    : 'outlined'
                }
                color="primary"
                onClick={() => this.clickProduct(item.id)}
                style={{ textTransform: 'none' }}
                title={item.title}
              >
                {item.title}
              </Button>
            </GridListTile>
          ))}
        </GridList>
      </Grid>
    )
  }
}
