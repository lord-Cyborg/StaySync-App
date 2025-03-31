const fs = require('fs-extra');
const path = require('path');

// Configuração dos caminhos
const ROOT_DIR = path.resolve(__dirname, '..');
const BACKUP_DIR = path.join(ROOT_DIR, 'backups');

// Função para listar backups disponíveis
function listAvailableBackups() {
    return fs.readdirSync(BACKUP_DIR)
        .filter(dir => dir.startsWith('backup_') && !dir.endsWith('.zip')) // Ignorar arquivos zip
        .map(dir => ({
            name: dir,
            path: path.join(BACKUP_DIR, dir),
            time: fs.statSync(path.join(BACKUP_DIR, dir)).mtime
        }))
        .sort((a, b) => b.time - a.time);
}

// Função para restaurar apenas o DB
function restoreDB() {
    // Pegar o backup mais recente
    const backups = listAvailableBackups();
    if (backups.length === 0) {
        console.error('No backups found!');
        return;
    }

    const latestBackup = backups[0];
    console.log(`Using latest backup: ${latestBackup.name}`);

    // Caminhos dos arquivos
    const backupDbPath = path.join(latestBackup.path, 'backend', 'db.json');
    const targetPropertiesPath = path.join(ROOT_DIR, 'backend', 'db_properties.json');
    
    try {
        // Verificar se o arquivo de backup existe
        if (!fs.existsSync(backupDbPath)) {
            console.error('Backup DB file not found!');
            return;
        }

        // Ler o DB do backup
        const backupData = fs.readJsonSync(backupDbPath);
        
        // Criar o novo arquivo de propriedades
        fs.writeJsonSync(targetPropertiesPath, {
            properties: backupData.properties
        }, { spaces: 2 });

        console.log('✅ DB restored successfully!');
        console.log(`📁 Properties data restored to: ${targetPropertiesPath}`);

    } catch (error) {
        console.error('Error restoring DB:', error);
    }
}

// Executar a restauração
restoreDB();
