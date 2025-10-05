# API Integration Guide

This document explains how to use the RTK Query API integration in the Virtual Wardrobe app.

## Overview

The app uses Redux Toolkit Query (RTK Query) for efficient data fetching and caching. All API services are organized in the `src/services` directory.

## API Services

### 1. Authentication API (`authApi.js`)

- User registration and login
- Password reset and email verification
- JWT token management

### 2. User API (`userApi.js`)

- User profile management
- Preferences and body measurements
- Dashboard data

### 3. Wardrobe API (`wardrobeApi.js`)

- Wardrobe item CRUD operations
- Search and filtering
- Favorites and wear tracking

### 4. Outfit API (`outfitApi.js`)

- Outfit creation and management
- Item management within outfits
- Templates and scheduling

### 5. Weather API (`weatherApi.js`)

- Current weather and forecasts
- Weather-based recommendations
- Location management

### 6. AI API (`aiApi.js`)

- AI-powered recommendations
- Style analysis
- Color coordination

### 7. Calendar API (`calendarApi.js`)

- Event management
- Outfit scheduling
- Reminders and notifications

### 8. Image API (`imageApi.js`)

- Image upload and processing
- Color extraction and style analysis
- Thumbnail generation

### 9. Analytics API (`analyticsApi.js`)

- User behavior tracking
- Performance metrics
- Dashboard analytics

## Usage Examples

### Basic Authentication

```javascript
import { useLoginMutation, useGetProfileQuery } from "../services";

const LoginScreen = () => {
  const [login, { isLoading }] = useLoginMutation();
  const { data: profile } = useGetProfileQuery(undefined, {
    skip: !auth.isAuthenticated,
  });

  const handleLogin = async () => {
    try {
      const result = await login({
        email: "user@example.com",
        password: "password123",
      }).unwrap();

      // Handle success
      dispatch(loginSuccess(result.data));
    } catch (error) {
      // Handle error
      Alert.alert("Error", error.data?.message);
    }
  };

  return (
    <Button
      title={isLoading ? "Logging in..." : "Login"}
      onPress={handleLogin}
      disabled={isLoading}
    />
  );
};
```

### Wardrobe Items

```javascript
import { useGetItemsQuery, useCreateItemMutation } from "../services";

const WardrobeScreen = () => {
  const { data: items, isLoading, error } = useGetItemsQuery({ limit: 20 });

  const [createItem, { isLoading: isCreating }] = useCreateItemMutation();

  const handleCreateItem = async () => {
    try {
      await createItem({
        name: "Blue T-Shirt",
        category: "top",
        color: "blue",
        season: "all-season",
      }).unwrap();

      Alert.alert("Success", "Item created!");
    } catch (error) {
      Alert.alert("Error", error.data?.message);
    }
  };

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.data?.message}</Text>;

  return (
    <View>
      {items?.data?.items?.map((item) => (
        <Text key={item._id}>{item.name}</Text>
      ))}
      <Button title="Add Item" onPress={handleCreateItem} />
    </View>
  );
};
```

### AI Recommendations

```javascript
import {
  useGenerateRecommendationsMutation,
  useGetRecommendationsQuery,
} from "../services";

const RecommendationsScreen = () => {
  const [generateRecommendations, { isLoading: isGenerating }] =
    useGenerateRecommendationsMutation();
  const { data: recommendations } = useGetRecommendationsQuery({
    type: "daily_outfit",
    limit: 5,
  });

  const handleGenerate = async () => {
    try {
      await generateRecommendations({
        type: "daily_outfit",
        occasion: "casual",
      }).unwrap();

      Alert.alert("Success", "Recommendations generated!");
    } catch (error) {
      Alert.alert("Error", error.data?.message);
    }
  };

  return (
    <View>
      <Button
        title={isGenerating ? "Generating..." : "Generate Recommendations"}
        onPress={handleGenerate}
        disabled={isGenerating}
      />

      {recommendations?.data?.recommendations?.map((rec) => (
        <Text key={rec._id}>{rec.title}</Text>
      ))}
    </View>
  );
};
```

### Image Upload

```javascript
import { useUploadImageMutation } from "../services";
import { createFormData, validateFile } from "../utils/apiUtils";

const ImageUploadScreen = () => {
  const [uploadImage, { isLoading }] = useUploadImageMutation();

  const handleImageUpload = async (imageFile) => {
    // Validate file
    const validation = validateFile(imageFile);
    if (!validation.isValid) {
      Alert.alert("Error", validation.errors.join(", "));
      return;
    }

    try {
      const formData = createFormData(
        {
          tags: "casual,blue",
          category: "top",
        },
        imageFile
      );

      await uploadImage(formData).unwrap();
      Alert.alert("Success", "Image uploaded!");
    } catch (error) {
      Alert.alert("Error", error.data?.message);
    }
  };

  return (
    <Button
      title={isLoading ? "Uploading..." : "Upload Image"}
      onPress={() => handleImageUpload(selectedImage)}
      disabled={isLoading}
    />
  );
};
```

## Configuration

### API Configuration (`src/config/api.js`)

```javascript
export const API_CONFIG = {
  BASE_URL: __DEV__
    ? "http://localhost:3001/api" // Development
    : "https://your-production-api.com/api", // Production

  TIMEOUT: 30000,
  RETRY: {
    attempts: 3,
    delay: 1000,
  },
  UPLOAD: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  },
};
```

### Environment Setup

1. **Development**: Backend runs on `http://localhost:3001`
2. **Production**: Update `API_CONFIG.BASE_URL` for your production API

## Error Handling

Use the provided utility functions for consistent error handling:

```javascript
import { handleApiError, showErrorMessage } from "../utils/apiUtils";

const handleApiCall = async () => {
  try {
    await apiCall().unwrap();
  } catch (error) {
    showErrorMessage(error, Alert.alert, "Operation failed");
  }
};
```

## Caching

RTK Query automatically handles caching with configurable cache times:

- **User data**: 1 hour
- **Wardrobe data**: 5 minutes
- **Weather data**: 10 minutes
- **Analytics data**: 30 minutes

## Authentication

The API automatically includes JWT tokens in requests when the user is authenticated. Tokens are managed through the Redux store.

## File Uploads

For file uploads, use the `createFormData` utility:

```javascript
import { createFormData } from "../utils/apiUtils";

const formData = createFormData(
  {
    tags: "casual,blue",
    category: "top",
  },
  imageFile
);

await uploadImage(formData).unwrap();
```

## Best Practices

1. **Use loading states**: Always show loading indicators for better UX
2. **Handle errors gracefully**: Use the error handling utilities
3. **Optimize queries**: Use `skip` to prevent unnecessary API calls
4. **Cache appropriately**: Leverage RTK Query's built-in caching
5. **Validate inputs**: Use validation functions before API calls

## Testing

Test API integration using the provided `ApiExample` component in `src/components/ApiExample.js`.

## Troubleshooting

### Common Issues

1. **Network errors**: Check backend server is running
2. **Authentication errors**: Verify JWT token is valid
3. **File upload errors**: Check file size and type
4. **CORS errors**: Ensure backend CORS is configured correctly

### Debug Mode

Enable debug logging by setting `__DEV__ = true` in development mode.
