console.log("✅ main.js carregado");

// ✅ URL da API no Render
const API_URL = "https://node-api-gc77.onrender.com";
console.log("🌐 API em uso:", API_URL);

let allProducts = [];

// Detectar região automática
function setDefaultRegion() {
  const lang = navigator.language || navigator.userLanguage;
  const country = lang.includes("pt") ? "Brasil" : "Estados Unidos";
  console.log("🌎 Região detectada:", country);
}

// Carregar produtos do backend
async function loadProducts() {
  try {
    const res = await fetch(`${API_URL}/api/products`);
    if (!res.ok) throw new Error(`Erro HTTP: ${res.status}`);

    allProducts = await res.json();
    console.log("📦 Produtos recebidos:", allProducts);

    applyFilters();
  } catch (err) {
    console.error("❌ Erro ao carregar produtos:", err);
    document.getElementById("products").innerHTML =
      "<p>Erro ao conectar com o servidor.</p>";
  }
}

// Aplicar filtros
function applyFilters() {
  const search = document.getElementById("buscar")?.value?.toLowerCase() || "";
  const plataforma = document.getElementById("plataforma")?.value || "Todas as plataformas";
  const categoria = document.getElementById("categoria")?.value || "Todas as categorias";
  const regiao = document.getElementById("regiao")?.value || "Todas as regiões";

  const filtered = allProducts.filter(p => {
    const matchSearch = p.name?.toLowerCase().includes(search);
    const matchPlatform = plataforma === "Todas as plataformas" || p.platform === plataforma;
    const matchCategory = categoria === "Todas as categorias" || p.category === categoria;
    const matchRegion = regiao === "Todas as regiões" || p.region === regiao;
    return matchSearch && matchPlatform && matchCategory && matchRegion;
  });

  renderProducts(filtered);
}

// Renderizar produtos
function renderProducts(products) {
  const container = document.getElementById("products");
  if (!container) return;

  container.innerHTML = products.length
    ? products.map(p => `
      <div class="produto-card">
        <img src="${p.image || "https://via.placeholder.com/200"}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p class="preco">${p.currency || "R$"} ${p.price}</p>
        <p class="plataforma">${p.platform} - ${p.region}</p>
        <a href="${p.affiliateLink}" target="_blank" class="btn">Comprar</a>
      </div>
    `).join("")
    : "<p>Nenhum produto encontrado.</p>";
}

// Eventos dos filtros
document.getElementById("buscar")?.addEventListener("input", applyFilters);
document.getElementById("plataforma")?.addEventListener("change", applyFilters);
document.getElementById("categoria")?.addEventListener("change", applyFilters);
document.getElementById("regiao")?.addEventListener("change", applyFilters);

// Inicialização
loadProducts();
