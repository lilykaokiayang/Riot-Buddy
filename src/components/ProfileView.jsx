import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Profile = styled.div`
  border: 2px solid black;
  margin: 15px 25vw 0px 25vw;
  max-height: 80%;
  float: center;
  border-radius: 5px;
  position: relative;
  border-color: #C8AA6E;
  background-color: #5B5A56;
`

const Username = styled.div`
  margin: 10px;
  font-size: 2em;
`;

const AgeGender = styled.div`
  font-size: 1.5em;
  position:absolute;
  right:10px;
  top: 10px;
`;

const Pfp = styled.img`
  width: 90%;
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-top: 10px;
  margin-bottom: 10px;
  max-height: 750px;
  max-width: 500px;
`

const Bio = styled.p`
  font-size: 1em;
  margin: 5px;
`

const Ranks = styled.div`
  font-size: 1em;
  margin: 5px;
`

const ProfileView = props => {

  return (
    <>
      <Profile>
          <Username>{props.Username}</Username>
          <AgeGender>{props.Age}</AgeGender>
          <hr/>

          <Pfp src={props.PfpURL} alt="pfp"/>
          <hr/>

          <p>{props.Pronouns}</p>
          <Bio>{props.Bio}</Bio>
          <hr/>

          <Ranks>
            <ul>
              <li>Competitiveness Rating: {props.Competitiveness}</li>
            </ul>
          </Ranks>
      </Profile>
    </>
  )
}

ProfileView.propTypes = {
  Username: PropTypes.string,
  Pronouns: PropTypes.string,
  Age: PropTypes.number,
  Bio: PropTypes.string,
  PfpURL: PropTypes.string,
  Competitiveness: PropTypes.number
}

ProfileView.defaultProps = {
  // this is a placeholder image for the profile picture
  PfpURL: "https://as2.ftcdn.net/v2/jpg/01/18/03/35/1000_F_118033506_uMrhnrjBWBxVE9sYGTgBht8S5liVnIeY.jpg"
}

export default ProfileView
