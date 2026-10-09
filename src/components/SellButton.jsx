import { useNavigate } from "react-router-dom"
import "./SellButton.css"

function SellButton() {
    const navigate = useNavigate()

    return (
        <button className="sell-button" onClick={() => navigate("/sell")}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M6 12H18M12 6V18" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
            <p className="sell-text">Sell</p>
        </button>
    )
}

export default SellButton

