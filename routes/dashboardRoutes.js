
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const baseHtml = require('../helpers/baseHtml');

// GET /dashboard - Panel admin
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().lean();

    let productsHtml = products.length === 0
      ? '<p style="text-align:center;">No hay productos aún.</p>'
      : products.map(p => `
          <div class="product-card">
            <h3>${p.nombre}</h3>
            <p>${p.precio.toFixed(2)} € | ${p.categoria} - ${p.talla}</p>
            <p>Stock: ${p.stock}</p>
            <div style="margin-top:10px;">
              <a href="/dashboard/edit/${p._id}" style="color:blue; margin-right:10px;">Editar</a>
              <form action="/dashboard/${p._id}?_method=DELETE" method="POST" style="display:inline;">
                <button type="submit" onclick="return confirm('¿Eliminar ${p.nombre}?')">Eliminar</button>
              </form>
            </div>
          </div>
        `).join('');

    const content = `
      <h1>Dashboard Administrador</h1>
      <p style="text-align:center;">
        <a href="/dashboard/new" style="background:#4CAF50;color:white;padding:10px 20px;border-radius:5px;text-decoration:none;">
          + Añadir Producto
        </a>
      </p>
      <div class="products-grid">${productsHtml}</div>
    `;

    res.send(baseHtml(content, 'Dashboard Admin', true));
  } catch (err) {
    console.error(err);
    res.send(baseHtml('<h1>Error cargando dashboard</h1>', 'Error', true));
  }
});

// GET /dashboard/new - Formulario para crear nuevo producto
router.get('/new', (req, res) => {
  const content = `
    <h1>Añadir Nuevo Producto</h1>
    
    <form action="/dashboard" method="POST" style="max-width:600px; margin:0 auto;">
      <div style="margin-bottom:1rem;">
        <label for="nombre">Nombre:</label><br>
        <input type="text" id="nombre" name="nombre" required style="width:100%; padding:0.5rem;">
      </div>
      
      <div style="margin-bottom:1rem;">
        <label for="descripcion">Descripción:</label><br>
        <textarea id="descripcion" name="descripcion" required rows="4" style="width:100%; padding:0.5rem;"></textarea>
      </div>
      
      <div style="margin-bottom:1rem;">
        <label for="precio">Precio (€):</label><br>
        <input type="number" id="precio" name="precio" step="0.01" min="0" required style="width:100%; padding:0.5rem;">
      </div>
      
      <div style="margin-bottom:1rem;">
        <label for="categoria">Categoría:</label><br>
        <select id="categoria" name="categoria" required style="width:100%; padding:0.5rem;">
          <option value="camisetas">Camisetas</option>
          <option value="pantalones">Pantalones</option>
          <option value="chaquetas">Chaquetas</option>
          <option value="zapatillas">Zapatillas</option>
          <option value="accesorios">Accesorios</option>
        </select>
      </div>
      
      <div style="margin-bottom:1rem;">
        <label for="talla">Talla:</label><br>
        <select id="talla" name="talla" required style="width:100%; padding:0.5rem;">
          <option value="XS">XS</option>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
          <option value="XXL">XXL</option>
        </select>
      </div>
      
      <div style="margin-bottom:1rem;">
        <label for="imagen">URL de la imagen:</label><br>
        <input type="url" id="imagen" name="imagen" required placeholder="https://..." style="width:100%; padding:0.5rem;">
      </div>
      
      <div style="margin-bottom:1rem;">
        <label for="stock">Stock:</label><br>
        <input type="number" id="stock" name="stock" min="0" required style="width:100%; padding:0.5rem;">
      </div>
      
      <button type="submit" style="background:#4CAF50; color:white; padding:0.8rem 1.5rem; border:none; border-radius:5px; cursor:pointer; font-size:1.1rem;">
        Guardar Producto
      </button>
      
      <a href="/dashboard" style="margin-left:1rem; color:#666; text-decoration:none;">Cancelar</a>
    </form>
  `;

  res.send(baseHtml(content, 'Nuevo Producto', true));
});

// POST /dashboard - Guardar nuevo producto
router.post('/', async (req, res) => {
  try {
    const { nombre, descripcion, precio, categoria, talla, imagen, stock } = req.body;

    await Product.create({
      nombre,
      descripcion,
      precio: parseFloat(precio),
      categoria,
      talla,
      imagen,
      stock: parseInt(stock, 10)
    });

    res.redirect('/dashboard');  // Vuelve al dashboard tras guardar
  } catch (error) {
    console.error('Error creando producto:', error);
    const errorContent = `<h1>Error al guardar</h1><p>${error.message || 'Datos inválidos'}</p><a href="/dashboard/new">Volver al formulario</a>`;
    res.status(400).send(baseHtml(errorContent, 'Error', true));
  }
});

// DELETE /dashboard/:id - Eliminar un producto
router.delete('/:id', async (req, res) => {
  try {
    const productId = req.params.id;

    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      const errorContent = '<h1>Producto no encontrado</h1><p>No existe un producto con ese ID.</p><a href="/dashboard">Volver al dashboard</a>';
      return res.status(404).send(baseHtml(errorContent, 'No encontrado', true));
    }

    // Redirigir al dashboard con éxito (puedes añadir un mensaje simple)
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Error eliminando producto:', error);
    const errorContent = `<h1>Error al eliminar</h1><p>${error.message || 'Error desconocido'}</p><a href="/dashboard">Volver</a>`;
    res.status(500).send(baseHtml(errorContent, 'Error', true));
  }
});

// GET /dashboard/edit/:id - Formulario para editar producto existente
router.get('/edit/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();

    if (!product) {
      const errorContent = '<h1>Producto no encontrado</h1><p>No existe un producto con ese ID.</p><a href="/dashboard">Volver al dashboard</a>';
      return res.status(404).send(baseHtml(errorContent, 'No encontrado', true));
    }

    const content = `
      <h1>Editar Producto: ${product.nombre}</h1>
      
      <form action="/dashboard/${product._id}?_method=PUT" method="POST" style="max-width:600px; margin:0 auto;">
        <div style="margin-bottom:1rem;">
          <label for="nombre">Nombre:</label><br>
          <input type="text" id="nombre" name="nombre" value="${product.nombre}" required style="width:100%; padding:0.5rem;">
        </div>
        
        <div style="margin-bottom:1rem;">
          <label for="descripcion">Descripción:</label><br>
          <textarea id="descripcion" name="descripcion" required rows="4" style="width:100%; padding:0.5rem;">${product.descripcion}</textarea>
        </div>
        
        <div style="margin-bottom:1rem;">
          <label for="precio">Precio (€):</label><br>
          <input type="number" id="precio" name="precio" step="0.01" min="0" value="${product.precio}" required style="width:100%; padding:0.5rem;">
        </div>
        
        <div style="margin-bottom:1rem;">
          <label for="categoria">Categoría:</label><br>
          <select id="categoria" name="categoria" required style="width:100%; padding:0.5rem;">
            <option value="camisetas" ${product.categoria === 'camisetas' ? 'selected' : ''}>Camisetas</option>
            <option value="pantalones" ${product.categoria === 'pantalones' ? 'selected' : ''}>Pantalones</option>
            <option value="chaquetas" ${product.categoria === 'chaquetas' ? 'selected' : ''}>Chaquetas</option>
            <option value="zapatillas" ${product.categoria === 'zapatillas' ? 'selected' : ''}>Zapatillas</option>
            <option value="accesorios" ${product.categoria === 'accesorios' ? 'selected' : ''}>Accesorios</option>
          </select>
        </div>
        
        <div style="margin-bottom:1rem;">
          <label for="talla">Talla:</label><br>
          <select id="talla" name="talla" required style="width:100%; padding:0.5rem;">
            <option value="XS" ${product.talla === 'XS' ? 'selected' : ''}>XS</option>
            <option value="S" ${product.talla === 'S' ? 'selected' : ''}>S</option>
            <option value="M" ${product.talla === 'M' ? 'selected' : ''}>M</option>
            <option value="L" ${product.talla === 'L' ? 'selected' : ''}>L</option>
            <option value="XL" ${product.talla === 'XL' ? 'selected' : ''}>XL</option>
            <option value="XXL" ${product.talla === 'XXL' ? 'selected' : ''}>XXL</option>
          </select>
        </div>
        
        <div style="margin-bottom:1rem;">
          <label for="imagen">URL de la imagen:</label><br>
          <input type="url" id="imagen" name="imagen" value="${product.imagen}" required placeholder="https://..." style="width:100%; padding:0.5rem;">
        </div>
        
        <div style="margin-bottom:1rem;">
          <label for="stock">Stock:</label><br>
          <input type="number" id="stock" name="stock" min="0" value="${product.stock}" required style="width:100%; padding:0.5rem;">
        </div>
        
        <button type="submit" style="background:#2196F3; color:white; padding:0.8rem 1.5rem; border:none; border-radius:5px; cursor:pointer; font-size:1.1rem;">
          Actualizar Producto
        </button>
        
        <a href="/dashboard" style="margin-left:1rem; color:#666; text-decoration:none;">Cancelar</a>
      </form>
    `;

    res.send(baseHtml(content, 'Editar Producto', true));
  } catch (error) {
    console.error('Error cargando edición:', error);
    const errorContent = '<h1>Error al cargar el formulario</h1><p>Inténtalo más tarde.</p><a href="/dashboard">Volver</a>';
    res.status(500).send(baseHtml(errorContent, 'Error', true));
  }
});

// PUT /dashboard/:id - Actualizar producto (usamos POST con _method=PUT)
router.put('/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const { nombre, descripcion, precio, categoria, talla, imagen, stock } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        nombre,
        descripcion,
        precio: parseFloat(precio),
        categoria,
        talla,
        imagen,
        stock: parseInt(stock, 10)
      },
      { new: true, runValidators: true }  // Devuelve el documento actualizado y valida
    );

    if (!updatedProduct) {
      const errorContent = '<h1>Producto no encontrado</h1><p>No existe un producto con ese ID.</p><a href="/dashboard">Volver</a>';
      return res.status(404).send(baseHtml(errorContent, 'No encontrado', true));
    }

    res.redirect('/dashboard');
  } catch (error) {
    console.error('Error actualizando producto:', error);
    const errorContent = `<h1>Error al actualizar</h1><p>${error.message || 'Datos inválidos'}</p><a href="/dashboard">Volver al dashboard</a>`;
    res.status(400).send(baseHtml(errorContent, 'Error', true));
  }
});

// GET /dashboard/:productId - Detalle de producto en modo admin
router.get('/:productId', async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).lean();

    if (!product) {
      return res.status(404).send(baseHtml('<h1>Producto no encontrado</h1><p><a href="/dashboard">Volver al dashboard</a></p>', 'No encontrado', true));
    }

    const content = `
      <h1>Detalle Admin: ${product.nombre}</h1>
      <div style="max-width:800px; margin:0 auto;">
        <img src="${product.imagen}" alt="${product.nombre}" style="max-width:100%; border-radius:8px; margin-bottom:1.5rem;">
        <p><strong>Precio:</strong> ${product.precio.toFixed(2)} €</p>
        <p><strong>Categoría:</strong> ${product.categoria} | <strong>Talla:</strong> ${product.talla}</p>
        <p><strong>Stock:</strong> ${product.stock}</p>
        <p><strong>Descripción:</strong> ${product.descripcion}</p>
        <p><strong>ID:</strong> ${product._id}</p>
        
        <div style="margin-top:2rem;">
          <a href="/dashboard/${product._id}/edit" style="background:#2196F3; color:white; padding:0.8rem 1.5rem; border-radius:5px; text-decoration:none; margin-right:1rem;">
            Editar
          </a>
          <form action="/dashboard/${product._id}?_method=DELETE" method="POST" style="display:inline;">
            <button type="submit" onclick="return confirm('¿Eliminar ${product.nombre}?')" style="background:#f44336; color:white; padding:0.8rem 1.5rem; border:none; border-radius:5px; cursor:pointer;">
              Eliminar
            </button>
          </form>
          <a href="/dashboard" style="margin-left:1rem; color:#666;">Volver al dashboard</a>
        </div>
      </div>
    `;

    res.send(baseHtml(content, `Detalle: ${product.nombre}`, true));
  } catch (error) {
    console.error('Error en detalle admin:', error);
    res.status(500).send(baseHtml('<h1>Error</h1><p><a href="/dashboard">Volver</a></p>', 'Error', true));
  }
});

module.exports = router;