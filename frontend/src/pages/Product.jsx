import { useContext } from "react"
import { ShopContext } from "../context/ShopContext"
import { useParams } from "react-router-dom"
import ProductHeader from "../components/Product/ProductHeader"
import ProductDisplay from "../components/Product/ProductDisplay"
import ProductDescription from "../components/Product/ProductDescription"
import RelatedProducts from "../components/Product/RelatedProducts"

const Product = () => {

  const { all_products } = useContext(ShopContext)
  const { productId } = useParams()

  const product = all_products.find(product => product.id === Number(productId))
  if(!product){
    return <div>Product not found!</div>
  }

  return (
    <section className="max_padd_container py-28">
      <div>
        <ProductHeader product={product} />
        <ProductDisplay product={product} />
        <ProductDescription />
        <RelatedProducts />
      </div>
    </section>
  )
}

export default Product