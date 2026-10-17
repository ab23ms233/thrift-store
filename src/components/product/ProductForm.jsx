import "./ProductForm.css"
import "../common/Form.css"
import { useEffect, useState } from "react"

import { getCategories } from "../../services/categories.js";
import CTAButton from "../button/CTAButton.jsx"

import { FormError, FormSuccess } from "../common/FormStatus.jsx";
import "../common/FormStatus.css"
import BackButton from "../button/BackButton.jsx";
import { useLocation } from "react-router-dom";
import { MAX_FILE_SIZE } from "../../constants.js";

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
    const [imageFile, setImageFile] = useState(null);

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
        } else if (file && file.size > MAX_FILE_SIZE * 1024 * 1024) {
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
                    <span className="upload-icon" aria-hidden="true">+</span>
                    
                    <strong className="upload-text">
                        {
                            imageFile
                                ? imageFile.name
                                : "Tap to upload an image"
                        }
                    
                    </strong>
                    <span className="upload-hint">
                        JPG/PNG/JPEG · Up to {MAX_FILE_SIZE} MB
                    
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