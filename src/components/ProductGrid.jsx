import ProductCard from "./ProductCard.jsx";

function ProductGrid({products, onProductSelect}) {
    return (
        <div className="product-grid">
            {products.map(product => (
                <ProductCard
                    key={product.id}
                    title={product.title}
                    price={product.price}
                    description={product.description}
                    image={product.image}
                    onClick={() => onProductSelect(product)}
                />
            ))}
        </div>
    )
}

export default ProductGrid