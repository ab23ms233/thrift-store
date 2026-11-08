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
    const error = params.get("error")
    const errorDescription = params.get("error_description")

    if (error) {
        navigate("/email-verified?error=callback_failed", {
            replace: true
        })
        return
    }

    if (!code) {
        navigate("/email-verified?error=missing_code", {
            replace: true
        })
        return
    }

    const { error: exchangeError } = 
        await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
        navigate("/email-verified?error=exchange_failed", {
            replace: true
        })
        return
    }

    navigate("/email-verified", { replace: true })
}
