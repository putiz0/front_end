import React from "react";

function ProductCard({ product }) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "10px",
        margin: "10px",
        width: "200px",
        textAlign: "center",
      }}
    >
      <h3>{product.name}</h3>
      <p>💰 R$ {product.price}</p>
      <p>📂 Categoria: {product.category}</p>
    </div>
  );
}

export default ProductCard;
