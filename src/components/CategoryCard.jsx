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
            onClick={() => onSelect(category)}>
                {category}
            </button>
    )
}

export default CategoryCard