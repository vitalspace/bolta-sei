import { writable } from "svelte/store";

export const dashboardStore = writable<{ isOpen: boolean }>({
  isOpen: false,
});

export const dashboardService = {
  open: () => {
    dashboardStore.update((state) => {
      return {
        ...state,
        isOpen: true,
      };
    });
  },
  close: () => {
    dashboardStore.update((state) => {
      return {
        ...state,
        isOpen: false,
      };
    });
  },
};
