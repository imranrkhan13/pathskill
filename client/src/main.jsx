/* Citrus Index reminder: load the paper-like global system before rendering the catalogue. */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")).render(<StrictMode><App /></StrictMode>);
