import React from 'react'
//import PropTypes from 'prop-types'
//import styled from 'styled-components';
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import { useNavigate } from 'react-router-dom'

const LoginPage = () => {
  const navigate = useNavigate();

  const SubmitLoginAction = () => {
    navigate('/matchmaking');
  }

  return (
    <>
      <h3>Enter your credentials</h3>

      <TextInput LabelText="Enter Username" PlaceholderText="Username" Id="username" />
      <TextInput LabelText="Enter Password" PlaceholderText="Password" Id="password" />
        
      <Button Text="LOG IN" Action={SubmitLoginAction}/>
      
    </>
  )
}

export default LoginPage
