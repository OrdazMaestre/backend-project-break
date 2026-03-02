const getNavBar = require('./getNavBar');

/**
 * Genera la estructura HTML base para todas las páginas
 * @param {string} content - El contenido principal (HTML) que irá dentro de <main>
 * @param {string} [title='Tienda de Ropa'] - Título de la página
 * @param {boolean} [isAdmin=false] - Indica si es una página de administración (muestra enlaces admin en navbar)
 * @returns {string} HTML completo
 */
const baseHtml = (content = '', title = 'Tienda de Ropa', isAdmin = false) => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      font-family: Arial, Helvetica, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
      color: #333;
    }
    header {
      background-color: #222;
      color: white;
      padding: 1rem;
      text-align: center;
    }
    main {
      max-width: 1200px;
      margin: 2rem auto;
      padding: 0 1rem;
    }
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
    }
    .product-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      overflow: hidden;
      transition: transform 0.2s;
    }
    .product-card:hover {
      transform: translateY(-5px);
    }
    .product-card img {
      width: 100%;
      height: 220px;
      object-fit: cover;
    }
    .product-info {
      padding: 1rem;
    }
    h3 {
      margin: 0.5rem 0;
      font-size: 1.2rem;
    }
    .price {
      font-size: 1.3rem;
      color: #e44d26;
      font-weight: bold;
    }
  </style>
</head>
<body>
  ${getNavBar(isAdmin)}
  
  <main>
    ${content}
  </main>
</body>
</html>
`;

module.exports = baseHtml;