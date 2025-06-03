const express = require('express');
const router = express.Router();

// Rota para obter filiais agrupadas por fornecedor
router.get('/api/filiais-por-fornecedor', async (req, res) => {
  try {
    const db = require('../config/db');
    const Fornecedor = db.Fornecedor;
    const Filial = db.Filial;
    
    // Buscar todos os fornecedores com suas filiais
    const fornecedores = await Fornecedor.findAll({
      include: [{
        model: Filial,
        as: 'filiais'
      }]
    });
    
    // Organizar filiais por fornecedor
    const filialPorFornecedor = {};
    
    fornecedores.forEach(fornecedor => {
      const fornecedorObj = fornecedor.get({ plain: true });
      filialPorFornecedor[fornecedorObj.nome] = fornecedorObj.filiais;
    });
    
    res.json(filialPorFornecedor);
  } catch (error) {
    console.error('Erro ao buscar filiais por fornecedor:', error);
    res.status(500).json({ error: 'Erro ao buscar filiais por fornecedor' });
  }
});

module.exports = router;
