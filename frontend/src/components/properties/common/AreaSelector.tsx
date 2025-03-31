import React from 'react';
import { Box, Chip } from '@mui/material';
import WeekendIcon from '@mui/icons-material/Weekend';
import KitchenIcon from '@mui/icons-material/Kitchen';
import BedIcon from '@mui/icons-material/Bed';
import BathtubIcon from '@mui/icons-material/Bathtub';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import PoolIcon from '@mui/icons-material/Pool';
import OutdoorGrillIcon from '@mui/icons-material/OutdoorGrill';
import LockIcon from '@mui/icons-material/Lock';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import { Property } from '../../../types/property';

interface AreaSelectorProps {
  property: Property;
  selectedArea: string | null;
  onAreaSelect: (area: string) => void;
}

const AreaSelector: React.FC<AreaSelectorProps> = ({
  property,
  selectedArea,
  onAreaSelect
}) => {
  const areas = React.useMemo(() => [
    { id: 'living', label: 'Living Room', icon: <WeekendIcon />, count: property?.livingRooms?.length || 0 },
    { id: 'kitchen', label: 'Kitchen', icon: <KitchenIcon />, count: property?.kitchens?.length || 0 },
    { id: 'bedroom', label: 'Bedroom', icon: <BedIcon />, count: property?.bedroomCount || 0 },
    { id: 'bathroom', label: 'Bathroom', icon: <BathtubIcon />, count: property?.bathroomCount || 0 },
    { id: 'game', label: 'Game Room', icon: <SportsEsportsIcon />, count: property?.gameRooms?.length || 0 },
    { id: 'pool', label: 'Pool', icon: <PoolIcon />, count: property?.pools?.length || 0 },
    { id: 'bbq', label: 'BBQ', icon: <OutdoorGrillIcon />, count: property?.bbq?.length || 0 },
    { id: 'ownerCloset', label: 'Owner Closet', icon: <LockIcon />, count: property?.ownerCloset?.length || 0 },
    { id: 'acRoom', label: 'A/C Room', icon: <AcUnitIcon />, count: property?.acRoom?.length || 0 }
  ], [property]);

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {areas.filter(area => area.count > 0).map((area) => (
        <Chip
          key={area.id}
          icon={area.icon}
          label={`${area.label} ${area.count > 1 ? `(${area.count})` : ''}`}
          onClick={() => onAreaSelect(area.id)}
          color={selectedArea === area.id ? 'primary' : 'default'}
          sx={{ m: 0.5 }}
        />
      ))}
    </Box>
  );
};

export default AreaSelector;
