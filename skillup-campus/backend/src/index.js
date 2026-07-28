const express = require('express');
const sequelize = require('./config/database');

const conection = sequelize.authenticate()
const app = express();
const PORT = 3001;

app.get('/', (req, res) => {
  res.send('Servidor Express funcionando');
});

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida');

    app.listen(PORT, () => {
      console.log(`Servidor Express escuchando en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error);
    process.exit(1);
  }
}

startServer();