import { useLocation, useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import "./ProductPage.css"

export function ProductRoute({ 
    products, 
    currentUser, 
    onDelete, 
    onProductSold 
}) {
    const {productId} = useParams()
    const product = products.find(
        product => productId === String(product.id)
    )

    return product
    ? <ProductPage
        product={product}
        currentUser={currentUser}
        onDelete={onDelete}
        onProductSold={onProductSold} />
    : <p>Product not found.</p>
}

function ProductPage({ 
    product,
    currentUser,
    onDelete,
    onProductSold
}) {
    const location = useLocation()
    const navigate = useNavigate()

    const from = location.state?.from || "/"
    const isOwner = currentUser.id === product.ownerId

    function handleDelete() {
        const confirm = window.confirm(
            "Are you sure you want to delete this product?"
        )

        if (!confirm) {
            return
        }

        onDelete(product)
        navigate(from)
    }

    function handleSold() {
        onProductSold(product)
        navigate(from)
    }

    return (
        <div className="product-page">
            <div className="product-page-img">
                <img
                    src={product.image}
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
                    <p>Posted On: {new Date(product.postedOn).toLocaleDateString()}</p>
                    <p>Owner: {product.owner}</p>
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