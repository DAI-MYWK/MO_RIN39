import { create } from 'zustand';
import { MenuItem } from '@/types/menu';

interface MenuStore {
  menuData: MenuItem[];
  setMenuData: (data: MenuItem[]) => void;
  updateMenuItem: (id: string, field: keyof MenuItem, value: any) => void;
  updateMenuItemName: (id: string, name: string) => void;
  updateMenuItemPrice: (id: string, price: string) => void;
  updateMenuItemDescription: (id: string, description: string) => void;
  toggleRecommended: (id: string) => void;
}

export const useMenuStore = create<MenuStore>((set) => ({
  menuData: [],
  setMenuData: (data) => set({ menuData: data }),
  updateMenuItem: (id, field, value) =>
    set((state) => ({
      menuData: state.menuData.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    })),
  updateMenuItemName: (id, name) =>
    set((state) => ({
      menuData: state.menuData.map((item) =>
        item.id === id ? { ...item, name } : item
      ),
    })),
  updateMenuItemPrice: (id, price) =>
    set((state) => ({
      menuData: state.menuData.map((item) =>
        item.id === id ? { ...item, price } : item
      ),
    })),
  updateMenuItemDescription: (id, description) =>
    set((state) => ({
      menuData: state.menuData.map((item) =>
        item.id === id ? { ...item, description } : item
      ),
    })),
  toggleRecommended: (id) =>
    set((state) => ({
      menuData: state.menuData.map((item) =>
        item.id === id
          ? { ...item, isRecommended: !item.isRecommended }
          : item
      ),
    })),
}));

