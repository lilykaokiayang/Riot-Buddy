import { useState, useEffect } from 'react'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import { useNavigate } from 'react-router-dom'
import { InvalidText, Table, Label} from '../style/RiotStyle'


const SignUpPage = () => {
    const navigate = useNavigate();
    const [getError, setError] = useState("")

    // from stackoverflow: https://stackoverflow.com/a/59147255
    // used to trigger submit function if the enter key is pressed
    // TODO: improve Button component so that this code block is not necessary
    useEffect(() => {
        const listener = event => {
        if (event.code === "Enter" || event.code === "NumpadEnter") {
            event.preventDefault();
            SignUpContinueAction();
        }
        };
        document.addEventListener("keydown", listener);
        return () => {
        document.removeEventListener("keydown", listener);
        };
    });

    const SignUpContinueAction = async () => {
      // makes POST request to /api/v1/create-account with JSON from entered email, username & password
      const res = await fetch('/api/v1/create-account', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: document.getElementById('email').value,
            username: document.getElementById('username').value,
            password: document.getElementById('password').value}
      )})

      // read /api/v1/create-account request response
      const data = await res.json()

      // if error = "", then their input was valid
      // if error is anything else, then their input was invalid
      if (data.error) {
        // triggers state update to show red error message
        setError(data.error)
      } else {
        // if input is valid, continue to profile set up page
        // cookie will be set
        navigate('/setup/bio')
      }
    }

    return (
        <>
            <h1>Sign up now.</h1>

            <Table>
              <tr>
                <td><Label htmlFor='email'>Enter email:</Label></td>
                <td><TextInput PlaceholderText="Email" Id="email" /></td>
              </tr>
              <tr>
                <td><Label htmlFor='username'>Choose a username:</Label></td>
                <td><TextInput PlaceholderText="Username" Id="username" /></td>
              </tr>
              <tr>
                <td><Label htmlFor='password'>Choose a password: </Label></td>
                <td><TextInput  PlaceholderText="Password" Id="password" Type="password" /></td>
              </tr>
            </Table>

            {/* this element only shows if getError has an error */}
            { getError && <InvalidText>{getError}</InvalidText>}

            <Button Text="CONTINUE" Action={SignUpContinueAction}/>

        </>
    )
}

export default SignUpPage
