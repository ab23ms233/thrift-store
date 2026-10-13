import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

import "../components/Form.css"
import "../components/PasswordInput.css"

import { INSTITUTE_EMAIL_DOMAIN, RESEND_TIMER } from "../constants.js"
import CTAButton from "../components/CTAButton";

import PageHeader from "../components/PageHeader.jsx";
import { FormError, FormStatus, FormSuccess } from "../components/FormStatus.jsx";
import BackButton from "../components/BackButton.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import ShowPasswordButton from "../components/ShowPasswordButton.jsx";

function SignUpPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const from = location?.state ?? "/"
    const { user } = useAuth()

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const [errorMessage, setErrorMessage] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const [nameError, setNameError] = useState("")
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [confirmPasswordError, setConfirmPasswordError] = useState("")

    const [isResending, setIsResending] = useState(false);
    const [resendMessage, setResendMessage] = useState("");
    const [resendError, setResendError] = useState("");

    const [resendCooldownUntil, setResendCooldownUntil] = useState(0);
    const [resendSecondsLeft, setResendSecondsLeft] = useState(0);

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const resendCooldownKey = email.trim()
        ? `signup-resend-cooldown:${email.trim().toLowerCase()}`
        : null;

    const isEmailVerified =
        user?.email?.toLowerCase() === email.trim().toLowerCase() &&
        Boolean(user.email_confirmed_at)

    /* Restore any existing cooldown for this email address */
    useEffect(() => {
        if (!submitted || !resendCooldownKey) return;

        const savedDeadline = Number(
            localStorage.getItem(resendCooldownKey) || 0
        );

        if (savedDeadline > Date.now()) {
            setResendCooldownUntil(savedDeadline);
        } else {
            localStorage.removeItem(resendCooldownKey);
            setResendCooldownUntil(0);
        }
    }, [submitted, resendCooldownKey]);

    /* Keep the countdown synchronized with the deadline */
    useEffect(() => {
        if (!resendCooldownUntil) {
            setResendSecondsLeft(0);
            return;
        }

        const updateCountdown = () => {
            const remaining = Math.max(
                0,
                Math.ceil((resendCooldownUntil - Date.now()) / 1000)
            );

            setResendSecondsLeft(remaining);

            if (remaining === 0) {
                clearInterval(intervalId)

                if (resendCooldownKey) {
                    localStorage.removeItem(resendCooldownKey);
                }
            }
        };

        const intervalId = setInterval(updateCountdown, 1000);
        updateCountdown();

        return () => clearInterval(intervalId);
    }, [resendCooldownUntil, resendCooldownKey]);

    function startResendCooldown() {
        const deadline =
            Date.now() + RESEND_TIMER * 1000;

        if (resendCooldownKey) {
            localStorage.setItem(
                resendCooldownKey,
                String(deadline)
            );
        }

        setResendCooldownUntil(deadline);
    }

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
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name
                    },
                    emailRedirectTo: `${window.location.origin}/email-verified`
                }
            })

            if (error) {
                console.error("Error signing up:", error)
                setErrorMessage(error.message)
                setIsSubmitting(false)
                return
            }

            setSubmitted(true)

        } catch (error) {
            console.error("Error signing up:", error)
            setIsSubmitting(false)
            setErrorMessage(error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    async function handleResendConfirmation() {
        if (!email || isResending || resendSecondsLeft > 0) return;

        setIsResending(true);
        setResendMessage("");
        setResendError("");

        try {
            const { error } = await supabase.auth.resend({
                type: "signup",
                email: email.trim().toLowerCase(),
                options: {
                    emailRedirectTo: `${window.location.origin}/email-verified`,
                },
            });

            if (error) {
                setResendError(error.message);
                return;
            }

            startResendCooldown()

            setResendMessage(
                "If this address has an unconfirmed account, a new verification email has been requested. Check your inbox and spam folder."
            );
        } catch (error) {
            console.error("Could not request a verification email:", error);
            setResendError("Could not request a verification email. Please try again later.");
        } finally {
            setIsResending(false);
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
                        disabled={isSubmitting || submitted}
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
                        disabled={isSubmitting || submitted}
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

                    <div className="input-wrapper password-input">
                        <input
                            className={`input-box${passwordError ? " input-box--error" : ""} password-input`}
                            id="signup-password-input"
                            type={showPassword ? "text" : "password"}
                            disabled={isSubmitting || submitted}
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

                        {
                            password && (
                                <ShowPasswordButton
                                    showPassword={showPassword}
                                    setShowPassword={setShowPassword}
                                />
                            )
                        }
                    </div>

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
                    
                    <div className="input-wrapper password-input">
                    <input
                        className={`input-box${confirmPasswordError ? " input-box--error" : ""}`}
                        id="signup-confirm-password-input"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password..."
                        disabled={isSubmitting || submitted}
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

                        {
                            confirmPassword && (
                                <ShowPasswordButton
                                    showPassword={showConfirmPassword}
                                    setShowPassword={setShowConfirmPassword} />
                            )
                        }
                    </div>
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
                    submitted
                        ? (
                            <>
                                {
                                    resendError && (
                                        <FormError
                                            message="Could not resend the email."
                                            description={resendError}
                                        />
                                    )
                                }
                                {
                                    resendMessage && (
                                        <FormStatus
                                            message={"Verification email requested."}
                                            description={resendMessage} />
                                    )
                                }
                                {
                                    isEmailVerified && (
                                        <FormSuccess
                                            message={"Email verified!"}
                                            description={"You are officially connected to the campus community! You can now redirect to the homepage."} />
                                    )
                                }
                                {
                                    !resendError && !resendMessage && !isEmailVerified && (
                                        <FormStatus
                                            message={"Check your email."}
                                            description={"Click the verification link on your email. Check your spam folder if you do not find it in inbox."} />
                                    )
                                }

                                {
                                    isEmailVerified
                                        ? (
                                            <button
                                                type="button"
                                                onClick={() => navigate("/")}
                                                className="cta-button"
                                            >
                                                Back to Home page
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={handleResendConfirmation}
                                                disabled={isResending || resendSecondsLeft > 0}
                                                className="cta-button"
                                            >
                                                {isResending
                                                    ? "Requesting email..."
                                                    : resendSecondsLeft > 0
                                                        ? `Resend email in ${resendSecondsLeft}s`
                                                        : "Resend verification email"}
                                            </button>
                                        )
                                }
                            </>
                        ) : (
                            <CTAButton
                                text={"Create account"}
                                type={"submit"}
                                isDisabled={isSubmitting || submitted}
                                disabledText={"Creating account..."}
                                successText={"Check email"}
                                isSuccess={submitted} />
                        )
                }

                <BackButton navigateTo={from} />
            </form>

            <p className="user-hint" id="signup-login-hint">
                Already have an account? <Link to="/login" className="hint-link">Login</Link>
            </p>
        </section>
    )
}

export default SignUpPage