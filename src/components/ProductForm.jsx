import "./ProductForm.css"
import "./Form.css"
import { useEffect, useState } from "react"

import { getCategories } from "../services/categories.js";
import CTAButton from "./CTAButton.jsx"

function ProductForm({ 
    initialProduct, 
    onSubmit, 
    submitLabel, 
    errorMessage,
    successMessage,
    onSuccess
}) {
    const [title, setTitle] = useState(initialProduct?.title ?? "");
    const [description, setDescription] = useState(initialProduct?.description ?? "");
    const [price, setPrice] = useState(initialProduct?.price ?? "");
    const [categoryId, setCategoryId] = useState(initialProduct?.category_id ?? "");
    const [imageFile, setImageFile] = useState(null);

    const [titleError, setTitleError] = useState("")
    const [priceError, setPriceError] = useState("")
    const [categoryError, setCategoryError] = useState("")
    const [imageError, setImageError] = useState("")

    const [formError, setFormError] = useState(false)
    const [formSuccess, setFormSuccess] = useState(false)

    const [categories, setCategories] = useState([])
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        async function fetchCategories() {
            const data = await getCategories()
            setCategories(data)
        }

        fetchCategories()
    }, [])

    useEffect(() => {
        if (!formSuccess || !onSuccess) {
            return
        }

        const timeoutId = window.setTimeout(onSuccess, 2000)
        return () => window.clearTimeout(timeoutId)
    }, [formSuccess, onSuccess])

    function validateTitle(value) {
        const error = value.trim() ? "" : "Please enter a title."
        setTitleError(error)
        return error
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

    function validateImage(file) {
        let error = ""

        if (!file && !initialProduct) {
            error = "Please add a product image."
        } else if (file && !file.type.startsWith("image/")) {
            error = "Please choose an image file."
        } else if (file && file.size > 5 * 1024 * 1024) {
            error = "Image must be 5 MB or smaller."
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
            validateImage(imageFile)
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
                image: imageFile
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
            <label htmlFor="product-title" className="form-field">
                Title*
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
            </label>

            <label htmlFor="product-description" className="form-field">
                Description (optional)
                <textarea
                    id="product-description"
                    placeholder="e.g. Casio fx-991EX, like new. Used for one semester. Includes the cover."
                    className="input-box"
                    value={description}
                    onChange={event => setDescription(event.target.value)}
                />
            </label>

            <label htmlFor="product-price" className="form-field">
                Price*
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
            </label>

            <label htmlFor="product-category" className="form-field">
                Category*
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
                    required
                >
                    <option value="">Select a category...</option>
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
                {categoryError && <span className="field-error" id="category-error">{categoryError}</span>}
            </label>

            <label className="form-field image-field" htmlFor="product-image">
                Image*
                <div className={`image-upload-area ${imageError ? "image-upload-area--error" : ""}`}>
                    <span className="upload-icon" aria-hidden="true">+</span>
                    
                    <strong className="upload-text">
                        {
                            imageFile
                                ? imageFile.name
                                : "Tap to upload an image"
                        }
                    
                    </strong>
                    <span className="upload-hint">
                        JPG/PNG/JPEG · Up to 5 MB
                    
                    </span>
                    <input
                        id="product-image"
                        className="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={event => {
                            const file = event.target.files[0] ?? null
                            setImageFile(file)
                            validateImage(file)
                        }}
                        onBlur={event => validateImage(event.target.files[0] ?? null)}
                        aria-invalid={Boolean(imageError)}
                        aria-describedby={imageError ? "image-error" : undefined}
                        required={!initialProduct}
                    />
                </div>
                {imageError && <span className="field-error" id="image-error">{imageError}</span>}
            </label>
            
            {
                formError && (
                    <div className="form-status form-error">
                        <strong className="form-message error-message">
                            {errorMessage}
                        </strong>
                        <p className="form-label error-label">
                            Your details are still here. Please try again.
                        </p>
                    </div>
                )
            }

            {
                formSuccess && (
                    <div className="form-status form-success">
                        <strong className="form-message success-message">
                            {successMessage}
                        </strong>
                        <p className="form-label success-label">
                            Your changes have been saved.
                        </p>
                    </div>
                )
            }

            <CTAButton
                type="submit"
                disabled={isSubmitting || formSuccess}
                text={submitLabel}
                disabledText="Saving..."
                isSuccess={formSuccess}
                successText={"Saved"}
            />
        </form>
    )
}

export default ProductForm