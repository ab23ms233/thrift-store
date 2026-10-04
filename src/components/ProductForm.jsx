import "./ProductForm.css"
import categories from "../data/categories.js"
import { useState } from "react"

function ProductForm({ initialProduct, onSubmit, submitLabel }) {
    let title, setTitle
    let description, setDescription
    let price, setPrice
    let category, setCategory
    let imageFile, setImageFile

    if (!initialProduct) {
        [title, setTitle] = useState("")
        [description, setDescription] = useState("");
        [price, setPrice] = useState("");
        [category, setCategory] = useState("");
        [imageFile, setImageFile] = useState(null);
    } else {
        [title, setTitle] = useState(initialProduct.title)
        [description, setDescription] = useState(initialProduct.description);
        [price, setPrice] = useState(initialProduct.price);
        [category, setCategory] = useState(initialProduct.category);
        [imageFile, setImageFile] = useState(initialProduct.price);
    }

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
                        <option key={category.id} value={category.name}>{category.name}</option>
                    ))}
                </select>

            </label>

            <label>
                Image
                <input
                    type="file"
                    accept="image/*"
                    onChange={event => setImageFile(event.target.files[0])}
                    required
                />
            </label>

            <button type="submit">{submitLabel}</button>
        </form>
    )
}

export default ProductForm