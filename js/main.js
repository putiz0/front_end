console.log("✅ main.js carregado");

// URL da API (Render)
const API_URL = "https://node-api-gc77.onrender.com/api/products";
console.log("🌐 API em uso:", API_URL);

// Referências
const productsContainer = document.getElementById("products");
const searchInput = document.getElementById("buscar");
const plataformaSelect = document.getElementById("plataforma");
const categoriaSelect = document.getElementById("categoria");
const regiaoSelect = document.getElementById("regiao");

// Função para buscar produtos
async function fetchProducts() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Erro ao buscar produtos");
    const data = await response.json();
    renderProducts(data);
  } catch (error) {
    console.error("❌ Erro ao carregar produtos:", error);
    productsContainer.innerHTML = "<p>Erro ao carregar produtos.</p>";
  }
}

// Renderizar produtos na tela
function renderProducts(produtos) {
  productsContainer.innerHTML = "";

  if (!produtos || produtos.length === 0) {
    productsContainer.innerHTML = "<p>Nenhum produto encontrado.</p>";
    return;
  }

  produtos.forEach(prod => {
    const card = document.createElement("div");
    card.classList.add("produto");

    card.innerHTML = `
      <img src="${prod.image || "https://via.placeholder.com/200"}" alt="${prod.name}">
      <h3>${prod.name}</h3>
      <p>${prod.description || ""}</p>
      <strong>${prod.currency || "R$"} ${prod.price || "0,00"}</strong>
      <p><small>${prod.platform || "Plataforma"} - ${prod.region || "Global"}</small></p>
      <a href="${prod.affiliateLink || "#"}" target="_blank" rel="noopener noreferrer">Comprar 🔗</a>
    `;

    productsContainer.appendChild(card);
  });
}

// Filtros
function applyFilters(produtos) {
  const busca = searchInput.value.toLowerCase();
  const plataforma = plataformaSelect.value.toLowerCase();
  const categoria = categoriaSelect.value.toLowerCase();
  const regiao = regiaoSelect.value.toLowerCase();

  return produtos.filter(prod => {
    const matchesBusca = prod.name.toLowerCase().includes(busca);
    const matchesPlataforma = !plataforma || prod.platform?.toLowerCase() === plataforma;
    const matchesCategoria = !categoria || prod.category?.toLowerCase() === categoria;
    const matchesRegiao = !regiao || prod.region?.toLowerCase() === regiao;

    return matchesBusca && matchesPlataforma && matchesCategoria && matchesRegiao;
  });
}

// Função principal
async function init() {
  try {
    const response = await fetch(API_URL);
    const produtos = await response.json();

    renderProducts(produtos);

    // Atualiza quando o usuário usar filtros
    [searchInput, plataformaSelect, categoriaSelect, regiaoSelect].forEach(el => {
      el.addEventListener("input", () => {
        const filtrados = applyFilters(produtos);
        renderProducts(filtrados);
      });
    });
  } catch (error) {
    console.error("Erro ao iniciar:", error);
  }
}

// Inicia o site
init();
