const fs = require('fs').promises;
const path = require('path');

async function cleanupInventoryFinal() {
    try {
        console.log('Iniciando limpeza final do inventário...');

        // 1. Ler o arquivo db_inventory.json
        const dbPath = path.join(__dirname, '..', 'db_inventory.json');
        const data = await fs.readFile(dbPath, 'utf8');
        const db = JSON.parse(data);

        let modificacoes = 0;

        // 2. Limpar sharedWith arrays em todo o objeto
        function limparSharedWith(obj) {
            if (obj && typeof obj === 'object') {
                if (Array.isArray(obj.sharedWith)) {
                    const tamanhoAnterior = obj.sharedWith.length;
                    obj.sharedWith = obj.sharedWith.filter(id => id !== '6302' && id !== '6303');
                    if (tamanhoAnterior !== obj.sharedWith.length) {
                        modificacoes++;
                    }
                }
                
                // Recursivamente procurar em todos os objetos e arrays
                for (const key in obj) {
                    limparSharedWith(obj[key]);
                }
            }
        }

        limparSharedWith(db);

        // 3. Salvar o arquivo atualizado
        await fs.writeFile(dbPath, JSON.stringify(db, null, 2), 'utf8');
        console.log(`Limpeza concluída! ${modificacoes} referências removidas.`);

        // 4. Criar backup do arquivo original
        const timestamp = new Date().toISOString().replace(/:/g, '-');
        const backupPath = path.join(__dirname, '..', 'backups', `db_inventory_${timestamp}.json`);
        await fs.writeFile(backupPath, data, 'utf8');
        console.log(`Backup do arquivo original criado em: ${backupPath}`);

    } catch (error) {
        console.error('Erro durante a limpeza:', error);
    }
}

cleanupInventoryFinal();
