import { useState } from "react";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"
import { Bar, BarItem } from "../style/RiotStyle";

const NavBar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [loc, setLoc] = useState()

  const handleLogout = async () => {
    const res = await fetch('/api/v1/logout')
    const data = await res.json()

    if (data.error) {
      console.log('error logging out', data.error)
    } else {
      navigate('/')
    }
  };

  useEffect(() => {
    setLoc(location.pathname.substring(1))
  }, [loc, location])

  return (
    <Bar>
      <BarItem to='/matchmaking' className={loc}>Matchmaking</BarItem>
      <BarItem to='/profile' className={loc}>My Profile</BarItem>
      <BarItem to='/chat' className={loc}>Chat</BarItem>
      <BarItem onClick={handleLogout} >Log out</BarItem>
    </Bar>
  )
}

export default NavBar
