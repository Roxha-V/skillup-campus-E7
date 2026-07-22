const express = require('express');

const app = express();
const PORT = 3001;

app.get('/', (req, res) => {
  res.send('Servidor Express funcionando');
});

app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});