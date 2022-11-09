import { useState, useEffect } from 'react'
import styled from 'styled-components';
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import { useNavigate } from 'react-router-dom'

const InvalidText = styled.div`
  font-size: 1rem;
  color: red;
`


const SignUpPage = () => {
    const navigate = useNavigate();
    const [getError, setError] = useState("")

    // from stackoverflow: https://stackoverflow.com/a/59147255
    // used to trigger submit function if the enter key is pressed
    // TODO: improve Button component so that this code block is not necessary
    useEffect(() => {
        const listener = event => {
        if (event.code === "Enter" || event.code === "NumpadEnter") {
            console.log("Enter key was pressed. Run your function.");
            event.preventDefault();
            SignUpContinueAction();
        }
        };
        document.addEventListener("keydown", listener);
        return () => {
        document.removeEventListener("keydown", listener);
        };
    }, []);
        

    const SignUpContinueAction = async () => {
      // makes POST request to /api/v1/login with JSON from entered username & password
    const res = await fetch('/api/v1/create-account', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ 
          email: document.getElementById('email').value, 
          username: document.getElementById('username').value, 
          password: document.getElementById('password').value}
      )})
      
      // read /api/v1/login request response
      const data = await res.json()
  
      // if error = "", then their login was correct
      // if error is anything else, then their login was incorrect
      if (data.error) {
        // triggers state update to show red invalid text
        setError(data.error)
      } else {
        // if username & password is correct, continue to main matchmaking page
        // cookie will be set
        navigate('/setup/bio')
      }
    }

    return (
        <>
            <h3>Sign up now.</h3>
            
            <TextInput LabelText="Enter Email" PlaceholderText="Email" Id="email" />
            <TextInput LabelText="Create Username" PlaceholderText="Username" Id="username" />
            <TextInput LabelText="Create Password" PlaceholderText="Password" Id="password" />

            {/* this element only shows if isInvalid is true (by default its false) */}
            { getError && <InvalidText>{getError}</InvalidText>}
            
            <Button Text="CONTINUE" Action={SignUpContinueAction}/>
            
        </>
    )
}


export default SignUpPage