const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors')
const clientesRoutes = require('./routes/clientesRoutes');
const usersRoutes = require('./routes/userRoutes');
const trabajadoresRoutes = require('./routes/workersRoutes');
const tiendaRoutes = require('./routes/tiendaRoutes');

const sequelize = require('./config/db');

dotenv.config();
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(morgan(':method :url :status :response-time ms - :res[content-length]'))

// Rutas
app.use('/api/clientes', clientesRoutes);
app.use('/api/trabajadores',trabajadoresRoutes);
app.use('/api/tiendas', tiendaRoutes);
app.use('/users', usersRoutes);

// Sincronizar la base de datos y arrancar el servidor
sequelize.sync().then(() => {
  app.listen(3030, () => {
    console.log('Servidor corriendo en http://localhost:3030');
  });
});