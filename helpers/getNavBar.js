
const getNavBar = (isAdmin = false) => `
<nav style="
  background: #222;
  padding: 1rem;
  margin-bottom: 2rem;
">
  <div style="
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: white;
  ">
    <a href="/" style="color: white; text-decoration: none; font-size: 1.5rem; font-weight: bold;">
      Tienda Ropa
    </a>
    
    <div>
      <a href="/products" style="color: white; margin-right: 1.5rem; text-decoration: none;">
        Catálogo
      </a>
      
      ${isAdmin ? `
        <a href="/dashboard" style="color: #4CAF50; margin-right: 1.5rem; text-decoration: none; font-weight: bold;">
          Dashboard Admin
        </a>
      ` : ''}
      
      <!-- Puedes añadir login/logout más adelante -->
      <a href="#" style="color: white; text-decoration: none;">
        Iniciar sesión
      </a>
    </div>
  </div>
</nav>
`;

module.exports = getNavBar;