import { useState, useEffect } from 'react'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import { useNavigate } from 'react-router-dom'
import { InvalidText } from '../style/RiotStyle'

const LoginPage = () => {
  const navigate = useNavigate();
  const [isInvalid, setIsInvalid] = useState(false)

  // from stackoverflow: https://stackoverflow.com/a/59147255
  // used to trigger submit function if the enter key is pressed
  // TODO: improve Button component so that this code block is not necessary
  useEffect(() => {
    const listener = event => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        event.preventDefault();
        SubmitLoginAction();
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  });

  const SubmitLoginAction = async () => {

    // makes POST request to /api/v1/login with JSON from entered username & password
    const res = await fetch('/api/v1/login', {
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ 
        username: document.getElementById('username').value, 
        password: document.getElementById('password').value}
    )})
    
    // read /api/v1/login request response
    const data = await res.json()

    // if error = "", then their login was correct
    // if error is anything else, then their login was incorrect
    if (data.error) {
      // clears password field
      document.getElementById('password').value = ""

      // triggers state update to show red invalid text
      setIsInvalid(true)
    } else {
      // if username & password is correct, continue to main matchmaking page
      // cookie will be set
      navigate('/matchmaking')
    }
  }

  return (
    <>
      <h1>Welcome Back!</h1>

      <TextInput LabelText="Enter Username" PlaceholderText="Username" Id="username" />
      <TextInput LabelText="Enter Password" PlaceholderText="Password" Id="password" Type="password"/>

      {/* this element only shows if isInvalid is true (by default its false) */}
      { isInvalid && <InvalidText>Username or password invalid. Please try again.</InvalidText>}
        
      <Button Text="LOG IN" Action={SubmitLoginAction}/>
    </>
  )
}

export default LoginPage
