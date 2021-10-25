import React from 'react'
import { Checkbox } from '@material-ui/core'
import PropTypes from 'prop-types'

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

IndeterminateCheckbox.propTypes = {
  indeterminate: PropTypes.bool.isRequired
}

export default IndeterminateCheckbox
