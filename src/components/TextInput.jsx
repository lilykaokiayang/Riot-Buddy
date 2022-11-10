import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components';

const RiotStyleLabel = styled.label`
    display: block;
    color: #000;
`

const TextInput = props => {

  const getInputType = () => {
    if (props.PlaceholderText === "Password") {
      return "password"
    }
    return "text"
  }

  return (
    <>
      <RiotStyleLabel htmlFor={props.Id}>
       {props.LabelText}
        <input type={getInputType()} id={props.Id} placeholder={props.PlaceholderText} defaultValue={props.Value}/>
      </RiotStyleLabel>
    </>
  )
}

TextInput.propTypes = {
  LabelText: PropTypes.string,
  PlaceholderText: PropTypes.string,
  Id: PropTypes.string,
  Value: PropTypes.string
}

TextInput.defaultProps = {
  Value: ""
}

export default TextInput
