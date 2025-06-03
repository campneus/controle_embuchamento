const { Sequelize } = require('sequelize');
const config = require('../config/config');
require('dotenv').config();

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Log para verificar a URL de conexão
// console.log(`Connecting to database with URL: ${dbConfig.url}`);

const sequelize = new Sequelize(dbConfig.url, {
  dialect: dbConfig.dialect,
  dialectOptions: dbConfig.dialectOptions,
  logging: false, // Desabilitar logs SQL no console
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Carregar modelos
db.Fornecedor = require('../models/fornecedor')(sequelize, Sequelize.DataTypes);
db.Filial = require('../models/filial')(sequelize, Sequelize.DataTypes);
db.Senha = require('../models/senha')(sequelize, Sequelize.DataTypes);

// Definir associações
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;

