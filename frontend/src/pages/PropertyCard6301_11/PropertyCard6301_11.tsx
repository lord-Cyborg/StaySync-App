import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper } from '@mui/material';
import PropertyCardComponent from '../../components/properties/common/PropertyCard';
import PropertyInventory from '../../components/inventory/PropertyInventory';
import { Property } from '../PropertyCard/types';

const PropertyCard6301_11 = () => {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [selectedCount, setSelectedCount] = useState<number>(0);

  // Propriedade 6301-11 com dados do JSON condensado
  const property: Property = {
    id: '6301-11',
    name: '6301 Sand Skeeper Rd, Orlando, Florida',
    type: 'Casa/apto inteiro',
    mainImage: "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTI0MjkwMjIxMTY3OTA1NzI5MQ%3D%3D/original/51d4bd8e-5d1a-4dec-917e-aa0774982cf4.jpeg",
    bedroomCount: 11,
    bathroomCount: 11,
    kitchens: [{ name: 'Kitchen 1' }, { name: 'Kitchen 2' }],
    livingRooms: [{ name: 'Living Room 1' }, { name: 'Living Room 2' }],
    gameRooms: [{ name: 'Game Room' }],
    pools: [{ name: 'Pool' }],
    bbq: [{ name: 'BBQ Area' }],
    ownerCloset: [],
    acRoom: []
  };

  // Lista de áreas que têm apenas uma unidade
  const singleUnitAreas = ['game', 'pool', 'bbq'];

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
    console.log('PropertyCard6301_11 - Área selecionada:', area);
    setSelectedArea(area);
    
    // Sempre seleciona a unidade 1 automaticamente para qualquer área
    const newRoomId = `${area}-1`;
    console.log('PropertyCard6301_11 - RoomId definido:', newRoomId);
    setSelectedRoomId(newRoomId);
  };

  const handleRoomSelect = (roomId: number) => {
    if (selectedArea) {
      const newRoomId = `${selectedArea}-${roomId}`;
      console.log('PropertyCard6301_11 - Nova unidade selecionada:', {
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
    console.log('PropertyCard6301_11 - Deve mostrar inventário?', {
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
            remoteImageMap={{
              // Mapeamento de áreas para URLs de imagens
              "living-1": "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTI0MjkwMjIxMTY3OTA1NzI5MQ%3D%3D/original/51d4bd8e-5d1a-4dec-917e-aa0774982cf4.jpeg",
              "living-2": "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTI0MjkwMjIxMTY3OTA1NzI5MQ%3D%3D/original/aaf661d1-3b40-421f-9561-2a6ca4e72e47.jpeg",
              "kitchen-1": "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTI0MjkwMjIxMTY3OTA1NzI5MQ%3D%3D/original/c9f4f503-6815-41bb-a853-5184e618f6bf.jpeg",
              "kitchen-2": "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTI0MjkwMjIxMTY3OTA1NzI5MQ%3D%3D/original/7c52b007-016d-465a-9c80-333b27072547.jpeg",
              "dining": "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTI0MjkwMjIxMTY3OTA1NzI5MQ%3D%3D/original/acf1be30-1ef2-4597-bf34-2df909fc2b94.jpeg",
              "bedroom-1": "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTI0MjkwMjIxMTY3OTA1NzI5MQ%3D%3D/original/880ff045-4ab5-438f-ace7-1a63b4a62d0d.jpeg",
              "bedroom-2": "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTI0MjkwMjIxMTY3OTA1NzI5MQ%3D%3D/original/89e9ab74-d4d4-49d6-893f-b0442317341c.jpeg",
              "bedroom-3": "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTI0MjkwMjIxMTY3OTA1NzI5MQ%3D%3D/original/71221689-db71-407a-9021-451f013793f6.jpeg",
              "pool": "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTI0MjkwMjIxMTY3OTA1NzI5MQ%3D%3D/original/543041ff-2e62-4c30-9230-8678ef2c37be.jpeg",
              "game": "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTI0MjkwMjIxMTY3OTA1NzI5MQ%3D%3D/original/51d4bd8e-5d1a-4dec-917e-aa0774982cf4.jpeg"
            }}
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

export default PropertyCard6301_11;
