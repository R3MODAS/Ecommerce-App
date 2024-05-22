import { useContext } from "react"
import { ShopContext } from "../context/ShopContext"
import { useParams } from "react-router-dom"
import ProductHeader from "../components/Product/ProductHeader"

const Product = () => {

  const { all_products } = useContext(ShopContext)
  const { productId } = useParams()

  const product = all_products.find(product => product.id === Number(productId))
  if(!product){
    return <div>Product not found!</div>
  }

  return (
    <section>
      <div>
        <ProductHeader product={product} />
      </div>
    </section>
  )
}

export default Product