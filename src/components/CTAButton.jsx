import "./CTAButton.css"

function CTAButton({ 
    text, 
    type, 
    disabled, 
    disabledText,
    successText,
    isSuccess
}) {
    const buttonText = isSuccess
        ? successText
        : disabled
            ? disabledText
            : text
    return (
        <button
            className="cta-button"
            type={type}
            disabled={disabled}
        >
            {buttonText}
        </button>
    )
}

export default CTAButton