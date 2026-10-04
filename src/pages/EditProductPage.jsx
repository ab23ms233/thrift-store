import { useNavigate, useParams } from "react-router-dom";
import ProductForm from "../components/ProductForm.jsx";

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

    function handleSubmit(fields) {
        const updatedProduct = {
            ...product,
            ...fields,
            price: Number(fields.price),
            image: fields.image
            ? URL.createObjectURL(fields.image)
            : product.image
        }

        onEditProduct(updatedProduct)
        navigate(`/products/${product.id}`)
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