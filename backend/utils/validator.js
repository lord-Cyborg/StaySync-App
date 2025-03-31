const schemas = require('../config/db-schemas');
const logger = require('./logger');

class Validator {
  validatePattern(value, pattern) {
    if (!pattern) return true;
    const regex = new RegExp(pattern);
    return regex.test(value);
  }

  validateRequired(data, required = []) {
    return required.every(field => {
      const hasField = data.hasOwnProperty(field);
      if (!hasField) {
        logger.error('Required field missing', { field });
      }
      return hasField;
    });
  }

  validateProperties(data, schema) {
    if (!schema || !schema.properties) return true;

    return Object.entries(schema.properties).every(([key, rules]) => {
      if (data[key]) {
        if (rules.pattern && !this.validatePattern(data[key], rules.pattern)) {
          logger.error('Pattern validation failed', { key, value: data[key], pattern: rules.pattern });
          return false;
        }
        if (rules.required && !this.validateRequired(data[key], rules.required)) {
          return false;
        }
      }
      return true;
    });
  }

  async validateDocument(collection, data) {
    const schema = schemas[collection];
    if (!schema) {
      logger.warning('No schema found for collection', { collection });
      return true;
    }

    const isValid = this.validateRequired(data, schema.required) &&
                   this.validateProperties(data, schema);

    if (!isValid) {
      logger.error('Document validation failed', { collection, data });
    }

    return isValid;
  }

  validateId(type, id) {
    const patterns = {
      property: '^\\d+$',
      owner: '^own-\\d{3}$',
      supplier: '^sup-\\d{3}$',
      invoice: '^inv-\\d{3}$',
      inspection: '^insp-\\d{3}$'
    };

    const pattern = patterns[type];
    if (!pattern) {
      logger.warning('No pattern found for ID type', { type });
      return true;
    }

    const isValid = this.validatePattern(id, pattern);
    if (!isValid) {
      logger.error('ID validation failed', { type, id, pattern });
    }

    return isValid;
  }
}

module.exports = new Validator();
