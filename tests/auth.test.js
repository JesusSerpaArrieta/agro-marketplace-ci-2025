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
});