import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { formTimeout } from "../constants";

import "./EmailVerifiedPage.css"
import { FormError, FormStatus, FormSuccess } from "../components/FormStatus";

function hasCallbackError(search, hash) {
    const queryParams = new URLSearchParams(search)
    const hasParams = new URLSearchParams(hash.replace(/^#/, ""))

    return (
        queryParams.has("error") ||
        queryParams.has("error_code") ||
        hasParams.has("error") ||
        hasParams.has("error_code")
    )
}

function EmailVerifiedPage() {
    const location = useLocation()
    const navigate = useNavigate()
    const [status, setStatus] = useState("loading")

    useEffect(() => {
        let isCurrent = true
        let redirectTimeout

        async function checkVerification() {
            if (hasCallbackError(location.search, location.hash)) {
                if (isCurrent) setStatus("error")
                return
            }

            try {
                const { data: sessionData, error: sessionError } =
                    await supabase.auth.getSession()

                if (sessionError) throw sessionError

                if (!sessionData.session) {
                    if (isCurrent) setStatus("no-session")
                    return
                }

                const { data: userData, error: userError } =
                    await supabase.auth.getUser()

                if (userError) throw userError

                if (!userData.user?.email_confirmed_at) {
                    if (isCurrent) setStatus("unverified")
                    return
                }

                if (isCurrent) {
                    setStatus("verified")
                    redirectTimeout = window.setTimeout(() => {
                        navigate("/", { replace: true })
                    }, formTimeout)
                }

            } catch (error) {
                console.error("Could not verify email callback:", error)

                if (isCurrent) setStatus("error")
            }
        }

        checkVerification()

        return () => {
            isCurrent = false

            if (redirectTimeout !== undefined) {
                window.clearTimeout(redirectTimeout)
            }
        }
    }, [location.hash, location.search, navigate])

    return (
        <section
            className="section"
            id="email-verification-page">
            {
                status === "loading" && (
                    <FormStatus
                        message={"Verifying your email..."}
                        description={"Please wait while we confirm your account."} />
                )
            }

            {
                status === "no-session" && (
                    <>
                        <FormStatus
                            message={"Check your sign-in"}
                            description={"We couldn't confirm an active session in this browser. If you just clicked a valid verification link, try logging in."} />

                        <Link to="/login">Go to login</Link>
                    </>
                )
            }

            {
                status === "unverified" && (
                    <>
                        <FormError
                            message={"Email not verified"}
                            description={"This account does not appear to have a confirmed email address. Try signing in or signing up again."} />

                        <div className="email-verification-button-cont">
                            <Link to="/login">Go to login</Link>
                            {" · "}
                            <Link to="/sign-up">Back to sign up</Link>
                        </div>
                    </>
                )
            }

            {
                status === "error" && (
                    <>
                        <FormError
                            message={"Verification link couldn't be used."}
                            description={"The link may be invalid or expired. Try signing in, or return to sign up to request another verification email."} />

                        <div className="email-verification-button-cont">
                            <Link to="/login">Go to login</Link>
                            {" · "}
                            <Link to="/sign-up">Back to sign up</Link>
                        </div>
                    </>
                )
            }

            {
                status === "verified" && (
                    <FormSuccess
                        message={"Email Verified!"}
                        description={`Your email has been verified.
                            Redirecting you to the Home page..`} />
                )
            }
        </section>
    )
}

export default EmailVerifiedPage