# API de Cadastro de Alunos

API back-end desenvolvida em Node.js com Express.js para cadastro seguro de alunos utilizando MySQL.

## 📋 Requisitos

- Node.js (versão 14 ou superior)
- MySQL (versão 5.7 ou superior)
- npm ou yarn

## 🚀 Instalação

1. Clone o repositório ou navegue até o diretório do projeto

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
   - Um arquivo `.env` de exemplo já foi criado na raiz do projeto. Você também pode usar o arquivo `env.example` como referência.
   - Edite o arquivo `.env` e configure com suas credenciais reais do banco de dados:
   ```env
   DB_HOST=localhost
   DB_USER=seu_usuario
   DB_PASSWORD=sua_senha
   DB_NAME=nome_do_banco
   PORT=3000
   ```
   **⚠️ IMPORTANTE:** Substitua os valores de exemplo pelas suas credenciais reais do MySQL.

## 🗄️ Estrutura do Banco de Dados

Certifique-se de que a tabela `alunos` existe no banco de dados. Exemplo de estrutura:

```sql
CREATE TABLE alunos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome_completo VARCHAR(255) NOT NULL,
  usuario_acesso VARCHAR(100) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  email_aluno VARCHAR(255) NOT NULL UNIQUE,
  observacao TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🏃 Executando a Aplicação

### Modo de desenvolvimento (com nodemon):
```bash
npm run dev
```

### Modo de produção:
```bash
npm start
```

O servidor estará rodando em `http://localhost:3000` (ou na porta configurada no `.env`).

## 📡 Endpoints

### POST /api/alunos/cadastro

Cadastra um novo aluno no sistema.

**Corpo da requisição (JSON):**
```json
{
  "nome_completo": "João Silva",
  "usuario_acesso": "joao.silva",
  "senha_hash": "senha123",
  "email_aluno": "joao.silva@example.com",
  "observacao": "Aluno do curso de informática"
}
```

**Campos obrigatórios:**
- `nome_completo`: Nome completo do aluno
- `usuario_acesso`: Nome de usuário para acesso
- `senha_hash`: Senha em texto puro (será hasheada automaticamente)
- `email_aluno`: Email do aluno (deve ter formato válido)
- `observacao`: Campo opcional para observações

**Respostas:**

- **201 Created** - Aluno cadastrado com sucesso
```json
{
  "sucesso": true,
  "mensagem": "Aluno cadastrado com sucesso",
  "id": 1
}
```

- **400 Bad Request** - Dados inválidos ou duplicados
```json
{
  "erro": "Dados inválidos",
  "mensagem": "O campo nome_completo é obrigatório e não pode estar vazio"
}
```

- **500 Internal Server Error** - Erro interno do servidor
```json
{
  "erro": "Erro interno do servidor",
  "mensagem": "Não foi possível cadastrar o aluno"
}
```

### GET /health

Endpoint de health check para verificar se o servidor está funcionando.

## 🔒 Segurança

- Senhas são hasheadas usando `bcrypt` com 10 rounds
- Queries SQL são parametrizadas para prevenir SQL injection
- Validação server-side de todos os campos obrigatórios
- Validação de formato de email

## 📁 Estrutura de Arquivos

```
api/
├── index.js              # Servidor principal
├── db.js                 # Configuração do pool de conexão MySQL
├── alunoRoutes.js        # Rotas do endpoint de cadastro
├── package.json          # Dependências do projeto
├── .env                  # Variáveis de ambiente (não versionado)
├── .gitignore           # Arquivos ignorados pelo Git
└── README.md            # Documentação
```

## ⚠️ Importante

- **NUNCA** commite o arquivo `.env` com credenciais reais no Git
- Configure as variáveis de ambiente antes de executar a aplicação
- Certifique-se de que o banco de dados MySQL está rodando e acessível

