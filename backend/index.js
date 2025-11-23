// backend/index.js
const express = require('express');
const path = require('path');
const app = express();

// === CONFIGURACIONES ===
app.use(express.json());

// Servir FRONTEND
app.use(express.static(path.join(__dirname, '../frontend')));

// === BASE DE DATOS LOWDB (versión 1.0.0) ===
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);

db.defaults({ users: [], campesinos: [] }).write();

// === RUTAS API ===

// Registro campesino
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

// Editar perfil
app.put('/api/campesino/:id', (req, res) => {
  const { id } = req.params;

  db.get('campesinos')
    .find({ id: parseInt(id) })
    .assign(req.body)
    .write();

  res.json({ message: 'Perfil actualizado' });
});


// Fallback: servir index.html si no encuentra rutas
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// === EXPORT + SERVER ===
module.exports = app;

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server corriendo en http://localhost:${PORT}`);
  });
}
