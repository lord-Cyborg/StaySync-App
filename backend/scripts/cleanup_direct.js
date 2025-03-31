const fs = require('fs').promises;
const path = require('path');

async function cleanup() {
    try {
        console.log('Iniciando limpeza direta...');

        // 1. Ler o arquivo db_properties.json
        const dbPath = path.join(__dirname, '..', 'db_properties.json');
        const data = await fs.readFile(dbPath, 'utf8');
        const db = JSON.parse(data);

        // 2. Filtrar as propriedades problemáticas
        const originalLength = db.properties.length;
        db.properties = db.properties.filter(p => 
            p.id === p.propertyId && 
            p.propertyId === p.addressNumber &&
            p.mainImage.includes(`/images/${p.propertyId}/`)
        );

        console.log(`Removidas ${originalLength - db.properties.length} propriedades inconsistentes`);

        // 3. Salvar o arquivo atualizado
        await fs.writeFile(dbPath, JSON.stringify(db, null, 2), 'utf8');
        console.log('Banco de dados atualizado com sucesso');

        // 4. Verificar e remover diretórios de imagem órfãos
        const imagesDir = path.join(__dirname, '..', '..', 'frontend', 'public', 'images');
        const dirs = await fs.readdir(imagesDir);
        
        const validPropertyIds = new Set(db.properties.map(p => p.propertyId));

        console.log('\nVerificando diretórios de imagens órfãos...');
        for (const dir of dirs) {
            if (!validPropertyIds.has(dir)) {
                const dirPath = path.join(imagesDir, dir);
                console.log(`Removendo diretório órfão: ${dirPath}`);
                try {
                    await fs.rm(dirPath, { recursive: true, force: true });
                    console.log(`Diretório ${dir} removido com sucesso`);
                } catch (error) {
                    console.error(`Erro ao remover diretório ${dir}:`, error);
                }
            }
        }

        console.log('\nLimpeza concluída com sucesso!');

    } catch (error) {
        console.error('Erro durante a limpeza:', error);
    }
}

cleanup();
