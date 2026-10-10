import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import ProductForm from "../components/ProductForm.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { addProduct } from "../services/products.js";

import "./ProductFormPage.css"

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
    }

    const handleSuccess = useCallback(() => navigate("/"), [navigate])

    return (
        <section className="product-form-page sell-product-page">
            <div className="page-description">
                <h3 className="page-header">
                    Sell Product
                </h3>
                <p className="page-label">
                    Give something a new home on campus.
                </p>
            </div>
            
            <ProductForm
                onSubmit={handleSubmit}
                submitLabel={"List Product"}
                errorMessage={"Could not list your product."}
                successMessage={"Product listed successfully."}
                onSuccess={handleSuccess}
            />
        </section>
    )
}

export default SellProductPage