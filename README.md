# Diário de Hogwarts

Projeto acadêmico desenvolvido para a disciplina de Programação para Sistemas Web.

## Tecnologias e arquitetura

- Frontend: React, TypeScript e Vite.
- Backend: Node.js, TypeScript e Fastify.
- MySQL: usuários e grade de aulas.
- MongoDB: histórico de alterações da grade.
- Backend organizado por funcionalidades, com separação entre rotas, controllers, services e repositories.

A organização por funcionalidades foi escolhida porque o sistema possui áreas distintas, como autenticação, grade e histórico. Cada módulo mantém seu fluxo próximo, enquanto as camadas separam HTTP, regras de negócio e acesso aos bancos, facilitando manutenção e evolução sem concentrar responsabilidades no servidor.

## Requisitos

- Node.js e npm.
- MySQL em execução.
- MongoDB Atlas ou uma instância local do MongoDB.

## Configuração inicial

1. Clone o repositório e abra a pasta do projeto.
2. No MySQL Workbench, execute `diario-de-hogwarts-backend/src/database/schema.sql` e depois `diario-de-hogwarts-backend/src/database/seed.sql`.
3. Copie `diario-de-hogwarts-backend/.env.example` para `diario-de-hogwarts-backend/.env` e preencha as credenciais do MySQL, a URI do MongoDB e a chave da sessão.

Gere uma chave de sessão hexadecimal com 64 caracteres executando no terminal:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Use o resultado como valor de `SESSION_KEY`. Na URI do MongoDB, substitua usuário, senha e endereço do cluster pelos valores da sua conta. Se a senha tiver caracteres especiais, codifique-os para URL.

## Executar localmente

Abra dois terminais na pasta do projeto.

Backend:

```bash
cd diario-de-hogwarts-backend
npm install
npm run dev
```

Frontend:

```bash
npm install
npm run dev
```

O backend inicia em `http://localhost:3333` e o frontend em `http://localhost:5173`.

## Contas de acesso

As senhas são armazenadas com hash Argon2. Para cadastrar um aluno ou professor, execute na pasta `diario-de-hogwarts-backend`:

```bash
npx tsx src/scripts/createUser.ts
```

O script solicita nome, email, perfil, casa e senha. As casas aceitas são Grifinória, Sonserina, Corvinal e Lufa-Lufa.

Alunos podem consultar a grade. Professores podem cadastrar, editar e excluir aulas, consultar o histórico e alterar os pontos das casas na interface. O backend também protege as operações de escrita e o histórico conforme o perfil.

## Dados e endpoints principais

- `GET /health`: verifica se o backend está ativo.
- `POST /auth/login`, `GET /auth/me` e `POST /auth/logout`: autenticação por sessão.
- `GET /schedule/paginated?page=1&limit=5&search=Poções`: consulta paginada e filtrada da grade.
- `GET /schedule/history`: histórico de criação, edição e exclusão armazenado no MongoDB; acesso de professor.

O histórico guarda a ação, o horário e uma cópia dos dados da aula no momento da alteração.

## Organização principal

```text
src/
├── components/       # Componentes React reutilizáveis
├── contexts/         # Estado da sessão autenticada
├── pages/            # Páginas da aplicação
└── services/         # Comunicação com o backend

diario-de-hogwarts-backend/src/
├── database/         # Conexões, schema e dados iniciais
├── modules/
│   ├── auth/          # Autenticação e autorização
│   ├── schedule/      # CRUD e consulta paginada de aulas
│   └── scheduleHistory/ # Registro e consulta do histórico no MongoDB
└── routes/           # Rotas HTTP
```
