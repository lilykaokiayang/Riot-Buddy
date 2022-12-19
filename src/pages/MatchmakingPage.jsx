import {useEffect, useState} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ProfileView from '../components/ProfileView'
import CircularButton from '../components/CircularButton'
import NavBar from '../components/NavBar'


const MatchmakingPage = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [profile, setProfile] = useState({})

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
      <NavBar/>

      {profile.photo_url !== undefined
        ? <ProfileView Username={profile.name} Pronouns={profile.pronouns} Age={profile.age} Bio={profile.bio} Competitiveness={profile.competitiveness} PfpURL={profile.photo_url}/>
        : <ProfileView Username={profile.name} Pronouns={profile.pronouns} Age={profile.age} Bio={profile.bio} Competitiveness={profile.competitiveness}/>}

      <center>
        <CircularButton Text={"✖"} Action={DeclineButtonAction}/>
        <CircularButton Text={"♥"} Action={AcceptButtonAction}/>
      </center>

    </>
  )
}

export default MatchmakingPage
