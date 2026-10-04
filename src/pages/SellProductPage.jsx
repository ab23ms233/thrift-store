import { useNavigate } from "react-router-dom";
import ProductForm from "../components/ProductForm.jsx";

function SellProductPage({ onListProduct }) {
    const navigate = useNavigate()

    function handleSubmit(product) {
        if (!product.image) {
            return
        }

        onListProduct({
            ...product,
            id: crypto.randomUUID(),
            price: Number(product.price),
            image: URL.createObjectURL(product.image)
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