import "./Spinner.css"

export function Spinner({ size = 48, label = "Loading..." }) {
    return (
        <div className="spinner-cont">
            <div
                className="spinner"
                style={{ "--spinner-size": `${size}px` }}
                role="status"
                aria-label={label}>
                {Array.from({ length: 12 }, (_, index) => (
                    <span
                        className="spinner-line"
                        key={`spinner-line-${index}`}
                        style={{ "--i": index }} />
                ))}
                <p className="spinner-label">
                    {label}
                </p>
            </div>

        </div>
    )
}
