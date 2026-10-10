import { supabase } from "../lib/supabase.js";

export async function getProducts() {
    const { data, error } = await supabase
        .from("products")
        .select("*, category:categories(name, icon_path), owner_name:profiles(full_name), owner_email:profiles(email)")
        .order("created_at", { ascending: false })

    if (error) {
        console.error("Error fetching products:", error)
        return []
    }

    return data.map(product => ({
        ...product,
        category: product.category
            ? {
                name: product.category?.name,
                iconUrl: product.category.icon_path
                    ? supabase.storage
                        .from("category-icons")
                        .getPublicUrl(product.category.icon_path).data.publicUrl
                    : null
            }
            : null
    }))
}

export async function addProduct(product, userId) {
    const fileExt = product.image.name.split(".").pop();
    const imagePath = `${userId}/${crypto.randomUUID()}.${fileExt}`;

    if (!Object.hasOwn(product, "id")) {
        product.id = crypto.randomUUID()
    }

    const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(imagePath, product.image);

    if (uploadError) throw uploadError;

    const imageUrl = supabase.storage
        .from("product-images")
        .getPublicUrl(imagePath).data.publicUrl;

    const { data: addedProduct, error: insertError } = await supabase
        .from("products")
        .insert({
            title: product.title,
            description: product.description,
            price: Number(product.price),
            category_id: product.categoryId,
            owner_id: userId,
            image_url: imageUrl,
            image_path: imagePath,
            status: "AVAILABLE",
        })
        .select()
        .single();

    if (insertError) throw insertError;

    return addedProduct
}

export async function editProduct(productId, fields, userId) {
    const { data: existingProduct, error: fetchError } =
        await supabase
            .from("products")
            .select("image_url, image_path")
            .eq("id", productId)
            .single()

    if (fetchError) {
        throw fetchError
    }

    const updates = {
        title: fields.title,
        description: fields.description,
        price: Number(fields.price),
        category_id: fields.categoryId
    }

    if (fields.image) {
        const fileExt = fields.image.name.split(".").pop()
        const newImagePath = `${userId}/${crypto.randomUUID()}.${fileExt}`

        const { error: uploadError } =
            await supabase.storage
                .from("product-images")
                .upload(newImagePath, fields.image)

        if (uploadError) {
            throw uploadError
        }

        updates.image_path = newImagePath
        updates.image_url = supabase.storage
            .from("product-images")
            .getPublicUrl(newImagePath).data.publicUrl
    }

    const { data: updatedProduct, error: updateError } =
        await supabase
            .from("products")
            .update(updates)
            .eq("id", productId)
            .eq("owner_id", userId)
            .select()
            .single()

    if (updateError) throw updateError

    if (fields.image && existingProduct.image_path) {
        const { error: removeError } = 
        await supabase.storage
            .from("product-images")
            .remove([existingProduct.image_path])

        if (removeError) {
            console.error("Could not remove old image for product:", updatedProduct.id, removeError)
        }
    }

    return updatedProduct
}

export async function deleteProduct(productId, userId) {
    const { data: product, error: fetchError } = await supabase
        .from("products")
        .select("image_path")
        .eq("id", productId)
        .eq("owner_id", userId)
        .single()

    if (fetchError) throw fetchError

    const { error: deleteError } = await supabase
        .from("products")
        .delete()
        .eq("id", productId)
        .eq("owner_id", userId)
    
    if (deleteError) throw deleteError

    if (product.image_path) {
        const { error: storageError } = await supabase.storage
            .from("product-images")
            .remove([product.image_path])
        
        if (storageError) throw storageError
    }
}

export async function markProductAsSold(productId, userId) {
    const soldProduct = {
        status: "SOLD"
    }

    const { data: updatedProduct, error: updateError } = 
        await supabase
            .from("products")
            .update(soldProduct)
            .eq("id", productId)
            .eq("owner_id", userId)
            .select()
            .single()

    if (updateError) throw updateError

    return updatedProduct
}