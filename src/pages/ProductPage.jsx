import { useEffect, useState } from "react"
import { useLocation, useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import "./ProductPage.css"
import "../components/CTAButton.css"
import Modal from "../components/Modal.jsx"
import { useAuth } from "../context/AuthContext.jsx"
import { deleteProduct, markProductAsSold } from "../services/products.js"
import PageHeader from "../components/PageHeader.jsx"
import BackButton from "../components/BackButton.jsx"
import { getProfile } from "../services/profile.js"
import CTAButton from "../components/CTAButton.jsx"
import { formTimeout } from "../constants.js"
import { FormError } from "../components/FormStatus.jsx"

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

    const [isMarkingAsSold, setIsMarkingAsSold] = useState(false)
    const [markedAsSold, setMarkedAsSold] = useState(false)

    const [userProfile, setUserProfile] = useState(null)
    const [profileError, setProfileError] = useState(null)

    const [errorMessage, setErrorMessage] = useState("")

    useEffect(() => {
        let isCurrent = true

        async function fetchProfile() {
            try {
                const profile = await getProfile(product.owner_id)
                if (isCurrent) setUserProfile(profile)
            } catch (error) {
                if (isCurrent) setProfileError(error)
            }
        }

        fetchProfile()

        return () => {
            isCurrent = false
        }
    }, [product.owner_id])

    const from = location.state?.from || "/"
    const isOwner = user?.id === product.owner_id
    const isAvailable = product.status === "AVAILABLE"
    const statusLabel = isAvailable
        ? "Available"
        : product.status === "SOLD"
            ? "Sold"
            : product.status
    const ownerEmail = userProfile?.email
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
        } catch (error) {
            console.error("Error deleting product:", product.id, error)
            setErrorMessage(error)
        } finally {
            setIsDeleting(false)
        }
    }

    async function handleSold() {
        setMarkedAsSold(false)
        setIsMarkingAsSold(true)

        try {
            await markProductAsSold(product.id, user.id)
            setMarkedAsSold(true)
            await onProductsChanged()
            setTimeout(() => {
                navigate(from)
            }, formTimeout)
        } catch (error) {
            console.error("Error marking product as sold:", product.id, error)
            setErrorMessage(error)
        } finally {
            setIsMarkingAsSold(true)
        }
    }

    return (
        <section className="section" id="product-page">
            <PageHeader
                header={"Product details"}
                description={""} />

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
                            <p>{userProfile?.full_name ?? "Name currently not available."}</p>
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

                        <CTAButton
                            text={"Mark as sold"}
                            type={"button"}
                            isDisabled={isMarkingAsSold || markedAsSold}
                            disabledText={"Changing status..."}
                            successText={"Product sold!"}
                            isSuccess={markedAsSold}
                            onClick={handleSold} />
                    </div>
                )}

                <BackButton navigateTo={from} />

                <p className="product-page__guidance">
                    Arrange pickup and payment directly on campus.
                </p>

                {
                    errorMessage && (
                        <FormError
                            message={"An error occurred."}
                            description={"The action could not be completed. Please try again later."} />
                    )
                }
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
        </section>
    )
}

export default ProductPage