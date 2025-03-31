const fs = require('fs').promises;
const path = require('path');

async function cleanupBackups() {
    try {
        console.log('Iniciando limpeza dos backups...');

        // 1. Ler diretório de backups
        const backupDir = path.join(__dirname, '..', 'backups');
        const files = await fs.readdir(backupDir);

        // 2. Processar cada arquivo de backup
        for (const file of files) {
            if (file.startsWith('db_properties_') && file.endsWith('.json')) {
                const filePath = path.join(backupDir, file);
                console.log(`\nProcessando arquivo: ${file}`);

                // Ler e parsear o arquivo
                const data = await fs.readFile(filePath, 'utf8');
                const db = JSON.parse(data);

                // Verificar se contém as propriedades a serem removidas
                const hasOrphanedProperties = db.properties && 
                    (db.properties['6302'] || db.properties['6303']);

                if (hasOrphanedProperties) {
                    // Remover as propriedades
                    if (db.properties['6302']) delete db.properties['6302'];
                    if (db.properties['6303']) delete db.properties['6303'];

                    // Salvar arquivo atualizado
                    await fs.writeFile(filePath, JSON.stringify(db, null, 2), 'utf8');
                    console.log(`Arquivo ${file} atualizado`);
                } else {
                    console.log(`Arquivo ${file} não contém propriedades órfãs`);
                }
            }
        }

        console.log('\nLimpeza dos backups concluída com sucesso!');

    } catch (error) {
        console.error('Erro durante a limpeza dos backups:', error);
    }
}

cleanupBackups();
