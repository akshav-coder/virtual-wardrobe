import React, { createContext, useContext, useReducer, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AppContext = createContext();

const initialState = {
  // Demo data removed - using Redux store and API calls instead
  user: null,
  wardrobe: [],
  outfits: [],
  favorites: [],
  weather: null,
  calendarEvents: [],
  preferences: {
    style: "casual",
    colors: [],
    brands: [],
    budget: 1000,
    notifications: true,
  },
  isOnboardingComplete: false,
  loading: false,
  error: null,
};

const appReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "SET_USER":
      return { ...state, user: action.payload };
    case "SET_WARDROBE":
      return { ...state, wardrobe: action.payload };
    case "ADD_ITEM":
      return { ...state, wardrobe: [...state.wardrobe, action.payload] };
    case "UPDATE_ITEM":
      return {
        ...state,
        wardrobe: state.wardrobe.map((item) =>
          item.id === action.payload.id ? action.payload : item
        ),
      };
    case "DELETE_ITEM":
      return {
        ...state,
        wardrobe: state.wardrobe.filter((item) => item.id !== action.payload),
      };
    case "SET_OUTFITS":
      return { ...state, outfits: action.payload };
    case "ADD_OUTFIT":
      return { ...state, outfits: [...state.outfits, action.payload] };
    case "UPDATE_OUTFIT":
      return {
        ...state,
        outfits: state.outfits.map((outfit) =>
          outfit.id === action.payload.id ? action.payload : outfit
        ),
      };
    case "DELETE_OUTFIT":
      return {
        ...state,
        outfits: state.outfits.filter((outfit) => outfit.id !== action.payload),
      };
    case "TOGGLE_FAVORITE":
      const itemId = action.payload;
      const isFavorite = state.favorites.includes(itemId);
      return {
        ...state,
        favorites: isFavorite
          ? state.favorites.filter((id) => id !== itemId)
          : [...state.favorites, itemId],
      };
    case "SET_WEATHER":
      return { ...state, weather: action.payload };
    case "SET_CALENDAR_EVENTS":
      return { ...state, calendarEvents: action.payload };
    case "UPDATE_PREFERENCES":
      return {
        ...state,
        preferences: { ...state.preferences, ...action.payload },
      };
    case "SET_ONBOARDING_COMPLETE":
      return { ...state, isOnboardingComplete: action.payload };
    case "RESET_STATE":
      return initialState;
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load data from AsyncStorage on app start
  useEffect(() => {
    loadAppData();
  }, []);

  // Save data to AsyncStorage whenever state changes
  useEffect(() => {
    saveAppData();
  }, [state]);

  const loadAppData = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const keys = [
        "user",
        "wardrobe",
        "outfits",
        "favorites",
        "preferences",
        "isOnboardingComplete",
      ];

      const data = await AsyncStorage.multiGet(keys);
      const loadedData = {};

      data.forEach(([key, value]) => {
        if (value) {
          loadedData[key] = JSON.parse(value);
        }
      });

      if (loadedData.user) {
        dispatch({ type: "SET_USER", payload: loadedData.user });
      }
      if (loadedData.wardrobe) {
        dispatch({ type: "SET_WARDROBE", payload: loadedData.wardrobe });
      }
      if (loadedData.outfits) {
        dispatch({ type: "SET_OUTFITS", payload: loadedData.outfits });
      }
      if (loadedData.favorites) {
        dispatch({ type: "SET_FAVORITES", payload: loadedData.favorites });
      }
      if (loadedData.preferences) {
        dispatch({
          type: "UPDATE_PREFERENCES",
          payload: loadedData.preferences,
        });
      }
      if (loadedData.isOnboardingComplete !== undefined) {
        dispatch({
          type: "SET_ONBOARDING_COMPLETE",
          payload: loadedData.isOnboardingComplete,
        });
      }
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const saveAppData = async () => {
    try {
      const dataToSave = {
        user: state.user,
        wardrobe: state.wardrobe,
        outfits: state.outfits,
        favorites: state.favorites,
        preferences: state.preferences,
        isOnboardingComplete: state.isOnboardingComplete,
      };

      const pairs = Object.entries(dataToSave).map(([key, value]) => [
        key,
        JSON.stringify(value),
      ]);

      await AsyncStorage.multiSet(pairs);
    } catch (error) {
      console.error("Error saving app data:", error);
    }
  };

  const addItem = (item) => {
    const newItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: "ADD_ITEM", payload: newItem });
  };

  const updateItem = (item) => {
    dispatch({ type: "UPDATE_ITEM", payload: item });
  };

  const deleteItem = (itemId) => {
    dispatch({ type: "DELETE_ITEM", payload: itemId });
  };

  const addOutfit = (outfit) => {
    const newOutfit = {
      ...outfit,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: "ADD_OUTFIT", payload: newOutfit });
  };

  const updateOutfit = (outfit) => {
    dispatch({ type: "UPDATE_OUTFIT", payload: outfit });
  };

  const deleteOutfit = (outfitId) => {
    dispatch({ type: "DELETE_OUTFIT", payload: outfitId });
  };

  const toggleFavorite = (itemId) => {
    dispatch({ type: "TOGGLE_FAVORITE", payload: itemId });
  };

  const updatePreferences = (preferences) => {
    dispatch({ type: "UPDATE_PREFERENCES", payload: preferences });
  };

  const completeOnboarding = () => {
    dispatch({ type: "SET_ONBOARDING_COMPLETE", payload: true });
  };

  const value = {
    ...state,
    addItem,
    updateItem,
    deleteItem,
    addOutfit,
    updateOutfit,
    deleteOutfit,
    toggleFavorite,
    updatePreferences,
    completeOnboarding,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
