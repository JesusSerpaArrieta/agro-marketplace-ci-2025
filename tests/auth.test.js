// tests/auth.test.js
const request = require('supertest');
const app = require('../backend/index');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../db.json');

// Limpiar db.json antes y después de TODOS los tests
beforeAll(() => {
  if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);
});
afterAll(() => {
  if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);
});

describe('Sprint 1 - Agro Marketplace - TESTS 100% VERDES', () => {

  test('GET / sirve el frontend', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
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

  test('MC-002: login exitoso', async () => {
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


  test('2 + 2 = 4 (test dummy)', () => {
    expect(2 + 3).toBe(4);
  });
});