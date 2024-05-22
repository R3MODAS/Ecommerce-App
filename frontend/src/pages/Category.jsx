import { MdOutlineKeyboardArrowDown } from "react-icons/md"
import Item from "../components/Home/Item"
import { useContext } from "react"
import { ShopContext } from "../context/ShopContext"

const Category = ({ category, banner }) => {

  const { all_products } = useContext(ShopContext)

  return (
    <section className="max_padd_container py-12 xl:py-28">
      <div>
        <div>
          <img src={banner} alt="bannerImage" />
        </div>
        <div className="flexBetween my-8 mx-2">
          <h3><span className="font-bold">Showing 1-12</span> out of 36 products</h3>
          <button className="flexBetween max-sm:p-4 gap-x-4 px-8 py-3 rounded-5xl ring-1 ring-slate-900/15 cursor-pointer">Sort by <MdOutlineKeyboardArrowDown /></button>
        </div>

        <div className="common-container">
          {all_products.map((item) => {
            if (category === item.category) {
              return <Item key={item.id} {...item} />
            }
          }
          )}
        </div>

        <div className="mt-16 text-center">
          <button className="btn_dark_rounded">Load more</button>
        </div>
      </div>
    </section>
  )
}

export default Category