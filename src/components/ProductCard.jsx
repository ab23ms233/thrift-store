import { formatTime } from "../utils/formatTime"
import "./ProductCard.css"

function ProductCard({ product, onClick }) {
    const isSold = product.status === "SOLD"

    return (
        <div className={`product-card${isSold ? " sold" : ""}`} onClick={onClick}>
            <img src={product.image_url} alt={product.title} className="product-img" />

            <div className="product-info">
                <h1 className="product-price">
                    ₹{product.price}
                </h1>

                <h2 className="product-title">{product.title}</h2>

                <p className="product-desc">
                    {product.description}
                </p>
                <p className="product-time">
                    {formatTime(product.created_at)}
                </p>

                {
                    isSold && (
                        <span className="sold-label">Sold</span>
                    )
                }
            </div>
        </div>
    )
}

export default ProductCard