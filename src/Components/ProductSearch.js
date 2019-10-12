import React from 'react'
import {
  Grid,
  GridList,
  GridListTile,
  GridListTileBar,
  ListSubheader
} from '@material-ui/core'

export default class RecipeList extends React.Component {
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
            <GridListTile key={i} xs={3}>
              <div>
                <img
                  src={item.images.length > 0 ? item.images[0].url : undefined}
                  alt={item.title}
                />
              </div>
              <GridListTileBar title={item.title} />
            </GridListTile>
          ))}
        </GridList>
      </Grid>
    )
  }
}
