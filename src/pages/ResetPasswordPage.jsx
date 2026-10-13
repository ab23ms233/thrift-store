import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import CTAButton from "../components/CTAButton.jsx"
import "../components/Form.css"
import "../components/PasswordInput.css"

import { FormError, FormSuccess } from "../components/FormStatus.jsx"
import PageHeader from "../components/PageHeader.jsx"
import { supabase } from "../lib/supabase.js"
import { formTimeout } from "../constants.js"
import ShowPasswordButton from "../components/ShowPasswordButton.jsx"

function ResetPasswordPage() {
    const navigate = useNavigate()
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [confirmPasswordError, setConfirmPasswordError] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [isUpdating, setIsUpdating] = useState(false)
    const [isUpdated, setIsUpdated] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    useEffect(() => {
        if (!isUpdated) return

        const redirectTimeout = window.setTimeout(() => {
            navigate("/login", { replace: true })
        }, formTimeout)

        return () => window.clearTimeout(redirectTimeout)
    }, [isUpdated, navigate])

    function validateConfirmPassword() {
        let error = ""
        if (password !== confirmPassword) {
            error = "Passwords do not match."
            setConfirmPasswordError(error)
        }
        return error
    }

    async function handleSubmit(event) {
        event.preventDefault()
        setErrorMessage("")
        setConfirmPasswordError("")

        const hasError = [
            validateConfirmPassword()
        ].some(Boolean)

        if (hasError) return

        setIsUpdating(true)
        try {
            const { error } = await supabase.auth.updateUser({ password })

            if (error) {
                setErrorMessage(error.message)
                return
            }

            setIsUpdated(true)
        } catch (error) {
            setErrorMessage(error.message)
        } finally {
            setIsUpdating(false)
        }
    }

    return (
        <section className="section reset-password-page">
            <PageHeader
                header="Set a new password"
                description="Choose a new password for your account and confirm it below."
            />

            <form className="form reset-password-form" onSubmit={handleSubmit}>
                <div className="form-field">
                    <label htmlFor="reset-password-new">
                        New password
                    </label>

                    <div className="input-wrapper password-input">

                        <input
                            className="input-box"
                            id="reset-password-new"
                            type={showPassword ? "text" : "password"}
                            name="new-password"
                            value={password}
                            onChange={(event) => {
                                setPassword(event.target.value)
                                setConfirmPasswordError("")
                                setErrorMessage("")
                            }}
                            placeholder="Enter new password..."
                            autoComplete="new-password"
                            disabled={isUpdating || isUpdated}
                            required
                        />

                        {
                            password && (
                                <ShowPasswordButton
                                    showPassword={showPassword}
                                    setShowPassword={setShowPassword} />
                            )
                        }
                    </div>
                </div>

                <div className="form-field">
                    <label htmlFor="reset-password-confirm">
                        Confirm new password
                    </label>
                    <input
                        className={`input-box${confirmPasswordError ? " input-box--error" : ""}`}
                        id="reset-password-confirm"
                        type="password"
                        name="confirm-password"
                        value={confirmPassword}
                        onChange={(event) => {
                            setConfirmPassword(event.target.value)
                            validateConfirmPassword()
                        }}
                        onBlur={validateConfirmPassword}
                        placeholder="Confirm new password..."
                        autoComplete="new-password"
                        disabled={isUpdating || isUpdated}
                        aria-invalid={Boolean(confirmPasswordError)}
                        aria-describedby={confirmPasswordError ? "reset-password-confirm-error" : undefined}
                        required
                    />
                    {confirmPasswordError && (
                        <span className="field-error" id="reset-password-confirm-error">
                            {confirmPasswordError}
                        </span>
                    )}
                </div>

                {errorMessage && (
                    <FormError
                        message="Unable to change password."
                        description={errorMessage}
                    />
                )}
                {isUpdated && (
                    <FormSuccess
                        message="Password changed successfully."
                        description="You’ll be redirected to login using your new password."
                    />
                )}

                <CTAButton
                    text="Change password"
                    type="submit"
                    isDisabled={isUpdating || isUpdated}
                    disabledText="Changing password..."
                    successText="Password changed!"
                    isSuccess={isUpdated}
                />
            </form>
        </section>
    )
}

export default ResetPasswordPage
