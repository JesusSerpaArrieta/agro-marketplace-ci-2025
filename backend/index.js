// backend/index.js
const express = require('express');
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API Agro Marketplace - CI funcionando');
});

// NO hacemos app.listen aquí cuando estamos en test
// Solo exportamos la app para que Jest la use
module.exports = app;

// Pero si lo ejecutamos directamente (npm start), sí levantamos el server
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server corriendo en puerto ${PORT}`);
  });
}