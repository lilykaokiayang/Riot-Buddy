import React from 'react';
//import PropTypes from 'prop-types'
//import styled from 'styled-components';
import Button from '../components/Button';
import { useNavigate } from "react-router-dom";


const WelcomePage = () => {
  const navigate = useNavigate();

  const LoginAction = () => {
    navigate('/log-in');
  }

  const SignUpAction = () => {
    navigate('/sign-up');
  }

  return (
    <>
      <p>Start meeting new people today to play games with online!</p>
      <Button Text="LOG IN" Action={LoginAction}/>
      <Button Text="SIGN UP" Action={SignUpAction}/>
    </>
  )
}

export default WelcomePage
