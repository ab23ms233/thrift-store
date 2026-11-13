import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Spinner } from "./Spinner";

export default function ProtectedRoute() {
    const { user, loading, setUser } = useAuth()
    const location = useLocation()
    const [checkingSession, setCheckingSession] = useState(true)

    useEffect(() => {
        let isActive = true
        setCheckingSession(true)

        async function restoreSession() {
            if (loading) return

            if (user) {
                setCheckingSession(false)
                return
            }

            const { data, error } = await supabase.auth.getUser()

            if (!isActive) return

            if (!error && data.user) {
                setUser(data.user)
            }

            setCheckingSession(false)
        }

        restoreSession()

        return () => {
            isActive = false
        }
    }, [loading, user, setUser])

    if (loading || checkingSession) {
        return <Spinner />
    }

    if (!user) {
        return (
            <Navigate
                to={"/login"}
                replace
                state={{ from: location }} />
        )
    }

    return <Outlet />
}