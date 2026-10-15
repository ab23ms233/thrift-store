import CategorySection from "../components/category/CategorySection.jsx"
import ProductGrid from "../components/product/ProductGrid.jsx"
import SearchBar from "../components/common/SearchBar.jsx"
import SellButton from "../components/button/SellButton.jsx"

import { useState } from "react"
import { useNavigate } from "react-router-dom"

function HomePage({ products }) {
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("All")

	const visibleProducts = products.filter(product => {
		const matchesCategory =
			selectedCategory === "All" ||
			product.category?.name === selectedCategory
		
		const query = searchQuery.trim().toLowerCase()
		const matchesSearch =
			!query ||
			product.title.toLowerCase().includes(query) ||
			product.description.toLowerCase().includes(query)
		
		return matchesCategory && matchesSearch
	})

    return (
        <section className="section" id="home-page">
            <SearchBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
            />

            <CategorySection
                products={products}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
            />

            <ProductGrid
                products={visibleProducts}
                onProductSelect={
                    product => 
                        navigate(
                            `/products/${product.id}`, {
                                state: { from: "/"}
                            }
                        )
                    }
            />

            <SellButton />
        </section>
    )
}

export default HomePage