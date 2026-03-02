// Archivo que contendrá la configuración de la base de 
// datos. Deberá conectarse a la base de datos de mongo 
// en Atlas.

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('¡Conexión exitosa a MongoDB Atlas! ✅');
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;