import "./FormStatus.css"

export function FormError({ message, description }) {
    return (
        <div className="form-status form-error">
            <strong className="form-message error-message">
                {message}
            </strong>
            <p className="form-label error-label">
                {description}
            </p>
        </div>
    )
}

export function FormSuccess({ message, description }) {
    return (
        <div className="form-status form-success">
            <strong className="form-message success-message">
                {message}
            </strong>
            <p className="form-label success-label">
                {description}
            </p>
        </div>
    )
}

export function FormStatus({ message, description }) {
    return (
        <div className="form-status">
            <strong className="form-message">
                {message}
            </strong>
            <p className="form-label">
                {description}
            </p>
        </div>
    )
}