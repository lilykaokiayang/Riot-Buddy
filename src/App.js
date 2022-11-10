import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomePage from './pages/WelcomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import MatchmakingPage from './pages/MatchmakingPage';
import SetUpBioPage from './pages/SetUpBioPage';
import SetUpGamesPage from './pages/SetUpGamesPage';
import MyProfilePage from './pages/MyProfilePage';
//import EditProfilePage from './pages/EditProfilePage'

function App() {

  return (
    <Router>
        <h1>Riot Buddy</h1>
        <hr />
        <Routes>
          <Route exact path="/" element={<WelcomePage/>} />

          <Route path="/log-in" element={<LoginPage/>} />

          <Route path="/matchmaking" element={<MatchmakingPage/>} />

          <Route path="/sign-up" element={<SignUpPage/>} />
          <Route path="/setup/bio" element={<SetUpBioPage/>} />
          <Route path="/setup/games" element={<SetUpGamesPage/>} />

          <Route path="/profile" element={<MyProfilePage/>}  />
          {/*<Route path="/profile/edit" element={<EditProfilePage/>} />*/}

        </Routes>
    </Router>
  );
}

export default App;
