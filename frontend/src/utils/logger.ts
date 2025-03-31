export const LogLevel = {
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
  DEBUG: 'DEBUG'
} as const;

export type LogType = keyof typeof LogLevel;

export interface LogMessage {
  level: LogType;
  component: string;
  message: string;
  data?: any;
  timestamp?: string;
}

export const logger = {
  log: (log: LogMessage) => {
    const timestamp = new Date().toISOString();
    const logEntry = {
      ...log,
      timestamp,
    };
    
    // Log no console com cores diferentes por nível
    const style = {
      INFO: 'color: #4CAF50',
      WARN: 'color: #FFC107',
      ERROR: 'color: #F44336',
      DEBUG: 'color: #2196F3'
    }[log.level];

    console.log(
      `%c[${logEntry.timestamp}][${logEntry.level}][${logEntry.component}] ${logEntry.message}`,
      style,
      logEntry.data || ''
    );

    // Aqui poderíamos adicionar integração com serviços de log
    return logEntry;
  },

  info: (component: string, message: string, data?: any) => 
    logger.log({ level: 'INFO', component, message, data }),

  warn: (component: string, message: string, data?: any) =>
    logger.log({ level: 'WARN', component, message, data }),

  error: (component: string, message: string, data?: any) =>
    logger.log({ level: 'ERROR', component, message, data }),

  debug: (component: string, message: string, data?: any) =>
    logger.log({ level: 'DEBUG', component, message, data })
};
