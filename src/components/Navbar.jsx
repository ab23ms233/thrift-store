import { useNavigate } from "react-router-dom"

function NavBtn({ text, id, onClick }) {
    return <button className="nav-btn" id={id} onClick={onClick}>{text}</button>
}

function Navbar({ searchQuery, onSearchChange, isLoggedIn }) {
    const navigate = useNavigate()

    return (
        <nav className="navbar">
            <h4 className="nav-header">
                Thrift Store
            </h4>

            <input
                type="search"
                className="nav-search"
                aria-label="Search products"
                placeholder="Search products..."
                value={searchQuery}
                onChange={event => onSearchChange(event.target.value)}
            />
            {isLoggedIn
                ? (
                    <div className="nav-btn-cont">
                        <NavBtn
                            text="Sell"
                            id="sell-btn"
                            onClick={() => navigate("/sell")}
                        />
                        <NavBtn
                            text="My Listings"
                            id="my-listings-btn"
                            onClick={() => navigate("/my-listings")}
                        />
                    </div>
                )
                : (
                    <div className="nav-btn-cont">
                        <NavBtn
                            text="Sell"
                            id="sell-btn"
                            onClick={() => navigate("/sell")}
                        />
                        <NavBtn
                            text="Login"
                            id="login-btn"
                            onClick={() => navigate("/login")}
                        />
                        <NavBtn
                            text="Sign Up"
                            id="signup-btn"
                            onClick={() => navigate("/sign-up")}
                        />
                    </div>
                )
            }
        </nav>
    )
}

export default Navbar