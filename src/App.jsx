import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom";

import "./App.css"
import { ProductRoute } from "./pages/ProductPage.jsx";

import Header from "./components/common/Header.jsx";
import BotttomNav from "./components/common/BotttomNav.jsx";

import HomePage from "./pages/HomePage.jsx";
import SellProductPage from "./pages/SellProductPage.jsx";
import { EditProductRoute } from "./pages/EditProductPage.jsx";

import MyListings from "./pages/MyListingsPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import EmailVerifiedPage from "./pages/EmailVerifiedPage.jsx";
import ChangePasswordPage from "./pages/ChangePasswordPage.jsx";

import { getProducts } from "./services/products.js";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";
import { handleAuthUrl } from "./hooks/useAuthDeepLink.js";

import { App as CapacitorApp } from "@capacitor/app";
import Footer from "./components/common/Footer.jsx";

function AppShell() {
	const location = useLocation()
	const navigate = useNavigate()

	const authPages = [
		"/login",
		"/forgot-password",
		"/reset-password",
		"/sign-up",
		"/email-verified",
		"/change-password"
	]
	const shouldShowBottomNav = !authPages.includes(location.pathname)

	const [products, setProducts] = useState([])
	const [isProductsLoading, setIsProductLoading] = useState(true)

	async function fetchProducts() {
		try {
			const data = await getProducts()
			setProducts(data)
		} finally {
			setIsProductLoading(false)
		}
	}

	useEffect(() => {
		fetchProducts()
	}, [])

	useEffect(() => {
		let isMounted = true
		let listener

		async function registerListener() {
			const registeredListener = await CapacitorApp.addListener(
				"appUrlOpen",
				({ url }) => {
					handleAuthUrl(url, navigate)
				}
			)

			if (isMounted) {
				listener = registeredListener
			} else {
				registeredListener.remove()
			}
		}

		registerListener()

		return () => {
			isMounted = false
			listener?.remove()
		}
	}, [])

	useEffect(() => {
		let isActive = true
		let listener

		async function setDeepLinks() {
			const registeredListener = await CapacitorApp.addListener(
				"appUrlOpen",
				({ url }) => {
					if (isActive) {
						void handleAuthUrl(url, navigate)
					}
				}
			)

			if (!isActive) {
				await registeredListener.remove()
				return
			}

			listener = registeredListener

			const launch = await CapacitorApp.getLaunchUrl()

			if (isActive && launch?.url) {
				await handleAuthUrl(launch.url, navigate)
			}
		}

		void setDeepLinks()

		return () => {
			isActive = false
			void listener?.remove()
		}
	}, [])

	return (
		<main style={{ paddingBottom: shouldShowBottomNav ? "90px" : undefined }}>
			<Header />

			<Routes>
				<Route element={<ProtectedRoute />}>
					<Route
						path="/sell"
						element={
							<SellProductPage
								onListProduct={fetchProducts} />
						} />

					<Route
						path="/my-listings"
						element={
							<MyListings
								products={products}
								isProductsLoading={isProductsLoading} />
						} />

					<Route
						path="/products/:productId/edit"
						element={
							<EditProductRoute
								products={products}
								onEditProduct={fetchProducts}
								isProductsLoading={isProductsLoading} />
						} />

					<Route
						path="/profile"
						element={
							<ProfilePage />
						} />

					<Route
						path="/change-password"
						element={<ChangePasswordPage />}
					/>

					<Route
						path="/reset-password"
						element={
							<ResetPasswordPage />
						} />
				</Route>

				<Route
					path="/"
					element={
						<HomePage
							products={products}
							isProductsLoading={isProductsLoading} />
					} />

				<Route
					path="/products/:productId"
					element={
						<ProductRoute
							products={products}
							onProductsChanged={fetchProducts}
							isProductsLoading={isProductsLoading} />
					} />

				<Route
					path="/login"
					element={
						<LoginPage />
					} />

				<Route
					path="/forgot-password"
					element={
						<ForgotPasswordPage />
					} />

				<Route
					path="/sign-up"
					element={
						<SignUpPage />
					} />

				<Route
					path="/email-verified"
					element={<EmailVerifiedPage />}
				/>

			</Routes>

			<Footer />

			{shouldShowBottomNav && <BotttomNav />}
		</main>
	)
}

function App() {
	return (
		<BrowserRouter>
			<AppShell />
		</BrowserRouter >
	)
}

export default App;
