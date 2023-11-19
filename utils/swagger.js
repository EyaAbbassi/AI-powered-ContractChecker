const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Contracts API Documentation',
      version: '1.0.0',
      description: 'API documentation for your contracts',
    },
  },
  apis: [`./routes/contractRoute.js`], // Path to the API routes
};

const specs = swaggerJsdoc(options);

module.exports = specs;
