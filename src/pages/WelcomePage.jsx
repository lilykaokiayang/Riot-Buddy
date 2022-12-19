import React from 'react';
import Button from '../components/Button';
import { useNavigate } from "react-router-dom";

const WelcomePage = () => {
  const navigate = useNavigate();

  const LoginAction = async () => {
    // checks if the user is already logged in or not
    const res = await fetch('/api/v1/whoami')
    const data = await res.json()
    if (data.username) {
      // if server responded with a username, skip login
      navigate('/matchmaking')
    } else {
      // otherwise, they dont have a valid session and need to be logged in
      navigate('/log-in')
    }
  }

  const SignUpAction = () => {
    navigate('/sign-up');
  }

  return (
    <>
      <h1>Start meeting new people today to play games with online!</h1>
      <Button Text="LOG IN" Action={LoginAction}/>
      <Button Text="SIGN UP" Action={SignUpAction}/>
    </>
  )
}

export default WelcomePage
