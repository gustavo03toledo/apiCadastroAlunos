-- Script SQL para criação da tabela de alunos
-- Execute este script no seu banco de dados MySQL antes de usar a API

CREATE DATABASE IF NOT EXISTS db_xxxx CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE db_xxxx;

CREATE TABLE IF NOT EXISTS alunos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome_completo VARCHAR(255) NOT NULL,
  usuario_acesso VARCHAR(100) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  email_aluno VARCHAR(255) NOT NULL UNIQUE,
  observacao TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_usuario_acesso (usuario_acesso),
  INDEX idx_email_aluno (email_aluno)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

