import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Header from "./components/layout/Header/Header"
import Footer from "./components/layout/Footer/Footer"
import Home from "./components/Home/Home"
import WebFont from "webfontloader";
import { useEffect } from "react";

function App() {

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"]
      }
    })
  }, [])


  return (
    <Router>
      <Header />
      <Routes>
        <Route index element={<Home />} />
      </Routes>
      <Footer />
    </Router>
  )
}

export default App
