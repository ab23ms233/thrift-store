import "./SearchBar.css"

function SearchBar({ searchQuery, onSearchChange }) {
    return (
        <section className="search-section">
            <input
                type="search"
                className="nav-search"
                aria-label="Search products"
                placeholder="What are you looking for?"
                value={searchQuery}
                onChange={event => onSearchChange(event.target.value)}
            />
        </section>
    )
}

export default SearchBar