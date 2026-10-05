import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css"
import { ProductRoute } from "./pages/ProductPage.jsx";

import Navbar from "./components/Navbar.jsx";
import "./components/Navbar.css"

import HomePage from "./pages/HomePage.jsx";
import SellProductPage from "./pages/SellProductPage.jsx";
import { EditProductRoute } from "./pages/EditProductPage.jsx";

import fakeProducts from "./data/products.js";
import MyListings from "./pages/MyListings.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";

function App() {
	const [searchQuery, setSearchQuery] = useState("")
	const [products, setProductList] = useState(() => {
		const products = localStorage.getItem("products")

		return products
		? JSON.parse(products)
		: fakeProducts
	})

	const [user, setUser] = useState(null)
	const isLoggedIn = user ? true : false

	function listProduct(product) {
		setProductList(prevProducts => 
			[...prevProducts, product]
		)
	}

	function editProduct(updatedProduct) {
		setProductList(prevProducts =>
			prevProducts.map(product => 
				product.id === updatedProduct.id
				? updatedProduct
				: product
			)
		)
	}

	function deleteProduct(product) {
		setProductList(prevProducts =>
			prevProducts.filter(item => item.id !== product.id)
		)
	}

	function onProductSold(soldProduct) {
		setProductList(prevProducts =>
			prevProducts.map(
				product =>
				product.id === soldProduct.id
				? {...product, status: "SOLD"}
				: product
			)
		)
	}

	useEffect(() => {
		localStorage.setItem(
			"products",
			JSON.stringify(products)
		)
	}, [products])

	return (
		<BrowserRouter>
			<main>
				<Navbar
					searchQuery={searchQuery}
					onSearchChange={setSearchQuery}
					isLoggedIn={isLoggedIn}
				/>
				<Routes>
					<Route 
						path="/" 
						element={
							<HomePage
								products={products}
								searchQuery={searchQuery}
							/>
						} 
					/>

					<Route 
						path="/sell"
						element={
							<SellProductPage 
								onListProduct={listProduct}
								currentUser={user}
							/>
						}
					/>
					
					<Route 
						path="/products/:productId"
						element={
							<ProductRoute
								products={products}
								currentUser={user}
								onDelete={deleteProduct}
								onProductSold={onProductSold}
							/>
						}
					/>

					<Route
						path="/my-listings"
						element={
							<MyListings
								products={products}
								currentUser={user} />
						}
					/>

					<Route
						path="/products/:productId/edit"
						element={
							<EditProductRoute
								products={products}
								onEditProduct={editProduct}
							/>
						}
					/>

					<Route 
						path="/login"
						element={
							<LoginPage
								onLogin={setUser}
							/>
						}
					/>

					<Route 
						path="/sign-up"
						element={
							<SignUpPage
								onSignUp={setUser}/>
						}
					/>

				</Routes>
			</main>
		</BrowserRouter>
	)
}

export default App;
