const express = require('express');
const router = express.Router();
const db = require('../config/db');
const Senha = db.Senha;
const Fornecedor = db.Fornecedor;
const Filial = db.Filial;
const { Op } = require('sequelize');

// Função para gerar senha aleatória
const gerarSenha = (tamanho = 6) => {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let resultado = '';
  for (let i = 0; i < tamanho; i++) {
    resultado += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return resultado;
};

// GET /api/senhas - Retorna todas as senhas cadastradas
router.get('/', async (req, res) => {
  try {
    const senhas = await Senha.findAll({
      order: [['data_hora', 'DESC']],
      include: [
        { model: Fornecedor, as: 'fornecedor', attributes: ['nome'] },
        { model: Filial, as: 'filial', attributes: ['nome'] }
      ]
    });
    
    // Formatar os dados para corresponder ao formato original
    const formattedSenhas = senhas.map(senha => {
      const senhaObj = senha.get({ plain: true });
      return {
        ...senhaObj,
        data_hora: new Date(senhaObj.data_hora).toLocaleString('pt-BR'),
        fornecedor_nome: senhaObj.fornecedor ? senhaObj.fornecedor.nome : null,
        filial_nome: senhaObj.filial ? senhaObj.filial.nome : null
      };
    });
    
    res.json(formattedSenhas);
  } catch (error) {
    console.error('Erro ao buscar senhas:', error);
    res.status(500).json({ error: 'Erro ao buscar senhas' });
  }
});

// GET /api/senhas/:id - Retorna uma senha específica pelo ID
router.get('/:id', async (req, res) => {
  try {
    const senha = await Senha.findByPk(req.params.id, {
      include: [
        { model: Fornecedor, as: 'fornecedor', attributes: ['nome'] },
        { model: Filial, as: 'filial', attributes: ['nome'] }
      ]
    });
    
    if (!senha) {
      return res.status(404).json({ error: 'Senha não encontrada' });
    }
    
    // Formatar os dados para corresponder ao formato original
    const senhaObj = senha.get({ plain: true });
    const formattedSenha = {
      ...senhaObj,
      data_hora: new Date(senhaObj.data_hora).toLocaleString('pt-BR'),
      fornecedor_nome: senhaObj.fornecedor ? senhaObj.fornecedor.nome : null,
      filial_nome: senhaObj.filial ? senhaObj.filial.nome : null
    };
    
    res.json(formattedSenha);
  } catch (error) {
    console.error('Erro ao buscar senha:', error);
    res.status(500).json({ error: 'Erro ao buscar senha' });
  }
});

// GET /api/senhas/gerar - Gera uma nova senha aleatória
router.get('/gerar/nova', async (req, res) => {
  try {
    const novaSenha = gerarSenha();
    res.json({ senha: novaSenha });
  } catch (error) {
    console.error('Erro ao gerar senha:', error);
    res.status(500).json({ error: 'Erro ao gerar senha' });
  }
});

// POST /api/senhas - Cria um novo registro de senha
router.post('/', async (req, res) => {
  try {
    const { senha, placa, orcamento, fornecedor_id, filial_id } = req.body;
    
    if (!senha || !fornecedor_id || !filial_id) {
      return res.status(400).json({ error: 'Dados incompletos' });
    }
    
    // Verificar se o fornecedor existe
    const fornecedor = await Fornecedor.findByPk(fornecedor_id);
    if (!fornecedor) {
      return res.status(404).json({ error: 'Fornecedor não encontrado' });
    }
    
    // Verificar se a filial existe
    const filial = await Filial.findByPk(filial_id);
    if (!filial) {
      return res.status(404).json({ error: 'Filial não encontrada' });
    }
    
    // Verificar se a filial pertence ao fornecedor
    if (filial.fornecedor_id !== parseInt(fornecedor_id)) {
      return res.status(400).json({ error: 'Filial não pertence ao fornecedor informado' });
    }
    
    const novaSenha = await Senha.create({
      senha,
      placa: placa || null,
      orcamento: orcamento || null,
      fornecedor_id,
      filial_id
    });
    
    // Buscar a senha com os relacionamentos para retornar no formato esperado
    const senhaCompleta = await Senha.findByPk(novaSenha.id, {
      include: [
        { model: Fornecedor, as: 'fornecedor', attributes: ['nome'] },
        { model: Filial, as: 'filial', attributes: ['nome'] }
      ]
    });
    
    // Formatar os dados para corresponder ao formato original
    const senhaObj = senhaCompleta.get({ plain: true });
    const formattedSenha = {
      ...senhaObj,
      data_hora: new Date(senhaObj.data_hora).toLocaleString('pt-BR'),
      fornecedor_nome: senhaObj.fornecedor ? senhaObj.fornecedor.nome : null,
      filial_nome: senhaObj.filial ? senhaObj.filial.nome : null
    };
    
    res.status(201).json(formattedSenha);
  } catch (error) {
    console.error('Erro ao criar senha:', error);
    res.status(500).json({ error: 'Erro ao criar senha' });
  }
});

// PUT /api/senhas/:id - Atualiza um registro de senha existente
router.put('/:id', async (req, res) => {
  try {
    const senha = await Senha.findByPk(req.params.id);
    if (!senha) {
      return res.status(404).json({ error: 'Senha não encontrada' });
    }
    
    const { placa, orcamento, status, cancelada, motivo_cancelamento } = req.body;
    
    if (placa !== undefined) senha.placa = placa;
    if (orcamento !== undefined) senha.orcamento = orcamento;
    if (status !== undefined) senha.status = status;
    if (cancelada !== undefined) senha.cancelada = cancelada;
    if (motivo_cancelamento !== undefined) senha.motivo_cancelamento = motivo_cancelamento;
    
    await senha.save();
    
    // Buscar a senha atualizada com os relacionamentos
    const senhaAtualizada = await Senha.findByPk(senha.id, {
      include: [
        { model: Fornecedor, as: 'fornecedor', attributes: ['nome'] },
        { model: Filial, as: 'filial', attributes: ['nome'] }
      ]
    });
    
    // Formatar os dados para corresponder ao formato original
    const senhaObj = senhaAtualizada.get({ plain: true });
    const formattedSenha = {
      ...senhaObj,
      data_hora: new Date(senhaObj.data_hora).toLocaleString('pt-BR'),
      fornecedor_nome: senhaObj.fornecedor ? senhaObj.fornecedor.nome : null,
      filial_nome: senhaObj.filial ? senhaObj.filial.nome : null
    };
    
    res.json(formattedSenha);
  } catch (error) {
    console.error('Erro ao atualizar senha:', error);
    res.status(500).json({ error: 'Erro ao atualizar senha' });
  }
});

// POST /api/senhas/:id/cancelar - Cancela uma senha
router.post('/:id/cancelar', async (req, res) => {
  try {
    const senha = await Senha.findByPk(req.params.id);
    if (!senha) {
      return res.status(404).json({ error: 'Senha não encontrada' });
    }
    
    const { motivo } = req.body;
    if (!motivo) {
      return res.status(400).json({ error: 'Motivo do cancelamento é obrigatório' });
    }
    
    senha.cancelada = true;
    senha.status = 'Cancelada';
    senha.motivo_cancelamento = motivo;
    
    await senha.save();
    
    // Buscar a senha atualizada com os relacionamentos
    const senhaAtualizada = await Senha.findByPk(senha.id, {
      include: [
        { model: Fornecedor, as: 'fornecedor', attributes: ['nome'] },
        { model: Filial, as: 'filial', attributes: ['nome'] }
      ]
    });
    
    // Formatar os dados para corresponder ao formato original
    const senhaObj = senhaAtualizada.get({ plain: true });
    const formattedSenha = {
      ...senhaObj,
      data_hora: new Date(senhaObj.data_hora).toLocaleString('pt-BR'),
      fornecedor_nome: senhaObj.fornecedor ? senhaObj.fornecedor.nome : null,
      filial_nome: senhaObj.filial ? senhaObj.filial.nome : null
    };
    
    res.json(formattedSenha);
  } catch (error) {
    console.error('Erro ao cancelar senha:', error);
    res.status(500).json({ error: 'Erro ao cancelar senha' });
  }
});

// DELETE /api/senhas/:id - Remove um registro de senha
router.delete('/:id', async (req, res) => {
  try {
    const senha = await Senha.findByPk(req.params.id);
    if (!senha) {
      return res.status(404).json({ error: 'Senha não encontrada' });
    }
    
    await senha.destroy();
    res.json({ message: 'Registro de senha removido com sucesso' });
  } catch (error) {
    console.error('Erro ao remover senha:', error);
    res.status(500).json({ error: 'Erro ao remover senha' });
  }
});

module.exports = router;
