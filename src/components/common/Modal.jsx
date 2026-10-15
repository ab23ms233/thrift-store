import { useEffect, useRef } from "react"
import "./Modal.css"

function Modal({
    title,
    description,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    onConfirm,
    onCancel,
    isSubmitting = false
}) {
    const dialogRef = useRef(null)
    const cancelButtonRef = useRef(null)
    const previousFocusRef = useRef(null)
    const onCancelRef = useRef(onCancel)
    const isSubmittingRef = useRef(isSubmitting)

    onCancelRef.current = onCancel
    isSubmittingRef.current = isSubmitting

    useEffect(() => {
        previousFocusRef.current = document.activeElement
        cancelButtonRef.current?.focus()

        function handleKeyDown(event) {
            if (event.key === "Escape" && !isSubmittingRef.current) {
                onCancelRef.current()
            }

            if (event.key !== "Tab") {
                return
            }

            const focusableElements = dialogRef.current?.querySelectorAll(
                "button:not(:disabled)"
            ) ?? []
            const firstElement = focusableElements[0]
            const lastElement = focusableElements[focusableElements.length - 1]

            if (event.shiftKey && document.activeElement === firstElement) {
                event.preventDefault()
                lastElement?.focus()
            } else if (!event.shiftKey && document.activeElement === lastElement) {
                event.preventDefault()
                firstElement?.focus()
            }
        }

        document.addEventListener("keydown", handleKeyDown)
        document.body.classList.add("modal-open")

        return () => {
            document.removeEventListener("keydown", handleKeyDown)
            document.body.classList.remove("modal-open")
            previousFocusRef.current?.focus()
        }
    }, [])

    function handleBackdropClick(event) {
        if (event.target === event.currentTarget && !isSubmitting) {
            onCancel()
        }
    }

    return (
        <div
            className="modal-backdrop"
            onMouseDown={handleBackdropClick}
        >
            <section
                ref={dialogRef}
                className="modal-dialog"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <div className="modal-message">
                    <h2 id="modal-title">{title}</h2>
                    <p id="modal-description">{description}</p>
                </div>

                <div className="modal-actions">
                    <button
                        type="button"
                        className="modal-button modal-button--confirm"
                        onClick={onConfirm}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Deleting…" : confirmLabel}
                    </button>
                    <button
                        ref={cancelButtonRef}
                        type="button"
                        className="modal-button modal-button--cancel"
                        onClick={onCancel}
                        disabled={isSubmitting}
                    >
                        {cancelLabel}
                    </button>
                </div>
            </section>
        </div>
    )
}

export default Modal
