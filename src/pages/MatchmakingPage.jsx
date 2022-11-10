import {useEffect, useState} from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import ProfileView from '../components/ProfileView'
//import PropTypes from 'prop-types'
import CircularButton from '../components/CircularButton'

const MatchmakingPage = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [profile, setProfile] = useState({})

  const linkStyle = {
    padding: 5 +'px',
    float: 'right',
  }

  const handleLogout = async () => {
    console.log('Link clicked');

    const res = await fetch('/api/v1/logout')

    const data = await res.json()

    if (data.error) {
      console.log('error logging out', data.error)
    } else {
      navigate('/log-in')
    }
  };

  useEffect(() => {
    async function getProfile() {
      const res = await fetch('/api/v1/profile/7')

      const data = await res.json()

      if (data.error) {
        navigate('/log-in')
      } else {
        // do if no error
        setProfile(data.profile)
      }
    }
    getProfile()
  }, [location, navigate])

  return (
    <>
      <Link style={linkStyle} onClick={handleLogout}>Log out</Link>
      <Link style={linkStyle} to='/profile'>Profile</Link> 
      <Link style={linkStyle} to='/messaging'>Messaging</Link>
      <Link style={linkStyle} to='/matchmaking'>Matchmaking</Link> 

      <ProfileView 
        Username={profile.name} 
        Pronouns={profile.pronouns}
        Age={profile.age}
        Bio={profile.bio}/>

      <center>
        <CircularButton Text={"✖"}/>
        <CircularButton Text={"♥"}/>
      </center>

    </>
  )
}

//MatchmakingPage.propTypes = {}

export default MatchmakingPage