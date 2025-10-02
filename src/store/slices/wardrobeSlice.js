import { createSlice } from "@reduxjs/toolkit";
import { demoWardrobe } from "../../data/demoData";

const initialState = {
  items: demoWardrobe,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const wardrobeSlice = createSlice({
  name: "wardrobe",
  initialState,
  reducers: {
    addItem: (state, action) => {
      state.items.push(action.payload);
    },
    updateItem: (state, action) => {
      const { id } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);
      if (existingItem) {
        Object.assign(existingItem, action.payload);
      }
    },
    deleteItem: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    toggleFavorite: (state, action) => {
      const itemId = action.payload;
      const itemIndex = state.items.findIndex((item) => item.id === itemId);
      if (itemIndex !== -1) {
        state.items[itemIndex] = {
          ...state.items[itemIndex],
          isFavorite: !state.items[itemIndex].isFavorite,
        };
      }
    },
    setWardrobe: (state, action) => {
      state.items = action.payload;
    },
  },
});

export const { addItem, updateItem, deleteItem, toggleFavorite, setWardrobe } =
  wardrobeSlice.actions;

export default wardrobeSlice.reducer;
