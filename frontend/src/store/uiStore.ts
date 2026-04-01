import { create } from 'zustand';

interface UIState {
  isRecordModalOpen: boolean;
  editingRecordId: string | null;
  openRecordModal: (recordId?: string) => void;
  closeRecordModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isRecordModalOpen: false,
  editingRecordId: null,

  openRecordModal: (recordId) => {
    set({
      isRecordModalOpen: true,
      editingRecordId: recordId || null,
    });
  },

  closeRecordModal: () => {
    set({
      isRecordModalOpen: false,
      editingRecordId: null,
    });
  },
}));
