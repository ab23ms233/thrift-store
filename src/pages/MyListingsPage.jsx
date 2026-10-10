import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext.jsx"
import "./MyListings.css"

import ProductGrid from "../components/ProductGrid.jsx"

function MyListings({ products }) {
    const navigate = useNavigate()
    const { user } = useAuth()

    const activeUserId = user?.id
    const myProducts = products.filter(product => (
        product.owner_id === activeUserId || product.ownerId === activeUserId
    ))

    const availableCount = myProducts.filter(product => (
        String(product.status ?? "AVAILABLE").toUpperCase() !== "SOLD"
    )).length
    const soldCount = myProducts.length - availableCount

    return (
        <section className="my-listings-page">
            <div className="page-description">
                <h3 className="page-header">
                    My Listings
                </h3>
                <p className="page-label">
                    Things that you have around the campus.
                </p>
            </div>

            <p className="my-listings-summary">
                {myProducts.length} listing{myProducts.length === 1 ? "" : "s"} · {availableCount} available · {soldCount} sold
            </p>

            <ProductGrid
                products={myProducts}
                onProductSelect={(product) => navigate(`/products/${product.id}`)}
            />

            <p className="my-listings-footer">
                Meet on campus. Give it a new home.
            </p>
        </section>
    )
}

export default MyListings