import { authService } from '../services/authService';

// Função para configurar automaticamente as credenciais de teste
// Isso é útil para desenvolvimento, mas deve ser removido em produção
export const setupTestAuth = () => {
  console.log('Configurando credenciais de teste para desenvolvimento...');
  
  // Verificar se já existe um token
  if (!localStorage.getItem('token')) {
    authService.setTestCredentials();
    console.log('Credenciais de teste configuradas com sucesso!');
  } else {
    console.log('Usuário já autenticado, pulando configuração de credenciais de teste.');
  }
};

export default setupTestAuth;
