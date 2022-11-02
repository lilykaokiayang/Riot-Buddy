import React from 'react'
import { Link } from 'react-router-dom'
import ProfileView from '../components/ProfileView'
//import PropTypes from 'prop-types'
import CircularButton from '../components/CircularButton'

const MatchmakingPage = () => {
  const linkStyle = {
    padding: 5 +'px',
    float: 'right',
  }

  return (
    <>
      <Link style={linkStyle} to='/setup/bio'>Profile</Link> 
      <Link style={linkStyle} to='/messaging'>Messaging</Link>
      <Link style={linkStyle} to='/matchmaking'>Matchmaking</Link> 

      <ProfileView 
      ProfileUsername={"y4ngst3r"} 
      ProfileAgeGender={"18F"}
      ProfileBio={"this is where the bio goes..."}
      ProfilePfpURL={"../images/example_pfp.jpg"}/>

      <center>
      <CircularButton Text={"✖"}/>
      <CircularButton Text={"♥"}/>
      </center>

    </>
  )
}

//MatchmakingPage.propTypes = {}

export default MatchmakingPage