const fs = require('fs-extra');
const path = require('path');
const moment = require('moment');

class Logger {
  constructor() {
    this.logDir = path.join(__dirname, '../logs');
    this.ensureLogDirectory();
  }

  ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  getLogFileName() {
    return path.join(this.logDir, `${moment().format('YYYY-MM-DD')}.log`);
  }

  formatMessage(level, message, data = {}) {
    return JSON.stringify({
      timestamp: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
      level,
      message,
      data
    }) + '\n';
  }

  async log(level, message, data = {}) {
    const logEntry = this.formatMessage(level, message, data);
    await fs.appendFile(this.getLogFileName(), logEntry);
  }

  async info(message, data = {}) {
    await this.log('INFO', message, data);
  }

  async error(message, data = {}) {
    await this.log('ERROR', message, data);
  }

  async warning(message, data = {}) {
    await this.log('WARNING', message, data);
  }

  async dbOperation(operation, collection, data = {}) {
    await this.log('DB_OPERATION', operation, {
      collection,
      data,
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = new Logger();
