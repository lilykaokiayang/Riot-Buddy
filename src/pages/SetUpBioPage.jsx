import { useState, useEffect } from 'react'
import styled from 'styled-components'
import TextInput from '../components/TextInput'
import Button from '../components/Button'
import { useNavigate } from 'react-router-dom'

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

const SetUpBioPage = () => {
  const navigate = useNavigate()
  const [getError, setError] = useState("")
  const [image, setImage] = useState()

  // from stackoverflow: https://stackoverflow.com/a/59147255
  // used to trigger submit function if the enter key is pressed
  // TODO: improve Button component so that this code block is not necessary
  useEffect(() => {
    const listener = event => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        event.preventDefault();
        SetUpBioContinueAction();
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  });

  const SetUpBioContinueAction = async () => {


    const res = await fetch('/api/v1/profile', {
      method: 'POST',
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
      const formData = new FormData();

      if (image !== undefined) {
        formData.append("pfp", image.img, image.img.name);

        const photores = await fetch('/api/v1/profile/photo', {
          method: 'PUT',
          body: formData,
        })

        const photodata = await photores.json()

        if (photodata.error) {
          setError(photodata.error)
        } else {
          navigate('/setup/games')
        }
      }
    }
  }

  const onFileChange = (event) => {
    setImage({ img: event.target.files[0] });
  };

  return (
    <>
      <h3>Set up your profile!</h3>
      <TextInput LabelText="Enter your name:" PlaceholderText="Name" Id="Name"/>
      <TextInput LabelText="Enter your pronouns:" PlaceholderText="pronouns" Id="Pronouns"/>
      <TextInput LabelText="Choose a good bio:" PlaceholderText="Bio" Id="Bio"/>
      <TextInput LabelText="Enter your age:" PlaceholderText="Age" Id="Age"/>

      <LabelBlock htmlFor="pfp">Upload a profile picture:</LabelBlock>
      <input type="file" id="pfp" name="pfp" accept="image/*" onChange={onFileChange}></input>

      <LabelBlock htmlFor="competitiveness">How competitive are you?</LabelBlock>
      <SliderBlock type="range" min="1" max="10" id="competitiveness" />

      {/* this element only shows if getError has an error */}
      { getError && <InvalidText>{getError}</InvalidText>}
      <Button Text="CONTINUE" Action={SetUpBioContinueAction}/>
    </>
  )
}

export default SetUpBioPage
