import React from 'react'
//import PropTypes from 'prop-types'
//import styled from 'styled-components';
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import { useNavigate } from 'react-router-dom'


const SignUpPage = () => {
    const navigate = useNavigate();

    const SignUpContinueAction = () => {
      navigate('/setup/bio');
    }

    return (
        <>
            <h3>Sign up now.</h3>
            
            <TextInput LabelText="Enter Email" PlaceholderText="Email" Id="email" />
            <TextInput LabelText="Create Username" PlaceholderText="Username" Id="username" />
            <TextInput LabelText="Create Password" PlaceholderText="Password" Id="password" />

            <Button Text="CONTINUE" Action={SignUpContinueAction}/>
            
        </>
    )
}


export default SignUpPage