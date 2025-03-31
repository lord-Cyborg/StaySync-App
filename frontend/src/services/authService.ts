import api from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token, user } = response.data;
      
      // Salvar token e informações do usuário
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Configurar o token para todas as requisições futuras
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return { token, user };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout() {
    // Limpar token e informações do usuário
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Remover token das requisições
    delete api.defaults.headers.common['Authorization'];
    
    // Redirecionar para a página de login usando caminho relativo
    window.location.href = '/auth/login';
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    // Configurar o token para todas as requisições se ele existir
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    return true;
  }
};

export default authService;
