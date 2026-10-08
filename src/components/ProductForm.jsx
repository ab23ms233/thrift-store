import "./ProductForm.css"
import { useEffect, useState } from "react"

import { getCategories } from "../services/categories.js";

function ProductForm({ initialProduct, onSubmit, submitLabel }) {
    const [title, setTitle] = useState(initialProduct?.title ?? "");
    const [description, setDescription] = useState(initialProduct?.description ?? "");
    const [price, setPrice] = useState(initialProduct?.price ?? "");
    const [categoryId, setCategoryId] = useState(initialProduct?.category_id ?? "");
    const [imageFile, setImageFile] = useState(null);

    const [categories, setCategories] = useState([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    
    useEffect(() => {
        async function fetchCategories() {
            const data = await getCategories()
            setCategories(data)
        }

        fetchCategories()
    }, [])

    async function handleSubmitForm(event) {
        event.preventDefault()
        setIsSubmitting(true)

        try {
            await onSubmit({
                title,
                description,
                price,
                categoryId,
                image: imageFile
            })
        } finally {
            setIsSubmitting(false)
        }
    }
    return (
        <form className="product-form" onSubmit={handleSubmitForm}>
            <label>
                Title
                <input
                    type="text"
                    value={title}
                    onChange={event => setTitle(event.target.value)}
                    required
                />
            </label>

            <label>
                Description
                <textarea
                    value={description}
                    onChange={event => setDescription(event.target.value)}
                    required
                />
            </label>

            <label>
                Price
                <input
                    type="number"
                    min="0"
                    step="1"
                    value={price}
                    onChange={event => setPrice(event.target.value)}
                    required />
            </label>

            <label>
                Category
                <select
                    value={categoryId}
                    onChange={event => setCategoryId(event.target.value)}
                    required
                >
                    <option value="">Select a category...</option>
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>

            </label>

            <label>
                Image
                <input
                    type="file"
                    accept="image/*"
                    onChange={event => setImageFile(event.target.files[0])}
                    required={!initialProduct}
                />
            </label>

            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : submitLabel}
            </button>
        </form>
    )
}

export default ProductForm