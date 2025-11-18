require('dotenv').config();
const express = require('express');
const alunoRoutes = require('./alunoRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsing de JSON
app.use(express.json());

// Middleware para logging de requisições
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rotas
app.use('/api/alunos', alunoRoutes);

// Rota de health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Servidor está funcionando' });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({ 
    erro: 'Erro interno do servidor',
    mensagem: 'Ocorreu um erro inesperado'
  });
});

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
});

