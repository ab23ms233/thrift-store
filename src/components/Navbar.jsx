import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { supabase } from "../lib/supabase"

function NavBtn({ text, id, onClick }) {
    return <button className="nav-btn" id={id} onClick={onClick}>{text}</button>
}

function Navbar({ searchQuery, onSearchChange }) {
    const navigate = useNavigate()
    const { user } = useAuth()
    const isLoggedIn = Boolean(user)

    function getInitials(user) {
        const name = user?.user_metadata?.full_name?.trim()

        if (name) {
            return name
                .split(/\s+/)
                .slice(0, 2)
                .map(word => word[0].toUpperCase())
                .join("")
        }

        return user?.email?.[0]?.toUpperCase() ?? "?"
    }

    async function handleLogout() {
        const { error } = await supabase.auth.signOut()

        if (error) {
            console.error(`Logout failed for userId ${user.id}: ${error}`)
            return
        }
    }

    return (
        <header className="home-header">
            <div className="upper-portion">
                <div className="brand-row">
                    <Link to="/" className="brand" aria-label="Thrift Store home">
                        <span className="brand-mark">
                            TS
                        </span>
                        <span className="brand-name">
                            Thrift Store
                        </span>
                    </Link>

                    <p className="brand-label">
                        IISER Kolkata · Your campus marketplace
                    </p>
                </div>

                <button className="profile-button">
                    {getInitials(user)}
                </button>
            </div>

            <div className="lower-portion">
                <input
                    type="search"
                    className="nav-search"
                    aria-label="Search products"
                    placeholder="What are you looking for?"
                    value={searchQuery}
                    onChange={event => onSearchChange(event.target.value)}
                />
            </div>

            {/* <h4 className="nav-header">
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
                        <NavBtn
                            text="Log Out"
                            id="logout-btn"
                            onClick={handleLogout}
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
            } */}
        </header>
    )
}

export default Navbar