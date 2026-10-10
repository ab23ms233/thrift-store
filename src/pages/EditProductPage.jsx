import { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductForm from "../components/ProductForm.jsx";
import { editProduct } from "../services/products.js";
import { useAuth } from "../context/AuthContext.jsx";

import "./ProductFormPage.css"

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

    async function handleSubmit(fields) {
        await editProduct(product.id, fields, user.id)
        await onEditProduct()
    }

    const handleSuccess = useCallback(
        () => navigate(`/products/${product.id}`),
        [navigate, product.id]
    )

    return (
        <section className="product-form-page edit-product-page">
            <div className="page-description">
                <h3 className="page-header">
                    Edit Product
                </h3>
                <p className="page-label">
                    Keep your listing up to date.
                </p>
            </div>

            <ProductForm
                initialProduct={product}
                onSubmit={handleSubmit}
                submitLabel={"Edit Product"}
                errorMessage={"Could not edit your product."}
                successMessage={"Product edited successfully."}
                onSuccess={handleSuccess}
            />
        </section>
    )
}

export default EditProductPage