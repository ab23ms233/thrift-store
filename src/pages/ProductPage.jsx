import { useState } from "react"
import { useLocation, useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import "./ProductPage.css"
import "../components/CTAButton.css"
import Modal from "../components/Modal"
import { useAuth } from "../context/AuthContext"
import { deleteProduct, markProductAsSold } from "../services/products"

export function ProductRoute({
    products,
    onProductsChanged
}) {
    const { productId } = useParams()
    const product = products.find(
        product => productId === String(product.id)
    )

    return product
        ? <ProductPage
            product={product}
            onProductsChanged={onProductsChanged} />
        : <p>Product not found.</p>
}

function ProductPage({
    product,
    onProductsChanged
}) {
    const location = useLocation()
    const navigate = useNavigate()
    const { user } = useAuth()
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const from = location.state?.from || "/"
    const isOwner = user?.id === product.owner_id
    const isAvailable = product.status === "AVAILABLE"
    const statusLabel = isAvailable
        ? "Available"
        : product.status === "SOLD"
            ? "Sold"
            : product.status
    const ownerEmail = product.owner_email?.email
    const postedDate = new Date(product.created_at).toLocaleDateString(
        "en-GB",
        { day: "numeric", month: "long", year: "numeric" }
    )

    async function handleDelete() {
        setIsDeleting(true)

        try {
            await deleteProduct(product.id, user.id)
            await onProductsChanged()
            setIsDeleteModalOpen(false)
            navigate(from)
        } finally {
            setIsDeleting(false)
        }
    }

    async function handleSold() {
        await markProductAsSold(product.id, user.id)
        await onProductsChanged()
        navigate(from)
    }

    return (
        <>
            <div className="product-page">
                <h1 className="product-page__heading">Product details</h1>

                <article className="product-page__card">
                    <div className="product-page__image">
                        <img src={product.image_url} alt={product.title} />
                    </div>

                    <div className="product-page__details">
                        <div className="product-page__summary">
                            <h2 className="product-page__title">{product.title}</h2>
                            <div className="product-page__price-row">
                                <p className="product-page__price">₹{product.price}</p>
                                <span
                                    className={`product-page__status${isAvailable ? "" : " is-unavailable"}`}
                                    aria-label={`Status: ${product.status}`}
                                >
                                    <span className="product-page__status-indicator" />
                                    {statusLabel}
                                </span>
                            </div>
                        </div>

                        <section className="product-page__description">
                            <h3>Description</h3>
                            <p>{product.description}</p>
                        </section>

                        <div className="product-page__posted">
                            <span className="product-page__field-label">Posted On</span>
                            <time dateTime={product.created_at}>{postedDate}</time>
                        </div>

                        <section className="product-page__owner">
                            <div className="product-page__owner-field">
                                <h3 className="product-page__field-label">Owner name</h3>
                                <p>{product.owner_name?.full_name}</p>
                            </div>
                            <div className="product-page__owner-field">
                                <h3 className="product-page__field-label">Contact owner (email)</h3>
                                {ownerEmail
                                    ? <a href={`mailto:${ownerEmail}`}>{ownerEmail}</a>
                                    : <p className="product-page__email-unavailable">Email unavailable</p>}
                            </div>
                        </section>
                    </div>
                </article>

                <div className="product-page__actions">
                    {isOwner && (
                        <div className="product-page__owner-actions">
                            <button
                                type="button"
                                className="product-page__button product-page__button--secondary"
                                id="edit-button"
                                onClick={() => navigate(`/products/${product.id}/edit`)}
                            >
                                Edit
                            </button>
                            <button
                                type="button"
                                className="product-page__button product-page__button--secondary"
                                id="delete-button"
                                onClick={() => setIsDeleteModalOpen(true)}
                            >
                                Delete
                            </button>
                            <button
                                type="button"
                                className="product-page__button product-page__button--secondary cta-button"
                                id="mark-as-sold-button"
                                onClick={handleSold}
                                disabled={!isAvailable}
                            >
                                Mark as Sold
                            </button>
                        </div>
                    )}

                    <button
                        type="button"
                        className="product-page__button product-page__button--back"
                        onClick={() => navigate("/")}
                    >
                        Back
                    </button>
                    <p className="product-page__guidance">
                        Arrange pickup and payment directly on campus.
                    </p>
                </div>
            </div>
            {isDeleteModalOpen && (
                <Modal
                    title="Delete product?"
                    description={(
                        <>
                            This will remove your <strong>{product.title}</strong> listing
                            from the campus marketplace. This cannot be undone.
                        </>
                    )}
                    confirmLabel="Delete Product"
                    onConfirm={handleDelete}
                    onCancel={() => setIsDeleteModalOpen(false)}
                    isSubmitting={isDeleting}
                />
            )}
        </>
    )
}

export default ProductPage