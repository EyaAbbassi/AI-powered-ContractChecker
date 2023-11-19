const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const swaggerUi = require('swagger-ui-express');
const specs = require('./utils/swagger');
const contractRoutes = require('./routes/contractRoute');
require('dotenv').config();

const core = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.DB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//middleware
app.use(core());
app.use(bodyParser.json());

// Serve Swagger UI at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use('/contracts', contractRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API Documentation are in http://localhost:${PORT}/api-docs/`);
});