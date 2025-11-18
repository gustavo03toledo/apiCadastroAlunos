require('dotenv').config();
const mysql = require('mysql2/promise');

// Validação das variáveis de ambiente necessárias
const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('Erro: Variáveis de ambiente faltando:', missingVars.join(', '));
  console.error('Por favor, configure o arquivo .env com as credenciais do banco de dados.');
  process.exit(1);
}

// Configuração do pool de conexão
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Função para testar a conexão
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Conexão com o banco de dados MySQL estabelecida com sucesso!');
    connection.release();
  } catch (error) {
    console.error('Erro ao conectar com o banco de dados:', error.message);
    throw error;
  }
}

// Testar conexão na inicialização (opcional)
if (require.main === module) {
  testConnection()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = pool;

