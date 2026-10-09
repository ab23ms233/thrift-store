import ProductCard from "./ProductCard.jsx";
import "./ProductGrid.css"

function ProductGrid({ products, onProductSelect }) {
    return (
        <section className="product-section">
            <h3 className="header product-header">
                Products
            </h3>

            <div className="product-grid">
                {products.map(product => (
                    <ProductCard
                        product={product}
                        onClick={() => onProductSelect(product)}
                    />
                ))}
            </div>
        </section>
    )
}

export default ProductGrid