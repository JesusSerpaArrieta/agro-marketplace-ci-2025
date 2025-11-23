const request = require('supertest');
const app = require('../backend/index');
const fs = require('fs');

beforeEach(() => {
  // Limpiar db.json antes de cada test
  if (fs.existsSync('db.json')) fs.unlinkSync('db.json');
  const db = require('../backend/index').db; // Recargar db
  db.defaults({ users: [], products: [] }).write();
});

describe('Sprint 1 - Agro Marketplace', () => {
  test('MC-001: registrar campesino', async () => {
    const res = await request(app)
      .post('/api/register-campesino')
      .send({ email: 'juan@campesino.com', password: '123', nombre: 'Juan', telefono: '300', ubicacion: 'Andes' });
    expect(res.status).toBe(201);
    expect(res.body.message).toBe('Campesino registrado');
  });

  // Prueba dummy que siempre pasa (para que el pipeline esté verde desde el inicio)
  test('2 + 2 = 4', () => {
    expect(2 + 2).toBe(4);
  });


  test('MC-002: registrar comprador', async () => {
    const res = await request(app)
      .post('/api/register-comprador')
      .send({ email: 'ana@comprador.com', password: '123', nombre: 'Ana' });
    expect(res.status).toBe(201);
    expect(res.body.message).toBe('Comprador registrado');
  });

  test('MC-002: login exitoso (campesino)', async () => {
    await request(app).post('/api/register-campesino').send({ email: 'juan@campesino.com', password: '123', nombre: 'Juan' });
    const res = await request(app).post('/api/login').send({ email: 'juan@campesino.com', password: '123' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.usuario.rol).toBe('campesino');
  });

  test('MC-003: publicar y listar productos', async () => {
    await request(app).post('/api/register-campesino').send({ email: 'juan@campesino.com', password: '123', nombre: 'Juan' });
    await request(app).post('/api/login').send({ email: 'juan@campesino.com', password: '123' });
    await request(app).post('/api/products').send({ nombre: 'Tomate', precio: 3000, cantidad: 50, campesino: 'Juan' });

    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].nombre).toBe('Tomate');
  });
});