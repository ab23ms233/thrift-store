import "./CTAButton.css"

function CTAButton({ 
    text, 
    type, 
    isDisabled, 
    disabledText,
    successText,
    isSuccess,
    onClick
}) {
    const buttonText = isSuccess
        ? successText
            ? successText
            : text
        : isDisabled
            ? disabledText
            : text
    return (
        <button
            className="cta-button"
            type={type}
            disabled={isDisabled}
            onClick={onClick} >
            {buttonText}
        </button>
    )
}

export default CTAButton