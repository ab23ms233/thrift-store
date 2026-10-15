import { useState } from "react"
import { Link } from "react-router-dom"

import CTAButton from "../components/button/CTAButton.jsx"
import "../components/common/Form.css"
import { FormError, FormSuccess } from "../components/common/FormStatus.jsx"
import PageHeader from "../components/common/PageHeader.jsx"
import { supabase } from "../lib/supabase.js"

function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [emailError, setEmailError] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [isSending, setIsSending] = useState(false)
    const [isSent, setIsSent] = useState(false)

    function validateEmail(value) {
        const normalizedEmail = value.trim().toLowerCase()
        setEmail(normalizedEmail)

        const error = normalizedEmail ? "" : "Please enter an email address."
        setEmailError(error)
        return error
    }

    async function handleSubmit(event) {
        event.preventDefault()
        setErrorMessage("")
        setIsSent(false)

        const normalizedEmail = email.trim().toLowerCase()
        if (validateEmail(normalizedEmail)) {
            return
        }

        setIsSending(true)
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
                redirectTo: `${window.location.origin}/reset-password`
            })

            if (error) {
                setErrorMessage(error.message)
                return
            }

            setIsSent(true)
        } catch (error) {
            setErrorMessage(error.message)
        } finally {
            setIsSending(false)
        }
    }

    return (
        <section className="section forgot-password-page">
            <PageHeader
                header="Forgot your password?"
                description="Enter the email address associated with your account and we’ll send you a link to reset your password."
            />

            <form className="form forgot-password-form" onSubmit={handleSubmit}>
                <div className="form-field">
                    <label htmlFor="forgot-password-email">
                        Email
                    </label>
                    <input
                        className={`input-box${emailError ? " input-box--error" : ""}`}
                        id="forgot-password-email"
                        type="email"
                        name="email"
                        value={email}
                        onChange={(event) => {
                            setEmail(event.target.value)
                            setIsSent(false)
                            setErrorMessage("")
                            if (emailError) validateEmail(event.target.value)
                        }}
                        onBlur={(event) => validateEmail(event.target.value)}
                        placeholder="Enter email..."
                        autoComplete="email"
                        disabled={isSending}
                        aria-invalid={Boolean(emailError)}
                        aria-describedby={emailError ? "forgot-password-email-error" : undefined}
                        required
                    />
                    {emailError && (
                        <span className="field-error" id="forgot-password-email-error">
                            {emailError}
                        </span>
                    )}
                </div>

                {errorMessage && (
                    <FormError
                        message="Failed to send reset link."
                        description={errorMessage}
                    />
                )}
                {isSent && (
                    <FormSuccess
                        message="Reset link sent."
                        description="If an account exists for that email, you’ll receive a link to reset your password."
                    />
                )}

                <CTAButton
                    text="Send reset link"
                    type="submit"
                    isDisabled={isSending || isSent}
                    disabledText="Sending..."
                    successText="Link sent!"
                    isSuccess={isSent}
                />
            </form>

            <p className="user-hint">
                Remember your password? <Link to="/login" className="hint-link">Log in</Link>
            </p>
        </section>
    )
}

export default ForgotPasswordPage
