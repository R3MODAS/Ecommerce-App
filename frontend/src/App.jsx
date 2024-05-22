import { Outlet } from "react-router-dom"
import Header from "./components/Common/Header"
import Footer from "./components/Common/Footer"
import ScrollToTop from "./utils/ScrollToTop"

function App() {
  return (
    <main className="bg-primary text-tertiary">
      <Header />
      <Outlet />
      <Footer />
      <ScrollToTop />
    </main>
  )
}

export default App
