import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ProfileView from '../components/ProfileView'
//import PropTypes from 'prop-types'

const MyProfilePage = () => {
  const location = useLocation()

  const [profile, setProfile] = useState({})

  const linkStyle = {
    padding: 5 +'px',
    float: 'right',
  }

  useEffect(() => {
    async function getProfile() {
      const res = await fetch('/api/v1/profile')

      const data = await res.json()

      if (data.error) {
        console.log(data.error)
      } else {
        // do if no error
        setProfile(data.profile)
      }
    }
    getProfile()
  }, [location])

  return (
    <>
      <Link style={linkStyle} to='/profile/edit'>Edit Profile</Link> 
      <Link style={linkStyle} to='/matchmaking'>Matchmaking</Link> 

      <ProfileView 
        Username={profile.name}
        Pronouns={profile.pronouns}
        Age={profile.age}
        Bio={profile.bio}/>
      
    </>
  )
}

//MyProfilePage.propTypes = {}

export default MyProfilePage