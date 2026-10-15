import { useNavigate, useParams } from "react-router-dom";
import ProductForm from "../components/product/ProductForm.jsx";
import { editProduct } from "../services/products.js";
import { useAuth } from "../context/AuthContext.jsx";

import PageHeader from "../components/common/PageHeader.jsx";
import { formTimeout } from "../constants.js";
import { useEffect, useState } from "react";

export function EditProductRoute({ products, onEditProduct }) {
    const { productId } = useParams()
    const product = products.find(product => String(product.id) === productId)

    return product
        ? <EditProductPage
            product={product}
            onEditProduct={onEditProduct}
        />
        : <p>Product not found.</p>
}

function EditProductPage({ product, onEditProduct }) {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [isUpdated, setIsUpdated] = useState(false)

    useEffect(() => {
        if (!isUpdated) return

        const redirectTimeout = window.setTimeout(() => {
            navigate(`/products/${product.id}`)
        }, formTimeout)

        return () => window.clearTimeout(redirectTimeout)
    }, [isUpdated, navigate, product.id])

    async function handleSubmit(fields) {
        await editProduct(product.id, fields, user.id)
        await onEditProduct()
        setIsUpdated(true)
    }

    return (
        <section className="section" id="edit-product-page">
            <PageHeader
                header={"Edit your product"}
                description={"Keep your listings updated."} />

            <ProductForm
                initialProduct={product}
                onSubmit={handleSubmit}
                submitLabel={"Edit Product"}
                errorMessage={"Could not edit your product."}
                successMessage={"Product edited successfully!"} />
        </section>
    )
}

export default EditProductPage