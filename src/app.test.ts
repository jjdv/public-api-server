import supertest from 'supertest';
import app from './app';

const request = supertest(app);

describe('General testing setup', () => {
  it('works as expected', async () => {
    const response = await request.get('/');

    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello World!');
  });
});
