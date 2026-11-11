import { supabase } from "../lib/supabase"

export async function handleAuthUrl(rawUrl, navigate) {
    const url = new URL(rawUrl)

    const isAuthCallback = 
        url.protocol === "in.ac.iiserkolkata.thriftstore:" &&
        url.host === "auth" &&
        url.pathname === "/callback"

    if (!isAuthCallback) return

    const params = new URLSearchParams(url.search)
    const code = params.get("code")
    const flow = params.get("flow") || "verification"
    const error = params.get("error")
    const errorDescription = params.get("error_description")

    const destination = flow === "password-reset"
        ? "/reset-password"
        : "/email-verified"

    if (error) {
        navigate(`${destination}?error=callback_failed`, {
            replace: true
        })
        return
    }

    if (!code) {
        navigate(`${destination}?error=missing_code`, {
            replace: true
        })
        return
    }

    const { error: exchangeError } = 
        await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
        navigate(`${destination}?error=exchange_failed`, {
            replace: true
        })
        return
    }

    navigate(destination, { replace: true })
}
