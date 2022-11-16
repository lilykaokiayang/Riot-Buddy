import {useEffect, useState} from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import ProfileView from '../components/ProfileView'
import CircularButton from '../components/CircularButton'
import Logout from '../components/Logout'

const MatchmakingPage = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [profile, setProfile] = useState({})

  const linkStyle = {
    padding: 5 +'px',
    float: 'right',
  }

  async function getProfile(n) {
    const res = await fetch('/api/v1/profile?' + new URLSearchParams({id: n}))

    const data = await res.json()

    if (data.error) {
      // user is logged out, send them back to login page
      navigate('/log-in')
    } else {
      setProfile(data.profile)
    }
  }

  useEffect(() => {
    getProfile(1)
    //eslint-disable-next-line
  }, [location])

  const DeclineButtonAction = async () => {
    getProfile(profile.id + 1)
  }

  const AcceptButtonAction = async () => {
    getProfile(profile.id + 1)
  }


  return (
    <>
      <Logout/>
      <Link style={linkStyle} to='/profile'>My Profile</Link>
      {/*<Link style={linkStyle} to='/messaging'>Messaging</Link>*/}
      <Link style={linkStyle} to='/matchmaking'>Matchmaking</Link>

      <ProfileView
        Username={profile.name}
        Pronouns={profile.pronouns}
        Age={profile.age}
        Bio={profile.bio}
        Competitiveness={profile.competitiveness}/>

      <center>
        <CircularButton Text={"✖"} Action={DeclineButtonAction}/>
        <CircularButton Text={"♥"} Action={AcceptButtonAction}/>
      </center>

    </>
  )
}

export default MatchmakingPage
