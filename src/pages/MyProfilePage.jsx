import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import NavBar from '../components/NavBar'
import ProfileView from '../components/ProfileView'

const MyProfilePage = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const [profile, setProfile] = useState({})

  useEffect(() => {
    async function getProfile() {
      const res = await fetch('/api/v1/profile')

      const data = await res.json()

      if (data.error === "profile not set up") {
        // in case user has set up account but not a profile
        navigate('/setup/bio')
      } else if (data.error) {
        // user needs to log in again, session expired
        navigate('/log-in')
      } else {
        setProfile(data.profile)
      }
    }
    getProfile()
  }, [location, navigate])

  const EditProfileButtonAction = () => {
    navigate('/profile/edit')
  }

  return (
    <>
      <NavBar/>
      <Button Text="Edit" Action={EditProfileButtonAction}/>
      <ProfileView
        Username={profile.name}
        Pronouns={profile.pronouns}
        Age={profile.age}
        Bio={profile.bio}
        Competitiveness={profile.competitiveness}
        PfpURL={profile.photo_url}/>
    </>
  )
}

export default MyProfilePage
