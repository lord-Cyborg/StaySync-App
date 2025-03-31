const fs = require('fs').promises;
const path = require('path');

async function removeProperties() {
    try {
        console.log('Iniciando remoção de propriedades...');

        // 1. Ler o arquivo db_properties.json
        const dbPath = path.join(__dirname, '..', 'db_properties.json');
        const data = await fs.readFile(dbPath, 'utf8');
        const db = JSON.parse(data);

        // 2. Remover as propriedades 6302 e 6303
        const propertiesToRemove = ['6302', '6303'];
        
        const originalLength = db.properties.length;
        db.properties = db.properties.filter(p => !propertiesToRemove.includes(p.propertyId));
        
        console.log(`Removidas ${originalLength - db.properties.length} propriedades`);

        // 3. Salvar o arquivo atualizado
        await fs.writeFile(dbPath, JSON.stringify(db, null, 2), 'utf8');
        console.log('Banco de dados atualizado com sucesso');

        // 4. Tentar remover os diretórios de imagem
        const imagesDir = path.join(__dirname, '..', '..', 'frontend', 'public', 'images');
        for (const propertyId of propertiesToRemove) {
            const dirPath = path.join(imagesDir, propertyId);
            try {
                await fs.rm(dirPath, { recursive: true, force: true });
                console.log(`Diretório ${propertyId} removido com sucesso`);
            } catch (error) {
                console.log(`Diretório ${propertyId} não encontrado ou já removido`);
            }
        }

        console.log('\nLimpeza concluída com sucesso!');

    } catch (error) {
        console.error('Erro durante a limpeza:', error);
    }
}

removeProperties();
