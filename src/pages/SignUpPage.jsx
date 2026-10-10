import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

import "../components/Form.css"
import { useAuth } from "../context/AuthContext";

function SignUpPage() {
    const navigate = useNavigate()
    const { setUser } = useAuth()

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [emailError, setEmailError] = useState("")

    function isInstituteEmail(email) {
        return email.toLowerCase().endsWith("@iiserkol.ac.in")
    }

    async function handleSignUp(event) {
        event.preventDefault()
        setErrorMessage("");
        setSuccessMessage("");
        setIsSubmitting(true);

        if (!isInstituteEmail(email)) {
            setEmailError("Use your IISERK email address.")
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

            setTimeout(() => {
                navigate("/")
            }, 1000)
        } catch (error) {
            setErrorMessage(error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <form className="form signup-form" onSubmit={handleSignUp}>
                <div className="form-field">
                    <label htmlFor="login-name-input">Full Name</label>
                    <input
                        id="login-name-input"
                        type="text"
                        placeholder="Your name..."
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        required />
                </div>

                <div className="form-field">
                    <label htmlFor="login-email-input">Institute Email</label>
                    <input
                        id="login-email-input"
                        type="email"
                        value={email}
                        placeholder="Enter your institute email..."
                        onChange={(event) => {
                            setEmail(event.target.value)
                            setEmailError("")
                        }}
                        autoComplete="email"
                        required
                    />

                    {emailError &&
                        <p className="field-error">{emailError}</p>
                    }
                </div>

                <div className="form-field">
                    <label htmlFor="login-email-password">Set Password</label>
                    <input
                        id="login-email-password"
                        type="password"
                        placeholder="Set your password..."
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        autoComplete="new-password"
                        required />
                </div>

                {errorMessage && <p role="alert">{errorMessage}</p>}
                {successMessage && <p role="status">{successMessage}</p>}

                <button type="submit">Create account</button>
            </form>
        </>
    )
}

export default SignUpPage