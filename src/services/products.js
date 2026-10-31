import { supabase } from "../lib/supabase.js";

export async function getProducts() {
    const { data, error } = await supabase
        .from("products")
        .select("*, category:categories(name, icon_path)")
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
    if (!Object.hasOwn(product, "id")) {
        product.id = crypto.randomUUID()
    }

    const uploadedImages = await Promise.all(
        product.images.map(async (file) => {
            const extension = file.name.split(".").pop()
            const imagePath = `${userId}/${crypto.randomUUID()}.${extension}`

            const { error: uploadError } = await supabase.storage
                .from("product-images")
                .upload(imagePath, file)

            if (uploadError) throw uploadError

            const imageUrl = supabase.storage
                .from("product-images")
                .getPublicUrl(imagePath).data.publicUrl

            return { imagePath, imageUrl }
        })
    )

    const imageUrls = uploadedImages.map(image => image.imageUrl)
    const imagePaths = uploadedImages.map(image => image.imagePath)

    const { data: addedProduct, error: insertError } = await supabase
        .from("products")
        .insert({
            title: product.title,
            description: product.description,
            price: Number(product.price),
            category_id: product.categoryId,
            owner_id: userId,
            image_url: uploadedImages[0].imageUrl,
            image_path: uploadedImages[0].imagePath,
            image_urls: imageUrls,
            image_paths: imagePaths,
            status: "AVAILABLE",
        })
        .select()
        .single();

    if (insertError) throw insertError;

    return addedProduct
}

export async function editProduct(productId, fields, userId) {
    if (!Array.isArray(fields.images)) {
        throw new Error("Product images must be present as an array.")
    }
    const { data: existingProduct, error: fetchError } =
        await supabase
            .from("products")
            .select("image_url, image_path, image_urls, image_paths")
            .eq("id", productId)
            .eq("owner_id", userId)
            .single()

    if (fetchError) throw fetchError

    const existingImageUrls = existingProduct.image_urls?.length
        ? existingProduct.image_urls
        : existingProduct.image_url
            ? [existingProduct.image_url]
            : []

    const existingImagePaths = existingProduct.image_paths?.length
        ? existingProduct.image_paths
        : existingProduct.image_path
            ? [existingProduct.image_path]
            : []

    const existingPaths = [...new Set([
        ...existingImagePaths,
        existingProduct.image_path
    ].filter(Boolean))]

    const uploadedPaths = []
    const imageUrls = []
    const imagePaths = []

    try {
        for (const image of fields.images) {
            let imageUrl
            let imagePath

            if (typeof image === "string") {
                imageUrl = image

                const existingIndex = existingImageUrls.indexOf(image)
                if (existingIndex === -1) {
                    throw new Error("An edited image does not match an existing product image.")
                }

                imagePath = existingImagePaths[existingIndex]

                if (!imagePath && image === existingProduct.image_url) {
                    imagePath = existingProduct.image_path
                }

                if (!imagePath) {
                    throw new Error(`Could not find the storage path for existing image: ${image}.`)
                }
            } else {
                if (!image || typeof image.name !== "string") {
                    throw new Error("each new product image must be a file.")
                }

                const fileExt = image.name.split(".").pop()
                imagePath = `${userId}/${crypto.randomUUID()}.${fileExt}`

                const { error: uploadError } = await supabase.storage
                    .from("product-images")
                    .upload(imagePath, image)

                if (uploadError) throw uploadError

                uploadedPaths.push(imagePath)
                imageUrl = supabase.storage
                    .from("product-images")
                    .getPublicUrl(imagePath).data.publicUrl
            }

            if (imageUrls.includes(imageUrl)) continue

            imageUrls.push(imageUrl)
            imagePaths.push(imagePath)
        }

        const { data: updatedProduct, error: updateError } = await supabase
            .from("products")
            .update({
                title: fields.title,
                description: fields.description,
                price: Number(fields.price),
                category_id: fields.categoryId,
                image_url: imageUrls[0] ?? null,
                image_path: imagePaths[0] ?? null,
                image_urls: imageUrls,
                image_paths: imagePaths
            })
            .eq("id", productId)
            .eq("owner_id", userId)
            .select()
            .single()

        if (updateError) throw updateError

        const finalPaths = new Set(imagePaths)
        const pathsToRemove = existingPaths.filter(path => !finalPaths.has(path))

        if (pathsToRemove.length) {
            const { error: removeError } = await supabase.storage
                .from("product-images")
                .remove(pathsToRemove)

            if (removeError) {
                console.error("Could not remove old images for product:", updatedProduct.id, removeError)
            }
        }

        return updatedProduct
    } catch (error) {
        if (uploadedPaths.length) {
            const { error: cleanupError } = await supabase.storage
                .from("product-images")
                .remove(uploadedPaths)

            if (cleanupError) {
                console.error("Could not clean up newly uploaded product images on failure of update row:", cleanupError) 
            }

            throw error
        }
    }
}

export async function deleteProduct(productId, userId) {
    const { data: product, error: fetchError } = await supabase
        .from("products")
        .select("image_path")
        .eq("id", productId)
        .eq("owner_id", userId)
        .single()

    if (fetchError) throw fetchError

    const imagePaths = [...new Set([
        ...(product.image_paths ?? []),
        product.image_path
    ].filter(Boolean))]

    const { error: deleteError } = await supabase
        .from("products")
        .delete()
        .eq("id", productId)
        .eq("owner_id", userId)

    if (deleteError) throw deleteError

    if (imagePaths.length) {
        const { error: storageError } = await supabase.storage
            .from("product-images")
            .remove(imagePaths)

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

export async function markProductAsUnsold(productId, userId) {
    const unsoldProduct = {
        status: "AVAILABLE"
    }

    const { data, error } = await supabase
        .from("products")
        .update(unsoldProduct)
        .eq("id", productId)
        .eq("owner_id", userId)
        .select()
        .single()

    if (error) throw error

    return data
}