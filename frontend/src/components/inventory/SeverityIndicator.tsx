import React from 'react';
import { Box, Tooltip } from '@mui/material';

interface SeverityIndicatorProps {
  severity: 'low' | 'medium' | 'high';
  size?: number;
}

const severityColors = {
  low: '#4caf50',    // Green
  medium: '#ff9800', // Orange
  high: '#f44336',   // Red
};

const SeverityIndicator: React.FC<SeverityIndicatorProps> = ({ 
  severity, 
  size = 12 
}) => {
  return (
    <Tooltip title={`${severity.charAt(0).toUpperCase() + severity.slice(1)} Priority`}>
      <Box
        sx={{
          width: size,
          height: size,
          borderRadius: '50%',
          backgroundColor: severityColors[severity],
          display: 'inline-block',
          marginRight: 1,
        }}
      />
    </Tooltip>
  );
};

export default SeverityIndicator;
