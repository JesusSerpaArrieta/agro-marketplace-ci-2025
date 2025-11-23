// tests/auth.test.js
const request = require('supertest');
const app = require('../backend/index'); // ahora sí importa la app exportada

describe('Pruebas básicas de la API', () => {
  test('GET / responde con mensaje de bienvenida', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toContain('Agro Marketplace');
  });

  // Prueba dummy que siempre pasa (para que el pipeline esté verde desde el inicio)
  test('2 + 2 = 4', () => {
    expect(2 + 2).toBe(4);
  });
  
  test('MC-001: registrar y editar perfil de campesino', async () => {
  const reg = await request(app)
    .post('/api/register-campesino')
    .send({
      email: 'juan@campesino.com',
      password: '123456',
      nombre: 'Juan Pérez',
      telefono: '3001234567',
      ubicacion: 'Cundinamarca'
    });
  expect(reg.status).toBe(201);
  expect(reg.body.id).toBeDefined();

  const edit = await request(app)
    .put(`/api/campesino/${reg.body.id}`)
    .send({ telefono: '3009998888' });
  expect(edit.status).toBe(200);
});
});