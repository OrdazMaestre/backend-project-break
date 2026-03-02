// Archivo que contendrá la definición de las rutas 
// CRUD para los productos. 
// Este llama a los métodos del controlador.

const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const baseHtml = require('../helpers/baseHtml');  // ← Importación correcta del helper actualizado

// GET /products - Lista todos los productos (catálogo público)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().lean(); // .lean() convierte a objetos JS simples (más rápido)

    let productsHtml = '';

    if (products.length === 0) {
      productsHtml = '<p style="text-align: center; font-size: 1.2rem;">No hay productos disponibles en este momento.</p>';
    } else {
      products.forEach(product => {
        productsHtml += `
          <div class="product-card">
            <img src="${product.imagen}" alt="${product.nombre}" onerror="this.src='https://via.placeholder.com/300x220?text=Sin+Imagen'; this.onerror=null;"
     loading="lazy">
            <div class="product-info">
              <h3>${product.nombre}</h3>
              <p class="price">${product.precio.toFixed(2)} €</p>
              <p>${product.descripcion}</p>
              <p><strong>Categoría:</strong> ${product.categoria}</p>
              <p><strong>Talla:</strong> ${product.talla}</p>
              <p><strong>Stock:</strong> ${product.stock} unidades</p>
            </div>
          </div>
        `;
      });
    }

    const content = `
      <h1>Catálogo de Productos</h1>
      <div class="products-grid">
        ${productsHtml}
      </div>
    `;

    // Usamos baseHtml con los tres parámetros: content, título, isAdmin
    const html = baseHtml(content, 'Catálogo', false);

    res.send(html);
  } catch (error) {
    console.error('Error listando productos:', error);
    res.status(500).send(baseHtml('<h1>Error del servidor</h1><p>Inténtalo más tarde.</p>', 'Error', false));
  }
});

module.exports = router;