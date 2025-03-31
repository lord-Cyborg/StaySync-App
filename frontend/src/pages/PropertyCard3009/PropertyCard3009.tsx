import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper } from '@mui/material';
import PropertyCardComponent from '../../components/properties/common/PropertyCard';
import PropertyInventory from '../../components/inventory/PropertyInventory';
import { Property } from '../PropertyCard/types';

const PropertyCard3009 = () => {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [selectedCount, setSelectedCount] = useState<number>(0);

  // Propriedade 3009 com dados do banco atual
  const property: Property = {
    id: '3009',
    name: '3009 Penelope Trl.',
    type: 'House',
    mainImage: "https://a0.muscache.com/im/pictures/miso/Hosting-1187773087217980534/original/68145b07-929e-4896-a346-d9436bc19738.png",
    bedroomCount: 4,
    bathroomCount: 3,
    kitchens: [{ name: 'Kitchen' }],
    livingRooms: [{ name: 'Living Room' }],
    gameRooms: [],
    pools: [{ name: 'Pool' }],
    bbq: [],
    ownerCloset: [],
    acRoom: [],
    status: 'b2b',
    addressNumber: '3009'
  };

  // Lista de áreas que têm apenas uma unidade
  const singleUnitAreas = ['living', 'kitchen', 'pool'];

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
    console.log('PropertyCard3009 - Área selecionada:', area);
    setSelectedArea(area);
    
    // Sempre seleciona a unidade 1 automaticamente para qualquer área
    const newRoomId = `${area}-1`;
    console.log('PropertyCard3009 - RoomId definido:', newRoomId);
    setSelectedRoomId(newRoomId);
  };

  const handleRoomSelect = (roomId: number) => {
    if (selectedArea) {
      const newRoomId = `${selectedArea}-${roomId}`;
      console.log('PropertyCard3009 - Nova unidade selecionada:', {
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
    console.log('PropertyCard3009 - Deve mostrar inventário?', {
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
            useRemoteImages={true} // Indica que esta propriedade usa URLs remotas
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

export default PropertyCard3009;
