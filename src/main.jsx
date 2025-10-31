import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "../css/style.css";

console.log("✅ main.jsx carregado corretamente!");

// Espera o DOM carregar para montar React
document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("app");
  if (root) {
    ReactDOM.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
      root
    );
  } else {
    console.error("❌ Elemento #app não encontrado no HTML!");
  }
});
