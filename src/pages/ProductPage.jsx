import { useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import "./ProductPage.css"

export function ProductRoute({ products, currentUser }) {
    const {productId} = useParams()
    const product = products.find(
        product => productId === String(product.id)
    )

    return product
    ? <ProductPage
        product={product}
        currentUser={currentUser} />
    : <p>Product not found.</p>
}

function ProductPage({ 
    product,
    currentUser
}) {
    const navigate = useNavigate() 
    const isOwner = currentUser.id === product.ownerId

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
                    <p>Posted On: {product.postedOn}</p>
                    <p>Owner: {product.owner}</p>
                </div>

                {isOwner
                ?
                <>
                    <button type="button">Edit</button>
                    <button type="button">Delete</button>
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