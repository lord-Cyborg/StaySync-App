const schemas = {
  version: '1.0.0',
  
  // Schema para validação de propriedades administrativas
  propertyAdmin: {
    required: ['basicInfo', 'dynamicMetrics'],
    properties: {
      basicInfo: {
        required: ['owner', 'property', 'hoa'],
        properties: {
          owner: {
            required: ['id', 'name', 'fiscalId'],
            pattern: {
              id: '^own-\\d{3}$',
              fiscalId: '^\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}$'
            }
          }
        }
      }
    }
  },

  // Schema para validação financeira
  financial: {
    required: ['revenue', 'expenses', 'kpis'],
    properties: {
      revenue: {
        pattern: {
          year: '^\\d{4}$',
          amount: '^\\d+(\\.\\d{1,2})?$'
        }
      }
    }
  },

  // Schema para validação de fornecedores
  suppliers: {
    required: ['name', 'services', 'active'],
    pattern: {
      id: '^sup-\\d{3}$'
    }
  }
};

module.exports = schemas;
