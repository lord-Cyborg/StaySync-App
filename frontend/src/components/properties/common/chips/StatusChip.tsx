import React from 'react';
import { Box, Chip, alpha, SxProps, Theme } from '@mui/material';
import { 
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  AccessTime as AccessTimeIcon 
} from '@mui/icons-material';

export type InspectionStatus = 'ok' | 'attention' | 'problem' | 'b2b' | 'B2B' | 'N/R';

interface StatusChipProps {
  status?: InspectionStatus;
  sx?: SxProps<Theme>;
  absolute?: boolean;
  chipStyle?: any;
}

const StatusChip: React.FC<StatusChipProps> = ({ 
  status = 'N/R', 
  sx, 
  absolute = true, 
  chipStyle
}) => {
  const getStatusConfig = (status: InspectionStatus) => {
    const configs = {
      'ok': {
        icon: <CheckCircleIcon sx={{ fontSize: '1rem' }} />,
        label: 'OK',
        color: '#4caf50'
      },
      'attention': {
        icon: <WarningIcon sx={{ fontSize: '1rem' }} />,
        label: 'Atenção',
        color: '#ff9800'
      },
      'problem': {
        icon: <ErrorIcon sx={{ fontSize: '1rem' }} />,
        label: 'Problema',
        color: '#f44336'
      },
      'N/R': {
        icon: <AccessTimeIcon sx={{ fontSize: '1rem' }} />,
        label: 'N/R',
        color: alpha('#000', 0.65)
      },
      'b2b': {
        icon: <AccessTimeIcon sx={{ fontSize: '1rem' }} />,
        label: 'b2b',
        color: alpha('#000', 0.65)
      },
      'B2B': {
        icon: <AccessTimeIcon sx={{ fontSize: '1rem' }} />,
        label: 'B2B',
        color: alpha('#000', 0.65)
      }
    };

    return configs[status] || configs['N/R'];
  };

  const statusConfig = getStatusConfig(status);

  return (
    <Chip
      icon={statusConfig.icon}
      label={statusConfig.label}
      sx={{
        height: 28, 
        minWidth: '80px', 
        bgcolor: statusConfig.color,
        color: '#fff',
        '& .MuiChip-label': {
          px: 1.5, 
          fontSize: '0.75rem',
          fontWeight: 400,
          lineHeight: 1,
          paddingLeft: '8px', 
        },
        '& .MuiChip-icon': {
          color: '#fff',
          marginLeft: '4px',
          marginRight: '0px', 
        },
        ...sx,
        ...chipStyle,
        position: absolute ? 'absolute' : 'relative',
        bottom: absolute ? 8 : 'auto',
        left: absolute ? 8 : 'auto',
      }}
    />
  );
};

export default StatusChip;
