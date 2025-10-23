import { useState } from "react";
import ProductList from "../components/ProductList";
import ProductForm from "../components/ProductForm";

function Admin() {
  const [refresh, setRefresh] = useState(false);

  const handleAdd = () => setRefresh(!refresh);

  return (
    <div>
      <h1>⚙️ Painel Admin</h1>
      <ProductForm onAdd={handleAdd} />
      <ProductList key={refresh} />
    </div>
  );
}

export default Admin;
