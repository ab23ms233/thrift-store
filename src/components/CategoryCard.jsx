import "./CategoryCard.css"

function CategoryCard({category, isSelected, onSelect}) {
    return (
        <button
            type="button"
            className={
                `category-card
                ${isSelected
                ? "is-active"
                : ""}`
            }
            aria-pressed={isSelected}
            onClick={() => onSelect(category.name)}>
                <img className="category-icon" src={category.iconUrl} alt={category.name} />
                <p className="category-name">{category.name}</p>
            </button>
    )
}

export default CategoryCard