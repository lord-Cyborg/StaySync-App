import { createClient } from '@supabase/supabase-js';

// Essas variáveis devem vir do seu .env
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para nossa tabela de propriedades
export interface Property {
  id: string;
  created_at: string;
  address: string;
  gate_code: string;
  door_code: string;
  wifi_password: string;
  main_image_url: string;
}

// Funções helper para interagir com o Supabase
export const propertyService = {
  // Buscar uma propriedade
  async getProperty(id: string) {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Criar/Atualizar propriedade
  async upsertProperty(property: Partial<Property>) {
    const { data, error } = await supabase
      .from('properties')
      .upsert(property)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Upload de imagem
  async uploadImage(file: File, path: string) {
    const { data, error } = await supabase
      .storage
      .from('property-images')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) throw error;
    return data;
  },

  // Gerar URL pública para imagem
  async getImageUrl(path: string) {
    const { data } = supabase
      .storage
      .from('property-images')
      .getPublicUrl(path);
    
    return data.publicUrl;
  }
};
