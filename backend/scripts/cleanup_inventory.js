const fs = require('fs').promises;
const path = require('path');

async function cleanupInventory() {
    try {
        console.log('Iniciando limpeza do inventário...');

        // 1. Ler o arquivo db_inventory.json
        const dbPath = path.join(__dirname, '..', 'db_inventory.json');
        const data = await fs.readFile(dbPath, 'utf8');
        const db = JSON.parse(data);

        // 2. Remover referências às propriedades 6302 e 6303
        const propertiesToRemove = ['6302', '6303'];

        // Limpar em catalog.items
        if (db.catalog?.items) {
            for (const item of db.catalog.items) {
                if (item.propertyIds) {
                    item.propertyIds = item.propertyIds.filter(id => !propertiesToRemove.includes(id));
                }
            }
        }

        // Limpar em groups
        if (db.groups) {
            for (const group of Object.values(db.groups)) {
                if (group.propertyIds) {
                    group.propertyIds = group.propertyIds.filter(id => !propertiesToRemove.includes(id));
                }
            }
        }

        // 3. Salvar o arquivo atualizado
        await fs.writeFile(dbPath, JSON.stringify(db, null, 2), 'utf8');
        console.log('Banco de dados de inventário atualizado com sucesso');

        console.log('\nLimpeza concluída com sucesso!');

    } catch (error) {
        console.error('Erro durante a limpeza:', error);
    }
}

cleanupInventory();
