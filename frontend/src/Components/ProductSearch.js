import server from "./server";
import React from "react";
import {
  Grid,
  GridList,
  GridListTile,
  TextField,
  Button
} from "@material-ui/core";

export default class ProductSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.clickProduct = this.selectProduct.bind(this);
  }

  selectProduct(productId) {
    const mappings = this.props.mappings;
    let selectedIngredient = this.props.selectedIngredient;
    mappings[selectedIngredient] = productId;
    this.setState({ mappings });

    server.post("choose", {
      ingredient: this.props.selectedIngredient,
      product: productId
    });
    this.forceUpdate();
  }

  componentDidMount() {
    this.setState({ mount: true });
  }

  searchIngredient(event) {
    if (event.keyCode === 13) {
      this.props.searchIngredient(
        event.target.value,
        this.props.fullSelectedIngredient
      );
    }
  }

  render() {
    const selectedIngredient = this.props.selectedIngredient || "";
    const fullSelectedIngredient = this.props.fullSelectedIngredient || "";

    const mappings = this.props.mappings;
    return (
      <Grid item xs={6}>
        <div>
          {fullSelectedIngredient.split(" ").map(item => (
            <Button
              key={item}
              variant="contained"
              color="secondary"
              onClick={() =>
                this.props.searchIngredient(item, fullSelectedIngredient)
              }
              style={{
                margin: 2,
                textTransform: "none"
              }}
            >
              {item}
            </Button>
          ))}
          <TextField
            style={{ margin: 2 }}
            defaultValue={selectedIngredient}
            onKeyDown={e => this.searchIngredient(e)}
            variant="outlined"
          />
        </div>

        <GridList cols={3} cellHeight="auto">
          {this.props.products.map((item, i) => (
            <GridListTile key={item.id} xs={4}>
              <Button
                color="primary"
                onClick={() => this.selectProduct(item.id)}
                style={{
                  textTransform: "none",
                  border:
                    (mappings[selectedIngredient] || {}).id === item.id
                      ? "2px solid"
                      : ""
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
    );
  }
}
