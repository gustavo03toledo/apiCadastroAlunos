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
// Parse port and SSL settings. DB_PORT is optional (defaults to 3306).
const dbPort = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306;
// DB_SSL can be set to 'true' to explicitly enable SSL. If not set, enable SSL automatically when connecting to Azure hosts.
const envDbSsl = typeof process.env.DB_SSL === 'string' ? process.env.DB_SSL.toLowerCase() === 'true' : undefined;
const isAzureHost = process.env.DB_HOST && /mysql\.database\.azure\.com$/i.test(process.env.DB_HOST);
const useSsl = typeof envDbSsl === 'boolean' ? envDbSsl : isAzureHost;

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: dbPort,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  // SSL: when true, mysql2 will attempt an encrypted connection. You can provide a CA via DB_SSL_CA if required.
  ssl: useSsl ? { rejectUnauthorized: true } : undefined
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

