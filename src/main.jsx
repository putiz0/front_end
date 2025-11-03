import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "../css/style.css";

// Tenta obter o elemento raiz (#root)
const rootElement = document.getElementById("root");

// Verifica se o elemento foi encontrado antes de tentar renderizar
if (!rootElement) {
  // Isso deve ser uma verificação de segurança, mas se ocorrer,
  // indica que o index.html não carregou o div#root.
  console.error("❌ Elemento #root não encontrado no HTML!");
} else {
  // Inicializa a aplicação React diretamente.
  // Carregar o script como type="module" no final do body
  // garante que o DOM já está pronto, então o DOMContentLoaded
  // não é necessário e é removido para simplificar.
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
