const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const PORT = 3004;

// Middleware
app.use(cors());
app.use(express.json());

// Função para ler o arquivo db_inventory.json
async function readInventoryDb() {
  const data = await fs.readFile(path.join(__dirname, 'db_inventory.json'), 'utf8');
  return JSON.parse(data);
}

// Função para salvar no arquivo db_inventory.json
async function writeInventoryDb(data) {
  await fs.writeFile(
    path.join(__dirname, 'db_inventory.json'),
    JSON.stringify(data, null, 2),
    'utf8'
  );
}

// GET /api/inventory/catalog - Buscar todos os itens do catálogo
app.get('/api/inventory/catalog', async (req, res) => {
  try {
    const db = await readInventoryDb();
    res.json(db.catalog.items);
  } catch (error) {
    console.error('Error fetching catalog:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/inventory/catalog/:id - Buscar item específico do catálogo
app.get('/api/inventory/catalog/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = await readInventoryDb();
    const item = db.catalog.items.find(item => item.id === id);
    
    if (!item) {
      return res.status(404).json({ error: 'Catalog item not found' });
    }
    
    res.json(item);
  } catch (error) {
    console.error('Error fetching catalog item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/inventory/catalog - Adicionar novo item ao catálogo
app.post('/api/inventory/catalog', async (req, res) => {
  try {
    const newItem = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const db = await readInventoryDb();
    db.catalog.items.push(newItem);
    await writeInventoryDb(db);
    
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error creating catalog item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/inventory/catalog/:id - Atualizar item do catálogo
app.patch('/api/inventory/catalog/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = await readInventoryDb();
    const itemIndex = db.catalog.items.findIndex(item => item.id === id);
    
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Catalog item not found' });
    }
    
    const updatedItem = {
      ...db.catalog.items[itemIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    db.catalog.items[itemIndex] = updatedItem;
    await writeInventoryDb(db);
    
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating catalog item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/inventory/:propertyId - Buscar inventário de uma propriedade
app.get('/api/inventory/:propertyId', async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { areaType } = req.query;
    
    const db = await readInventoryDb();
    const propertyInventory = db.propertyInventories[propertyId];
    
    if (!propertyInventory) {
      return res.status(404).json({ error: 'Property inventory not found' });
    }

    // Filtrar itens por área se especificado
    if (areaType) {
      const filteredItems = propertyInventory.items.filter(item => {
        const catalogItem = db.catalog.items.find(
          catItem => catItem.id === item.catalogItemId
        );
        return catalogItem && catalogItem.type.toLowerCase() === areaType.toLowerCase();
      });

      return res.json(filteredItems);
    }

    res.json(propertyInventory.items);
  } catch (error) {
    console.error('Error fetching property inventory:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/inventory/:propertyId/items - Adicionar item ao inventário
app.post('/api/inventory/:propertyId/items', async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { catalogItemId, ...itemData } = req.body;
    
    const db = await readInventoryDb();
    
    // Verifica se o item do catálogo existe
    const catalogItem = db.catalog.items.find(item => item.id === catalogItemId);
    if (!catalogItem) {
      return res.status(404).json({ error: 'Catalog item not found' });
    }
    
    // Cria ou inicializa o inventário da propriedade
    if (!db.propertyInventories[propertyId]) {
      db.propertyInventories[propertyId] = {
        propertyId,
        items: []
      };
    }
    
    const newItem = {
      id: Date.now().toString(),
      catalogItemId,
      propertyId,
      ...itemData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    db.propertyInventories[propertyId].items.push(newItem);
    await writeInventoryDb(db);
    
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error adding item to property:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/inventory/:propertyId/items/:itemId - Atualizar item do inventário
app.patch('/api/inventory/:propertyId/items/:itemId', async (req, res) => {
  try {
    const { propertyId, itemId } = req.params;
    const db = await readInventoryDb();
    
    if (!db.propertyInventories[propertyId]) {
      return res.status(404).json({ error: 'Property inventory not found' });
    }
    
    const itemIndex = db.propertyInventories[propertyId].items.findIndex(
      item => item.id === itemId
    );
    
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    const updatedItem = {
      ...db.propertyInventories[propertyId].items[itemIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    db.propertyInventories[propertyId].items[itemIndex] = updatedItem;
    await writeInventoryDb(db);
    
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating property item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/inventory/:propertyId/items/:itemId - Remover item do inventário
app.delete('/api/inventory/:propertyId/items/:itemId', async (req, res) => {
  try {
    const { propertyId, itemId } = req.params;
    const db = await readInventoryDb();
    
    if (!db.propertyInventories[propertyId]) {
      return res.status(404).json({ error: 'Property inventory not found' });
    }
    
    const itemIndex = db.propertyInventories[propertyId].items.findIndex(
      item => item.id === itemId
    );
    
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    db.propertyInventories[propertyId].items.splice(itemIndex, 1);
    await writeInventoryDb(db);
    
    res.status(204).send();
  } catch (error) {
    console.error('Error removing property item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/inventory/:propertyId/items/:itemId/clone - Clonar item do inventário
app.post('/api/inventory/:propertyId/items/:itemId/clone', async (req, res) => {
  try {
    const { propertyId, itemId } = req.params;
    const modifications = req.body;
    
    const db = await readInventoryDb();
    
    if (!db.propertyInventories[propertyId]) {
      return res.status(404).json({ error: 'Property inventory not found' });
    }
    
    const originalItem = db.propertyInventories[propertyId].items.find(
      item => item.id === itemId
    );
    
    if (!originalItem) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    const clonedItem = {
      ...originalItem,
      ...modifications,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    db.propertyInventories[propertyId].items.push(clonedItem);
    await writeInventoryDb(db);
    
    res.status(201).json(clonedItem);
  } catch (error) {
    console.error('Error cloning property item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/inventory/:propertyId/items - Buscar itens do inventário de uma propriedade
app.get('/api/inventory/:propertyId/items', async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { roomId } = req.query;
    const db = await readInventoryDb();
    
    // Buscar os itens da propriedade
    const propertyInventory = db.propertyInventories[propertyId];
    if (!propertyInventory) {
      return res.status(404).json({ error: 'Property inventory not found' });
    }

    // Filtrar por roomId se fornecido
    let items = propertyInventory.items;
    if (roomId) {
      items = items.filter(item => item.roomId === roomId);
    }

    // Enriquecer os itens com informações do catálogo
    const enrichedItems = await Promise.all(items.map(async (item) => {
      const catalogItem = db.catalog.items.find(
        catItem => catItem.id === item.catalogItemId
      );
      
      if (!catalogItem) {
        console.warn(`Catalog item not found for ${item.catalogItemId}`);
        return null;
      }

      return {
        ...item,
        name: catalogItem.name,
        category: catalogItem.category,
        description: catalogItem.description,
        specifications: catalogItem.specifications
      };
    }));

    // Remover itens nulos (caso o item do catálogo não seja encontrado)
    const validItems = enrichedItems.filter(item => item !== null);
    
    res.json(validItems);
  } catch (error) {
    console.error('Error fetching property items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/inventory/:propertyId/clone - Clonar inventário de uma propriedade
app.post('/api/inventory/:propertyId/clone', async (req, res) => {
  try {
    const sourcePropertyId = req.params.propertyId;
    const { targetPropertyId } = req.body;

    if (!sourcePropertyId || !targetPropertyId) {
      return res.status(400).json({
        success: false,
        error: 'IDs de origem e destino são obrigatórios'
      });
    }

    console.log(`Clonando inventário: ${sourcePropertyId} -> ${targetPropertyId}`);

    const db = await readInventoryDb();

    // Busca todos os itens do inventário da propriedade de origem
    const sourceItems = db.propertyInventories[sourcePropertyId] && db.propertyInventories[sourcePropertyId].items;

    if (!sourceItems) {
      return res.status(404).json({ error: 'Property inventory not found' });
    }

    console.log(`Encontrados ${sourceItems.length} itens para clonar`);

    // Clona cada item para a nova propriedade
    const clonedItems = sourceItems.map(item => ({
      ...item,
      id: `${targetPropertyId}_${item.id.split('_')[1]}`,
      propertyId: targetPropertyId,
      createdAt: new Date().toISOString()
    }));

    // Salva os itens clonados
    if (!db.propertyInventories[targetPropertyId]) {
      db.propertyInventories[targetPropertyId] = {
        propertyId: targetPropertyId,
        items: clonedItems
      };
    } else {
      db.propertyInventories[targetPropertyId].items.push(...clonedItems);
    }

    await writeInventoryDb(db);

    console.log(`${clonedItems.length} itens clonados com sucesso`);

    res.json({
      success: true,
      message: `Inventário clonado com sucesso: ${clonedItems.length} itens`,
      sourcePropertyId,
      targetPropertyId,
      itemsCount: clonedItems.length
    });

  } catch (error) {
    console.error('Erro ao clonar inventário:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao clonar inventário',
      details: error.message
    });
  }
});

// DELETE /api/inventory/:propertyId - Deletar inventário de uma propriedade
app.delete('/api/inventory/:propertyId', async (req, res) => {
  try {
    const { propertyId } = req.params;

    console.log(`Deletando inventário da propriedade ${propertyId}`);

    const db = await readInventoryDb();

    // Remove o inventário da propriedade
    if (db.propertyInventories[propertyId]) {
      delete db.propertyInventories[propertyId];
      await writeInventoryDb(db);
      console.log(`Inventário da propriedade ${propertyId} deletado com sucesso`);
    }

    res.json({
      success: true,
      message: 'Inventário deletado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar inventário:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao deletar inventário',
      details: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Inventory server is running on port ${PORT}`);
});
