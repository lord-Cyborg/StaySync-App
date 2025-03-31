const fs = require('fs').promises;
const path = require('path');
const db = require('../utils/db');

async function cleanup() {
    try {
        console.log('Iniciando limpeza...');

        // 1. Remover propriedades com IDs inconsistentes
        const properties = await db.get('properties');
        const propertiesToRemove = properties.filter(p => 
            p.propertyId !== p.id || 
            p.propertyId !== p.addressNumber ||
            !p.mainImage.includes(`/images/${p.propertyId}/`)
        );

        console.log(`\nEncontradas ${propertiesToRemove.length} propriedades inconsistentes:`);
        propertiesToRemove.forEach(p => {
            console.log(`- ID: ${p.id}, PropertyId: ${p.propertyId}, AddressNumber: ${p.addressNumber}`);
        });

        // 2. Remover do banco de dados
        for (const prop of propertiesToRemove) {
            console.log(`\nRemovendo propriedade ${prop.propertyId}...`);
            await db.delete('properties', prop.id);
            console.log(`Propriedade ${prop.propertyId} removida do banco de dados`);
        }

        // 3. Verificar e remover diretórios de imagem órfãos
        const imagesDir = path.join(__dirname, '..', '..', 'frontend', 'public', 'images');
        const dirs = await fs.readdir(imagesDir);
        
        const remainingProperties = await db.get('properties');
        const validPropertyIds = new Set(remainingProperties.map(p => p.propertyId));

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
