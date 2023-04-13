import dotenv from "dotenv";
import request from "supertest";
dotenv.config();


export const baseURL = `http://localhost:${process.env.PORT}`;
export const getToken = async (): Promise<string> => {
  const loginResponse = await request(baseURL).post("/login").send({
    login: "Denis",
    password: "0000",
  });

  return loginResponse.body.token;
};
