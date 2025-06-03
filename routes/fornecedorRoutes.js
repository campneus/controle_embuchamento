const express = require('express');
const router = express.Router();
const db = require('../config/db');
const Fornecedor = db.Fornecedor;

// GET /api/fornecedores - Retorna todos os fornecedores cadastrados
router.get('/', async (req, res) => {
  try {
    const fornecedores = await Fornecedor.findAll();
    res.json(fornecedores);
  } catch (error) {
    console.error('Erro ao buscar fornecedores:', error);
    res.status(500).json({ error: 'Erro ao buscar fornecedores' });
  }
});

// GET /api/fornecedores/:id - Retorna um fornecedor específico pelo ID
router.get('/:id', async (req, res) => {
  try {
    const fornecedor = await Fornecedor.findByPk(req.params.id);
    if (!fornecedor) {
      return res.status(404).json({ error: 'Fornecedor não encontrado' });
    }
    res.json(fornecedor);
  } catch (error) {
    console.error('Erro ao buscar fornecedor:', error);
    res.status(500).json({ error: 'Erro ao buscar fornecedor' });
  }
});

// POST /api/fornecedores - Cria um novo fornecedor
router.post('/', async (req, res) => {
  try {
    const { nome, cnpj } = req.body;
    
    if (!nome || !cnpj) {
      return res.status(400).json({ error: 'Dados incompletos' });
    }
    
    // Verificar se já existe fornecedor com este CNPJ
    const existing = await Fornecedor.findOne({ where: { cnpj } });
    if (existing) {
      return res.status(400).json({ error: 'CNPJ já cadastrado' });
    }
    
    const fornecedor = await Fornecedor.create({ nome, cnpj });
    res.status(201).json(fornecedor);
  } catch (error) {
    console.error('Erro ao criar fornecedor:', error);
    res.status(500).json({ error: 'Erro ao criar fornecedor' });
  }
});

// PUT /api/fornecedores/:id - Atualiza um fornecedor existente
router.put('/:id', async (req, res) => {
  try {
    const fornecedor = await Fornecedor.findByPk(req.params.id);
    if (!fornecedor) {
      return res.status(404).json({ error: 'Fornecedor não encontrado' });
    }
    
    const { nome, cnpj } = req.body;
    
    if (cnpj) {
      // Verificar se já existe outro fornecedor com este CNPJ
      const existing = await Fornecedor.findOne({ where: { cnpj } });
      if (existing && existing.id !== parseInt(req.params.id)) {
        return res.status(400).json({ error: 'CNPJ já cadastrado para outro fornecedor' });
      }
      fornecedor.cnpj = cnpj;
    }
    
    if (nome) {
      fornecedor.nome = nome;
    }
    
    await fornecedor.save();
    res.json(fornecedor);
  } catch (error) {
    console.error('Erro ao atualizar fornecedor:', error);
    res.status(500).json({ error: 'Erro ao atualizar fornecedor' });
  }
});

// DELETE /api/fornecedores/:id - Remove um fornecedor
router.delete('/:id', async (req, res) => {
  try {
    const fornecedor = await Fornecedor.findByPk(req.params.id);
    if (!fornecedor) {
      return res.status(404).json({ error: 'Fornecedor não encontrado' });
    }
    
    await fornecedor.destroy();
    res.json({ message: 'Fornecedor removido com sucesso' });
  } catch (error) {
    console.error('Erro ao remover fornecedor:', error);
    res.status(500).json({ error: 'Erro ao remover fornecedor' });
  }
});

module.exports = router;
