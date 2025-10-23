import { useState } from "react";
import api from "../services/api";

function ProductForm({ onAdd }) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    link: "",
    image: "",
    description: "",
    featured: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/products", form);
      onAdd(res.data);
      setForm({ name: "", price: "", category: "", link: "", image: "", description: "", featured: false });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Nome" value={form.name} onChange={handleChange} required />
      <input name="price" placeholder="Preço" type="number" value={form.price} onChange={handleChange} required />
      <input name="category" placeholder="Categoria" value={form.category} onChange={handleChange} required />
      <input name="link" placeholder="Link de compra" value={form.link} onChange={handleChange} required />
      <input name="image" placeholder="URL da imagem" value={form.image} onChange={handleChange} />
      <textarea name="description" placeholder="Descrição" value={form.description} onChange={handleChange} />
      <label>
        Destaque
        <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
      </label>
      <button type="submit">Adicionar Produto</button>
    </form>
  );
}

export default ProductForm;
