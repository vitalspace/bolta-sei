import { writable } from 'svelte/store';

interface AIChatState {
  isOpen: boolean;
}

const initialState: AIChatState = {
  isOpen: false
};

function createAIChatStore() {
  const { subscribe, set, update } = writable<AIChatState>(initialState);

  return {
    subscribe,
    open: () => update(state => ({ ...state, isOpen: true })),
    close: () => update(state => ({ ...state, isOpen: false })),
    toggle: () => update(state => ({ ...state, isOpen: !state.isOpen }))
  };
}

export const aiChatStore = createAIChatStore();