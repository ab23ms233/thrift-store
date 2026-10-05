import { Link, useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase.js"
import { useState } from "react"

import "./Form.css"

function LoginPage({ onLogin }) {
    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [errorMessage, setErrorMessage] = useState("")
    const [loginMessage, setLoginMessage] = useState("")
    const [isLoggedIn, setLogin] = useState(false)

    async function handleLogin(event, onLogin) {
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
    
            onLogin(data.user)
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
            <form className="form login-form" onSubmit={(event) => handleLogin(event, onLogin)}>
                <div className="form-field">
                    <label htmlFor="login-email-input">Email</label>
                    <input
                        id="login-email-input"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="Enter email..."
                        name="email"
                        autoComplete="email"
                        required />
                </div>

                <div className="form-field">
                    <label htmlFor="login-password-input">Password</label>
                    <input
                        id="login-password-input"
                        type="password"
                        name="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        autoComplete="current-password"
                        placeholder="Enter password..."
                    />
                    <a href="/forgot-password">Forgot Password</a>
                </div>

                {errorMessage &&
                <p className="error-message">{errorMessage}</p>
                }
                {loginMessage &&
                <p className="success-message">{loginMessage}</p>
                }

                <button type="submit" className="log-in-btn">Log In</button>
            </form>

            <p>
                Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
        </>
    )
}

export default LoginPage