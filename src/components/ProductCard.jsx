import "./ProductCard.css"

function ProductCard({product, onClick}) {
    return (
        <div className="product-card" onClick={onClick}>
            <img src={product.image} alt={product.title} className="product-img" />

            <div className="product-info">
                <h2 className="product-title">{product.title}</h2>

                <p className="product-price">
                    ₹{product.price}
                </p>

                <p>{product.status}</p>

                <p className="product-desc">
                    {product.description}
                </p>
            </div>
        </div>
    )
}

export default ProductCard