const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors')

const sequelize = require('./config/db');

dotenv.config();
const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(morgan(':method :url :status :response-time ms - :res[content-length]'));
app.use('/api',require('./routes'));

// Sincronizar la base de datos y arrancar el servidor
sequelize.sync().then(() => {
  app.listen(3030, () => {
    console.log('Servidor corriendo en http://localhost:3030');
  });
});