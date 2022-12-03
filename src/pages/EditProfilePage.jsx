import { useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import styled from 'styled-components'
import TextInput from '../components/TextInput'
import Button from '../components/Button'

const InvalidText = styled.div`
  font-size: 1rem;
  color: red;
`

const LabelBlock = styled.label`
  display: block;
`

const SliderBlock = styled.input`
  display: 'block';
`

const EditProfilePage = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const [getError, setError] = useState("")
  const [profile, setProfile] = useState({})
  const [image, setImage] = useState()

  // from stackoverflow: https://stackoverflow.com/a/59147255
  // used to trigger submit function if the enter key is pressed
  // TODO: improve Button component so that this code block is not necessary
  useEffect(() => {
    const listener = event => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        event.preventDefault();
        EditProfileSaveAction();
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  });

  // get the current profile info on page load
  // used to fill in the text input boxes with current info to edit
  useEffect(() => {
    async function getProfile() {
      const res = await fetch('/api/v1/profile')

      const data = await res.json()

      if (data.error) {
        // user needs to log in again, session expired
        navigate('/log-in')
      } else {
        document.getElementById("competitiveness").defaultValue = data.profile.competitiveness
        data.profile.age = String(data.profile.age)
        setProfile(data.profile)
      }
    }
    getProfile()
  }, [location, navigate])

  const EditProfileSaveAction = async () => {

    const formData = new FormData();

    // if image was uploaded
    if (image !== undefined) {
      formData.append("pfp", image.img, image.img.name);

      const photores = await fetch('/api/v1/profile/photo', {
        method: 'PUT',
        body: formData,
      })

      const photodata = await photores.json()

      if (photodata.error) {
        setError(photodata.error)
      }
    }

    const res = await fetch('/api/v1/profile', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        name: document.getElementById('Name').value,
        pronouns: document.getElementById('Pronouns').value,
        bio: document.getElementById('Bio').value,
        age: parseInt(document.getElementById('Age').value),
        competitiveness: document.getElementById('competitiveness').value,}
    )})

    const data = await res.json()

    if (data.error === "account already has a profile associated with it") {
      // edge case where user hits back button or refresh
      navigate('/setup/games')
    } else if (data.error) {
      setError(data.error)
    } else {
      // if no errors, allow user to continue to next page
      navigate('/profile')
    }
  }

  const onFileChange = (event) => {
    setImage({ img: event.target.files[0] });
  };

  return (
    <>
      <h3>Edit your profile!</h3>
      <TextInput LabelText="Enter your name:" PlaceholderText="Name" Id="Name" Value={profile.name}/>
      <TextInput LabelText="Enter your pronouns:" PlaceholderText="pronouns" Id="Pronouns" Value={profile.pronouns}/>
      <TextInput LabelText="Choose a good bio:" PlaceholderText="Bio" Id="Bio" Value={profile.bio}/>
      <TextInput LabelText="Enter your age:" PlaceholderText="Age" Id="Age" Value={profile.age}/>

      <LabelBlock htmlFor="pfp">Upload a profile picture:</LabelBlock>
      <input type="file" id="pfp" name="pfp" accept="image/*" onChange={onFileChange}></input>

      <LabelBlock htmlFor="competitiveness">How competitive are you?</LabelBlock>
      <SliderBlock type="range" min="1" max="10" id="competitiveness"/>

      {/* this element only shows if getError has an error */}
      { getError && <InvalidText>{getError}</InvalidText>}
      <Button Text="SAVE" Action={EditProfileSaveAction}/>
    </>
  )
}

export default EditProfilePage
