export const migrations = [
  `
  CREATE TABLE IF NOT EXISTS pessoa (
      id INTEGER PRIMARY KEY,
      nome TEXT NOT NULL,
      cpf TEXT,
      sus TEXT,
      dataNascimento TEXT,
      sexo TEXT,
      telefone TEXT,
      familiaId INTEGER,
      createdAt TEXT,
      updatedAt TEXT,
      deletedAt TEXT,
      FOREIGN KEY (familiaId) REFERENCES familia(id)
  );
  `,

  `
  CREATE TABLE IF NOT EXISTS familia (
      id INTEGER PRIMARY KEY,
      endereco TEXT,
      numero TEXT,
      bairro TEXT,
      cep TEXT,
      latitude REAL,
      longitude REAL,
      descricao TEXT,
      createdAt TEXT,
      updatedAt TEXT,
      deletedAt TEXT
  );
  `,

  `
  CREATE TABLE IF NOT EXISTS visita (
      id INTEGER PRIMARY KEY,
      localId TEXT UNIQUE,
      pessoaId INTEGER,
      dataVisita TEXT,
      tipoVisita TEXT,
      observacao TEXT,
      encaminhamento INTEGER,
      createdAt TEXT,
      updatedAt TEXT,
      deletedAt TEXT,
      FOREIGN KEY (pessoaId) REFERENCES pessoa(id)
  );
  `,

  `
  CREATE TABLE IF NOT EXISTS comorbidade (
      id INTEGER PRIMARY KEY,
      nome TEXT,
      cid TEXT,
      descricao TEXT,
      createdAt TEXT,
      updatedAt TEXT,
      deletedAt TEXT
  );
  `,

  `
  CREATE TABLE IF NOT EXISTS pessoa_comorbidade (
      id INTEGER PRIMARY KEY,
      pessoaId INTEGER,
      comorbidadeId INTEGER,
      dataDiagnostico TEXT,
      observacao TEXT,
      status TEXT,
      createdAt TEXT,
      updatedAt TEXT,
      deletedAt TEXT,
      FOREIGN KEY (pessoaId) REFERENCES pessoa(id),
      FOREIGN KEY (comorbidadeId) REFERENCES comorbidade(id)
  );
  `,

  `
  CREATE TABLE IF NOT EXISTS sync_control (
      tabela TEXT PRIMARY KEY,
      ultimaSync TEXT
  );
  `,
  `
  CREATE TABLE IF NOT EXISTS sync_queue (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tabela TEXT,
        registroId TEXT,
        operacao TEXT,
        dataCriacao TEXT,
        tentativas INTEGER DEFAULT 0,
        erro TEXT
    );
`,
`
CREATE INDEX IF NOT EXISTS idx_pessoa_nome
ON pessoa(nome);
`,

`
CREATE INDEX IF NOT EXISTS idx_pessoa_cpf
ON pessoa(cpf);
`,

`
CREATE INDEX IF NOT EXISTS idx_visita_pessoa
ON visita(pessoaId);
`,

`
CREATE INDEX IF NOT EXISTS idx_pessoa_familia
ON pessoa(familiaId);
`,
];