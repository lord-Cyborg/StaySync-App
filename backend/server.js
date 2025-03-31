const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./utils/db');
const fs = require('fs').promises; // Usando fs.promises para operações assíncronas
const multer = require('multer');

const app = express();
const PORT = 3003;

// Middleware
app.use(cors());
app.use(express.json());

// Importar rotas de autenticação
const authRoutes = require('./routes/auth');

// Configurar rotas com prefixo /api
app.use('/api/auth', authRoutes);

// Rota para buscar todas as propriedades externas
app.get('/api/external-properties', async (req, res) => {
  try {
    // Caminho para o arquivo JSON externo
    const filePath = path.join('C:', 'Users', 'LENOVO', 'Desktop', 'StaySync  Scraper - Host', 'Data', 'properties-condensed.json');
    
    console.log('Tentando acessar arquivo em:', filePath);
    
    // Verificar se o arquivo existe
    try {
      await fs.access(filePath);
      console.log('Arquivo encontrado com sucesso!');
    } catch (error) {
      console.error('Arquivo não encontrado:', filePath);
      return res.status(404).json({ 
        error: 'Arquivo de propriedades externas não encontrado',
        details: `O arquivo ${filePath} não existe ou não está acessível`
      });
    }
    
    // Ler o arquivo
    const data = await fs.readFile(filePath, 'utf8');
    console.log('Arquivo lido com sucesso, tamanho:', data.length);
    
    let jsonData;
    try {
      jsonData = JSON.parse(data);
      console.log('JSON parseado com sucesso');
    } catch (error) {
      console.error('Erro ao fazer parse do JSON:', error);
      return res.status(500).json({
        error: 'Erro ao fazer parse do JSON',
        details: error.message
      });
    }
    
    // Verificar se o objeto JSON tem a estrutura esperada
    if (!jsonData.properties || !Array.isArray(jsonData.properties)) {
      console.error('Estrutura JSON inválida:', Object.keys(jsonData));
      return res.status(500).json({
        error: 'Estrutura JSON inválida',
        details: 'O arquivo não contém um array de propriedades'
      });
    }
    
    console.log('Encontradas', jsonData.properties.length, 'propriedades externas');
    
    // Retornar as propriedades
    res.json(jsonData.properties);
  } catch (error) {
    console.error('Erro ao buscar propriedades externas:', error);
    res.status(500).json({ error: error.message });
  }
});

// Rota para buscar uma propriedade externa específica
app.get('/api/external-properties/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Caminho para o arquivo JSON externo
    const filePath = path.join('C:', 'Users', 'LENOVO', 'Desktop', 'StaySync  Scraper - Host', 'Data', 'properties-condensed.json');
    
    console.log('Tentando acessar arquivo em:', filePath);
    
    // Verificar se o arquivo existe
    try {
      await fs.access(filePath);
    } catch (error) {
      console.error('Arquivo não encontrado:', filePath);
      return res.status(404).json({ 
        error: 'Arquivo de propriedades externas não encontrado',
        details: `O arquivo ${filePath} não existe ou não está acessível`
      });
    }
    
    // Ler o arquivo
    const data = await fs.readFile(filePath, 'utf8');
    const jsonData = JSON.parse(data);
    
    // Verificar se o objeto JSON tem a estrutura esperada
    if (!jsonData.properties || !Array.isArray(jsonData.properties)) {
      console.error('Estrutura JSON inválida:', Object.keys(jsonData));
      return res.status(500).json({
        error: 'Estrutura JSON inválida',
        details: 'O arquivo não contém um array de propriedades'
      });
    }
    
    console.log('Encontradas', jsonData.properties.length, 'propriedades externas');
    
    // Encontrar a propriedade com o ID especificado
    const property = jsonData.properties.find(p => p.id === id);
    
    if (!property) {
      return res.status(404).json({ error: 'Propriedade não encontrada' });
    }
    
    res.json(property);
  } catch (error) {
    console.error('Erro ao buscar propriedade externa:', error);
    res.status(500).json({ 
      error: 'Falha ao buscar propriedade externa',
      details: error.message
    });
  }
});

// Servir arquivos estáticos da pasta images
app.use('/images', express.static(path.join(__dirname, '..', 'frontend', 'public', 'images')));

// Rotas de API
app.use('/api', (req, res, next) => {
  // Middleware para adicionar prefixo /api
  next();
});

// GET /properties - Listar todas as propriedades
app.get('/api/properties', async (req, res) => {
  try {
    const properties = await db.get('properties');
    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

// GET /properties/:id - Buscar uma propriedade específica
app.get('/api/properties/:id', async (req, res) => {
  try {
    const property = await db.get('properties', req.params.id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json(property);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch property' });
  }
});

// POST /properties - Criar nova propriedade
app.post('/api/properties', async (req, res) => {
  try {
    const { id, propertyId, addressNumber } = req.body;

    // Validar se os IDs são consistentes
    if (id !== propertyId || id !== addressNumber) {
      return res.status(400).json({ 
        error: 'ID inconsistente',
        details: 'id, propertyId e addressNumber devem ser iguais'
      });
    }

    // Verificar se já existe uma propriedade com este ID
    const existing = await db.get('properties', id);
    if (existing) {
      return res.status(400).json({ 
        error: 'Propriedade já existe',
        details: `Já existe uma propriedade com o ID ${id}`
      });
    }

    // Criar nova propriedade usando o ID fornecido
    const newProperty = {
      ...req.body,
      id: id, // Forçar o uso do ID fornecido
      propertyId: id, // Garantir consistência
      addressNumber: id, // Garantir consistência
      createdAt: new Date().toISOString()
    };
    
    // Criar diretório para imagens se não existir
    const imagesDir = path.join(__dirname, '..', 'frontend', 'public', 'images', id, 'gallery');
    await fs.mkdir(imagesDir, { recursive: true });
    
    const property = await db.add('properties', newProperty);
    console.log(`Nova propriedade criada com ID ${id}`);
    res.status(201).json(property);
  } catch (error) {
    console.error('Erro ao criar propriedade:', error);
    res.status(500).json({ 
      error: 'Falha ao criar propriedade',
      details: error.message
    });
  }
});

// POST /properties/:id/ensure-directories - Criar diretórios de imagens
app.post('/api/properties/:id/ensure-directories', async (req, res) => {
  try {
    const { id } = req.params;
    const imagesDir = path.join(__dirname, '..', 'frontend', 'public', 'images', id, 'gallery');
    
    await fs.mkdir(imagesDir, { recursive: true });
    
    res.json({ success: true, message: 'Diretórios criados com sucesso' });
  } catch (error) {
    console.error('Erro ao criar diretórios:', error);
    res.status(500).json({ 
      error: 'Falha ao criar diretórios',
      details: error.message
    });
  }
});

// PUT /properties/:id - Atualizar propriedade
app.put('/api/properties/:id', async (req, res) => {
  try {
    const property = await db.update('properties', req.params.id, {
      ...req.body,
      updatedAt: new Date().toISOString()
    });
    
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    
    res.json(property);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update property' });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  // Aqui você deve implementar a lógica de autenticação
  // Por exemplo, verificar as credenciais em um banco de dados
  if (email === 'test@example.com' && password === 'password') {
    return res.json({ message: 'Login successful', token: 'fake-jwt-token' });
  }

  return res.status(401).json({ error: 'Invalid credentials' });
});

// Função auxiliar para copiar diretório recursivamente
async function copyDir(src, dest, targetId) {  
  try {
    console.log(`Copiando diretório de ${src} para ${dest}`);
    
    // Criar diretório de destino
    await fs.mkdir(dest, { recursive: true });
    console.log('Diretório de destino criado:', dest);
    
    // Ler conteúdo do diretório fonte
    const entries = await fs.readdir(src, { withFileTypes: true });
    console.log(`Encontrados ${entries.length} arquivos/diretórios para copiar`);
    
    // Processar cada entrada
    for (let entry of entries) {
      const srcPath = path.join(src, entry.name);
      let destPath = path.join(dest, entry.name);
      
      console.log(`Processando: ${entry.name}`);
      
      try {
        // Verificar se o arquivo fonte existe e é acessível
        await fs.access(srcPath);
        
        if (entry.isDirectory()) {
          await copyDir(srcPath, destPath, targetId);
        } else {
          // Se for a imagem principal, renomear para o novo ID
          if (entry.name.startsWith('main-')) {
            destPath = path.join(dest, `main-${targetId}.JPG`);
            console.log(`Renomeando imagem principal para: ${destPath}`);
          }
          
          // Ler o arquivo fonte
          const content = await fs.readFile(srcPath);
          // Escrever no destino
          await fs.writeFile(destPath, content);
          console.log(`Arquivo copiado com sucesso: ${destPath}`);
        }
      } catch (err) {
        console.error(`Erro ao copiar ${entry.name}:`, err);
        throw err;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao copiar diretório:', error);
    throw error;
  }
}

// POST /properties/:id/clone-images - Clonar imagens para nova propriedade
app.post('/api/properties/:sourceId/clone-images', async (req, res) => {
  try {
    const { sourceId } = req.params;
    const { targetId } = req.body;

    console.log(`Iniciando clonagem de imagens: ${sourceId} -> ${targetId}`);

    if (!sourceId || !targetId) {
      return res.status(400).json({
        error: 'IDs de origem e destino são obrigatórios'
      });
    }

    // 1. Verificar se a propriedade fonte existe no banco
    const sourceProperty = await db.get('properties', sourceId);
    if (!sourceProperty) {
      return res.status(404).json({
        error: 'Propriedade fonte não encontrada no banco de dados'
      });
    }

    // 2. Verificar se a propriedade destino existe no banco
    const targetProperty = await db.get('properties', targetId);
    if (!targetProperty) {
      return res.status(404).json({
        error: 'Propriedade destino não encontrada no banco de dados'
      });
    }

    // 3. Caminhos dos diretórios
    const sourceDir = path.join(__dirname, '..', 'frontend', 'public', 'images', sourceId);
    const targetDir = path.join(__dirname, '..', 'frontend', 'public', 'images', targetId);
    const sourceGalleryDir = path.join(sourceDir, 'gallery');
    const targetGalleryDir = path.join(targetDir, 'gallery');

    console.log('Diretórios:', {
      sourceDir,
      targetDir,
      sourceGalleryDir,
      targetGalleryDir
    });

    // 4. Verificar se o diretório fonte existe e é acessível
    try {
      await fs.access(sourceGalleryDir);
      console.log('Diretório fonte existe e é acessível');
    } catch (error) {
      console.error('Erro ao acessar diretório fonte:', error);
      return res.status(404).json({
        error: 'Diretório de imagens fonte não encontrado ou sem permissão de acesso',
        details: sourceGalleryDir
      });
    }

    // 5. Criar estrutura de diretórios no destino
    try {
      await fs.mkdir(targetDir, { recursive: true });
      await fs.mkdir(targetGalleryDir, { recursive: true });
      console.log('Diretórios de destino criados com sucesso');
    } catch (error) {
      console.error('Erro ao criar diretórios de destino:', error);
      return res.status(500).json({
        error: 'Falha ao criar diretórios de destino',
        details: error.message
      });
    }

    // 6. Copiar imagens da galeria
    try {
      await copyDir(sourceGalleryDir, targetGalleryDir, targetId);  
      console.log('Imagens copiadas com sucesso');
    } catch (error) {
      console.error('Erro ao copiar imagens:', error);
      return res.status(500).json({
        error: 'Falha ao copiar imagens',
        details: error.message
      });
    }

    // 7. Copiar CSV de instalações
    const sourceCsvPath = path.join(sourceDir, `instalations_list-${sourceId}.csv`);
    const targetCsvPath = path.join(targetDir, `instalations_list-${targetId}.csv`);
    
    try {
      const csvContent = await fs.readFile(sourceCsvPath);
      await fs.writeFile(targetCsvPath, csvContent);
      console.log('CSV de instalações copiado com sucesso');
    } catch (error) {
      console.warn('CSV de instalações não encontrado:', error.message);
    }

    console.log(`Clonagem concluída com sucesso para ${targetDir}`);

    res.json({
      success: true,
      message: 'Imagens e arquivos clonados com sucesso',
      details: {
        sourceDir,
        targetDir,
        filesCount: await fs.readdir(targetGalleryDir).then(files => files.length).catch(() => 0)
      }
    });

  } catch (error) {
    console.error('Erro ao clonar imagens:', error);
    res.status(500).json({
      error: 'Falha ao clonar imagens',
      details: error.message
    });
  }
});

// Função auxiliar para deletar diretório recursivamente
async function deleteDir(dirPath) {
  try {
    console.log(`Deletando diretório: ${dirPath}`);
    
    // Verificar se o diretório existe
    try {
      await fs.access(dirPath);
    } catch (error) {
      console.log(`Diretório não existe: ${dirPath}`);
      return;
    }
    
    // Ler conteúdo do diretório
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    
    // Deletar cada arquivo/subdiretório
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        await deleteDir(fullPath);
      } else {
        await fs.unlink(fullPath);
        console.log(`Arquivo deletado: ${fullPath}`);
      }
    }
    
    // Deletar o diretório vazio
    await fs.rmdir(dirPath);
    console.log(`Diretório deletado: ${dirPath}`);
  } catch (error) {
    console.error(`Erro ao deletar diretório ${dirPath}:`, error);
    throw error;
  }
}

// DELETE /properties/:id - Deletar uma propriedade
app.delete('/api/properties/:id', async (req, res) => {
  try {
    const propertyId = req.params.id;
    console.log(`Deletando propriedade: ${propertyId}`);
    
    // 1. Verificar se a propriedade existe
    const property = await db.get('properties', propertyId);
    if (!property) {
      return res.status(404).json({ 
        error: 'Propriedade não encontrada',
        details: `ID: ${propertyId}`
      });
    }
    
    // 2. Deletar diretório de imagens
    const imagesDir = path.join(__dirname, '..', 'frontend', 'public', 'images', propertyId);
    try {
      await deleteDir(imagesDir);
      console.log('Diretório de imagens deletado com sucesso');
    } catch (error) {
      console.error('Erro ao deletar diretório de imagens:', error);
      // Continua mesmo se falhar ao deletar imagens
    }
    
    // 3. Deletar propriedade do banco de dados
    const deleted = await db.delete('properties', propertyId);
    if (!deleted) {
      return res.status(500).json({ 
        error: 'Falha ao deletar propriedade do banco de dados',
        details: `ID: ${propertyId}`
      });
    }
    
    console.log(`Propriedade ${propertyId} deletada com sucesso`);
    res.json({
      success: true,
      message: 'Propriedade deletada com sucesso',
      details: {
        propertyId,
        imagesDeleted: true
      }
    });
    
  } catch (error) {
    console.error('Erro ao deletar propriedade:', error);
    res.status(500).json({ 
      error: 'Falha ao deletar propriedade',
      details: error.message
    });
  }
});

// Configuração do Multer para upload de imagens
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const propertyId = req.params.propertyId;
    const uploadPath = path.join(__dirname, '..', 'frontend', 'public', 'images', propertyId, 'gallery');
    
    try {
      await fs.mkdir(uploadPath, { recursive: true });
      cb(null, uploadPath);
    } catch (err) {
      cb(err);
    }
  },
  filename: function (req, file, cb) {
    const propertyId = req.params.propertyId;
    if (req.body.isMain === 'true') {
      cb(null, `main-${propertyId}.JPG`);
    } else {
      cb(null, file.originalname);
    }
  }
});

const upload = multer({ storage: storage });

// POST /properties/:propertyId/upload - Upload de imagem principal
app.post('/api/properties/:propertyId/upload', upload.single('image'), async (req, res) => {
  try {
    const { propertyId } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        error: 'Nenhuma imagem enviada'
      });
    }

    // Verifica se a propriedade existe
    const property = await db.get('properties', propertyId);
    if (!property) {
      return res.status(404).json({
        error: 'Propriedade não encontrada'
      });
    }

    // Atualiza o caminho da imagem principal no banco
    const imagePath = `/images/${propertyId}/gallery/${file.filename}`;
    await db.update('properties', propertyId, {
      mainImage: imagePath
    });

    console.log(`Imagem principal atualizada para propriedade ${propertyId}:`, imagePath);

    res.json({
      success: true,
      message: 'Imagem atualizada com sucesso',
      path: imagePath
    });

  } catch (error) {
    console.error('Erro no upload de imagem:', error);
    res.status(500).json({
      error: 'Falha ao fazer upload da imagem',
      details: error.message
    });
  }
});

// POST /properties/:propertyId/upload-multiple - Upload de múltiplas imagens
app.post('/api/properties/:propertyId/upload-multiple', upload.array('images'), async (req, res) => {
  try {
    const { propertyId } = req.params;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({
        error: 'Nenhuma imagem enviada'
      });
    }

    // Verifica se a propriedade existe
    const property = await db.get('properties', propertyId);
    if (!property) {
      return res.status(404).json({
        error: 'Propriedade não encontrada'
      });
    }

    // Processa cada imagem
    const images = files.map((file, index) => ({
      id: path.basename(file.filename, path.extname(file.filename)),
      path: `/images/${propertyId}/gallery/${file.filename}`,
      category: 'Uncategorized',
      order: index + 1
    }));

    // Atualiza a lista de imagens no banco
    await db.update('properties', propertyId, {
      images: [...(property.images || []), ...images]
    });

    console.log(`${images.length} imagens adicionadas à propriedade ${propertyId}`);

    res.json({
      success: true,
      message: 'Imagens adicionadas com sucesso',
      images
    });

  } catch (error) {
    console.error('Erro no upload de imagens:', error);
    res.status(500).json({
      error: 'Falha ao fazer upload das imagens',
      details: error.message
    });
  }
});

app.use(express.static(path.join(__dirname, '../frontend'))); // Servir arquivos estáticos do frontend

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
