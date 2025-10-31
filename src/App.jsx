import React, { useEffect } from "react";

function App() {
  useEffect(() => {
    console.log("✅ App.jsx carregado com sucesso!");
  }, []);

  return (
    <div className="app-container">
      <header className="header">
        <h1>🌍 GlobalAfiliados</h1>
        <p>Os melhores produtos das principais plataformas globais</p>
      </header>

      <main>
        <section id="products">
          {/* Os produtos serão carregados aqui pelo JS principal */}
        </section>
      </main>

      <footer>
        <p>© 2025 GlobalAfiliados - Todos os direitos reservados</p>
      </footer>
    </div>
  );
}

export default App;
