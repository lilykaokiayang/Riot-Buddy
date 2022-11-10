import { useNavigate, Link } from 'react-router-dom'

export const Logout = () => {
  const navigate = useNavigate()
  
  const linkStyle = {
    padding: 5 +'px',
    float: 'right',
  }

  const handleLogout = async () => {
    const res = await fetch('/api/v1/logout')
    const data = await res.json()
    
    if (data.error) {
      console.log('error logging out', data.error)
    } else {
      navigate('/')
    }
  };

  return (
    <Link style={linkStyle} onClick={handleLogout}>Log out</Link>
  )
}

export default Logout