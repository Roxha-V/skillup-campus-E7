const express = require('express');
const app = express();
const sequelize = require('./config/database');

const conection = sequelize.authenticate()
const PORT = 3001;

app.use(express.json());
// Importar rutas
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/coursePublicRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
app.use('/api/courses', courseRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/enrollments', enrollmentRoutes);

const courseRoutesAdmin = require('./routes/courseAdminRoutes');
app.use('/api/admin/courses', courseRoutesAdmin);


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