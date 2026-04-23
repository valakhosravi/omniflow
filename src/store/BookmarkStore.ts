import { favoriteModel } from "@/features/homePage/homePage.types";
import { create } from "zustand";

interface FavoriteStore {
  count: number;
  favorites: favoriteModel[];
  setCount: (count: number) => void;
  setFavorites: (favorites: favoriteModel[]) => void;
}

export const useFavoriteStore = create<FavoriteStore>((set) => ({
  count: 0,
  favorites: [],
  setCount: (count) => set({ count }),
  setFavorites: (favorites) => set({ favorites }),
}));
