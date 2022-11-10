import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import ProfileView from '../components/ProfileView'
import Logout from '../components/Logout'

const MyProfilePage = () => {
  const location = useLocation()
  const navigate = useNavigate()

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
        // user needs to log in again, session expired
        navigate('/log-in')
      } else {
        setProfile(data.profile)
      }
    }
    getProfile()
  }, [location, navigate])

  return (
    <>
      <Logout/>
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

export default MyProfilePage