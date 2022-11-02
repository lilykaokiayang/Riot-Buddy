import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components';

const RiotSyleButton = styled.button`
  font-family: 'Marcellus SC', serif;
  font-size: 15px;
  font-weight: bold;
  letter-spacing: 1px;

  padding: 5px 15px;
  margin: 5px 5px;

  background: #1e2328;
  color: #cdbe91;

  box-shadow: inset 0 0 2px #000000;
  border-image: linear-gradient(to bottom, #c8aa6d, #7a5c29);
  border-image-slice: 1;
  border-width: 2px;

  &:hover {
    text-shadow: 0 0 5px #ffffff80;
    box-shadow: 0 0 8px 0 #ffffff50;
    background: linear-gradient(to bottom, #1e2328, #433d2b);
    cursor: pointer;
    transition: 0.1s;
  }

  &:active {
    text-shadow: none;
    box-shadow: none;
    color: #cdbe9130;
  }
`

const Button = props => {
  return (
    <RiotSyleButton onClick={props.Action}>{props.Text}</RiotSyleButton>
  )
}

Button.propTypes = {
  Text: PropTypes.string,
  Action: PropTypes.func
}

export default Button
