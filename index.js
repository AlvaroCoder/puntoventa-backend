const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors')

const sequelize = require('./config/db');
const seedRoles = require('./seeders/seedRoles');

dotenv.config();
const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(morgan(':method :url :status :response-time ms - :res[content-length]'));
app.use('/api',require('./routes'));

// Sincronizar la base de datos y arrancar el servidor
sequelize.authenticate()
  .then(() => sequelize.query("SET GLOBAL sql_mode = 'NO_ENGINE_SUBSTITUTION'"))
  .then(() => sequelize.sync())
  .then(() => seedRoles())
  .then(() => {
    app.listen(3030, () => {
      console.log('Servidor corriendo en http://localhost:3030');
    });
  })
  .catch((err) => {
    console.error('Error al iniciar el servidor:', err);
  });