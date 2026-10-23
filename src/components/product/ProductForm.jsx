import "./ProductForm.css"
import "../common/Form.css"
import { useEffect, useState } from "react"

import { getCategories } from "../../services/categories.js";
import CTAButton from "../button/CTAButton.jsx"

import { FormError, FormSuccess } from "../common/FormStatus.jsx";
import "../common/FormStatus.css"
import BackButton from "../button/BackButton.jsx";
import { useLocation } from "react-router-dom";
import { MAX_FILE_SIZE, MAX_FILES } from "../../constants.js";

function ImageFrameIcon() {
    return (
        <svg
            className="image-frame"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <rect x="3" y="4" width="18" height="16" rx="1" />
            <path d="M3 16.71 7.71 12l8 8H4a1 1 0 0 1-1-1v-2.29Z" />
            <path d="m10.51 14.8 4.78-4.8L21 15.73V19a1 1 0 0 1-1 1h-4.29l-5.2-5.2Z" />
            <path d="M10.08 8.29h.1" />
        </svg>
    )
}

function RemoveIcon() {
    return (
        <svg className="remove-icon" viewBox="0 -0.5 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M6.96967 16.4697C6.67678 16.7626 6.67678 17.2374 6.96967 17.5303C7.26256 17.8232 7.73744 17.8232 8.03033 17.5303L6.96967 16.4697ZM13.0303 12.5303C13.3232 12.2374 13.3232 11.7626 13.0303 11.4697C12.7374 11.1768 12.2626 11.1768 11.9697 11.4697L13.0303 12.5303ZM11.9697 11.4697C11.6768 11.7626 11.6768 12.2374 11.9697 12.5303C12.2626 12.8232 12.7374 12.8232 13.0303 12.5303L11.9697 11.4697ZM18.0303 7.53033C18.3232 7.23744 18.3232 6.76256 18.0303 6.46967C17.7374 6.17678 17.2626 6.17678 16.9697 6.46967L18.0303 7.53033ZM13.0303 11.4697C12.7374 11.1768 12.2626 11.1768 11.9697 11.4697C11.6768 11.7626 11.6768 12.2374 11.9697 12.5303L13.0303 11.4697ZM16.9697 17.5303C17.2626 17.8232 17.7374 17.8232 18.0303 17.5303C18.3232 17.2374 18.3232 16.7626 18.0303 16.4697L16.9697 17.5303ZM11.9697 12.5303C12.2626 12.8232 12.7374 12.8232 13.0303 12.5303C13.3232 12.2374 13.3232 11.7626 13.0303 11.4697L11.9697 12.5303ZM8.03033 6.46967C7.73744 6.17678 7.26256 6.17678 6.96967 6.46967C6.67678 6.76256 6.67678 7.23744 6.96967 7.53033L8.03033 6.46967ZM8.03033 17.5303L13.0303 12.5303L11.9697 11.4697L6.96967 16.4697L8.03033 17.5303ZM13.0303 12.5303L18.0303 7.53033L16.9697 6.46967L11.9697 11.4697L13.0303 12.5303ZM11.9697 12.5303L16.9697 17.5303L18.0303 16.4697L13.0303 11.4697L11.9697 12.5303ZM13.0303 11.4697L8.03033 6.46967L6.96967 7.53033L11.9697 12.5303L13.0303 11.4697Z" fill="#000000"></path> </g></svg>
    )
}

function RemoveImageButton({ file, index, removeImage }) {
    return (
        <button
            type="button"
            className="remove-image-button"
            onClick={() => removeImage(index)}
            aria-label={`Remove ${file.name}`}
        >
            <RemoveIcon />
        </button>
    )
}

function ProductForm({
    initialProduct,
    onSubmit,
    submitLabel,
    errorMessage,
    successMessage
}) {
    const [title, setTitle] = useState(initialProduct?.title ?? "");
    const [description, setDescription] = useState(initialProduct?.description ?? "");
    const [price, setPrice] = useState(initialProduct?.price ?? "");
    const [categoryId, setCategoryId] = useState(initialProduct?.category_id ?? "");
    const [imageFiles, setImageFiles] = useState([])

    const [titleError, setTitleError] = useState("")
    const [priceError, setPriceError] = useState("")
    const [categoryError, setCategoryError] = useState("")
    const [imageError, setImageError] = useState("")

    const [formError, setFormError] = useState(false)
    const [formSuccess, setFormSuccess] = useState(false)

    const [categories, setCategories] = useState([])
    const [isSubmitting, setIsSubmitting] = useState(false)

    const location = useLocation()
    const from = location.state?.from || "/"

    useEffect(() => {
        async function fetchCategories() {
            const data = await getCategories()
            setCategories(data)
        }

        fetchCategories()
    }, [])

    function validateTitle(value) {
        const error = value.trim() ? "" : "Please enter a title."
        setTitleError(error)
        return error
    }

    function handleImageChange(event) {
        const selectedFiles = Array.from(event.target.files || [])

        validateImages(selectedFiles)

        setImageFiles((previousFiles) => {
            const remainingSlots = MAX_FILES - previousFiles.length
            const newFiles = selectedFiles.slice(0, remainingSlots)

            return [...previousFiles, ...newFiles]
        })

        event.target.value = ""
    }

    function removeImage(indexToRemove) {
        setImageFiles((previousFiles) =>
            previousFiles.filter((_, index) => index !== indexToRemove)
        )
    }

    function validatePrice(value) {
        let error = ""
        const numericPrice = Number(value)

        if (!String(value).trim()) {
            error = "Please enter a price."
        } else if (!Number.isFinite(numericPrice) || numericPrice < 0) {
            error = "Enter a valid price of 0 or more."
        }

        setPriceError(error)
        return error
    }

    function validateCategory(value) {
        const error = value ? "" : "Please select a category."
        setCategoryError(error)
        return error
    }

    function validateImages(files) {
        let error = ""

        if (!files.length && !initialProduct) {
            error = "Please add a product image."
        }

        for (let i = 0; i < files.length; i++) {
            const file = files[i]

            if (file && !file.type.startsWith("image/")) {
                error = "Please choose an image file."
                break
            } else if (file && file.size > MAX_FILE_SIZE * 1024 * 1024) {
                error = "Image must be 5 MB or smaller."
                break
            }
        }

        setImageError(error)
        return error
    }

    async function handleSubmitForm(event) {
        event.preventDefault()

        const hasErrors = [
            validateTitle(title),
            validatePrice(price),
            validateCategory(categoryId),
            validateImages(imageFiles)
        ].some(Boolean)

        if (hasErrors) {
            return
        }

        setFormError(false)
        setFormSuccess(false)
        setIsSubmitting(true)

        try {
            await onSubmit({
                title,
                description,
                price,
                categoryId,
                images: imageFiles
            })
            setFormSuccess(true)
        } catch (error) {
            console.error("Could not save product:", error)
            setFormError(true)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form className="form" id="product-form" onSubmit={handleSubmitForm} noValidate>
            <div className="form-field">
                <label htmlFor="product-title">Title*</label>
                <input
                    id="product-title"
                    className={`input-box ${titleError ? "input-box--error" : ""}`}
                    placeholder="e.g. Scientific Calculator"
                    type="text"
                    value={title}
                    onChange={event => {
                        setTitle(event.target.value)
                        if (titleError) validateTitle(event.target.value)
                    }}
                    onBlur={event => validateTitle(event.target.value)}
                    aria-invalid={Boolean(titleError)}
                    aria-describedby={titleError ? "title-error" : undefined}
                    required
                />
                {titleError && <span className="field-error" id="title-error">{titleError}</span>}
            </div>

            <div className="form-field">
                <label htmlFor="product-description">Description (optional)</label>
                <textarea
                    id="product-description"
                    placeholder="e.g. Casio fx-991EX, like new. Used for one semester. Includes the cover."
                    className="input-box"
                    value={description}
                    onChange={event => setDescription(event.target.value)}
                />
            </div>

            <div className="form-field">
                <label htmlFor="product-price">Price*</label>
                <input
                    id="product-price"
                    type="number"
                    placeholder="500"
                    min="0"
                    step="1"
                    value={price}
                    className={`input-box ${priceError ? "input-box--error" : ""}`}
                    onChange={event => {
                        setPrice(event.target.value)
                        if (priceError) validatePrice(event.target.value)
                    }}
                    onBlur={event => validatePrice(event.target.value)}
                    aria-invalid={Boolean(priceError)}
                    aria-describedby={priceError ? "price-error" : undefined}
                    required
                />
                {priceError && <span className="field-error" id="price-error">{priceError}</span>}
            </div>

            <div className="form-field">
                <label htmlFor="product-category">Category*</label>
                <select
                    id="product-category"
                    className={`input-box drop-down ${categoryError ? "input-box--error" : ""}`}
                    value={categoryId}
                    onChange={event => {
                        setCategoryId(event.target.value)
                        if (categoryError) validateCategory(event.target.value)
                    }}
                    onBlur={event => validateCategory(event.target.value)}
                    aria-invalid={Boolean(categoryError)}
                    aria-describedby={categoryError ? "category-error" : undefined}
                    required >
                    <option value="">Select a category...</option>
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
                {categoryError && <span className="field-error" id="category-error">{categoryError}</span>}
            </div>

            <div className="form-field image-field">
                <label htmlFor="product-image">Image*</label>
                <div className={`image-upload-area ${imageError ? "image-upload-area--error" : ""}`}>
                    <div className="product-images-grid">
                        {Array.from({ length: MAX_FILES }, (_, index) => {
                            const file = imageFiles[index]

                            return (
                                <div className={`image-preview${index === 0 ? " cover-image" : ""}`} key={file ? `${file.name}-${index}` : `empty-${index}`}>
                                    {file ? (
                                        <>
                                            <img src={URL.createObjectURL(file)} alt={file.name} />
                                            <RemoveImageButton
                                                file={file}
                                                index={index}
                                                removeImage={removeImage} />
                                        </>
                                    ) : (
                                        <ImageFrameIcon />
                                    )}
                                </div>
                            )
                        })}
                    </div>

                    <div className="image-upload-info">
                        <span className="upload-icon">+</span>
                        <span className="upload-text">
                            Tap to upload an image
                        </span>
                        <span className="upload-hint">
                            JPG/PNG/JPEG · Up to {MAX_FILE_SIZE} MB

                        </span>
                    </div>
                    <input
                        id="product-image"
                        className="image-upload"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={event => {
                            handleImageChange(event)
                        }}
                        onBlur={event => validateImages(event.target.files ?? null)}
                        aria-invalid={Boolean(imageError)}
                        aria-describedby={imageError ? "image-error" : undefined}
                        required={!initialProduct} />
                </div>
                {imageError && <span className="field-error" id="image-error">{imageError}</span>}
            </div>

            {
                formError && (
                    <FormError
                        message={errorMessage}
                        description={"Your details are still here."} />
                )
            }

            {
                formSuccess && (
                    <FormSuccess
                        message={successMessage}
                        description={"Your product is live on campus!"} />
                )
            }

            <CTAButton
                type="submit"
                disabled={isSubmitting || formSuccess}
                text={submitLabel}
                disabledText="Saving..."
                isSuccess={formSuccess}
                successText={"Saved"} />

            <BackButton navigateTo={from} />
        </form>
    )
}

export default ProductForm