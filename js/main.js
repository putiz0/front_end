console.log("✅ main.js carregado");

// URL da API (Render)
const API_URL = "https://node-api-gc77.onrender.com/api/products";
console.log("🌐 API em uso:", API_URL);

// Referências (Verifica se os elementos existem)
const productsContainer = document.getElementById("products");
const searchInput = document.getElementById("buscar");
const plataformaSelect = document.getElementById("plataforma");
const categoriaSelect = document.getElementById("categoria");
const regiaoSelect = document.getElementById("regiao");

// Função para buscar produtos
async function fetchProducts() {
  if (!productsContainer) {
    console.error("❌ Elemento #products não encontrado no HTML!");
    return [];
  }
  
  // Mostra mensagem de carregamento inicial
  productsContainer.innerHTML = "<p class='loading-message'>Carregando produtos...</p>";

  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Erro ao buscar produtos");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("❌ Erro ao carregar produtos:", error);
    // Exibe mensagem de erro se a busca falhar
    productsContainer.innerHTML = "<p class='loading-message'>Erro ao carregar produtos. Tente novamente mais tarde.</p>";
    return [];
  }
}

// Renderizar produtos na tela
function renderProducts(produtos) {
  if (!productsContainer) return;
  
  productsContainer.innerHTML = "";

  if (!produtos || produtos.length === 0) {
    productsContainer.innerHTML = "<p class='loading-message'>Nenhum produto encontrado com os filtros atuais.</p>";
    return;
  }

  produtos.forEach(prod => {
    const card = document.createElement("div");
    // CLASSE AJUSTADA: Usando 'produto-card' para corresponder ao style.css
    card.classList.add("produto-card"); 

    // Adicionado placeholder de imagem e formatação de preço mais segura
    const formattedPrice = prod.price ? parseFloat(prod.price).toFixed(2).replace('.', ',') : "0,00";

    card.innerHTML = `
      <img 
        src="${prod.image || "https://placehold.co/200x200/cccccc/333333?text=Sem+Imagem"}" 
        alt="${prod.name || "Imagem do Produto"}" 
        loading="lazy"
      >
      <h3>${prod.name || "Produto Desconhecido"}</h3>
      <p>${prod.description || "Descrição não disponível."}</p>
      <strong class="preco">${prod.currency || "R$"} ${formattedPrice}</strong>
      <p class="info-plataforma"><small>${prod.platform || "Plataforma"} - ${prod.region || "Global"}</small></p>
      <a href="${prod.affiliateLink || "#"}" class="btn" target="_blank" rel="noopener noreferrer">Comprar 🔗</a>
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
    // Adicionei a verificação de existência para prod.name
    const matchesBusca = prod.name ? prod.name.toLowerCase().includes(busca) : false;
    const matchesPlataforma = !plataforma || prod.platform?.toLowerCase() === plataforma;
    const matchesCategoria = !categoria || prod.category?.toLowerCase() === categoria;
    const matchesRegiao = !regiao || prod.region?.toLowerCase() === regiao;

    return matchesBusca && matchesPlataforma && matchesCategoria && matchesRegiao;
  });
}

// Função principal
async function init() {
  const produtos = await fetchProducts();

  // Se a busca inicial falhou, o fetchProducts já exibiu a mensagem de erro.
  if (produtos.length === 0 && productsContainer.innerHTML.includes("Carregando produtos...")) {
      renderProducts(produtos); // Exibe "Nenhum produto encontrado"
  } else if (produtos.length > 0) {
      renderProducts(produtos);

      // Adiciona listeners somente se os elementos de filtro existirem
      if (searchInput && plataformaSelect && categoriaSelect && regiaoSelect) {
        [searchInput, plataformaSelect, categoriaSelect, regiaoSelect].forEach(el => {
          el.addEventListener("input", () => {
            const filtrados = applyFilters(produtos);
            renderProducts(filtrados);
          });
        });
      }
  }
}

// Inicia o site após o DOM estar completamente carregado
document.addEventListener('DOMContentLoaded', init);