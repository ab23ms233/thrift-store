import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase";

import "../components/Form.css"

import { useAuth } from "../context/AuthContext";
import { INSTITUTE_EMAIL_DOMAIN } from "../constants.js"
import CTAButton from "../components/CTAButton";
import { formTimeout } from "../constants.js"

import PageHeader from "../components/PageHeader.jsx";
import { FormError, FormSuccess } from "../components/FormStatus.jsx";
import BackButton from "../components/BackButton.jsx";

function SignUpPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const from = location?.state ?? "/"
    const { setUser } = useAuth()

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const [nameError, setNameError] = useState("")
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [confirmPasswordError, setConfirmPasswordError] = useState("")

    function validateName(value) {
        setName(value.trim())
        const error = value.trim() ? "" : "Please enter your name."
        setNameError(error)
        return error
    }

    function validateEmail(value) {
        setEmail(value.trim().toLowerCase())
        let error = ""

        if (!value) {
            error = "Please enter an email address."
        } else if (!value.endsWith(INSTITUTE_EMAIL_DOMAIN)) {
            error = "Please use your IISERK email address."
        }

        setEmailError(error)
        return error
    }

    function validatePassword(value) {
        const error = value ? "" : "Please enter a password."
        setPasswordError(error)
        return error
    }

    function validateConfirmPassword(value) {
        const error = value === password ? "" : "Passwords do not match."
        setConfirmPasswordError(error)
        return error
    }

    async function handleSignUp(event) {
        event.preventDefault()
        setErrorMessage("");
        setSuccessMessage("");
        setNameError("");
        setEmailError("");
        setPasswordError("");
        setIsSubmitting(true);
        setSubmitted(false);
        setConfirmPasswordError("");

        const hasError = [
            validateName(name),
            validateEmail(email),
            validatePassword(password),
            validateConfirmPassword(confirmPassword)
        ].some(Boolean)

        if (hasError) {
            return
        }

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name
                    }
                }
            })

            if (error) {
                setErrorMessage(error.message)
                return
            }

            setUser(data.user)
            setSuccessMessage(
                "Account created successfully."
            )
            setSubmitted(true)

            setTimeout(() => {
                navigate("/")
            }, formTimeout)

        } catch (error) {
            setErrorMessage(error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <section className="section" id="signup-page">
            <PageHeader
                header={"Create an account"}
                description={"Sign up to start listing your products."} />

            <form className="form signup-form" onSubmit={handleSignUp}>
                <div className="form-field">
                    <label htmlFor="signup-name-input">
                        Full Name
                    </label>

                    <input
                        className={`input-box${nameError ? " input-box--error" : ""}`}
                        id="signup-name-input"
                        type="text"
                        placeholder="Your name..."
                        value={name}
                        onChange={(event) => {
                            setName(event.target.value)
                            if (nameError) validateName(event.target.value)
                        }}
                        onBlur={event => validateName(event.target.value)}
                        aria-invalid={Boolean(nameError)}
                        aria-describedby={nameError ? "signup-name-error" : undefined}
                        required />
                    {nameError && (
                        <span className="field-error" id="signup-name-error">
                            {nameError}
                        </span>
                    )}
                </div>

                <div className="form-field">
                    <label htmlFor="signup-email-input">
                        Institute Email
                    </label>

                    <input
                        className={`input-box${emailError ? " input-box--error" : ""}`}
                        id="signup-email-input"
                        type="email"
                        value={email}
                        placeholder="Enter your institute email..."
                        onChange={(event) => {
                            setEmail(event.target.value)
                            if (emailError) validateEmail(event.target.value)
                        }}
                        onBlur={event => validateEmail(event.target.value)}
                        autoComplete="email"
                        aria-invalid={Boolean(emailError)}
                        aria-describedby={emailError ? "signup-email-error" : undefined}
                        required
                    />
                    {emailError &&
                        <span className="field-error" id="signup-email-error">{emailError}</span>
                    }
                </div>

                <div className="form-field">
                    <label htmlFor="signup-password-input">
                        Set Password
                    </label>

                    <input
                        className={`input-box${passwordError ? " input-box--error" : ""}`}
                        id="signup-password-input"
                        type="password"
                        placeholder="Set your password..."
                        value={password}
                        onChange={(event) => {
                            setPassword(event.target.value)
                            if (passwordError) validatePassword(event.target.value)
                        }}
                        onBlur={event => validatePassword(event.target.value)}
                        autoComplete="new-password"
                        aria-invalid={Boolean(passwordError)}
                        aria-describedby={passwordError ? "signup-password-error" : undefined}
                        required />
                    {passwordError && (
                        <span className="field-error" id="signup-password-error">
                            {passwordError}
                        </span>
                    )}
                </div>

                <div className="form-field">
                    <label htmlFor="signup-confirm-password-input">
                        Confirm Password
                    </label>

                    <input
                        className={`input-box${confirmPasswordError ? " input-box--error" : ""}`}
                        id="signup-confirm-password-input"
                        type="password"
                        placeholder="Confirm your password..."
                        value={confirmPassword}
                        onChange={(event) => {
                            setConfirmPassword(event.target.value)
                            validateConfirmPassword(event.target.value)
                        }}
                        onBlur={event => validateConfirmPassword(event.target.value)}
                        autoComplete="new-password"
                        aria-invalid={Boolean(confirmPasswordError)}
                        aria-describedby={confirmPasswordError ? "signup-confirm-password-error" : undefined}
                        required />
                    {confirmPasswordError && (
                        <span className="field-error" id="signup-confirm-password-error">
                            {confirmPasswordError}
                        </span>
                    )}

                </div>

                {
                    errorMessage &&
                    <FormError
                        message={"Failed to create account."}
                        description={errorMessage} />
                }
                {
                    successMessage &&
                    <FormSuccess
                        message={"Account created successfully!"}
                        description={"You have joined the campus community."} />
                }

                <CTAButton
                    text={"Create account"}
                    type={"submit"}
                    isDisabled={isSubmitting || submitted}
                    disabledText={"Creating account..."}
                    successText={"Account created!"}
                    isSuccess={submitted} />

                <BackButton navigateTo={from} />
            </form>

            <p className="user-hint" id="signup-login-hint">
                Already have an account? <Link to="/login" className="hint-link">Login</Link>
            </p>
        </section>
    )
}

export default SignUpPage