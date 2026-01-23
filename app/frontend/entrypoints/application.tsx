import React from "react";
import ReactDOM from "react-dom/client";
import App from "../App";
import "../services/axiosConfig";
import "../global";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/main.css";
import '@react-spectrum/s2/page.css';


// Mount React app to the element with id 'app' in your Rails views
const appElement = document.getElementById("app");
if (appElement) {
  const root = ReactDOM.createRoot(appElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
