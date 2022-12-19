import React from 'react'
import PropTypes from 'prop-types'
import { Label } from '../style/RiotStyle';

const CheckBox = props => {
  return (
    <>
      <Label htmlFor={props.Id}>
        <input type="checkbox" onChange={props.Action} value={props.Value}/>
        {props.DisplayText}
      </Label>
    </>
  )
}

CheckBox.propTypes = {
  DisplayText: PropTypes.string,
  Action: PropTypes.func,
  Value: PropTypes.bool,
}

export default CheckBox
