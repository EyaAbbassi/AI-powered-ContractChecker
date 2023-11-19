const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Your API Documentation',
      version: '1.0.0',
      description: 'API documentation for your contracts',
    },
  },
  apis: [`${__dirname}/routes/contractRoute.js`], // Path to the API routes
};

const specs = swaggerJsdoc(options);

module.exports = specs;
