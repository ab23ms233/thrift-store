import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import BackButton from "../components/BackButton.jsx"
import CTAButton from "../components/CTAButton.jsx"

import "../components/Form.css"
import "../components/PasswordInput.css"

import { FormError, FormSuccess } from "../components/FormStatus.jsx"
import PageHeader from "../components/PageHeader.jsx"
import { supabase } from "../lib/supabase.js"

import { formTimeout } from "../constants.js"
import ShowPasswordButton from "../components/ShowPasswordButton.jsx"

function ChangePasswordPage() {
    const navigate = useNavigate()
    const [authStatus, setAuthStatus] = useState("checking")
    const [email, setEmail] = useState("")
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [newPasswordError, setNewPasswordError] = useState("")
    const [confirmPasswordError, setConfirmPasswordError] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [isUpdating, setIsUpdating] = useState(false)
    const [isUpdated, setIsUpdated] = useState(false)

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)

    useEffect(() => {
        let isCurrent = true

        async function checkAuthentication() {
            try {
                const { data, error } = await supabase.auth.getUser()
                if (!isCurrent) return

                if (error) {
                    setErrorMessage(error.message)
                    setAuthStatus("error")
                    return
                }

                if (!data.user) {
                    setAuthStatus("unauthenticated")
                    return
                }

                if (!data.user.email) {
                    setErrorMessage("This account does not have an email address to verify the current password.")
                    setAuthStatus("error")
                    return
                }

                setEmail(data.user.email)
                setAuthStatus("authenticated")
            } catch (error) {
                if (!isCurrent) return
                setErrorMessage(error.message)
                setAuthStatus("error")
            }
        }

        checkAuthentication()

        return () => {
            isCurrent = false
        }
    }, [])

    useEffect(() => {
        if (!isUpdated) return

        const redirectTimeout = window.setTimeout(() => {
            navigate("/profile", { replace: true })
        }, formTimeout);

        return () => window.clearTimeout(redirectTimeout)
    }, [isUpdated, navigate])

    useEffect(() => {
        if (authStatus === "unauthenticated") {
            navigate("/login", { replace: true })
        }
    }, [authStatus, navigate])

    function validateNewPassword(value = newPassword) {
        const error = value === currentPassword
            ? "New password must be different from your current password."
            : ""
        setNewPasswordError(error)
        return error
    }

    function validateConfirmPassword(value = confirmPassword) {
        const error = value !== newPassword
            ? "New passwords do not match."
            : ""
        setConfirmPasswordError(error)
        return error
    }

    async function handleSubmit(event) {
        event.preventDefault()
        setErrorMessage("")
        setNewPasswordError("")
        setConfirmPasswordError("")

        const hasError = [
            validateNewPassword(),
            validateConfirmPassword()
        ].some(Boolean)

        if (hasError || authStatus !== "authenticated" || !email) return

        setIsUpdating(true)
        try {
            const { error: verificationError } = await supabase.auth.signInWithPassword({
                email,
                password: currentPassword
            })

            if (verificationError) {
                setErrorMessage(verificationError.message)
                return
            }

            const { error: updateError } = await supabase.auth.updateUser({
                password: newPassword
            })

            if (updateError) {
                setErrorMessage(updateError.message)
                return
            }

            setIsUpdated(true)
        } catch (error) {
            setErrorMessage(error.message)
        } finally {
            setIsUpdating(false)
        }
    }

    const isFormDisabled = authStatus !== "authenticated" || isUpdating || isUpdated

    return (
        <section className="section change-password-page">
            <PageHeader
                header="Change your password"
                description="Verify your current password, then choose and confirm a new password."
            />

            <form className="form change-password-form" onSubmit={handleSubmit}>
                <div className="form-field">
                    <label htmlFor="change-password-current">
                        Current password
                    </label>

                    <div className="input-wrapper password-input">
                        <input
                            className="input-box"
                            id="change-password-current"
                            type={showCurrentPassword ? "text" : "password"}
                            name="current-password"
                            value={currentPassword}
                            onChange={(event) => {
                                setCurrentPassword(event.target.value)
                                setNewPasswordError("")
                                setErrorMessage("")
                            }}
                            placeholder="Enter current password..."
                            autoComplete="current-password"
                            disabled={isFormDisabled}
                            required
                        />
                        {
                            currentPassword && (
                                <ShowPasswordButton
                                    showPassword={showCurrentPassword}
                                    setShowPassword={setShowCurrentPassword} />
                            )
                        }
                    </div>
                </div>

                <div className="form-field">
                    <label htmlFor="change-password-new">
                        New password
                    </label>
                    <div className="input-wrapper password-input">
                        <input
                            className={`input-box${newPasswordError ? " input-box--error" : ""}`}
                            id="change-password-new"
                            type={showPassword ? "text" : "password"}
                            name="new-password"
                            value={newPassword}
                            onChange={(event) => {
                                setNewPassword(event.target.value)
                                setNewPasswordError("")
                                setConfirmPasswordError("")
                                setErrorMessage("")
                            }}
                            onBlur={(event) => validateNewPassword(event.target.value)}
                            placeholder="Enter new password..."
                            autoComplete="new-password"
                            disabled={isFormDisabled}
                            aria-invalid={Boolean(newPasswordError)}
                            aria-describedby={newPasswordError ? "change-password-new-error" : undefined}
                            required
                        />
                        {
                            newPassword && (
                                <ShowPasswordButton
                                    showPassword={showPassword}
                                    setShowPassword={setShowPassword} />
                            )
                        }
                    </div>
                    {newPasswordError && (
                        <span className="field-error" id="change-password-new-error">
                            {newPasswordError}
                        </span>
                    )}
                </div>

                <div className="form-field">
                    <label htmlFor="change-password-confirm">
                        Confirm new password
                    </label>
                    <div className="input-wrapper password-input">
                        <input
                            className={`input-box${confirmPasswordError ? " input-box--error" : ""}`}
                            id="change-password-confirm"
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirm-password"
                            value={confirmPassword}
                            onChange={(event) => {
                                setConfirmPassword(event.target.value)
                                setConfirmPasswordError("")
                                setErrorMessage("")
                                validateConfirmPassword()
                            }}
                            onBlur={(event) => validateConfirmPassword(event.target.value)}
                            placeholder="Confirm new password..."
                            autoComplete="new-password"
                            disabled={isFormDisabled}
                            aria-invalid={Boolean(confirmPasswordError)}
                            aria-describedby={confirmPasswordError ? "change-password-confirm-error" : undefined}
                            required
                        />
                        {
                            confirmPassword && (
                                <ShowPasswordButton
                                    showPassword={showConfirmPassword}
                                    setShowPassword={setShowConfirmPassword} />
                            )
                        }
                    </div>
                    {confirmPasswordError && (
                        <span className="field-error" id="change-password-confirm-error">
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
                        description="Your account password has been updated."
                    />
                )}

                <CTAButton
                    text="Change password"
                    type="submit"
                    isDisabled={isFormDisabled}
                    disabledText={
                        isUpdating
                            ? "Changing password..."
                            : authStatus === "checking"
                                ? "Checking account..."
                                : "Unavailable"
                    }
                    successText="Password changed!"
                    isSuccess={isUpdated}
                />
                <BackButton navigateTo="/profile" />
            </form>
        </section>
    )
}

export default ChangePasswordPage
