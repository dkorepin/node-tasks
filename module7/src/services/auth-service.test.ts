import request from "supertest";

const baseURL = "http://localhost:3001";

describe('Auth service', () => {
    test.only('should respond with a 200 status code', async () => {
      const response = await request(baseURL)
        .post('/login')
        .send({
            login:"Denis",
            password:"0000",
        });
  
      expect(response.statusCode).toBe(200);
    });
  });

