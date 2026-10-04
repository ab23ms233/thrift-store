import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css"
import { ProductRoute } from "./pages/ProductPage.jsx";

import Navbar from "./components/Navbar.jsx";
import "./components/Navbar.css"

import HomePage from "./pages/HomePage.jsx";
import SellProductPage from "./pages/SellProductPage.jsx";

import products from "./data/products.js";
import MyListings from "./pages/MyListings.jsx";

function App() {
	const [searchQuery, setSearchQuery] = useState("")
	const [productList, setProductList] = useState(products)

	const currentUser = {
		id: "user001",
		name: "Arya Basak",
		email: "aryabasak6@gmail.com"
	}
	const isLoggedIn = currentUser?true:false

	function handleListProduct(product) {
		setProductList(prevProducts => 
			[...prevProducts, product]
		)
	}

	function editListProduct(product) {

	}

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
								products={productList}
								searchQuery={searchQuery}
							/>
						} 
					/>

					<Route 
						path="/sell"
						element={
							<SellProductPage 
								onListProduct={handleListProduct}
							/>
						}
					/>
					
					<Route 
						path="/products/:productId"
						element={
							<ProductRoute
								products={productList}
								currentUser={currentUser}
							/>
						}
					/>

					<Route
						path="/my-listings"
						element={
							<MyListings
								products={productList}
								currentUser={currentUser} />
						}
					/>
				</Routes>
			</main>
		</BrowserRouter>
	)
}

export default App;
