import CategoryCard from "./CategoryCard.jsx"
import allIconUrl from "../assets/category-icons/Group.svg"
import "./CategorySection.css"

function CategorySection({ products, selectedCategory, setSelectedCategory }) {
    const categories = [
		...products.map(product => product.category),
        {
            name: "All",
            iconUrl: allIconUrl
        }
	]

    return (
        <section className="category-section">
            <h3 className="header category-header">
                Categories
            </h3>

            <div className="category-cards-cont">
                {categories.map(category => (
                    <CategoryCard 
                        category={category}
                        isSelected={selectedCategory === category.name}
                        onSelect={setSelectedCategory}
                    />
                ))}
            </div>
        </section>
    )
}

export default CategorySection