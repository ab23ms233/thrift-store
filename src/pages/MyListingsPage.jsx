import ProductGrid from "../components/ProductGrid.jsx"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext.jsx"

function MyListings({ products }) {
    const navigate = useNavigate()
    const { user } = useAuth()

    const myProducts = products.filter(product => (
        product.owner_id === user.id
    ))

    return (
        <ProductGrid
            products={myProducts}
            onProductSelect={
                (product) => 
                    navigate(
                        `/products/${product.id}`, {
                            state: { from: "/my-listings"}
                        }
                    )
                }
        />
    )
}

export default MyListings