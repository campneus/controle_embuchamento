# README - Controle de Senhas Node.js

Este projeto é uma migração do sistema de controle de senhas originalmente desenvolvido em Python/Flask para Node.js com PostgreSQL.

## Requisitos

- Node.js (v14 ou superior)
- NPM (v6 ou superior)
- PostgreSQL (já configurado com a string de conexão fornecida)

## Configuração

O projeto já está configurado para usar o banco de dados PostgreSQL fornecido:

```
postgresql://db_embuchamento_user:HRM1fL8ngYAgL6nJ4UKARzew0xvrUDdt@dpg-d0vfjs0gjchc7384nbqg-a.oregon-postgres.render.com/db_embuchamento
```

Esta configuração está no arquivo `.env` e também no arquivo `config/config.js`.

## Instalação

1. Extraia o arquivo zip em um diretório de sua preferência
2. Navegue até o diretório do projeto
3. Instale as dependências:

```bash
npm install
```

## Execução

Para iniciar o servidor:

```bash
npm start
```

O servidor será iniciado na porta 3000 por padrão. Você pode acessar a aplicação em:

```
http://localhost:3000
```

## Estrutura do Projeto

```
├── config/             # Configurações do projeto
│   ├── config.js       # Configuração do Sequelize
│   ├── db.js           # Configuração da conexão com o banco
│   └── env.js          # Variáveis de ambiente
├── models/             # Modelos Sequelize
│   ├── fornecedor.js   # Modelo de Fornecedor
│   ├── filial.js       # Modelo de Filial
│   └── senha.js        # Modelo de Senha
├── routes/             # Rotas da API
│   ├── fornecedorRoutes.js  # Rotas de Fornecedor
│   ├── filialRoutes.js      # Rotas de Filial
│   ├── senhaRoutes.js       # Rotas de Senha
│   └── utilRoutes.js        # Rotas utilitárias
├── public/             # Arquivos estáticos
│   └── index.html      # Interface do usuário
├── .env                # Variáveis de ambiente
├── package.json        # Dependências e scripts
├── server.js           # Ponto de entrada da aplicação
└── test-api.js         # Script para testar endpoints da API
```

## Endpoints da API

### Fornecedores
- `GET /api/fornecedores` - Listar todos os fornecedores
- `GET /api/fornecedores/:id` - Obter um fornecedor específico
- `POST /api/fornecedores` - Criar um novo fornecedor
- `PUT /api/fornecedores/:id` - Atualizar um fornecedor
- `DELETE /api/fornecedores/:id` - Remover um fornecedor

### Filiais
- `GET /api/filiais` - Listar todas as filiais
- `GET /api/filiais/:id` - Obter uma filial específica
- `POST /api/filiais` - Criar uma nova filial
- `PUT /api/filiais/:id` - Atualizar uma filial
- `DELETE /api/filiais/:id` - Remover uma filial

### Senhas
- `GET /api/senhas` - Listar todas as senhas
- `GET /api/senhas/:id` - Obter uma senha específica
- `GET /api/senhas/gerar/nova` - Gerar uma nova senha aleatória
- `POST /api/senhas` - Criar um novo registro de senha
- `PUT /api/senhas/:id` - Atualizar um registro de senha
- `POST /api/senhas/:id/cancelar` - Cancelar uma senha
- `DELETE /api/senhas/:id` - Remover um registro de senha

### Utilitários
- `GET /api/status` - Verificar status da API
- `GET /api/filiais-por-fornecedor` - Obter filiais agrupadas por fornecedor

## Testando a API

O projeto inclui um script para testar os endpoints da API. Para executá-lo:

1. Inicie o servidor em um terminal:
```bash
npm start
```

2. Em outro terminal, execute o script de teste:
```bash
node test-api.js
```

## Observações

- O sistema mantém a mesma estrutura de dados e funcionalidades do projeto original
- A interface do usuário (index.html) foi mantida idêntica
- O banco de dados PostgreSQL já está configurado com a string de conexão fornecida
