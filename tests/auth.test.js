const request = require('supertest');
const app = require('../backend/index');

test('API base responde OK', async () => {
  const response = await request(app).get('/');
  expect(response.status).toBe(200);
  expect(response.text).toContain('Agro Marketplace');
});