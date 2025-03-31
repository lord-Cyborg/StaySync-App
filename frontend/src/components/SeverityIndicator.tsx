import { type FC } from 'react';
import { Box, Tooltip, Typography } from '@mui/material';
import * as Icons from '@mui/icons-material';
import {
  SeverityLevel,
  SeverityContext,
  getSeverityLevel,
  getContextLabel,
  getContextIcon,
} from '../constants/SeverityLevels';

interface SeverityIndicatorProps {
  level: number;
  context?: SeverityContext;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  showIcon?: boolean;
  className?: string;
}

type SizeConfig = {
  indicator: number;
  fontSize: number;
  iconSize: number;
}

type Sizes = {
  small: SizeConfig;
  medium: SizeConfig;
  large: SizeConfig;
}

const sizes: Sizes = {
  small: {
    indicator: 16,
    fontSize: 12,
    iconSize: 16,
  },
  medium: {
    indicator: 24,
    fontSize: 14,
    iconSize: 20,
  },
  large: {
    indicator: 32,
    fontSize: 16,
    iconSize: 24,
  },
};

export const SeverityIndicator: FC<SeverityIndicatorProps> = ({
  level,
  context,
  size = 'medium',
  showLabel = false,
  showIcon = true,
  className,
}: SeverityIndicatorProps) => {
  const severityLevel: SeverityLevel = getSeverityLevel(level);
  const dimensions = sizes[size];
  const label = context ? getContextLabel(context, level) : severityLevel.label;
  const iconName = context ? getContextIcon(context, level) : severityLevel.defaultIcon;
  
  // Obtém o componente do ícone dinamicamente do Material-UI
  const IconComponent = Icons[iconName as keyof typeof Icons] || Icons.Circle;

  return (
    <Box
      className={className}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
      }}
    >
      <Tooltip title={severityLevel.description}>
        <Box
          sx={{
            width: dimensions.indicator,
            height: dimensions.indicator,
            borderRadius: '50%',
            backgroundColor: severityLevel.backgroundColor,
            border: `2px solid ${severityLevel.color}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'help',
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: severityLevel.color,
              fontSize: dimensions.fontSize,
              fontWeight: 'bold',
            }}
          >
            {level}
          </Typography>
        </Box>
      </Tooltip>
      
      {showIcon && (
        <IconComponent
          sx={{
            color: severityLevel.color,
            fontSize: dimensions.iconSize,
          }}
        />
      )}
      
      {showLabel && (
        <Typography
          sx={{
            color: severityLevel.color,
            fontSize: dimensions.fontSize,
            fontWeight: 500,
          }}
        >
          {label}
        </Typography>
      )}
    </Box>
  );
};
