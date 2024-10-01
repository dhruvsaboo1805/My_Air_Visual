import { BrowserRouter, Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { Suspense, lazy, useEffect } from "react";
import Loader from "./components/Loader";
import { Bounce, ToastContainer , toast } from "react-toastify";

// ** pages lazy import()
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AqiIndex = lazy(() => import("./pages/AqiIndex"));
const RecentBlogs = lazy(() => import("./pages/RecentBlogs"));
const Blog = lazy(() => import("./pages/Blog"));
const Health = lazy(() => import("./pages/Health"));
const Contact = lazy(() => import("./pages/Contact"));
const Forecast = lazy(() => import("./pages/Forecast"));

const App = () => {

	useEffect(() => {
		// Clear any toasts when the component is unmounted or on re-render
		return () => {
		  toast.dismiss();
		};
	  }, []);

	return (
		<BrowserRouter>
			<Suspense fallback={<Loader />}>
				<Routes>
					<Route path="/" element={<Dashboard />} />
					<Route path="/aqi/index" element={<AqiIndex />} />
					<Route path="/blogs" element={<RecentBlogs />} />
					<Route path="/blogs/:id" element={<Blog />} />
					<Route path="/health" element={<Health />} />
					<Route path="/contact" element={<Contact />} />
					<Route path="/forecast" element={<Forecast />} />
					<Route path="*" element={<h2>Page Not Found</h2>} />
				</Routes>
				<ToastContainer 
				position="top-right"
				autoClose={3000} // Automatically close after 3 seconds
				hideProgressBar={false} // Show progress bar (optional)
				newestOnTop={true} // Newest toast on top
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
      />
			</Suspense>
		</BrowserRouter>
	);
};

export default App;
