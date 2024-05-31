import { create } from "zustand";

export type NovaTokenList = {
  novaTokenList: any[];
  setNovaTokenList: (list: any[]) => void;
};

export const useNovaTokenList = create<NovaTokenList>((set, get) => ({
  novaTokenList: [],
  setNovaTokenList: (list: any[]) => {
    set({
      novaTokenList: list,
    });
  },
}));
