import { Link, useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase.js"
import { useState } from "react"

import "../components/Form.css"
import { useAuth } from "../context/AuthContext.jsx"

import CTAButton from "../components/CTAButton.jsx"

function LoginPage() {
    const navigate = useNavigate()
    const { setUser } = useAuth()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [errorMessage, setErrorMessage] = useState("")
    const [loginMessage, setLoginMessage] = useState("")
    const [isLoggedIn, setLogin] = useState(false)

    async function handleLogin(event) {
        event.preventDefault()
        setErrorMessage("")
        setLoginMessage("")

        try {
            const { data, error } = await supabase.auth.signInWithPassword(
                {
                    email,
                    password
                }
            )

            if (error) {
                setErrorMessage(error.message)
                return
            }

            setUser(data.user)
            setLoginMessage("Login successful!")

            setTimeout(() => {
                navigate("/")
            }, 1000)

        } catch (error) {
            setErrorMessage(error.message)
        } finally {
            setLogin(true)
        }
    }

    return (
        <>
            <form className="form login-form" onSubmit={handleLogin}>
                <label
                    htmlFor="login-email-input"
                    className="form-field">
                    Email

                    <input
                        className="input-box"
                        id="login-email-input"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="Enter email..."
                        name="email"
                        autoComplete="email"
                        required />
                </label>

                <label
                    htmlFor="login-password-input"
                    className="form-field">
                    Password

                    <input
                        className="input-box"
                        id="login-password-input"
                        type="password"
                        name="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        autoComplete="current-password"
                        placeholder="Enter password..."
                    />
                    <a href="/forgot-password">Forgot Password</a>
                </label>

                {errorMessage &&
                    <p className="error-message">{errorMessage}</p>
                }
                {loginMessage &&
                    <p className="success-message">{loginMessage}</p>
                }

                <CTAButton
                    text={"Login"}
                    type={"submit"}
                />
            </form>

            <p>
                Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
        </>
    )
}

export default LoginPage