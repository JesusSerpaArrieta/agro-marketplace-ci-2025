// backend/index.js
const express = require('express');
const path = require('path');
const app = express();

// === CONFIGURACIONES ===
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// === BASE DE DATOS LOWDB ===
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync(path.join(__dirname, 'db.json')); // Ruta absoluta
const db = low(adapter);

// Inicialización de colecciones (unificada)
db.defaults({ users: [], products: [] }).write(); // Eliminamos campesinos para simplificar

// === RUTAS API ===

// MC-001: Registro campesino
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
  res.status(201).json({ message: 'Campesino registrado', id: nuevo.id });
});

// Registro comprador
app.post('/api/register-comprador', (req, res) => {
  const { email, password, nombre } = req.body;
  if (db.get('users').find({ email }).value()) {
    return res.status(400).json({ error: 'Email ya registrado' });
  }
  const nuevo = {
    id: Date.now(),
    email,
    password,
    rol: 'comprador',
    nombre,
    creadoEl: new Date().toISOString()
  };
  db.get('users').push(nuevo).write();
  res.status(201).json({ message: 'Comprador registrado', id: nuevo.id });
});

// MC-002: Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const usuario = db.get('users').find({ email, password }).value();
  if (!usuario) return res.status(401).json({ error: 'Credenciales incorrectas' });

  const token = Buffer.from(`${email}:${Date.now()}:${Math.random()}`).toString('base64');
  res.json({
    message: 'Login exitoso',
    token,
    usuario: { id: usuario.id, email: usuario.email, nombre: usuario.nombre, rol: usuario.rol }
  });
});

// MC-003: Productos
app.get('/api/products', (req, res) => res.json(db.get('products').value()));
app.post('/api/products', (req, res) => {
  const producto = { id: Date.now(), publicadoEl: new Date().toISOString(), ...req.body };
  db.get('products').push(producto).write();
  res.status(201).json(producto);
});

// Fallback SPA
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../frontend/index.html')));

// === EXPORT + SERVER ===
module.exports = app;
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
}

const multer = require('multer');
const upload = multer({ dest: '../frontend/uploads/' });

// Ruta para subir imagen
app.post('/api/upload', upload.single('imagen'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No se subió archivo' });
  res.json({ url: `/uploads/${req.file.filename}` });
});