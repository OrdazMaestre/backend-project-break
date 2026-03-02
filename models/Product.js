// Archivo que contendrá la definición del esquema del 
// producto utilizando Mongoose.

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del producto es obligatorio'],
    trim: true,
    minlength: [3, 'El nombre debe tener al menos 3 caracteres']
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    trim: true
  },
  precio: {
    type: Number,
    required: [true, 'El precio es obligatorio'],
    min: [0, 'El precio no puede ser negativo']
  },
  categoria: {
    type: String,
    required: [true, 'La categoría es obligatoria'],
    enum: {
      values: ['camisetas', 'pantalones', 'chaquetas', 'zapatillas', 'accesorios'],
      message: '{VALUE} no es una categoría válida'
    }
  },
  talla: {
    type: String,
    required: [true, 'La talla es obligatoria'],
    enum: {
      values: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      message: '{VALUE} no es una talla válida'
    }
  },
  imagen: {
    type: String,
    required: [true, 'La URL de la imagen es obligatoria'],
    trim: true
  },
  stock: {
    type: Number,
    required: [true, 'El stock es obligatorio'],
    min: [0, 'El stock no puede ser negativo'],
    default: 0
  }
}, {
  timestamps: true // Añade createdAt y updatedAt automáticamente
});

module.exports = mongoose.model('Product', productSchema);