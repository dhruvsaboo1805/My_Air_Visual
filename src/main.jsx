import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/app.scss";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById("root"))
.render(
    <>
        <App />
        <ToastContainer 
        position="top-right"
        autoClose={3000} // Automatically close after 3 seconds
        hideProgressBar={false} // Show progress bar (optional)
        newestOnTop={true} // Newest toast on top
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover />
    </>
);
