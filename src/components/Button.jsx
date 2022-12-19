import React from 'react'
import PropTypes from 'prop-types'
import { RiotStyleButton } from '../style/RiotStyle';


const Button = props => {
  return (
    <RiotStyleButton onClick={props.Action}>{props.Text}</RiotStyleButton>
  )
}

Button.propTypes = {
  Text: PropTypes.string,
  Action: PropTypes.func
}

export default Button
