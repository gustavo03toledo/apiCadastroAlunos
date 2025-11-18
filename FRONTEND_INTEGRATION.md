# 📱 Guia de Integração Front-End com API

## 🔗 Base URL da API
```
https://apicadastroalunos.onrender.com
```

## 📡 Endpoints Disponíveis

### 1. Cadastro de Aluno
**Endpoint:** `POST /api/alunos/cadastro`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
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
- `nome_completo` - String, máximo 255 caracteres
- `usuario_acesso` - String única, máximo 100 caracteres
- `senha_hash` - String (será hasheada com bcrypt no servidor)
- `email_aluno` - Email válido (verificação de formato)
- `observacao` - String (opcional)

**Respostas:**

✅ **201 Created** - Sucesso
```json
{
  "sucesso": true,
  "mensagem": "Aluno cadastrado com sucesso",
  "id": 1
}
```

❌ **400 Bad Request** - Validação falhou
```json
{
  "erro": "Dados inválidos",
  "mensagem": "O campo nome_completo é obrigatório e não pode estar vazio"
}
```

❌ **400 Bad Request** - Dados duplicados (usuário ou email já existe)
```json
{
  "erro": "Dados duplicados",
  "mensagem": "Usuário ou email já cadastrado no sistema"
}
```

❌ **500 Internal Server Error**
```json
{
  "erro": "Erro interno do servidor",
  "mensagem": "Não foi possível cadastrar o aluno"
}
```

---

### 2. Listar Todos os Alunos
**Endpoint:** `GET /api/alunos`

**Respostas:**

✅ **200 OK**
```json
{
  "sucesso": true,
  "total": 2,
  "alunos": [
    {
      "id": 1,
      "nome_completo": "João Silva",
      "usuario_acesso": "joao.silva",
      "email_aluno": "joao.silva@example.com",
      "observacao": "Aluno do curso de informática",
      "created_at": "2024-11-18T10:30:00.000Z"
    },
    {
      "id": 2,
      "nome_completo": "Maria Santos",
      "usuario_acesso": "maria.santos",
      "email_aluno": "maria.santos@example.com",
      "observacao": null,
      "created_at": "2024-11-18T11:15:00.000Z"
    }
  ]
}
```

---

### 3. Buscar Aluno por ID
**Endpoint:** `GET /api/alunos/:id`

**Exemplo:** `GET /api/alunos/1`

**Respostas:**

✅ **200 OK** - Aluno encontrado
```json
{
  "sucesso": true,
  "aluno": {
    "id": 1,
    "nome_completo": "João Silva",
    "usuario_acesso": "joao.silva",
    "email_aluno": "joao.silva@example.com",
    "observacao": "Aluno do curso de informática",
    "created_at": "2024-11-18T10:30:00.000Z"
  }
}
```

❌ **400 Bad Request** - ID inválido
```json
{
  "erro": "ID inválido",
  "mensagem": "O ID deve ser um número válido"
}
```

❌ **404 Not Found** - Aluno não existe
```json
{
  "erro": "Aluno não encontrado",
  "mensagem": "Nenhum aluno encontrado com o ID 999"
}
```

---

### 4. Buscar Aluno por Usuário de Acesso
**Endpoint:** `GET /api/alunos/usuario/:usuario_acesso`

**Exemplo:** `GET /api/alunos/usuario/joao.silva`

**Respostas:**

✅ **200 OK** - Aluno encontrado
```json
{
  "sucesso": true,
  "aluno": {
    "id": 1,
    "nome_completo": "João Silva",
    "usuario_acesso": "joao.silva",
    "email_aluno": "joao.silva@example.com",
    "observacao": "Aluno do curso de informática",
    "created_at": "2024-11-18T10:30:00.000Z"
  }
}
```

❌ **400 Bad Request** - Usuário vazio
```json
{
  "erro": "Usuário inválido",
  "mensagem": "O usuario_acesso não pode estar vazio"
}
```

❌ **404 Not Found** - Aluno não existe
```json
{
  "erro": "Aluno não encontrado",
  "mensagem": "Nenhum aluno encontrado com o usuário \"joao.silva\""
}
```

---

### 5. Health Check
**Endpoint:** `GET /health`

**Respostas:**

✅ **200 OK**
```json
{
  "status": "OK",
  "message": "Servidor está funcionando"
}
```

---

## 💻 Exemplos de Integração

### JavaScript/Fetch API

**Cadastrar Aluno:**
```javascript
const cadastrarAluno = async (dados) => {
  try {
    const response = await fetch('https://apicadastroalunos.onrender.com/api/alunos/cadastro', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dados)
    });

    const resultado = await response.json();

    if (response.ok) {
      console.log('Aluno cadastrado com sucesso! ID:', resultado.id);
      return resultado;
    } else {
      console.error('Erro:', resultado.mensagem);
      throw new Error(resultado.mensagem);
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
  }
};

// Usar
cadastrarAluno({
  nome_completo: 'João Silva',
  usuario_acesso: 'joao.silva',
  senha_hash: 'senha123',
  email_aluno: 'joao.silva@example.com',
  observacao: 'Aluno do curso de informática'
});
```

**Listar Todos os Alunos:**
```javascript
const listarAlunos = async () => {
  try {
    const response = await fetch('https://apicadastroalunos.onrender.com/api/alunos');
    const resultado = await response.json();

    if (response.ok) {
      console.log(`Total de alunos: ${resultado.total}`);
      console.log(resultado.alunos);
      return resultado.alunos;
    } else {
      throw new Error('Erro ao buscar alunos');
    }
  } catch (error) {
    console.error('Erro:', error);
  }
};

// Usar
listarAlunos();
```

**Buscar Aluno por ID:**
```javascript
const buscarAlunoPorId = async (id) => {
  try {
    const response = await fetch(`https://apicadastroalunos.onrender.com/api/alunos/${id}`);
    const resultado = await response.json();

    if (response.ok) {
      console.log('Aluno encontrado:', resultado.aluno);
      return resultado.aluno;
    } else {
      console.warn(resultado.mensagem);
      return null;
    }
  } catch (error) {
    console.error('Erro:', error);
  }
};

// Usar
buscarAlunoPorId(1);
```

**Buscar Aluno por Usuário:**
```javascript
const buscarAlunoPorUsuario = async (usuario) => {
  try {
    const response = await fetch(`https://apicadastroalunos.onrender.com/api/alunos/usuario/${usuario}`);
    const resultado = await response.json();

    if (response.ok) {
      console.log('Aluno encontrado:', resultado.aluno);
      return resultado.aluno;
    } else {
      console.warn(resultado.mensagem);
      return null;
    }
  } catch (error) {
    console.error('Erro:', error);
  }
};

// Usar
buscarAlunoPorUsuario('joao.silva');
```

---

### Axios (se usar a biblioteca)

**Instalação:**
```bash
npm install axios
```

**Cadastrar Aluno:**
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://apicadastroalunos.onrender.com'
});

const cadastrarAluno = async (dados) => {
  try {
    const response = await api.post('/api/alunos/cadastro', dados);
    console.log('Aluno cadastrado:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro:', error.response?.data?.mensagem || error.message);
  }
};
```

**Listar Alunos:**
```javascript
const listarAlunos = async () => {
  try {
    const response = await api.get('/api/alunos');
    console.log('Alunos:', response.data.alunos);
    return response.data.alunos;
  } catch (error) {
    console.error('Erro:', error.response?.data?.mensagem || error.message);
  }
};
```

---

## 🔒 Considerações de Segurança

1. **Senhas:** Sempre envie em texto puro (será hasheada no servidor com bcrypt)
2. **Validação Client-Side:** Valide os dados antes de enviar
3. **CORS:** A API está configurada para aceitar requisições do front-end
4. **Tratamento de Erros:** Sempre verifique a resposta e trate erros apropriadamente

---

## 📋 Checklist para Integração

- [ ] Base URL configurada: `https://apicadastroalunos.onrender.com`
- [ ] POST /api/alunos/cadastro implementado no formulário
- [ ] GET /api/alunos implementado para listar alunos
- [ ] GET /api/alunos/:id implementado para detalhes
- [ ] GET /api/alunos/usuario/:usuario_acesso implementado para busca
- [ ] Tratamento de erros implementado (400, 404, 500)
- [ ] Validação client-side de email
- [ ] Feedback visual de sucesso/erro ao usuário
- [ ] Loading states durante requisições
- [ ] Testes com ferramentas (Postman, Insomnia, curl)

---

## 🧪 Teste com cURL

**Cadastro:**
```bash
curl -X POST https://apicadastroalunos.onrender.com/api/alunos/cadastro \
  -H "Content-Type: application/json" \
  -d '{
    "nome_completo": "João Silva",
    "usuario_acesso": "joao.silva",
    "senha_hash": "senha123",
    "email_aluno": "joao.silva@example.com",
    "observacao": "Teste"
  }'
```

**Listar:**
```bash
curl https://apicadastroalunos.onrender.com/api/alunos
```

**Buscar por ID:**
```bash
curl https://apicadastroalunos.onrender.com/api/alunos/1
```

**Buscar por Usuário:**
```bash
curl https://apicadastroalunos.onrender.com/api/alunos/usuario/joao.silva
```

---

## 📞 Suporte

Em caso de problemas:
1. Verifique se a API está online: `GET /health`
2. Revise os headers e body da requisição
3. Verifique o console do navegador para erros
4. Valide os dados antes de enviar
5. Confira se o usuário/email já existe no banco (erro 400 duplicado)
