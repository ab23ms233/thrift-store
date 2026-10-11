import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { supabase } from "../lib/supabase"

import "./Header.css"
import { useEffect, useRef, useState } from "react"

function Header() {
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const { user } = useAuth()
    const navigate = useNavigate()
    const isLoggedIn = Boolean(user)

    const profileMenuRef = useRef()

    useEffect(() => {
        if (!isProfileOpen) return

        function handlePointerDown(event) {
            if (!profileMenuRef.current?.contains(event.target)) {
                setIsProfileOpen(false)
            }
        }

        document.addEventListener("pointerdown", handlePointerDown)

        return () => {
            document.removeEventListener("pointerdown", handlePointerDown)
        }
    }, [isProfileOpen])

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
        <header className="app-header">
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

            {
                isLoggedIn
                    ? (
                        <div className="profile-menu" ref={profileMenuRef}>
                            <button
                                className={`profile-button${isLoggedIn ? "" : " is-logged-out"}`}
                                onClick={() => setIsProfileOpen(open => !open)}
                            >
                                {getInitials(user)}
                            </button>

                            {
                                isProfileOpen && (
                                    <div className="profile-popover">
                                        <div className="user-info">
                                            <svg className="user-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g clip-path="url(#clip0_15_82)"> <rect width="24" height="24" fill="white"></rect> <g filter="url(#filter0_d_15_82)"> <path d="M14.3365 12.3466L14.0765 11.9195C13.9082 12.022 13.8158 12.2137 13.8405 12.4092C13.8651 12.6046 14.0022 12.7674 14.1907 12.8249L14.3365 12.3466ZM9.6634 12.3466L9.80923 12.8249C9.99769 12.7674 10.1348 12.6046 10.1595 12.4092C10.1841 12.2137 10.0917 12.022 9.92339 11.9195L9.6634 12.3466ZM4.06161 19.002L3.56544 18.9402L4.06161 19.002ZM19.9383 19.002L20.4345 18.9402L19.9383 19.002ZM16 8.5C16 9.94799 15.2309 11.2168 14.0765 11.9195L14.5965 12.7737C16.0365 11.8971 17 10.3113 17 8.5H16ZM12 4.5C14.2091 4.5 16 6.29086 16 8.5H17C17 5.73858 14.7614 3.5 12 3.5V4.5ZM7.99996 8.5C7.99996 6.29086 9.79082 4.5 12 4.5V3.5C9.23854 3.5 6.99996 5.73858 6.99996 8.5H7.99996ZM9.92339 11.9195C8.76904 11.2168 7.99996 9.948 7.99996 8.5H6.99996C6.99996 10.3113 7.96342 11.8971 9.40342 12.7737L9.92339 11.9195ZM9.51758 11.8683C6.36083 12.8309 3.98356 15.5804 3.56544 18.9402L4.55778 19.0637C4.92638 16.1018 7.02381 13.6742 9.80923 12.8249L9.51758 11.8683ZM3.56544 18.9402C3.45493 19.8282 4.19055 20.5 4.99996 20.5V19.5C4.70481 19.5 4.53188 19.2719 4.55778 19.0637L3.56544 18.9402ZM4.99996 20.5H19V19.5H4.99996V20.5ZM19 20.5C19.8094 20.5 20.545 19.8282 20.4345 18.9402L19.4421 19.0637C19.468 19.2719 19.2951 19.5 19 19.5V20.5ZM20.4345 18.9402C20.0164 15.5804 17.6391 12.8309 14.4823 11.8683L14.1907 12.8249C16.9761 13.6742 19.0735 16.1018 19.4421 19.0637L20.4345 18.9402Z" fill="#000000"></path> </g> </g> <defs> <filter id="filter0_d_15_82" x="2.55444" y="3.5" width="18.8911" height="19" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"> <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood> <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix> <feOffset dy="1"></feOffset> <feGaussianBlur stdDeviation="0.5"></feGaussianBlur> <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"></feColorMatrix> <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_15_82"></feBlend> <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_15_82" result="shape"></feBlend> </filter> <clipPath id="clip0_15_82"> <rect width="24" height="24" fill="white"></rect> </clipPath> </defs> </g></svg>
                                            <span className="user-name">
                                                {user?.user_metadata?.full_name ?? user?.email ?? "User"}
                                            </span>
                                        </div>

                                        <div className="profile-options-cont">

                                            <Link to="/profile" className="profile-options" id="profile-link" onClick={() => setIsProfileOpen(false)}>
                                                <svg className="profile-icons" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                    <path d="M20 21a8 8 0 0 0-16 0M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                <p className="profile-menu-text" id="profile-text">
                                                    My Profile
                                                </p>
                                            </Link>

                                            <Link to="/my-listings" className="profile-options" id="my-listings-link" onClick={() => setIsProfileOpen(false)}>
                                                <svg className="profile-icons" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M8 6L21 6.00078M8 12L21 12.0008M8 18L21 18.0007M3 6.5H4V5.5H3V6.5ZM3 12.5H4V11.5H3V12.5ZM3 18.5H4V17.5H3V18.5Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>

                                                <p className="profile-menu-text" id="my-listings-text">
                                                    My Listings
                                                </p>
                                            </Link>

                                            <button
                                                className="profile-options" id="logout-button"
                                                onClick={() => {
                                                    setIsProfileOpen(false)
                                                    handleLogout()
                                                }}>
                                                <svg className="profile-icons" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M14.9453 1.25C13.5778 1.24998 12.4754 1.24996 11.6085 1.36652C10.7084 1.48754 9.95048 1.74643 9.34857 2.34835C8.82363 2.87328 8.55839 3.51836 8.41916 4.27635C8.28387 5.01291 8.25799 5.9143 8.25196 6.99583C8.24966 7.41003 8.58357 7.74768 8.99778 7.74999C9.41199 7.7523 9.74964 7.41838 9.75194 7.00418C9.75803 5.91068 9.78643 5.1356 9.89448 4.54735C9.99859 3.98054 10.1658 3.65246 10.4092 3.40901C10.686 3.13225 11.0746 2.9518 11.8083 2.85315C12.5637 2.75159 13.5648 2.75 15.0002 2.75H16.0002C17.4356 2.75 18.4367 2.75159 19.1921 2.85315C19.9259 2.9518 20.3144 3.13225 20.5912 3.40901C20.868 3.68577 21.0484 4.07435 21.1471 4.80812C21.2486 5.56347 21.2502 6.56459 21.2502 8V16C21.2502 17.4354 21.2486 18.4365 21.1471 19.1919C21.0484 19.9257 20.868 20.3142 20.5912 20.591C20.3144 20.8678 19.9259 21.0482 19.1921 21.1469C18.4367 21.2484 17.4356 21.25 16.0002 21.25H15.0002C13.5648 21.25 12.5637 21.2484 11.8083 21.1469C11.0746 21.0482 10.686 20.8678 10.4092 20.591C10.1658 20.3475 9.99859 20.0195 9.89448 19.4527C9.78643 18.8644 9.75803 18.0893 9.75194 16.9958C9.74964 16.5816 9.41199 16.2477 8.99778 16.25C8.58357 16.2523 8.24966 16.59 8.25196 17.0042C8.25799 18.0857 8.28387 18.9871 8.41916 19.7236C8.55839 20.4816 8.82363 21.1267 9.34857 21.6517C9.95048 22.2536 10.7084 22.5125 11.6085 22.6335C12.4754 22.75 13.5778 22.75 14.9453 22.75H16.0551C17.4227 22.75 18.525 22.75 19.392 22.6335C20.2921 22.5125 21.0499 22.2536 21.6519 21.6517C22.2538 21.0497 22.5127 20.2919 22.6337 19.3918C22.7503 18.5248 22.7502 17.4225 22.7502 16.0549V7.94513C22.7502 6.57754 22.7503 5.47522 22.6337 4.60825C22.5127 3.70814 22.2538 2.95027 21.6519 2.34835C21.0499 1.74643 20.2921 1.48754 19.392 1.36652C18.525 1.24996 17.4227 1.24998 16.0551 1.25H14.9453Z" ></path> <path d="M15 11.25C15.4142 11.25 15.75 11.5858 15.75 12C15.75 12.4142 15.4142 12.75 15 12.75H4.02744L5.98809 14.4306C6.30259 14.7001 6.33901 15.1736 6.06944 15.4881C5.79988 15.8026 5.3264 15.839 5.01191 15.5694L1.51191 12.5694C1.34567 12.427 1.25 12.2189 1.25 12C1.25 11.7811 1.34567 11.573 1.51191 11.4306L5.01191 8.43056C5.3264 8.16099 5.79988 8.19741 6.06944 8.51191C6.33901 8.8264 6.30259 9.29988 5.98809 9.56944L4.02744 11.25H15Z" ></path> </g></svg>
                                                <p className="profile-menu-text" id="logout-text">Log Out</p>
                                            </button>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    ) : (
                        <div className="anon-action-menu">
                            <button
                                className="anon-user-button"
                                id="header-login-button"
                                onClick={() => navigate("/login")}>
                                Login
                            </button>

                            <button
                                className="anon-user-button"
                                id="header-signup-button"
                                onClick={() => navigate("/sign-up")}>
                                Signup
                            </button>
                        </div>
                    )
            }
        </header>
    )
}

export default Header