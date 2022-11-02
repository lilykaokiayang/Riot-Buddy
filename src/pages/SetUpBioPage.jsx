import React from 'react'
import TextInput from '../components/TextInput'
import Button from '../components/Button'
import { useNavigate } from 'react-router-dom'

const SetUpBioPage = () => {
  const navigate = useNavigate()

  const SetUpBioContinueAction = () => {
    navigate("/setup/games")
  }

  const sliderStyle = {
    display: 'block',
  }

  return (
    <>
    <h3>Set up your profile!</h3>
    <TextInput LabelText="Enter your name:" PlaceholderText="Name"/>

    <label htmlFor="pfp">Upload a profile picture:</label>
    <input type="file" id="pfp" name="pfp"></input>
    <TextInput LabelText="Choose a good bio:" PlaceholderText="Bio"/>

    <label htmlFor="competitiveness">How competitive are you?</label>
    <input type="range" min="1" max="10" style={sliderStyle} id="competitiveness" />

    <Button Text="CONTINUE" Action={SetUpBioContinueAction}/>
    
    </>
  )
}

export default SetUpBioPage