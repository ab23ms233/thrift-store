import { formatTime } from "../utils/formatTime"
import "./ProductCard.css"

function ProductCard({product, onClick}) {
    return (
        <div className="product-card" onClick={onClick}>
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
            </div>
        </div>
    )
}

export default ProductCard