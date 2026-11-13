import { Capacitor } from "@capacitor/core"

const NATIVE_AUTH_CALLBACK = "in.ac.iiserkolkata.thriftstore://auth/callback"

export function getAuthRedirectUrl(flow) {
    const webPath = flow === "reset-password"
        ? "/reset-password"
        : "/email-verified"

    if (Capacitor.isNativePlatform()) {
        return `${NATIVE_AUTH_CALLBACK}?flow=${encodeURIComponent(flow)}`
    }

    return `${window.location.origin}${webPath}`
}
