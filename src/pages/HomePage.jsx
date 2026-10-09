import CategorySection from "../components/CategorySection.jsx"
import ProductGrid from "../components/ProductGrid.jsx"
import SearchBar from "../components/SearchBar.jsx"
import SellButton from "../components/SellButton.jsx"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "./HomePage.css"


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
			product.title.includes(query) ||
			product.description.includes(query)
		
		return matchesCategory && matchesSearch
	})

    return (
        <div className="home-page">
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
        </div>
    )
}

export default HomePage