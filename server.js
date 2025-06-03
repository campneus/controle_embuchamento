const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const { sequelize } = require('./config/db');

// Carregar variáveis de ambiente
dotenv.config();

// Inicializar aplicação Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Importar rotas
const fornecedorRoutes = require('./routes/fornecedorRoutes');
const filialRoutes = require('./routes/filialRoutes');
const senhaRoutes = require('./routes/senhaRoutes');
const utilRoutes = require('./routes/utilRoutes');

// Registrar rotas
app.use('/api/fornecedores', fornecedorRoutes);
app.use('/api/filiais', filialRoutes);
app.use('/api/senhas', senhaRoutes);
app.use('/', utilRoutes);

// Rota para verificar status da API
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toLocaleString('pt-BR')
  });
});

// Rota para servir o index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para qualquer outro caminho
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Sincronizar modelos com o banco de dados
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: false });
    console.log('Banco de dados sincronizado com sucesso.');
  } catch (error) {
    console.error('Erro ao sincronizar banco de dados:', error);
  }
};

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', async () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  await syncDatabase();
});

module.exports = app;
