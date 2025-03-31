import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import EditPropertyCard from '../components/properties/common/EditPropertyCard';
import { propertyService, PropertyData } from '../services/propertyService';

const EditProperty = () => {
  const [property, setProperty] = useState<PropertyData | null>(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      try {
        console.log('Fetching property with id:', id);
        const data = await propertyService.getProperty(id);
        console.log('Fetched property data:', data);
        setProperty(data);
      } catch (error) {
        console.error('Error fetching property:', error);
      }
    };
    if (id) {
      fetchProperty();
    }
  }, [id]);

  const handleSave = async (data: PropertyData) => {
    try {
      if (id) {
        await propertyService.updateProperty(id, data);
        console.log('Property updated successfully!');
        navigate('/properties'); 
      }
    } catch (error) {
      console.error('Error saving property:', error);
    }
  };

  const handleSaveAs = async (data: PropertyData) => {
    try {
      const { _imageFile, ...propertyData } = data;
      
      // Prepara a nova propriedade usando o mesmo número para todos os IDs
      const newProperty = {
        ...propertyData,
        id: data.addressNumber,           // Usa o número digitado como ID
        propertyId: data.addressNumber,   // Mesmo número no propertyId
        addressNumber: data.addressNumber, // E no addressNumber
        mainImage: `/images/${data.addressNumber}/gallery/main-${data.addressNumber}.JPG`,
        images: data.images?.map(img => ({
          ...img,
          path: img.path.replace(/\/images\/\d+\//, `/images/${data.addressNumber}/`)
        })) || []
      };

      console.log('Criando nova propriedade:', newProperty);
      
      // Cria a propriedade no banco
      await propertyService.createProperty(newProperty);
      
      // Clona as imagens da propriedade original para a nova
      if (id) {
        console.log('Clonando imagens:', { sourceId: id, targetId: data.addressNumber });
        await propertyService.cloneImages(id, data.addressNumber);
      }
      
      console.log('Property created successfully!');
      navigate('/properties');
    } catch (error) {
      console.error('Error creating new property:', error);
    }
  };

  const handleDelete = async (propertyId: string) => {
    try {
      await propertyService.deleteProperty(propertyId);
      console.log('Property deleted successfully!');
      navigate('/properties');
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  };

  const handleBack = () => {
    navigate('/properties'); 
  };

  return (
    <>
      <Box sx={{ 
        position: 'relative',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '400px',
        pt: 3
      }}>
        {property && (
          <EditPropertyCard
            initialData={property}
            onSave={handleSave}
            onSaveAs={handleSaveAs}
            onDelete={handleDelete}
          />
        )}
      </Box>
    </>
  );
};

export default EditProperty;