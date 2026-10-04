import "./ProductCard.css"

function ProductCard({
    title,
    description,
    price,
    image,
    onClick
}) {
    return (
        <div className="product-card" onClick={onClick}>
            <img src={image} alt={title} className="product-img" />

            <div className="product-info">
                <h2 className="product-title">{title}</h2>

                <p className="product-price">
                    ₹{price}
                </p>

                <p className="product-desc">
                    {description}
                </p>
            </div>
        </div>
    )
}

export default ProductCard