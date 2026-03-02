// Archivo principal que iniciará el servidor Express. Importa las rutas y las usa. También tiene que estar configurado para servir archivos estáticos y para leer el body de las peticiones de formularios.
require('dotenv').config();           // Carga variables de entorno desde .env
const express = require('express');
const connectDB = require('./config/db');   // Importa la conexión a DB
const methodOverride = require('method-override');
const app = express();

// Middlewares básicos
app.use(express.urlencoded({ extended: true }));  // Para procesar formularios HTML
app.use(express.json());                          // Para procesar JSON (útil más adelante)
app.use(methodOverride('_method'));               // Para usar PUT/DELETE desde formularios

// Ruta de prueba para saber que el servidor vive
app.get('/', (req, res) => {
  res.send(`
    <h1>¡Servidor funcionando! 🎉</h1>
    <p>Estás en: http://localhost:${process.env.PORT || 8080}</p>
    <p>Próximamente: catálogo de ropa y dashboard admin</p>
  `);
});

// Conectar a la base de datos
connectDB();

// Rutas de productos (catálogo público)
app.use('/products', require('./routes/productRoutes'));

// Iniciar servidor
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});