import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add Google Fonts
const linkElement = document.createElement("link");
linkElement.rel = "stylesheet";
linkElement.href = "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Open+Sans:wght@300;400;600&family=Playfair+Display:wght@400;700&display=swap";
document.head.appendChild(linkElement);

// Add FontAwesome
const fontAwesomeLink = document.createElement("link");
fontAwesomeLink.rel = "stylesheet";
fontAwesomeLink.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
document.head.appendChild(fontAwesomeLink);

// Add page title and meta description
document.title = "FruitFresh - Organic Food Marketplace";
const metaDescription = document.createElement("meta");
metaDescription.name = "description";
metaDescription.content = "FruitFresh is your go-to marketplace for fresh, locally-sourced organic produce. Support local farmers and enjoy the freshest fruits and vegetables delivered to your door.";
document.head.appendChild(metaDescription);

// Add Open Graph tags
const ogTitle = document.createElement("meta");
ogTitle.property = "og:title";
ogTitle.content = "FruitFresh - Organic Food Marketplace";
document.head.appendChild(ogTitle);

const ogDescription = document.createElement("meta");
ogDescription.property = "og:description";
ogDescription.content = "Shop fresh organic produce from local farmers with convenient delivery. Discover our range of fruits, vegetables, and more!";
document.head.appendChild(ogDescription);

const ogType = document.createElement("meta");
ogType.property = "og:type";
ogType.content = "website";
document.head.appendChild(ogType);

createRoot(document.getElementById("root")!).render(<App />);
