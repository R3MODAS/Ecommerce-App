import { CgMouse } from "react-icons/cg"
import ProductCard from "./ProductCard"
import "./Home.css"
import MetaData from "../layout/MetaData"

const product = {
  name: "Blue TShirt",
  images: "",
  price: "Rs3000",
  _id: "randomId"
}

const Home = () => {
  return (
    <>
      <MetaData title="ECOMMERCE" />
      <div className="banner">
        <p>Welcome to Ecommerce</p>
        <h1>FIND AMAZING PRODUCTS BELOW</h1>

        <a href="#container">
          <button>
            Scroll <CgMouse />
          </button>
        </a>
      </div>

      <h2 className="homeHeading">Featured Products</h2>

      <div className="container" id="container">
        <ProductCard product={product} />
      </div>
    </>
  )
}

export default Home