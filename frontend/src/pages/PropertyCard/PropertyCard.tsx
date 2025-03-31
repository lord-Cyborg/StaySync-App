import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper } from '@mui/material';
import PropertyCardComponent from '../../components/properties/common/PropertyCard';
import PropertyInventory from '../../components/inventory/PropertyInventory';
import { Property } from './types';

const PropertyCard = () => {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [selectedCount, setSelectedCount] = useState<number>(0);

  const property: Property = {
    id: '6301',
    name: '6301 Sand Skeeper Rd, Orlando, Florida',
    type: 'House',
    mainImage: '/images/6301/gallery/main-6301.JPG',
    bedroomCount: 11,
    bathroomCount: 6,
    kitchens: [{ name: 'Main Kitchen' }, { name: 'Pool Kitchen' }],
    livingRooms: [{ name: 'Living Room' }],
    gameRooms: [{ name: 'Game Room' }],
    pools: [{ name: 'Pool' }],
    bbq: [{ name: 'BBQ Area' }],
    ownerCloset: [{ name: 'Owner Closet' }],
    acRoom: [{ name: 'AC Room' }]
  };

  // Lista de áreas que têm apenas uma unidade
  const singleUnitAreas = ['living', 'game', 'pool', 'bbq', 'ownerCloset', 'acRoom'];

  // Função para verificar se é área única
  const isSingleUnitArea = (area: string) => singleUnitAreas.includes(area);

  // Efeito para atualizar o contador de seleções
  useEffect(() => {
    let count = 0;
    if (selectedArea) count++;
    if (selectedRoomId) count++;
    console.log('Selection count updated:', count);
    setSelectedCount(count);
  }, [selectedArea, selectedRoomId]);

  const handleAreaSelect = (area: string) => {
    console.log('PropertyCard - Área selecionada:', area);
    setSelectedArea(area);
    
    // Sempre seleciona a unidade 1 automaticamente para qualquer área
    const newRoomId = `${area}-1`;
    console.log('PropertyCard - RoomId definido:', newRoomId);
    setSelectedRoomId(newRoomId);
  };

  const handleRoomSelect = (roomId: number) => {
    if (selectedArea) {
      const newRoomId = `${selectedArea}-${roomId}`;
      console.log('PropertyCard - Nova unidade selecionada:', {
        selectedArea,
        roomId,
        newRoomId
      });
      setSelectedRoomId(newRoomId);
    }
  };

  // Função para determinar se deve mostrar o inventário
  const shouldShowInventory = () => {
    const should = selectedCount >= 1 && selectedRoomId !== null;
    console.log('PropertyCard - Deve mostrar inventário?', {
      selectedCount,
      selectedRoomId,
      should
    });
    return should;
  };

  // Não mostrar o inventário na página principal
  const isMainPage = !selectedArea;

  return (
    <Box sx={{ p: 3 }}>
      <Grid 
        container 
        spacing={3}
        sx={{
          flexDirection: { xs: 'column', md: 'row' }  // Vertical em tablet/celular, horizontal em desktop
        }}
      >
        <Grid 
          item 
          xs={12} 
          md={6}  // 6 colunas em telas md+ (horizontal)
          sx={{
            display: 'flex',
            justifyContent: 'center',
            '& > *': {  // Aplica em todos os filhos diretos
              width: '100%',
              maxWidth: '600px'  // Mesma largura máxima para ambos os cards
            }
          }}
        >
          <PropertyCardComponent
            property={property}
            onAreaSelect={handleAreaSelect}
            onRoomSelect={handleRoomSelect}
          />
        </Grid>

        {/* Coluna do Inventário */}
        {!isMainPage && (
          <Grid 
            item 
            xs={12} 
            md={6}  // 6 colunas em telas md+ (horizontal)
            sx={{
              display: 'flex',
              justifyContent: 'center',
              '& > *': {  // Aplica em todos os filhos diretos
                width: '100%',
                maxWidth: '600px'  // Mesma largura máxima para ambos os cards
              }
            }}
          >
            {shouldShowInventory() && (
              <Paper 
                elevation={2}
                sx={{
                  px: { xs: 1.5, sm: 2 },
                  py: 2,
                  width: '100%',  // Ocupa toda a largura disponível
                  maxWidth: '600px'  // Mesma largura máxima do PropertyCard
                }}
              >
                <PropertyInventory
                  propertyId={property.id}
                  roomId={selectedRoomId!}
                  areaType={selectedArea!}
                />
              </Paper>
            )}
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default PropertyCard;
