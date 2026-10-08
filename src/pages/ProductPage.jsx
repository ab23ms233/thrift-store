import { useLocation, useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import "./ProductPage.css"
import { useAuth } from "../context/AuthContext"
import { deleteProduct, markProductAsSold } from "../services/products"

export function ProductRoute({ 
    products, 
    onProductsChanged
}) {
    const {productId} = useParams()
    const product = products.find(
        product => productId === String(product.id)
    )

    return product
    ? <ProductPage
        product={product}
        onProductsChanged={onProductsChanged} />
    : <p>Product not found.</p>
}

function ProductPage({ 
    product,
    onProductsChanged
}) {
    const location = useLocation()
    const navigate = useNavigate()
    const { user } = useAuth()

    const from = location.state?.from || "/"
    const isOwner = user.id === product.owner_id

    async function handleDelete() {
        const confirm = window.confirm(
            "Are you sure you want to delete this product?"
        )

        if (!confirm) {
            return
        }

        await deleteProduct(product.id, user.id)
        await onProductsChanged()
        navigate(from)
    }

    async function handleSold() {
        await markProductAsSold(product.id, user.id)
        await onProductsChanged()
        navigate(from)
    }

    return (
        <div className="product-page">
            <div className="product-page-img">
                <img
                    src={product.image_url}
                    alt={product.title} 
                />
            </div>

            <div className="product-page-details">
                <h1>{product.title}</h1>

                <p className="product-page-price">
                    ₹{product.price}
                </p>

                <p className="product-page-description">
                    {product.description}
                </p>

                <div className="product-page-metadata">
                    <p>Posted On: {new Date(product.created_at).toLocaleDateString()}</p>
                    <p>Owner: {product.owner_name?.full_name}</p>
                    <p>Status: {product.status}</p>
                </div>

                {isOwner
                ?
                <>
                    <button type="button" onClick={() => navigate(`/products/${product.id}/edit`)}>Edit</button>
                    <button type="button" onClick={handleDelete}>Delete</button>
                    <button type="button" onClick={handleSold}>Mark as Sold</button>
                </>
                :
                <>
                    <button type="button">Contact Owner</button>
                </>}
                
                <button type="button" onClick={() => navigate("/")}>Back</button>
            </div>
        </div>
    )
}

export default ProductPage