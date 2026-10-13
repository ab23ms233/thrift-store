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
    const ownerPhone = userProfile?.phone
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
                        <h3 className="product-page__field-label">Description</h3>
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
                            <h3 className="product-page__field-label">Contact owner</h3>
                            <div className="product-page__contacts-cont">
                                <div className="product-page__contact-cont">
                                    <svg
                                        className="product-page__contact-icon"
                                        id="product-page__email-icon"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        role="img"
                                        aria-label="Email"
                                    >
                                        <rect x="3" y="5" width="18" height="14" rx="2" />
                                        <path d="m3 7 9 6 9-6" />
                                    </svg>
                                    {ownerEmail
                                        ? <a href={`mailto:${ownerEmail}`}>{ownerEmail}</a>
                                        : <p className="product-page__email-unavailable">Email unavailable</p>}

                                </div>

                                <div className="product-page__contact-cont">
                                    <svg
                                        className="product-page__contact-icon"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        role="img"
                                        aria-label="Phone"
                                    >
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.2 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.35 1.9.69 2.8a2 2 0 0 1-.45 2.11L8.08 9.92a16 16 0 0 0 6 6l1.29-1.27a2 2 0 0 1 2.11-.45c.9.34 1.84.57 2.8.69A2 2 0 0 1 22 16.92z" />
                                    </svg>
                                    {ownerPhone
                                        ? <p className="product-page__phone-number">
                                            {ownerPhone}</p>
                                        : <p className="product-page__phone-unavailable">
                                            Phone number unavailable
                                        </p>
                                    }
                                </div>
                            </div>
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