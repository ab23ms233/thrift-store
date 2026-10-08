import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css"
import { ProductRoute } from "./pages/ProductPage.jsx";

import Navbar from "./components/Navbar.jsx";
import "./components/Navbar.css"

import HomePage from "./pages/HomePage.jsx";
import SellProductPage from "./pages/SellProductPage.jsx";
import { EditProductRoute } from "./pages/EditProductPage.jsx";

import MyListings from "./pages/MyListingsPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";

import { getProducts } from "./services/products.js";

function App() {
	const [searchQuery, setSearchQuery] = useState("")
	const [products, setProducts] = useState([])

	async function fetchProducts() {
		const data = await getProducts()
		setProducts(data)
	}

	useEffect(() => {
		fetchProducts()
	}, [])

	return (
		<BrowserRouter>
			<main>
				<Navbar
					searchQuery={searchQuery}
					onSearchChange={setSearchQuery}
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
								onListProduct={fetchProducts}
							/>
						}
					/>

					<Route
						path="/products/:productId"
						element={
							<ProductRoute
								products={products}
								onProductsChanged={fetchProducts}
							/>
						}
					/>

					<Route
						path="/my-listings"
						element={
							<MyListings
								products={products}
							/>
						}
					/>

					<Route
						path="/products/:productId/edit"
						element={
							<EditProductRoute
								products={products}
								onEditProduct={fetchProducts}
							/>
						}
					/>

					<Route
						path="/login"
						element={
							<LoginPage />
						}
					/>

					<Route
						path="/sign-up"
						element={
							<SignUpPage />
						}
					/>

				</Routes>
			</main>
		</BrowserRouter>
	)
}

export default App;
