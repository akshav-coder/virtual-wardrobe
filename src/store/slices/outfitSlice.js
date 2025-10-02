import { createSlice } from "@reduxjs/toolkit";
import { demoOutfits } from "../../data/demoData";

const initialState = {
  outfits: demoOutfits,
  selectedItems: [],
  isCreatingOutfit: false,
  selectedView: "calendar",
  loading: false,
  error: null,
};

const outfitSlice = createSlice({
  name: "outfits",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    addOutfit: (state, action) => {
      const newOutfit = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      state.outfits.push(newOutfit);
    },
    updateOutfit: (state, action) => {
      const index = state.outfits.findIndex(
        (outfit) => outfit.id === action.payload.id
      );
      if (index !== -1) {
        state.outfits[index] = { ...state.outfits[index], ...action.payload };
      }
    },
    deleteOutfit: (state, action) => {
      state.outfits = state.outfits.filter(
        (outfit) => outfit.id !== action.payload
      );
    },
    addItemToOutfit: (state, action) => {
      const item = action.payload;
      const existingIndex = state.selectedItems.findIndex(
        (selected) => selected.id === item.id
      );
      if (existingIndex !== -1) {
        state.selectedItems.splice(existingIndex, 1);
      } else {
        state.selectedItems.push(item);
      }
    },
    removeItemFromOutfit: (state, action) => {
      state.selectedItems = state.selectedItems.filter(
        (item) => item.id !== action.payload
      );
    },
    clearSelectedItems: (state) => {
      state.selectedItems = [];
    },
    setIsCreatingOutfit: (state, action) => {
      state.isCreatingOutfit = action.payload;
    },
    setSelectedView: (state, action) => {
      state.selectedView = action.payload;
    },
    incrementOutfitWearCount: (state, action) => {
      const outfit = state.outfits.find(
        (outfit) => outfit.id === action.payload
      );
      if (outfit) {
        outfit.wearCount = (outfit.wearCount || 0) + 1;
        // Also increment wear count for individual items
        outfit.items.forEach((item) => {
          // This would need to be handled by the wardrobe slice
          // For now, we'll just track outfit wear count
        });
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  addOutfit,
  updateOutfit,
  deleteOutfit,
  addItemToOutfit,
  removeItemFromOutfit,
  clearSelectedItems,
  setIsCreatingOutfit,
  setSelectedView,
  incrementOutfitWearCount,
  clearError,
} = outfitSlice.actions;

export default outfitSlice.reducer;
