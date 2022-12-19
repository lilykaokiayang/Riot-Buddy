import { BrowserRouter as Router, Routes, Route} from "react-router-dom";

import WelcomePage from './pages/WelcomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import MatchmakingPage from './pages/MatchmakingPage';
import SetUpBioPage from './pages/SetUpBioPage';
import SetUpGamesPage from './pages/SetUpGamesPage';
import MyProfilePage from './pages/MyProfilePage';
import EditProfilePage from './pages/EditProfilePage'
import ChatPage from './pages/ChatPage'

import styled from "styled-components";

import left from './images/decorator-left.png';
import right from './images/decorator-right.png';
import hr from './images/decorator-hr.png';

const Logo = styled.h1`
  font-family: "Beaufort";
  font-size: 5vh;
  text-align: center;
`

const Dec = styled.img`
  padding-left: 10px;
  padding-right: 10px;
  height: 2vh;
`

const Hr = styled.img`
  width: 100vw;
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 50%;
`

const LogoLink = styled.a`
  color: inherit;
  text-decoration: none;
`

function App() {

  return (
    <Router>
      <Logo>
        <Dec src={left} alt='left decorator'/>
        <LogoLink href='/'> RIOT BUDDY</LogoLink>
        <Dec src={right} alt='right decorator'/>
      </Logo>
        <Hr src={hr} alt='hr'/>
        <Routes>
          <Route exact path="/" element={<WelcomePage/>} />

          <Route exact path="/log-in" element={<LoginPage/>} />

          <Route exact path="/matchmaking" element={<MatchmakingPage/>} />

          <Route exact path="/sign-up" element={<SignUpPage/>} />
          <Route exact path="/setup/bio" element={<SetUpBioPage/>} />
          <Route exact path="/setup/games" element={<SetUpGamesPage/>} />

          <Route exact path="/profile" element={<MyProfilePage/>}  />
          <Route exact path="/profile/edit" element={<EditProfilePage/>} />

          <Route exact path="/chat" element={<ChatPage/>} />

        </Routes>
    </Router>
  );
}

export default App;
