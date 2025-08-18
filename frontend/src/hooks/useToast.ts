import { useCallback } from 'react';

interface ToastOptions {
  duration?: number;
}

export const useToast = () => {
  const showToast = useCallback(
    (message: string, type: 'error' | 'success' | 'warning' | 'info', options?: ToastOptions) => {
      if ((window as any).showToast) {
        (window as any).showToast(message, type, options?.duration);
      }
    },
    []
  );

  const showError = useCallback(
    (message: string, options?: ToastOptions) => {
      showToast(message, 'error', options);
    },
    [showToast]
  );

  const showSuccess = useCallback(
    (message: string, options?: ToastOptions) => {
      showToast(message, 'success', options);
    },
    [showToast]
  );

  const showWarning = useCallback(
    (message: string, options?: ToastOptions) => {
      showToast(message, 'warning', options);
    },
    [showToast]
  );

  const showInfo = useCallback(
    (message: string, options?: ToastOptions) => {
      showToast(message, 'info', options);
    },
    [showToast]
  );

  return {
    showToast,
    showError,
    showSuccess,
    showWarning,
    showInfo,
  };
};

export default useToast;
