require('dotenv').config();
const { Sequelize } = require('sequelize');

// Sequelize detecta automáticamente todos los datos a partir del string URL
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Evita errores de certificados SSL en entornos de desarrollo
    }
  }
});

module.exports = sequelize;
