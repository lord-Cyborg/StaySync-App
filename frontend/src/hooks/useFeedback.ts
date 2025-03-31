import { useState, useCallback } from 'react';
import { AlertColor } from '@mui/material';
import { logger } from '../utils/logger';

interface FeedbackState {
  open: boolean;
  message: string;
  severity: AlertColor;
}

const initialState: FeedbackState = {
  open: false,
  message: '',
  severity: 'info'
};

export const useFeedback = () => {
  const [feedback, setFeedback] = useState<FeedbackState>(initialState);

  const showFeedback = useCallback((message: string, severity: AlertColor = 'info') => {
    logger.debug('useFeedback', 'Showing feedback', { message, severity });
    setFeedback({
      open: true,
      message,
      severity
    });
  }, []);

  const hideFeedback = useCallback(() => {
    logger.debug('useFeedback', 'Hiding feedback');
    setFeedback(prev => ({
      ...prev,
      open: false
    }));
  }, []);

  const showSuccess = useCallback((message: string) => {
    showFeedback(message, 'success');
  }, [showFeedback]);

  const showError = useCallback((message: string) => {
    showFeedback(message, 'error');
  }, [showFeedback]);

  const showWarning = useCallback((message: string) => {
    showFeedback(message, 'warning');
  }, [showFeedback]);

  const showInfo = useCallback((message: string) => {
    showFeedback(message, 'info');
  }, [showFeedback]);

  return {
    feedback,
    showFeedback,
    hideFeedback,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};

export default useFeedback;
