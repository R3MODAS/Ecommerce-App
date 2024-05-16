import { BrowserRouter as Router, Navigate, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Profile from "./pages/Profile"
import { useSelector } from "react-redux"

const App = () => {
  const mode = useSelector(state => state.mode)

  return (
    <div className='app'>
      <Router>
          <Routes>
            <Route index element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/profile/:userId" element={<Profile />} />
          </Routes>
      </Router>
    </div>
  )
}

export default App