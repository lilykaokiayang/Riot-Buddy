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
      <h3>Pick the Riot Games you play.</h3>
      
      <label htmlFor='region'>
        Select your region
        <select name='region' id='region'>
          <option value="NA">North America</option>
          <option value="EUW">European West</option>
          <option value="AU">Australia</option>
          <option value="KR">Korea</option>
        </select>
      </label>

      <CheckBox DisplayText='VALORANT' Value={showVal} Action={handleValChange}/>
      {showVal && <TextInput Id="ValUser" LabelText="Valorant Username" PlaceholderText="name#123"/>}

      <CheckBox DisplayText='League of Legends' Value={showLol} Action={handleLolChange}/>
      {showLol && <TextInput Id="LolUser" LabelText="League of Legends Username" PlaceholderText="name"/>}

      <CheckBox DisplayText='Teamfight Tactics' Value={showTft} Action={handleTftChange}/>
      {showTft && <TextInput Id="TftUser" LabelText="Teamfight Tactics Username" PlaceholderText="name"/>}

      <CheckBox DisplayText='Legends of Runeterra' Value={showLor} Action={handleLorChange}/>
      {showLor && <TextInput Id="LorUser" LabelText="Legends of Runeterra Username" PlaceholderText="name"/>}
  
      <Button Text="CONTINUE" Action={SetUpGameContinueAction}/>
    </>
  )
}

export default SetUpGamesPage
