const swaggerUi = require('swagger-ui-express');

export function initSwagger(app) {
  const swaggerDocument = require('./swagger.json');
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}
