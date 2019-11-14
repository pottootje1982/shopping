import React from "react"
import styled from "styled-components"
import Button from "@material-ui/core/Button"

export default styled(({ ...otherProps }) => (
  <Button
    variant="contained"
    color="secondary"
    {...otherProps}
    style={{ marginRight: 5, textTransform: "none" }}
  />
))``
