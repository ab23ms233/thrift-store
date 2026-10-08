import { useNavigate } from "react-router-dom";

import ProductForm from "../components/ProductForm.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { addProduct } from "../services/products.js";

function SellProductPage({ onListProduct }) {
    const navigate = useNavigate()
    const { user } = useAuth()

    async function handleSubmit(product) {
        if (!product.image) {
            return
        }
        if (!product.id) {
            product.id = crypto.randomUUID()
        }

        try {
            await addProduct(product, user.id)
            await onListProduct()
            navigate("/")

        } catch (error) {
            console.error("Error listing product:", error)
        }
    }

    return (
        <ProductForm 
            onSubmit={handleSubmit}
            submitLabel={"List Product"}
        />
    )
}

export default SellProductPage