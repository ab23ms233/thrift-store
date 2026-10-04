import { useNavigate } from "react-router-dom";
import ProductForm from "../components/ProductForm.jsx";

function SellProductPage({ onListProduct, currentUser }) {
    const navigate = useNavigate()

    function handleSubmit(product) {
        if (!product.image) {
            return
        }

        onListProduct({
            ...product,
            id: crypto.randomUUID(),
            price: Number(product.price),
            image: URL.createObjectURL(product.image),
            ownerId: currentUser.id,
            postedOn: new Date().toISOString(),
            status: "AVAILABLE"
        })

        navigate("/")
    }

    return (
        <ProductForm 
            onSubmit={handleSubmit}
            submitLabel={"List Product"}
        />
    )
}

export default SellProductPage