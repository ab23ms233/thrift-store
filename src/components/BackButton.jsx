import { useNavigate } from "react-router-dom"
import "./BackButton.css"

function BackButton({ navigateTo }) {
    const navigate = useNavigate()
    return (
        <button
            type="button"
            className="back-button"
            onClick={() => navigate(navigateTo)} >
            Back
        </button>
    )
}

export default BackButton