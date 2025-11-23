// tests/auth.test.js
const request = require('supertest');
const app = require('../backend/index');
const fs = require('fs');
const path = require('path');

// Limpiar db.json antes de cada test
beforeEach(() => {
  const dbPath = path.join(__dirname, '../db.json');
  if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);
});

describe('Sprint 1 - Agro Marketplace - TESTS VERDES', () => {

  test('GET / sirve el frontend (dashboard)', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toContain('Agro Marketplace');
  });

  test('MC-001: registrar campesino', async () => {
    const res = await request(app)
      .post('/api/register-campesino')
      .send({
        email: 'juan@campesino.com',
        password: '123456',
        nombre: 'Juan Pérez',
        telefono: '3001234567',
        ubicacion: 'Cundinamarca'
      });
    expect(res.status).toBe(201);
    expect(res.body.message).toContain('registrado');
  });

  test('MC-002: registrar comprador', async () => {
    const res = await request(app)
      .post('/api/register-comprador')
      .send({
        email: 'ana@comprador.com',
        password: '123456',
        nombre: 'Ana Gómez'
      });
    expect(res.status).toBe(201);
  });

  test('MC-002: login exitoso (campesino)', async () => {
    await request(app).post('/api/register-campesino').send({
      email: 'maria@campesina.com',
      password: '123456',
      nombre: 'María'
    });

    const res = await request(app)
      .post('/api/login')
      .send({ email: 'maria@campesina.com', password: '123456' });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.usuario.rol).toBe('campesino');
  });

  test('MC-003: publicar y listar productos', async () => {
    const producto = {
      nombre: 'Tomate Chonto',
      precio: 3500,
      cantidad: 100,
      campesino: { nombre: 'Pedro', id: 999 }
    };

    await request(app)
      .post('/api/products')
      .send(producto);

    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].nombre).toBe('Tomate Chonto');
  });

  test('2 + 2 = 4 (test dummy para CI)', () => {
    expect(2 + 2).toBe(4);
  });
});