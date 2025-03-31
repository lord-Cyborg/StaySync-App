const fs = require('fs').promises;
const path = require('path');

class Database {
    constructor(dbPath) {
        this.dbPath = dbPath;
        this.cache = null;
        this.lastRead = null;
        this.cacheTimeout = 5000; // 5 segundos
    }

    async read() {
        // Se tiver cache válido, retorna ele
        if (this.cache && this.lastRead && (Date.now() - this.lastRead) < this.cacheTimeout) {
            return this.cache;
        }

        try {
            const data = await fs.readFile(this.dbPath, 'utf8');
            this.cache = JSON.parse(data);
            this.lastRead = Date.now();
            return this.cache;
        } catch (error) {
            console.error('Error reading database:', error);
            throw error;
        }
    }

    async write(data) {
        try {
            // Criar backup antes de escrever
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const backupPath = path.join(
                path.dirname(this.dbPath),
                'backups',
                `${path.basename(this.dbPath, '.json')}_${timestamp}.json`
            );

            // Garantir que a pasta de backups existe
            await fs.mkdir(path.dirname(backupPath), { recursive: true });

            // Fazer backup do arquivo atual
            if (await fs.access(this.dbPath).then(() => true).catch(() => false)) {
                await fs.copyFile(this.dbPath, backupPath);
            }

            // Escrever novos dados
            await fs.writeFile(this.dbPath, JSON.stringify(data, null, 2));
            this.cache = data;
            this.lastRead = Date.now();
        } catch (error) {
            console.error('Error writing to database:', error);
            throw error;
        }
    }

    async get(collection, id) {
        const data = await this.read();
        if (!data[collection]) return null;
        return id ? data[collection].find(item => item.id === id) : data[collection];
    }

    async add(collection, item) {
        const data = await this.read();
        if (!data[collection]) data[collection] = [];
        data[collection].push(item);
        await this.write(data);
        return item;
    }

    async update(collection, id, updates) {
        const data = await this.read();
        if (!data[collection]) return null;
        
        const index = data[collection].findIndex(item => item.id === id);
        if (index === -1) return null;

        data[collection][index] = { ...data[collection][index], ...updates };
        await this.write(data);
        return data[collection][index];
    }

    async delete(collection, id) {
        const data = await this.read();
        if (!data[collection]) return false;
        
        const index = data[collection].findIndex(item => item.id === id);
        if (index === -1) return false;

        data[collection].splice(index, 1);
        await this.write(data);
        return true;
    }
}

module.exports = new Database(path.join(__dirname, '../db_properties.json'));
