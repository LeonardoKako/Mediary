-- ============================================================
--  MEDIDIARY - SQL Server Schema
-- ============================================================

CREATE DATABASE MediDiary;
GO

USE MediDiary;
GO

-- Tabela de usuários
CREATE TABLE Usuarios (
    id         INT IDENTITY(1,1) PRIMARY KEY,
    nome       NVARCHAR(150)  NOT NULL,
    email      NVARCHAR(255)  NOT NULL UNIQUE,
    senha_hash NVARCHAR(512)  NOT NULL,
    criado_em  DATETIME2      DEFAULT GETDATE()
);
GO

-- Tabela de sintomas registrados
CREATE TABLE Sintomas (
    id          INT IDENTITY(1,1) PRIMARY KEY,
    usuario_id  INT            NOT NULL REFERENCES Usuarios(id) ON DELETE CASCADE,
    tipo        NVARCHAR(100)  NOT NULL,   -- ex: DOR, NÁUSEA, FADIGA ...
    subtipo     NVARCHAR(100)  NULL,        -- ex: CABEÇA, ABDOMINAL (apenas para DOR)
    descricao   NVARCHAR(1000) NULL,        -- campo livre (tipo OUTRO)
    inicio      DATETIME2      NOT NULL,
    fim         DATETIME2      NULL,
    criado_em   DATETIME2      DEFAULT GETDATE(),
    atualizado_em DATETIME2    DEFAULT GETDATE()
);
GO

-- Índice para buscas por usuário + data
CREATE INDEX IX_Sintomas_UsuarioData
    ON Sintomas (usuario_id, inicio);
GO
