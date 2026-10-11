import { useNavigate } from "react-router-dom";

import ProductForm from "../components/ProductForm.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { addProduct } from "../services/products.js";

import "./ProductFormPage.css"
import PageHeader from "../components/PageHeader.jsx";
import { formTimeout } from "../constants.js";

function SellProductPage({ onListProduct }) {
    const navigate = useNavigate()
    const { user } = useAuth()

    async function handleSubmit(product) {
        if (!product.image) {
            throw new Error("A product image is required.")
        }
        if (!product.id) {
            product.id = crypto.randomUUID()
        }

        await addProduct(product, user.id)
        await onListProduct()

        setTimeout(() => navigate("/"), formTimeout)
    }

    return (
        <section className="section" id="sell-product-page">
            <PageHeader
                header={"Sell your product"}
                description={"Give something a new home on campus."} />
            
            <ProductForm
                onSubmit={handleSubmit}
                submitLabel={"List Product"}
                errorMessage={"Could not list your product."}
                successMessage={"Product listed successfully!"} />
        </section>
    )
}

export default SellProductPage