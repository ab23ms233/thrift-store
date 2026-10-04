import ProductGrid from "../components/ProductGrid.jsx"
import { useNavigate } from "react-router-dom"

function MyListings({ products, currentUser }) {
    const navigate = useNavigate()

    const myProducts = products.filter(product => (
        product.ownerId === currentUser.id
    ))

    return (
        <ProductGrid
            products={myProducts}
            onProductSelect={(product) => navigate(`/products/${product.id}`)}
        />
    )
}

export default MyListings