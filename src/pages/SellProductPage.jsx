import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase.js";

import ProductForm from "../components/ProductForm.jsx";

function SellProductPage({ currentUser }) {
    const navigate = useNavigate()

    async function handleSubmit(product) {
        if (!product.image) {
            return
        }

        try {
            const fileExt = product.image.name.split(".").pop()
            const fileName = `${currentUser.id}/${crypto.randomUUID()}.${fileExt}`

            const { error: uploadError } = await supabase.storage
                .from("product-images")
                .upload(fileName, product.image)
            
            if (uploadError) {
                console.error(uploadError)
            }

            const { data: imageData } = supabase.storage
                .from("product-images")
                .getPublicUrl(fileName)
            
            const imageUrl = imageData.publicUrl

            const { error: insertError } = await supabase
                .from("products")
                .insert({
                    title: product.title,
                    description: product.description,
                    price: Number(product.price),
                    category_id: product.category,
                    owner_id: currentUser.id,
                    image_url: imageUrl,
                    status: "AVAILABLE"
                })
            
            if (insertError) {
                console.error(insertError)
            }
            navigate("/")

        } catch (error) {
            console.error("Error listing product:", error)
        }

    }

    return (
        <ProductForm 
            onSubmit={handleSubmit}
            submitLabel={"List Product"}
        />
    )
}

export default SellProductPage