import { useNavigate } from "react-router-dom";

import ProductForm from "../components/product/ProductForm.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { addProduct } from "../services/products.js";

import "./ProductFormPage.css"
import PageHeader from "../components/common/PageHeader.jsx";
import { formTimeout } from "../constants.js";
import { useEffect, useState } from "react";

function SellProductPage({ onListProduct }) {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [createdProductId, setCreatedProductId] = useState(null)

    useEffect(() => {
        if (!createdProductId) return

        const redirectTimeout = window.setTimeout(() => {
            navigate(`/products/${createdProductId}`)
        }, formTimeout)

        return () => window.clearTimeout(redirectTimeout)
    }, [createdProductId, navigate])

    async function handleSubmit(product) {
        if (!product.images) {
            throw new Error("A product image is required.")
        }
        const createdProduct = await addProduct(product, user.id)
        await onListProduct()
        setCreatedProductId(createdProduct.id)
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