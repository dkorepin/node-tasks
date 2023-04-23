import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { RequestHandler } from "express";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "My API",
    version: "1.0.0",
    description: "API documentation using Swagger",
  },
  servers: [
    {
      url: "http://localhost:3001",
      description: "Development server",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./src/routers/*.ts"], // Path to the API routes folder
};

const swaggerSpec = swaggerJSDoc(options);

export const swaggerUiMiddleware: RequestHandler[] = swaggerUi.serve;
export const swaggerUiSetup = swaggerUi.setup(swaggerSpec);
