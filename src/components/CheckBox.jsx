import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components';

const RiotStyleLabel = styled.label`
    display: block;
    color: #000;
    margin: 5px 5px;
`

const CheckBox = props => {
  return (
    <>
      
      <RiotStyleLabel htmlFor={props.Id}>
        <input type="checkbox" onChange={props.Action} value={props.Value}/>
        {props.DisplayText}
      </RiotStyleLabel>
    </>
  )
}

CheckBox.propTypes = {
  DisplayText: PropTypes.string,
  Action: PropTypes.func,
  Value: PropTypes.bool,
}

export default CheckBox
