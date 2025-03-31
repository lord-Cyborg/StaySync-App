export interface SeverityLevel {
  level: number;
  label: string;
  color: string;
  backgroundColor: string;
  description: string;
  defaultIcon: string;
}

export const SEVERITY_LEVELS: Record<number, SeverityLevel> = {
  1: {
    level: 1,
    label: 'Baixo',
    color: '#4caf50',
    backgroundColor: '#e8f5e9',
    description: 'Impacto mínimo, atenção de rotina',
    defaultIcon: 'CheckCircle'
  },
  2: {
    level: 2,
    label: 'Moderado Baixo',
    color: '#8bc34a',
    backgroundColor: '#f1f8e9',
    description: 'Impacto leve, requer atenção regular',
    defaultIcon: 'Info'
  },
  3: {
    level: 3,
    label: 'Moderado',
    color: '#ffc107',
    backgroundColor: '#fff8e1',
    description: 'Impacto médio, necessita atenção específica',
    defaultIcon: 'Warning'
  },
  4: {
    level: 4,
    label: 'Alto',
    color: '#ff9800',
    backgroundColor: '#fff3e0',
    description: 'Impacto significativo, requer atenção prioritária',
    defaultIcon: 'PriorityHigh'
  },
  5: {
    level: 5,
    label: 'Crítico',
    color: '#f44336',
    backgroundColor: '#ffebee',
    description: 'Impacto crítico, demanda atenção imediata',
    defaultIcon: 'Error'
  }
};

export const getSeverityLevel = (level: number): SeverityLevel => {
  return SEVERITY_LEVELS[level] || SEVERITY_LEVELS[1];
};

export const getSeverityColor = (level: number): string => {
  return getSeverityLevel(level).color;
};

export const getSeverityBackgroundColor = (level: number): string => {
  return getSeverityLevel(level).backgroundColor;
};

export const getSeverityLabel = (level: number): string => {
  return getSeverityLevel(level).label;
};

export const SEVERITY_CONTEXTS = {
  DAMAGE: {
    1: {
      label: 'Cosmético',
      icon: 'Brush'
    },
    2: {
      label: 'Funcional Menor',
      icon: 'Handyman'
    },
    3: {
      label: 'Funcional Maior',
      icon: 'Build'
    },
    4: {
      label: 'Estrutural',
      icon: 'Construction'
    },
    5: {
      label: 'Crítico',
      icon: 'ReportProblem'
    }
  },
  TASK: {
    1: {
      label: 'Baixa Prioridade',
      icon: 'LowPriority'
    },
    2: {
      label: 'Prioridade Regular',
      icon: 'Assignment'
    },
    3: {
      label: 'Prioridade Média',
      icon: 'AssignmentLate'
    },
    4: {
      label: 'Alta Prioridade',
      icon: 'AssignmentReturn'
    },
    5: {
      label: 'Urgente',
      icon: 'AssignmentTurnedIn'
    }
  },
  MAINTENANCE: {
    1: {
      label: 'Manutenção Preventiva',
      icon: 'BuildCircle'
    },
    2: {
      label: 'Ajuste Menor',
      icon: 'Tune'
    },
    3: {
      label: 'Reparo Necessário',
      icon: 'HomeRepairService'
    },
    4: {
      label: 'Reparo Urgente',
      icon: 'Engineering'
    },
    5: {
      label: 'Substituição Imediata',
      icon: 'Sync'
    }
  }
} as const;

export type SeverityContext = keyof typeof SEVERITY_CONTEXTS;

export const getContextLabel = (context: SeverityContext, level: number): string => {
  return SEVERITY_CONTEXTS[context][level as keyof typeof SEVERITY_CONTEXTS[typeof context]]?.label || getSeverityLabel(level);
};

export const getContextIcon = (context: SeverityContext, level: number): string => {
  return SEVERITY_CONTEXTS[context][level as keyof typeof SEVERITY_CONTEXTS[typeof context]]?.icon || getSeverityLevel(level).defaultIcon;
};
