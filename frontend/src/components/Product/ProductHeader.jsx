import { TbArrowRight } from "react-icons/tb"

const ProductHeader = ({ product }) => {
    return (
        <div className="flex items-center flex-wrap gap-x-2 medium-16 my-4">
            <span>Home</span> <TbArrowRight /> <span>Shop</span> <TbArrowRight /> <span className="capitalize">{product.category}</span> <TbArrowRight /> <span>{product.name}</span>
        </div>
    )
}

export default ProductHeader