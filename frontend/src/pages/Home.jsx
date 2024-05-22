import Hero from "../components/Home/Hero"
import Offer from "../components/Home/Offer"
import Popular from "../components/Home/Popular"
import NewCollections from "../components/Home/NewCollections"
import Newsletter from "../components/Home/Newsletter"

const Home = () => {
  return (
    <main className="bg-primary text-tertiary">
      <Hero />
      <Popular />
      <Offer />
      <NewCollections />
      <Newsletter />
    </main>
  )
}

export default Home