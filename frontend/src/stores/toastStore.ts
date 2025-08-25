import { writable } from 'svelte/store';

export interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  visible: boolean;
}

function createToastStore() {
  const { subscribe, set, update } = writable<ToastItem[]>([]);

  return {
    subscribe,
    showToast: (type: ToastItem['type'], message: string) => {
      const id = Math.random().toString(36).substr(2, 9);
      const newToast: ToastItem = {
        id,
        type,
        message,
        visible: true
      };

      update(toasts => [...toasts, newToast]);

      // Auto-remove after 5 seconds
      setTimeout(() => {
        update(toasts => toasts.filter(toast => toast.id !== id));
      }, 5000);

      return id;
    },
    removeToast: (id: string) => {
      update(toasts => toasts.filter(toast => toast.id !== id));
    },
    clearAll: () => {
      set([]);
    }
  };
}

export const toastStore = createToastStore();