import CheckBox from '../components/CheckBox'
import TextInput from '../components/TextInput'
import Button from '../components/Button';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SetUpGamesPage = () => {
  const navigate = useNavigate()

  const [showVal, setValCheck] = useState(false);
  const [showLol, setLolCheck] = useState(false);
  const [showTft, setTftCheck] = useState(false);
  const [showLor, setLorCheck] = useState(false);

  const handleValChange = () => {
    setValCheck(current => !current);
  };
  const handleLolChange = () => {
    setLolCheck(current => !current);
  };
  const handleTftChange = () => {
    setTftCheck(current => !current);
  };
  const handleLorChange = () => {
    setLorCheck(current => !current);
  };

  const SetUpGameContinueAction = () => {
    navigate("/matchmaking")
  }

  return (
    <>
      <h1>Enter your Riot Username and pick the games you play.</h1>

      {/* <label htmlFor='region'>
        Select your region
        <select name='region' id='region'>
          <option value="NA">North America</option>
          <option value="EUW">European West</option>
          <option value="AU">Australia</option>
          <option value="KR">Korea</option>
        </select>
      </label> */}

      <TextInput Id="ValUser" LabelText="Valorant Username" PlaceholderText="name#123"/>

      <CheckBox DisplayText='VALORANT' Value={showVal} Action={handleValChange}/>

      <CheckBox DisplayText='League of Legends' Value={showLol} Action={handleLolChange}/>

      <CheckBox DisplayText='Teamfight Tactics' Value={showTft} Action={handleTftChange}/>

      <CheckBox DisplayText='Legends of Runeterra' Value={showLor} Action={handleLorChange}/>


      <Button Text="CONTINUE" Action={SetUpGameContinueAction}/>
    </>
  )
}

export default SetUpGamesPage
