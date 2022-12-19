import React from 'react'
import PropTypes from 'prop-types'
import { Input } from '../style/RiotStyle';


const TextInput = props => {
  return (
    <>
      <Input size='50' type={props.Type} id={props.Id} placeholder={props.PlaceholderText} defaultValue={props.Value}/>
    </>
  )
}

TextInput.propTypes = {
  //LabelText: PropTypes.string,
  PlaceholderText: PropTypes.string,
  Id: PropTypes.string,
  Value: PropTypes.string,
  Type: PropTypes.string,
}

TextInput.defaultProps = {
  Type: "text",
  Value: ""
}

export default TextInput
