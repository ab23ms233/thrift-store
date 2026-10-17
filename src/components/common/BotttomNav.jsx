import { Link, useLocation } from "react-router-dom"
import "./BottomNav.css"

const routes = [
    {
        label: "Home",
        path: "/",
        icon: (
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M4 10.5 12 4l8 6.5V18a2 2 0 0 1-2 2h-3.5v-7h-5v7H6a2 2 0 0 1-2-2v-7.5Z" />
            </svg>
        )
    },
    {
        label: "Sell",
        path: "/sell",
        icon: (
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M12 5v14M5 12h14" />
            </svg>
        )
    },
    {
        label: "My Listings",
        path: "/my-listings",
        icon: (
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M5 7h14M5 12h14M5 17h10" />
            </svg>
        )
    },
    {
        label: "Profile",
        path: "/profile",
        icon: (
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M16.5 18.5A5.5 5.5 0 0 0 12 15a5.5 5.5 0 0 0-4.5 3.5M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
            </svg>
        )
    }
]

function BotttomNav() {
    const location = useLocation()
    const pathname = location.pathname

    function isActive(path) {
        if (path === "/") {
            return pathname === "/" || pathname.startsWith("/products/")
        }

        return pathname === path
    }

    const visibleItems = routes.map((item) => ({
        ...item,
        isActive: isActive(item.path)
    }))

    return (
        <nav className="bottom-nav" aria-label="Bottom navigation">
            <ul className="bottom-nav__list">
                {visibleItems.map((item) => (
                    <li key={item.label} className="bottom-nav__item">
                        <Link
                            to={item.path}
                            className={`bottom-nav__link${item.isActive ? " is-active" : ""}`}
                            aria-current={item.isActive ? "page" : undefined}
                        >
                            <span className="bottom-nav__icon-wrap">
                                <span className="bottom-nav__icon">{item.icon}</span>
                            </span>
                            <span className="bottom-nav__label">{item.label}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    )
}

export default BotttomNav
