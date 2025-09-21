## Testes E2E com Cypress

Este diretório contém testes end-to-end (E2E) usando Cypress para testar a aplicação Weid.

### Clonando os projetos necessários

Para executar os testes, é necessário clonar os repositórios do backend e frontend:

- Backend: https://github.com/wenderson-me/weid-backend
- Frontend: https://github.com/wenderson-me/weid-frontend

Execute os comandos abaixo em seu terminal:

```bash
git clone https://github.com/wenderson-me/weid-backend.git
git clone https://github.com/wenderson-me/weid-frontend.git
```

Certifique-se de seguir as instruções de instalação e execução presentes nos READMEs de cada projeto antes de rodar os testes.

### Estrutura de Diretórios

```
tests/
├── cypress/
│   ├── e2e/            # Testes E2E
│   │   └── auth/       # Testes relacionados à autenticação
│   │       ├── login.cy.js
│   │       └── register.cy.js
│   ├── fixtures/       # Dados de teste
│   │   ├── users.json  # (Contém dados sensíveis - ignorado pelo Git)
│   │   └── users.example.json  # (Modelo para dados de teste)
│   └── support/        # Comandos e configurações de suporte
│       ├── commands.js
│       ├── e2e.js
│       └── testData.js # Gerencia carregamento seguro de dados de teste
├── cypress.config.js   # Configuração do Cypress
├── .env.example        # Modelo para variáveis de ambiente
├── .env                # Variáveis de ambiente locais (ignorado pelo Git)
└── package.json        # Dependências e scripts
```

### Pré-requisitos

- Node.js 14+
- npm ou yarn
- Aplicação Weid (frontend e backend) em execução

### Configuração dos Dados de Teste

Para proteger dados sensíveis de autenticação e evitar que eles sejam enviados ao repositório remoto, siga uma destas opções:

#### Opção 1: Usando Variáveis de Ambiente (Recomendado)

1. Crie um arquivo `.env` baseado no `.env.example`:
   ```bash
   cp .env.example .env
   ```

2. Edite o arquivo `.env` e adicione seus dados de teste:
   ```
   TEST_USER_EMAIL=seu-email@exemplo.com
   TEST_USER_PASSWORD=SuaSenhaSegura
   TEST_USER_NAME=Seu Nome
   ```

3. Este arquivo `.env` já está configurado para ser ignorado pelo Git (.gitignore).

#### Opção 2: Usando o Arquivo de Fixture

1. Edite o arquivo `cypress/fixtures/users.example.json` com dados fictícios para exemplos
2. Crie um arquivo `cypress/fixtures/users.json` com seus dados reais de teste
3. O arquivo `users.json` já está configurado para ser ignorado pelo Git (.gitignore)

#### Como Funciona

- Os testes tentam primeiro usar as variáveis de ambiente se disponíveis
- Se não encontrar variáveis de ambiente, o sistema procura pelo arquivo `users.json`
- Se não encontrar `users.json`, usa o arquivo `users.example.json` como último recurso

### Instalação

```bash
# A partir da raiz do projeto
npm run install:tests
```

Ou diretamente neste diretório:

```bash
npm install
```

### Executando os Testes

#### Usando os scripts da raiz do projeto

```bash
# Abrir o Cypress Test Runner UI
npm run test:e2e:open

# Executar todos os testes E2E
npm run test:e2e

# Executar apenas testes de login
npm run test:e2e:login

# Executar apenas testes de registro
npm run test:e2e:register
```

### Comandos Personalizados

Foram criados alguns comandos personalizados para facilitar o desenvolvimento dos testes:

- `cy.loginViaUI(email, password)` - Faz login via interface do usuário
- `cy.loginViaAPI(email, password)` - Faz login via API (mais rápido)
- `cy.getTestUsers()` - Obtém dados de teste de forma segura (com suporte a variáveis de ambiente)
- `cy.registerViaAPI(userData)` - Registra um novo usuário via API
- `cy.isVisible()` - Verifica se um elemento está visível
- `cy.clearTestUser(email)` - Limpa um usuário de teste do banco de dados

### Dados de Teste

Os dados de teste estão disponíveis em `cypress/fixtures/users.json` e incluem:

- Usuário válido para login
- Usuário inválido para testar falhas de login
- Novo usuário para testes de registro
- Dados inválidos para testar validações de formulário

### Adicionando Novos Testes

Para adicionar novos testes:

1. Crie um novo arquivo `.cy.js` no diretório apropriado em `cypress/e2e/`
2. Adicione os casos de teste usando o padrão Cypress
3. Se necessário, adicione novos dados de teste em `cypress/fixtures/`
4. Adicione comandos personalizados em `cypress/support/commands.js` se necessário