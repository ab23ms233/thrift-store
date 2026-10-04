import ProductCard from "./ProductCard.jsx";

function ProductGrid({products, onProductSelect}) {
    return (
        <div className="product-grid">
            {products.map(product => (
                <ProductCard
                    product={product}
                    onClick={() => onProductSelect(product)}
                />
            ))}
        </div>
    )
}

export default ProductGrid