import "./ShowPasswordButton.css"

function ShowPasswordButton({
    showPassword,
    setShowPassword
}) {
    return (
        <button
            type="button"
            className="toggle-password"
            onClick={() => {
                setShowPassword((previous) => !previous)
            }}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
        >
            {
                showPassword
                    ? "Hide"
                    : "Show"
            }
        </button>
    )
}

export default ShowPasswordButton