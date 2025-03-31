const jsonServer = require('json-server');
const express = require('express');
const path = require('path');
const server = jsonServer.create();
const middlewares = jsonServer.defaults({
  static: path.join(__dirname, '../frontend/public')
});

// Carrega os arquivos de banco de dados
const propertiesDb = require('./db_properties.json');
const inventoryDb = require('./db_inventory.json');

// Cria o router com o banco de dados combinado
const router = jsonServer.router({
  properties: propertiesDb.properties,
  ...inventoryDb
});

// Middleware para CORS e outros padrões
server.use(middlewares);

// Middleware para logging personalizado
server.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Serve static files from the public directory
server.use('/images', express.static(path.join(__dirname, '../frontend/public/images')));

// Rotas específicas
server.use('/api', router);

// Configuração do servidor
const PORT = 3003;
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
  console.log(`API: http://localhost:${PORT}/api`);
});
