const express = require('express');
const router = express.Router();
const db = require('../config/db');
const Filial = db.Filial;
const Fornecedor = db.Fornecedor;

// GET /api/filiais - Retorna todas as filiais cadastradas
router.get('/', async (req, res) => {
  try {
    const { fornecedor_id } = req.query;
    
    let filiais;
    if (fornecedor_id) {
      filiais = await Filial.findAll({
        where: { fornecedor_id: parseInt(fornecedor_id) }
      });
    } else {
      filiais = await Filial.findAll();
    }
    
    res.json(filiais);
  } catch (error) {
    console.error('Erro ao buscar filiais:', error);
    res.status(500).json({ error: 'Erro ao buscar filiais' });
  }
});

// GET /api/filiais/:id - Retorna uma filial específica pelo ID
router.get('/:id', async (req, res) => {
  try {
    const filial = await Filial.findByPk(req.params.id);
    if (!filial) {
      return res.status(404).json({ error: 'Filial não encontrada' });
    }
    res.json(filial);
  } catch (error) {
    console.error('Erro ao buscar filial:', error);
    res.status(500).json({ error: 'Erro ao buscar filial' });
  }
});

// POST /api/filiais - Cria uma nova filial
router.post('/', async (req, res) => {
  try {
    const { codigo, nome, fornecedor_id } = req.body;
    
    if (!codigo || !nome || !fornecedor_id) {
      return res.status(400).json({ error: 'Dados incompletos' });
    }
    
    // Verificar se o fornecedor existe
    const fornecedor = await Fornecedor.findByPk(fornecedor_id);
    if (!fornecedor) {
      return res.status(404).json({ error: 'Fornecedor não encontrado' });
    }
    
    // Verificar se já existe filial com este código para este fornecedor
    const existing = await Filial.findOne({
      where: {
        codigo,
        fornecedor_id
      }
    });
    
    if (existing) {
      return res.status(400).json({ error: 'Código de filial já cadastrado para este fornecedor' });
    }
    
    const filial = await Filial.create({
      codigo,
      nome,
      fornecedor_id
    });
    
    res.status(201).json(filial);
  } catch (error) {
    console.error('Erro ao criar filial:', error);
    res.status(500).json({ error: 'Erro ao criar filial' });
  }
});

// PUT /api/filiais/:id - Atualiza uma filial existente
router.put('/:id', async (req, res) => {
  try {
    const filial = await Filial.findByPk(req.params.id);
    if (!filial) {
      return res.status(404).json({ error: 'Filial não encontrada' });
    }
    
    const { codigo, nome, fornecedor_id } = req.body;
    
    if (codigo) {
      // Verificar se já existe outra filial com este código para o mesmo fornecedor
      const existing = await Filial.findOne({
        where: {
          codigo,
          fornecedor_id: filial.fornecedor_id
        }
      });
      
      if (existing && existing.id !== parseInt(req.params.id)) {
        return res.status(400).json({ error: 'Código de filial já cadastrado para este fornecedor' });
      }
      
      filial.codigo = codigo;
    }
    
    if (nome) {
      filial.nome = nome;
    }
    
    if (fornecedor_id) {
      // Verificar se o fornecedor existe
      const fornecedor = await Fornecedor.findByPk(fornecedor_id);
      if (!fornecedor) {
        return res.status(404).json({ error: 'Fornecedor não encontrado' });
      }
      
      filial.fornecedor_id = fornecedor_id;
    }
    
    await filial.save();
    res.json(filial);
  } catch (error) {
    console.error('Erro ao atualizar filial:', error);
    res.status(500).json({ error: 'Erro ao atualizar filial' });
  }
});

// DELETE /api/filiais/:id - Remove uma filial
router.delete('/:id', async (req, res) => {
  try {
    const filial = await Filial.findByPk(req.params.id);
    if (!filial) {
      return res.status(404).json({ error: 'Filial não encontrada' });
    }
    
    await filial.destroy();
    res.json({ message: 'Filial removida com sucesso' });
  } catch (error) {
    console.error('Erro ao remover filial:', error);
    res.status(500).json({ error: 'Erro ao remover filial' });
  }
});

module.exports = router;
