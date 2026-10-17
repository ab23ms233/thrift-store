import { Link, useLocation, useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase.js"
import { useState, useEffect } from "react"

import "../components/common/Form.css"
import "../components/common/PasswordInput.css"

import { useAuth } from "../context/AuthContext.jsx"

import CTAButton from "../components/button/CTAButton.jsx"
import PageHeader from "../components/common/PageHeader.jsx"
import { FormError, FormSuccess } from "../components/common/FormStatus.jsx"

import { formTimeout, INSTITUTE_EMAIL_DOMAIN } from "../constants.js"
import BackButton from "../components/button/BackButton.jsx"
import ShowPasswordButton from "../components/button/ShowPasswordButton.jsx"

function LoginPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const from = location?.state?.from?.pathname ?? "/"
    const { setUser } = useAuth()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")

    const [errorMessage, setErrorMessage] = useState("")
    const [loginMessage, setLoginMessage] = useState("")

    const [isLoggedIn, setLogin] = useState(false)
    const [isLogging, setIsLogging] = useState(false)

    useEffect(() => {
        if (!isLoggedIn) return

        const redirectTimeout = window.setTimeout(() => {
            navigate(from, { replace: true })
        }, formTimeout)

        return () => window.clearTimeout(redirectTimeout)
    }, [isLoggedIn, navigate, from])

    function validateEmail(email) {
        setEmail(email.trim().toLowerCase())
        let error = ""

        if (!email) {
            error = "Please enter an email address."
        } else if (!email.endsWith(INSTITUTE_EMAIL_DOMAIN)) {
            error = "Please login with your IISERK email."
        }
        setEmailError(error)
        return error
    }

    function validatePassword(password) {
        let error = ""

        if (!password) {
            error = "Please enter a password."
        }
        setPasswordError(error)
        return error
    }

    async function handleLogin(event) {
        event.preventDefault()

        setErrorMessage("")
        setLoginMessage("")
        setEmailError("")
        setPasswordError("")
        setIsLogging(true)

        const hasError = [
            validateEmail(email),
            validatePassword(password)
        ].some(Boolean)

        if (hasError) {
            return
        }

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
            setLogin(true)

        } catch (error) {
            setErrorMessage(error.message)
        } finally {
            setIsLogging(false)
        }
    }

    return (
        <section className="section login-page">
            <PageHeader
                header={"Welcome back!"}
                description={"Login to manage your listings and connect with the campus marketplace."} />

            <form className="form login-form" onSubmit={handleLogin}>
                <div className="form-field">
                    <label htmlFor="login-email-input">
                        Email
                    </label>

                    <input
                        className={`input-box${emailError ? " input-box--error" : ""}`}
                        id="login-email-input"
                        type="email"
                        value={email}
                        onChange={(event) => {
                            setEmail(event.target.value.trim().toLowerCase())
                            if (emailError) validateEmail(event.target.value)
                        }}
                        onBlur={event => validateEmail(event.target.value)}
                        placeholder="Enter email..."
                        name="email"
                        autoComplete="email"
                        aria-invalid={Boolean(emailError)}
                        aria-describedby={emailError ? "login-email-error" : undefined}
                        required />
                    {emailError && (
                        <span className="field-error" id="login-email-error">
                            {emailError}
                        </span>
                    )}
                </div>

                <div className="form-field">
                    <label htmlFor="login-password-input">
                        Password
                    </label>

                    <div className="input-wrapper password-input">
                        <input
                            className="input-box"
                            id="login-password-input"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={password}
                            onChange={(event) => {
                                setPassword(event.target.value)
                                if (passwordError) validatePassword(event.target.value)
                            }}
                            onBlur={event => validatePassword(event.target.value)}
                            autoComplete="current-password"
                            aria-invalid={Boolean(passwordError)}
                            aria-describedby={passwordError ? "login-password-error" : undefined}
                            required
                            placeholder="Enter password..."
                        />

                        {
                            password && (
                                <ShowPasswordButton
                                    showPassword={showPassword}
                                    setShowPassword={setShowPassword} />
                            )
                        }
                    </div>
                    <a href="/forgot-password">Forgot Password</a>
                    {
                        passwordError && (
                            <span className="field-error" id="login-password-error">
                                {passwordError}
                            </span>
                        )
                    }
                </div>

                {
                    errorMessage &&
                    <FormError
                        message={"Failed to login."}
                        description={errorMessage} />
                }
                {loginMessage &&
                    <FormSuccess
                        message={"Login successful!"}
                        description={"You have joined the campus community!"} />
                }

                <CTAButton
                    text={"Login"}
                    type={"submit"}
                    isDisabled={isLogging || isLoggedIn}
                    disabledText={"Logging in..."}
                    successText={"Logged in!"}
                    isSuccess={isLoggedIn} />

                <BackButton navigateTo={from} />
            </form>

            <p className="user-hint" id="login-signup-hint">
                Don't have an account? <Link to="/sign-up" className="hint-link">Sign up</Link>
            </p>
        </section>
    )
}

export default LoginPage