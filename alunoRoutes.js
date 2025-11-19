const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('./db');

const router = express.Router();

// Função auxiliar para validar email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Função auxiliar para validar campos obrigatórios
function validateRequiredFields(body) {
  const errors = [];
  
  if (!body.nome_completo || body.nome_completo.trim() === '') {
    errors.push('O campo nome_completo é obrigatório e não pode estar vazio');
  }
  
  if (!body.usuario_acesso || body.usuario_acesso.trim() === '') {
    errors.push('O campo usuario_acesso é obrigatório e não pode estar vazio');
  }
  
  if (!body.senha_hash || body.senha_hash.trim() === '') {
    errors.push('O campo senha_hash é obrigatório e não pode estar vazio');
  }
  
  if (!body.email_aluno || body.email_aluno.trim() === '') {
    errors.push('O campo email_aluno é obrigatório e não pode estar vazio');
  }
  
  return errors;
}

// ============================================================================
// ROTAS GET - Devem vir PRIMEIRO, antes de rotas POST e específicas
// ============================================================================

// Endpoint GET / - Listar todos os alunos (sem a senha)
router.get('/', async (req, res) => {
  try {
    console.log('🔍 GET / - Buscando todos os alunos');
    
    const query = `
      SELECT id, nome_completo, usuario_acesso, email_aluno, observacao, created_at
      FROM alunos
      ORDER BY created_at DESC
    `;

    const [alunos] = await pool.execute(query);

    console.log(`✅ Total de alunos encontrados: ${alunos.length}`);

    res.status(200).json({
      sucesso: true,
      total: alunos.length,
      alunos: alunos
    });
  } catch (error) {
    console.error('❌ Erro ao buscar alunos:', error);
    res.status(500).json({
      erro: 'Erro interno do servidor',
      mensagem: 'Não foi possível recuperar os alunos',
      detalhe: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Endpoint GET /usuario/:usuario_acesso - Buscar aluno por usuario_acesso
router.get('/usuario/:usuario_acesso', async (req, res) => {
  try {
    const { usuario_acesso } = req.params;

    // Validação de usuário - não pode estar vazio
    if (!usuario_acesso || usuario_acesso.trim() === '') {
      return res.status(400).json({
        erro: 'Usuário inválido',
        mensagem: 'O usuario_acesso não pode estar vazio'
      });
    }

    const query = `
      SELECT id, nome_completo, usuario_acesso, email_aluno, observacao, created_at
      FROM alunos
      WHERE usuario_acesso = ?
    `;

    const [alunos] = await pool.execute(query, [usuario_acesso.trim()]);

    if (alunos.length === 0) {
      return res.status(404).json({
        erro: 'Aluno não encontrado',
        mensagem: `Nenhum aluno encontrado com o usuário "${usuario_acesso}"`
      });
    }

    res.status(200).json({
      sucesso: true,
      aluno: alunos[0]
    });
  } catch (error) {
    console.error('Erro ao buscar aluno por usuário:', error);
    res.status(500).json({
      erro: 'Erro interno do servidor',
      mensagem: 'Não foi possível buscar o aluno'
    });
  }
});

// Endpoint GET /:id - Buscar aluno por id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validação de ID - deve ser um número inteiro válido
    if (!id || isNaN(id) || !Number.isInteger(Number(id))) {
      return res.status(400).json({
        erro: 'ID inválido',
        mensagem: 'O ID deve ser um número válido'
      });
    }

    const query = `
      SELECT id, nome_completo, usuario_acesso, email_aluno, observacao, created_at
      FROM alunos
      WHERE id = ?
    `;

    const [alunos] = await pool.execute(query, [id]);

    if (alunos.length === 0) {
      return res.status(404).json({
        erro: 'Aluno não encontrado',
        mensagem: `Nenhum aluno encontrado com o ID ${id}`
      });
    }

    res.status(200).json({
      sucesso: true,
      aluno: alunos[0]
    });
  } catch (error) {
    console.error('Erro ao buscar aluno por ID:', error);
    res.status(500).json({
      erro: 'Erro interno do servidor',
      mensagem: 'Não foi possível buscar o aluno'
    });
  }
});

// ============================================================================
// ROTAS POST - Cadastro
// ============================================================================

// Endpoint POST /cadastro - Cadastrar novo aluno
router.post('/cadastro', async (req, res) => {
  try {
    console.log('📝 POST /cadastro - Recebido: ', req.body);
    
    const { nome_completo, usuario_acesso, senha_hash, email_aluno, observacao } = req.body;

    // Validação de campos obrigatórios
    const validationErrors = validateRequiredFields(req.body);
    if (validationErrors.length > 0) {
      console.log('❌ Erro de validação:', validationErrors);
      return res.status(400).json({
        erro: 'Dados inválidos',
        mensagem: validationErrors.join('; ')
      });
    }

    // Validação do formato do email
    if (!isValidEmail(email_aluno)) {
      console.log('❌ Email inválido:', email_aluno);
      return res.status(400).json({
        erro: 'Email inválido',
        mensagem: 'O formato do email_aluno é inválido'
      });
    }

    // Hashing da senha com bcrypt (10 rounds)
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(senha_hash, 10);
    } catch (hashError) {
      console.error('❌ Erro ao gerar hash da senha:', hashError);
      return res.status(500).json({
        erro: 'Erro interno do servidor',
        mensagem: 'Não foi possível processar a senha'
      });
    }

    // Inserção no banco de dados usando query parametrizada
    const query = `
      INSERT INTO alunos (nome_completo, usuario_acesso, senha_hash, email_aluno, observacao)
      VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await pool.execute(query, [
      nome_completo.trim(),
      usuario_acesso.trim(),
      hashedPassword,
      email_aluno.trim(),
      observacao ? observacao.trim() : null
    ]);

    console.log('✅ Aluno cadastrado com sucesso! ID:', result.insertId);

    // Resposta de sucesso
    res.status(201).json({
      sucesso: true,
      mensagem: 'Aluno cadastrado com sucesso',
      id: result.insertId
    });

  } catch (error) {
    // Tratamento de erros do banco de dados
    console.error('❌ Erro ao cadastrar aluno:', error);

    // Verificar se é erro de duplicação (usuário ou email já existente)
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        erro: 'Dados duplicados',
        mensagem: 'Usuário ou email já cadastrado no sistema'
      });
    }

    // Erro genérico do servidor
    res.status(500).json({
      erro: 'Erro interno do servidor',
      mensagem: 'Não foi possível cadastrar o aluno'
    });
  }
});

module.exports = router;

