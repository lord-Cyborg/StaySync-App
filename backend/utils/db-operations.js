const fs = require('fs-extra');
const path = require('path');
const logger = require('./logger');
const validator = require('./validator');

class DatabaseOperations {
  constructor() {
    this.dbPath = path.join(__dirname, '../');
  }

  getDbPath(collection) {
    return path.join(this.dbPath, `db_${collection}.json`);
  }

  async readDb(collection) {
    try {
      const filePath = this.getDbPath(collection);
      const exists = await fs.pathExists(filePath);
      if (!exists) {
        await fs.writeJson(filePath, {}, { spaces: 2 });
        return {};
      }
      return await fs.readJson(filePath);
    } catch (error) {
      logger.error('Error reading database', { collection, error: error.message });
      throw error;
    }
  }

  async writeDb(collection, data) {
    try {
      const filePath = this.getDbPath(collection);
      await fs.writeJson(filePath, data, { spaces: 2 });
      await logger.dbOperation('write', collection, { size: JSON.stringify(data).length });
    } catch (error) {
      logger.error('Error writing database', { collection, error: error.message });
      throw error;
    }
  }

  async insert(collection, document) {
    try {
      // Validar documento
      const isValid = await validator.validateDocument(collection, document);
      if (!isValid) {
        throw new Error('Document validation failed');
      }

      // Ler banco atual
      const db = await this.readDb(collection);

      // Inserir documento
      if (Array.isArray(db)) {
        db.push(document);
      } else {
        Object.assign(db, document);
      }

      // Salvar alterações
      await this.writeDb(collection, db);
      await logger.dbOperation('insert', collection, document);

      return document;
    } catch (error) {
      logger.error('Error inserting document', { collection, error: error.message });
      throw error;
    }
  }

  async update(collection, id, updates) {
    try {
      // Validar ID
      const isValidId = validator.validateId(collection, id);
      if (!isValidId) {
        throw new Error('Invalid ID format');
      }

      // Validar atualizações
      const isValid = await validator.validateDocument(collection, updates);
      if (!isValid) {
        throw new Error('Updates validation failed');
      }

      // Ler banco atual
      const db = await this.readDb(collection);

      // Atualizar documento
      if (Array.isArray(db)) {
        const index = db.findIndex(doc => doc.id === id);
        if (index === -1) throw new Error('Document not found');
        db[index] = { ...db[index], ...updates };
      } else {
        if (!db[id]) throw new Error('Document not found');
        db[id] = { ...db[id], ...updates };
      }

      // Salvar alterações
      await this.writeDb(collection, db);
      await logger.dbOperation('update', collection, { id, updates });

      return updates;
    } catch (error) {
      logger.error('Error updating document', { collection, id, error: error.message });
      throw error;
    }
  }

  async backup(collection) {
    try {
      const db = await this.readDb(collection);
      const backupPath = path.join(
        this.dbPath,
        'backups',
        `${collection}_${new Date().toISOString().replace(/[:.]/g, '-')}.json`
      );
      
      await fs.ensureDir(path.dirname(backupPath));
      await fs.writeJson(backupPath, db, { spaces: 2 });
      await logger.info('Database backup created', { collection, path: backupPath });
      
      return backupPath;
    } catch (error) {
      logger.error('Error creating backup', { collection, error: error.message });
      throw error;
    }
  }
}

module.exports = new DatabaseOperations();
