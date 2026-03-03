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
          <a href="/products/${product._id}" 
             style="text-decoration:none; color:inherit; display:block;">
            <div class="product-card">
              <img src="${product.imagen}" alt="${product.nombre}" 
                   onerror="this.src='https://via.placeholder.com/300x220?text=Sin+Imagen'; this.onerror=null;"
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
          </a>
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

// GET /products/:productId - Detalle de un producto (público)
router.get('/:productId', async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).lean();

    if (!product) {
      return res.status(404).send(baseHtml('<h1>Producto no encontrado</h1><p><a href="/products">Volver al catálogo</a></p>', 'No encontrado', false));
    }

    const content = `
      <h1>${product.nombre}</h1>
      <div style="max-width:800px; margin:0 auto; text-align:center;">
        <img src="${product.imagen}" alt="${product.nombre}" 
             onerror="this.src='https://via.placeholder.com/600x400?text=Sin+Imagen';this.onerror=null;"
             loading="lazy" style="max-width:100%; border-radius:8px; margin-bottom:1.5rem;">
        <p style="font-size:1.3rem; margin:1rem 0;"><strong>Precio:</strong> ${product.precio.toFixed(2)} €</p>
        <p><strong>Categoría:</strong> ${product.categoria} | <strong>Talla:</strong> ${product.talla}</p>
        <p><strong>Stock disponible:</strong> ${product.stock} unidades</p>
        <p style="margin:1.5rem 0; font-size:1.1rem;">${product.descripcion}</p>
        <a href="/products" style="display:inline-block; background:#2196F3; color:white; padding:0.8rem 1.5rem; border-radius:5px; text-decoration:none;">
          Volver al catálogo
        </a>
      </div>
    `;

    res.send(baseHtml(content, product.nombre, false));
  } catch (error) {
    console.error('Error mostrando detalle:', error);
    res.status(500).send(baseHtml('<h1>Error del servidor</h1><p>Inténtalo más tarde.</p><a href="/products">Volver</a>', 'Error', false));
  }
});

module.exports = router;