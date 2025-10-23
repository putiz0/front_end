import { useEffect, useState } from "react";
import api from "../services/api";

function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/products")
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>📦 Lista de Produtos</h2>
      <ul>
        {products.map(prod => (
          <li key={prod._id}>
            <strong>{prod.name}</strong> - R${prod.price} <br />
            {prod.category} {prod.featured && "⭐"}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductList;
