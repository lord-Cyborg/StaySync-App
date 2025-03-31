# StaySync App

Sistema de gerenciamento de propriedades para aluguel de temporada, com controle de inventário, reservas e manutenção.

## Estrutura do Projeto

- `/frontend`: Interface do usuário React/TypeScript
  - `/src/pages`: Componentes de página
  - `/src/components`: Componentes reutilizáveis
  - `/src/services`: Serviços de API
  - `/public/images`: Armazenamento de imagens por propriedade

- `/backend`: Servidores Node.js/Express
  - `server.js`: API principal
  - `server_inventory.js`: API de inventário
  - `/config`: Arquivos de configuração
  - Arquivos de banco de dados (JSON)

## Requisitos

- Node.js (v14 ou superior)
- npm (v6 ou superior)
- Navegador web moderno

## Configuração Inicial

### 1. Instalação de Dependências

```bash
# Instalar dependências do projeto principal
npm install

# Instalar dependências do frontend
cd frontend
npm install
cd ..
```

### 2. Configuração de Variáveis de Ambiente

1. Crie um arquivo `.env` na raiz do projeto baseado no arquivo `.env.example`:

```bash
cp .env.example .env
```

2. Edite o arquivo `.env` com suas configurações:

```
# Email Configuration
EMAIL_USER=seu_email@exemplo.com
EMAIL_PASS=sua_senha_segura
JWT_SECRET=chave_secreta_para_jwt

# Server Configuration
PORT=3003
NODE_ENV=development

# Company Information
COMPANY_NAME=Nome da Sua Empresa
SUPPORT_EMAIL=suporte@exemplo.com
COMPANY_DOMAIN=exemplo.com
BASE_URL=http://localhost:3003
```

### 3. Configuração dos Bancos de Dados

1. Crie os arquivos de banco de dados baseados nos exemplos fornecidos:

```bash
cp backend/db_properties.example.json backend/db_properties.json
cp backend/db_users.example.json backend/db_users.json
cp backend/db_inventory.example.json backend/db_inventory.json
```

2. Edite os arquivos conforme necessário para adicionar suas propriedades, usuários e itens de inventário.

## Inicialização do Sistema

Para iniciar o sistema completo, use o script de inicialização:

```bash
node start-staysync.js
```

Este script iniciará:
- Servidor backend principal (porta 3003)
- Servidor de inventário (porta 3004)
- Frontend React (porta 5173)

## Backup e Restauração

O sistema inclui scripts para backup e restauração dos bancos de dados:

- Para criar um backup: `backup-db.bat`
- Para restaurar um backup: `restore-db.bat`

## Acesso Mobile

Para acessar o sistema de outros dispositivos na mesma rede:

```bash
node start-mobile-access.js
```

## Gestão de Propriedades

### Estrutura de Pastas de Imagens

As imagens das propriedades são armazenadas em:
```
/frontend/public/images/{addressNumber}/gallery
```

### Convenções de Nomenclatura

- IDs de propriedade devem ser consistentes em todos os campos:
  - id
  - propertyId
  - addressNumber

## Desenvolvimento

### Padrões de Código

- Idioma para código: Inglês
- Idioma para comentários: Português
- Tratamento de erros com mensagens em português
- Validações no servidor antes de operações no banco

### Logs e Depuração

O sistema mantém logs detalhados para depuração em:
```
/backend/logs
```

## Segurança

- Nunca compartilhe o arquivo `.env` ou arquivos de banco de dados com dados reais
- Utilize sempre os arquivos `.example.json` para compartilhar a estrutura dos dados
- Mantenha o JWT_SECRET seguro e único para cada instalação

## Contribuição

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nome-da-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nome-da-feature`)
5. Abra um Pull Request
