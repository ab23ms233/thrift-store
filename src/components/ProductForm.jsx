import "./ProductForm.css"
import { useEffect, useState } from "react"

import { getCategories } from "../services/categories.js";

function ProductForm({ initialProduct, onSubmit, submitLabel }) {
    const [title, setTitle] = useState(initialProduct?.title ?? "");
    const [description, setDescription] = useState(initialProduct?.description ?? "");
    const [price, setPrice] = useState(initialProduct?.price ?? "");
    const [category, setCategory] = useState(initialProduct?.category ?? "");
    const [imageFile, setImageFile] = useState(null);

    const [categories, setCategories] = useState([])

    useEffect(() => {
        async function fetchCategories() {
            const data = await getCategories()
            setCategories(data)
        }

        fetchCategories()
    }, [])

    function handleSubmitForm(event) {
        event.preventDefault()

        onSubmit({
            title,
            description,
            price,
            category,
            image: imageFile
        })
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
                    value={category}
                    onChange={event => setCategory(event.target.value)}
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

            <button type="submit">{submitLabel}</button>
        </form>
    )
}

export default ProductForm