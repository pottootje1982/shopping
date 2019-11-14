import React from "react"
import styled from "styled-components"
import Fab from "@material-ui/core/Fab"

export default styled(({ ...otherProps }) => (
  <Fab
    color="secondary"
    size="small"
    {...otherProps}
    style={{ marginRight: 5, width: 35, height: 35 }}
  />
))``
