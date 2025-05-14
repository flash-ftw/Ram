import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./i18n"; // Importer la configuration i18n avant le rendu

createRoot(document.getElementById("root")!).render(<App />);
