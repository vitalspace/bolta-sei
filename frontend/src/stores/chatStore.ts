import { writable } from 'svelte/store';

export interface ChatMessage {
  id: number;
  text: string;
  timestamp: Date;
  isRemoving?: boolean;
}

export interface ChatState {
  isVisible: boolean;
  inputText: string;
  messages: ChatMessage[];
  messageId: number;
  lastActivity: Date;
  isClearing: boolean;
}

const initialState: ChatState = {
  isVisible: false,
  inputText: '',
  messages: [],
  messageId: 0,
  lastActivity: new Date(),
  isClearing: false
};

function createChatStore() {
  const { subscribe, set, update } = writable<ChatState>(initialState);
  
  let inactivityTimer: NodeJS.Timeout | null = null;
  
  // Función para limpiar mensajes automáticamente
  const cleanupMessages = (messages: ChatMessage[]) => {
    if (messages.length > 10) {
      return messages.slice(-10); // Mantener solo los últimos 10 mensajes
    }
    return messages;
  };
  
  // Función para marcar mensajes para eliminación con efecto
  const markMessagesForRemoval = (messages: ChatMessage[], keepCount: number) => {
    if (messages.length <= keepCount) return messages;
    
    const messagesToRemove = messages.length - keepCount;
    return messages.map((message, index) => ({
      ...message,
      isRemoving: index < messagesToRemove
    }));
  };
  
  // Función para limpiar mensajes con efecto suave en cascada
  const clearMessagesWithEffect = () => {
    update(state => {
      const messages = state.messages;
      
      // Aplicar efecto de cascada: cada mensaje se marca con un retraso
      messages.forEach((message, index) => {
        setTimeout(() => {
          update(currentState => ({
            ...currentState,
            messages: currentState.messages.map(msg => 
              msg.id === message.id ? { ...msg, isRemoving: true } : msg
            )
          }));
        }, index * 100); // 100ms de retraso entre cada mensaje
      });
      
      // Eliminar todos los mensajes después de que termine la cascada
      const totalDelay = messages.length * 100 + 300; // tiempo de cascada + animación
      setTimeout(() => {
        update(currentState => ({ ...currentState, messages: [], isClearing: false }));
      }, totalDelay);
      
      return state;
     });
   };
  
  // Función para reiniciar el timer de inactividad
  const resetInactivityTimer = () => {
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
    }
    inactivityTimer = setTimeout(() => {
      clearMessagesWithEffect();
    }, 10000); // 10 segundos
  };

  return {
    subscribe,
    
    // Alternar visibilidad del chat
    toggleChat: () => update(state => {
      if (state.isVisible && state.inputText.trim() === '') {
        return { ...state, isVisible: false };
      } else if (!state.isVisible) {
        resetInactivityTimer();
        return { ...state, isVisible: true, lastActivity: new Date() };
      }
      return state;
    }),

    // Mostrar chat
    showChat: () => update(state => {
      resetInactivityTimer();
      return { ...state, isVisible: true, lastActivity: new Date() };
    }),

    // Ocultar chat
    hideChat: () => update(state => ({ ...state, isVisible: false, inputText: '' })),

    // Actualizar texto del input
    updateInputText: (text: string) => update(state => {
      resetInactivityTimer();
      return { ...state, inputText: text, lastActivity: new Date() };
    }),

    // Limpiar input y cerrar chat (ya no agrega mensajes localmente)
    sendMessage: () => update(state => {
      if (state.inputText.trim() !== '') {
        resetInactivityTimer();
        return {
          ...state,
          inputText: '',
          isVisible: false,
          lastActivity: new Date()
        };
      }
      return state;
    }),

    // Agregar mensaje desde WebSocket
    addWebSocketMessage: (message: string, socketId?: string) => update(state => {
      // Formatear el ID del socket para mostrar solo los primeros 2 y últimos 2 dígitos
      const formatSocketId = (id: string) => {
        if (id.length <= 4) return id;
        return `${id.slice(0, 2)}..${id.slice(-2)}`;
      };
      
      const displayText = socketId ? `[${formatSocketId(socketId)}] ${message}` : message;
      
      const newMessage: ChatMessage = {
        id: state.messageId,
        text: displayText,
        timestamp: new Date()
      };
      
      const allMessages = [...state.messages, newMessage];
      const cleanedMessages = cleanupMessages(allMessages);
      
      resetInactivityTimer();
      
      return {
        ...state,
        messages: cleanedMessages,
        messageId: state.messageId + 1,
        lastActivity: new Date()
      };
    }),

    // Limpiar todos los mensajes
    clearMessages: () => {
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
        inactivityTimer = null;
      }
      clearMessagesWithEffect();
    },

    // Reset completo
    reset: () => {
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
        inactivityTimer = null;
      }
      set(initialState);
    },

    // Limpiar timer (para cleanup)
    cleanup: () => {
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
        inactivityTimer = null;
      }
    }
  };
}

export const chatStore = createChatStore();