// backend/index.js
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static('../frontend'));  // Sirve el frontend

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

// === MC-001: Registro y gestión de perfil de campesino ===
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);
db.defaults({ users: [], campesinos: [] }).write();

// Registro de campesino
app.post('/api/register-campesino', (req, res) => {
  const { email, password, nombre, telefono, ubicacion } = req.body;
  if (db.get('users').find({ email }).value()) {
    return res.status(400).json({ error: 'Email ya registrado' });
  }
  const nuevo = {
    id: Date.now(),
    email,
    password,
    rol: 'campesino',
    nombre,
    telefono,
    ubicacion,
    creadoEl: new Date().toISOString()
  };
  db.get('users').push(nuevo).write();
  db.get('campesinos').push(nuevo).write();
  res.status(201).json({ message: 'Campesino registrado', id: nuevo.id });
});

// Editar perfil campesino
app.put('/api/campesino/:id', (req, res) => {
  const { id } = req.params;
  db.get('campesinos').find({ id: parseInt(id) }).assign(req.body).write();
  res.json({ message: 'Perfil actualizado' });
});