import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import BackButton from "../components/BackButton.jsx"
import CTAButton from "../components/CTAButton.jsx"
import "../components/Form.css"
import { FormError, FormSuccess } from "../components/FormStatus.jsx"
import Modal from "../components/Modal.jsx"
import PageHeader from "../components/PageHeader.jsx"
import { INSTITUTE_EMAIL_DOMAIN } from "../constants.js"
import { useAuth } from "../context/AuthContext.jsx"
import { deleteProfile, editProfile, getProfile } from "../services/profile.js"

import "./ProfilePage.css"

function ProfilePage() {
    const navigate = useNavigate()
    const location = useLocation()
    const from = location?.state ?? "/"
    const { user } = useAuth()

    const [profile, setProfile] = useState(null)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSaved, setIsSaved] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [nameError, setNameError] = useState("")
    const [emailError, setEmailError] = useState("")
    const [phoneError, setPhoneError] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [successMessage, setSuccessMessage] = useState("")

    useEffect(() => {
        let isCurrent = true

        async function loadProfile() {
            if (!user?.id) {
                setErrorMessage("You must be signed in to view your profile.")
                setIsLoading(false)
                return
            }

            try {
                const data = await getProfile(user.id)
                if (!isCurrent) return

                setProfile(data)
                setName(data.full_name ?? user.user_metadata?.full_name ?? "")
                setEmail(data.email ?? user.email ?? "")
                setPhone(data.phone_number ?? data.phone ?? "")
            } catch (error) {
                console.error("Could not load profile:", error)
                if (isCurrent) {
                    setErrorMessage("Could not load your profile. Please try again.")
                    setIsLoading(false)
                }
            } finally {
                if (isCurrent) setIsLoading(false)
            }
        }

        loadProfile()

        return () => {
            isCurrent = false
        }
    }, [user])

    function validateName(value) {
        const error = value.trim() ? "" : "Please enter your name."
        setNameError(error)
        return error
    }

    function validateEmail(value) {
        const normalizedEmail = value.trim().toLowerCase()
        let error = ""

        if (!normalizedEmail) {
            error = "Please enter an email address."
        } else if (!normalizedEmail.endsWith(INSTITUTE_EMAIL_DOMAIN)) {
            error = `Email must end with ${INSTITUTE_EMAIL_DOMAIN}.`
        }

        setEmailError(error)
        return error
    }

    function validatePhone(value) {
        const digits = value.replace(/\D/g, "")
        const error = digits.length > 0 && digits.length !== 10
            ? "Enter a phone number with 10 digits."
            : ""

        setPhoneError(error)
        return error
    }

    async function handleSubmit(event) {
        event.preventDefault()
        setErrorMessage("")
        setSuccessMessage("")

        const hasErrors = [
            validateName(name),
            validateEmail(email),
            validatePhone(phone)
        ].some(Boolean)

        if (hasErrors || !user?.id || !profile) return

        setIsSubmitting(true)
        try {
            const phoneField = Object.prototype.hasOwnProperty.call(profile, "phone")
                && !Object.prototype.hasOwnProperty.call(profile, "phone_number")
                ? "phone"
                : "phone_number"

            const updatedProfile = await editProfile(user.id, {
                full_name: name.trim(),
                email: email.trim().toLowerCase(),
                [phoneField]: phone.trim()
            })

            setProfile(updatedProfile)
            setIsSaved(true)
            setSuccessMessage("Your profile has been updated.")
        } catch (error) {
            console.error("Could not update profile:", error)
            setErrorMessage("Could not update your profile. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    async function handleDeleteProfile() {
        if (!user?.id) return

        setIsDeleting(true)
        setErrorMessage("")
        try {
            await deleteProfile(user.id)
            setIsDeleteModalOpen(false)
            navigate("/", { replace: true })
        } catch (error) {
            console.error("Could not delete profile:", error)
            setErrorMessage("Could not delete your profile. Please try again.")
            setIsDeleteModalOpen(false)
        } finally {
            setIsDeleting(false)
        }
    }

    function updateField(setter, value) {
        setter(value)
        setIsSaved(false)
        setSuccessMessage("")
    }

    const fieldsDisabled = isLoading || !profile

    return (
        <section className="section profile-page">
            <PageHeader
                header="Profile"
                description="Review your campus marketplace details."
            />

            {errorMessage && (
                <FormError
                    message="There was a problem."
                    description={errorMessage}
                />
            )}

            <form className="form profile-form" onSubmit={handleSubmit} noValidate>
                <div className="form-field">
                    <label htmlFor="profile-name">Name*</label>
                    <input
                        id="profile-name"
                        className={`input-box${nameError ? " input-box--error" : ""}`}
                        type="text"
                        placeholder="Enter your name..."
                        autoComplete="name"
                        value={name}
                        disabled={fieldsDisabled}
                        onChange={event => {
                            updateField(setName, event.target.value)
                            if (nameError) validateName(event.target.value)
                        }}
                        onBlur={event => validateName(event.target.value)}
                        aria-invalid={Boolean(nameError)}
                        aria-describedby={nameError ? "profile-name-error" : undefined}
                    />
                    {nameError && (
                        <span className="field-error" id="profile-name-error">
                            {nameError}
                        </span>
                    )}
                </div>

                <div className="form-field">
                    <label htmlFor="profile-email">Email*</label>
                    <input
                        id="profile-email"
                        placeholder="Enter your email..."
                        className={`input-box${emailError ? " input-box--error" : ""}`}
                        type="email"
                        autoComplete="email"
                        value={email}
                        disabled={fieldsDisabled}
                        onChange={event => {
                            updateField(setEmail, event.target.value)
                            if (emailError) validateEmail(event.target.value)
                        }}
                        onBlur={event => validateEmail(event.target.value)}
                        aria-invalid={Boolean(emailError)}
                        aria-describedby={emailError ? "profile-email-error" : undefined}
                    />
                    {emailError && (
                        <span className="field-error" id="profile-email-error">
                            {emailError}
                        </span>
                    )}
                </div>

                <div className="form-field">
                    <label htmlFor="profile-phone">Phone number (optional)</label>
                    <input
                        id="profile-phone"
                        placeholder="Enter your phone number..."
                        className={`input-box${phoneError ? " input-box--error" : ""}`}
                        type="tel"
                        autoComplete="tel"
                        value={phone}
                        disabled={fieldsDisabled}
                        onChange={event => {
                            updateField(setPhone, event.target.value)
                            if (phoneError) validatePhone(event.target.value)
                        }}
                        aria-invalid={Boolean(phoneError)}
                        aria-describedby={phoneError ? "profile-phone-error" : undefined}
                    />
                    {phoneError && (
                        <span className="field-error" id="profile-phone-error">
                            {phoneError}
                        </span>
                    )}
                </div>

                {successMessage && (
                    <FormSuccess
                        message="Profile updated"
                        description={successMessage}
                    />
                )}

                <CTAButton
                    text="Edit profile"
                    type="submit"
                    isDisabled={fieldsDisabled || isSubmitting || isSaved}
                    disabledText={
                        isLoading
                            ? "Loading profile..."
                            : isSubmitting
                                ? "Saving..."
                                : "Edit profile"
                    }
                    successText="Profile updated!"
                    isSuccess={isSaved}
                />
                <BackButton navigateTo={from} />
            </form>

            <div className="profile-page__account-actions">
                <button
                    className="profile-page__change-password"
                    type="button"
                    onClick={() => navigate("/change-password")}
                >
                    Change password
                </button>
                <button
                    className="profile-page__delete-profile"
                    type="button"
                    onClick={() => setIsDeleteModalOpen(true)}
                    disabled={!user?.id}
                >
                    Delete profile
                </button>
            </div>

            {isDeleteModalOpen && (
                <Modal
                    title="Delete profile?"
                    description="This will permanently remove your profile. This action cannot be undone."
                    confirmLabel="Delete profile"
                    onConfirm={handleDeleteProfile}
                    onCancel={() => setIsDeleteModalOpen(false)}
                    isSubmitting={isDeleting}
                />
            )}
        </section>
    )
}

export default ProfilePage
