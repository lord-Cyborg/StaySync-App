# StaySync Development Guidelines

## Arquitetura e Estrutura

### Componentes Principais
1. **PropertyCard**
   - Componente central para visualização de propriedades
   - Gerencia estados de visualização (foto principal, unidades)
   - Integra com sistema de inventário

2. **Inventory System**
   - Gerencia itens por área/unidade
   - Mantém estado de problemas/alertas
   - Integra com PropertyCard para indicadores visuais

3. **Authentication System**
   - Gerencia estado de autenticação
   - Chaves de localStorage padronizadas:
     - 'token': JWT token
     - 'user': Informações do usuário

### Pontos Críticos e Advertências

#### 1. Gerenciamento de Estado
- **NUNCA** modificar diretamente o localStorage sem passar pelo authService
- Manter consistência nas chaves de armazenamento
- Sempre usar authService.isAuthenticated() para verificações

#### 2. Navegação e Rotas
- Usar navigate com { replace: true } para evitar loops
- Manter hierarquia de rotas consistente
- Sempre verificar autenticação em rotas protegidas

#### 3. Modificações no PropertyCard
- Preservar lógica de seleção de fotos
- Manter consistência nos chips de status
- Não quebrar navegação entre áreas/unidades

#### 4. Sistema de Inventário
- Manter estado consistente entre PropertyCard e Inventory
- Usar padrão de cores consistente para status
- Preservar expansão/colapso de categorias

### Estrutura do DB

#### Property Collection
```typescript
interface Property {
  id: string;
  name: string;
  status: string;
  areas: Area[];
  // ... outros campos
}
```

#### Inventory Collection
```typescript
interface InventoryItem {
  id: string;
  propertyId: string;
  areaId: string;
  status: 'ok' | 'problem' | 'attention';
  // ... outros campos
}
```

### Checklist de Implementação

Antes de qualquer modificação:
1. [ ] Verificar impacto em componentes relacionados
2. [ ] Testar navegação completa
3. [ ] Validar estado de autenticação
4. [ ] Confirmar consistência de dados
5. [ ] Testar em diferentes resoluções

### Fluxo de Dados

1. **Autenticação**
   ```
   Login -> Token -> LocalStorage -> API Requests
   ```

2. **PropertyCard**
   ```
   Property Data -> Área Selection -> Unit Selection -> Inventory
   ```

3. **Inventory**
   ```
   Load Items -> Group by Category -> Update Status -> Update UI
   ```

### Regras de Implementação

1. **Autenticação**
   - Sempre usar authService para operações de auth
   - Manter token atualizado em api.defaults.headers

2. **PropertyCard**
   - Preservar hierarquia de componentes
   - Manter lógica de seleção de fotos
   - Respeitar sistema de chips

3. **Inventory**
   - Manter agrupamento por categoria
   - Preservar estado de expansão
   - Atualizar status consistentemente

### Recuperação de Erros

Em caso de problemas:
1. Verificar logs de console
2. Validar estado de autenticação
3. Confirmar consistência de dados
4. Verificar navegação
5. Validar estado do inventário
