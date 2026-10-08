import { useNavigate, useParams } from "react-router-dom";
import ProductForm from "../components/ProductForm.jsx";
import { editProduct } from "../services/products.js";
import { useAuth } from "../context/AuthContext.jsx";

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
        try {
            await editProduct(product.id, fields, user.id)
            await onEditProduct()
            navigate(`/products/${product.id}`)
        } catch (error) {
            console.error("Could not update product:", product.id, error)
        }
    }

    return (
        <ProductForm
            initialProduct={product}
            onSubmit={handleSubmit}
            submitLabel={"Edit Product"}
        />
    )
}

export default EditProductPage