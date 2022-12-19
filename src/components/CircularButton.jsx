import React from 'react'
import PropTypes from 'prop-types'
import { CircularRiotStyleButton } from '../style/RiotStyle';


const CircularButton = props => {
  return (
    <CircularRiotStyleButton onClick={props.Action}>{props.Text}</CircularRiotStyleButton>
  )
}

CircularButton.propTypes = {
  Text: PropTypes.string,
  Action: PropTypes.func
}

export default CircularButton
