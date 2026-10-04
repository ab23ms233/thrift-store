import CategoryCard from "../components/CategoryCard.jsx"
import "../components/CategoryCard.css"

import ProductGrid from "../components/ProductGrid.jsx"

import { useState } from "react"
import { useNavigate } from "react-router-dom"

function HomePage({ products, searchQuery }) {
    const navigate = useNavigate()
    const [selectedCategory, setSelectedCategory] = useState("All")

	const visibleProducts = products.filter(product => {
		const matchesCategory =
			selectedCategory === "All" ||
			product.category === selectedCategory
		
		const query = searchQuery.trim().toLowerCase()
		const matchesSearch =
			!query ||
			product.title.includes(query) ||
			product.description.includes(query)
		
		return matchesCategory && matchesSearch
	})

	const categories = [
		"All",
		...new Set(products.map(product => product.category))
	]

    return (
        <>
            <div className="category-list">
                {categories.map(category => (
                    <CategoryCard
                        key={category}
                        category={category}
                        isSelected={selectedCategory === category}
                        onSelect={setSelectedCategory}
                    />
                ))}
            </div>

            <ProductGrid
                products={visibleProducts}
                onProductSelect={product => navigate(`/products/${product.id}`)}
            />
        </>
    )
}

export default HomePage