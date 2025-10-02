# Virtual Wardrobe - AI-Powered Personal Stylist

A modern React Native Expo app that helps you organize your wardrobe and create amazing outfits with AI-powered recommendations.

## 🌟 Features

### Core Functionality

- **Smart Wardrobe Management** - Organize and categorize your clothing items
- **AI-Powered Outfit Suggestions** - Get personalized style recommendations
- **Weather-Based Recommendations** - Outfit suggestions based on current weather
- **Outfit Planning** - Plan your outfits in advance with calendar integration
- **Style Analytics** - Track your style preferences and wardrobe diversity

### Key Screens

- **Home Dashboard** - Daily outfit suggestions and quick stats
- **Wardrobe** - Browse, search, and manage your clothing items
- **Outfit Planner** - Calendar-based outfit planning
- **AI Stylist** - Get personalized recommendations and insights
- **Profile** - User profile, statistics, and settings

### Technical Features

- **Redux State Management** - Centralized state with Redux Toolkit
- **RTK Query** - Ready for API integration
- **Modern UI/UX** - Material Design 3 with custom theming
- **Authentication Flow** - Login, register, and forgot password screens
- **Onboarding Tour** - Comprehensive app tour for new users
- **Responsive Design** - Optimized for various screen sizes

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (for testing)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/virtual-wardrobe.git
   cd virtual-wardrobe
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**

   ```bash
   npm start
   # or
   yarn start
   ```

4. **Run on device/simulator**
   - Scan the QR code with Expo Go app (Android/iOS)
   - Press `i` for iOS simulator
   - Press `a` for Android emulator

## 📱 Screenshots

### Authentication

- Modern login/register screens with social authentication options
- Forgot password flow with email verification
- Demo mode for testing without account creation

### Home Dashboard

- Weather-based outfit suggestions
- Quick stats and wardrobe insights
- Recent activity feed
- Floating action button for quick item addition

### Wardrobe Management

- Grid/list view with search and filtering
- Category-based organization
- Favorite items tracking
- High-quality item images

### AI Stylist

- Personalized outfit recommendations
- Style score and diversity metrics
- Wardrobe insights and analytics
- Preference-based suggestions

## 🛠️ Tech Stack

- **React Native** - Cross-platform mobile development
- **Expo** - Development platform and tools
- **React Navigation** - Navigation library
- **React Native Paper** - Material Design components
- **Redux Toolkit** - State management
- **RTK Query** - Data fetching and caching
- **Expo Linear Gradient** - Gradient backgrounds
- **Expo Image Picker** - Camera and gallery integration

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   └── OnboardingTour.js
├── screens/            # Screen components
│   ├── auth/           # Authentication screens
│   ├── HomeScreen.js
│   ├── WardrobeScreen.js
│   ├── OutfitPlannerScreen.js
│   ├── StylistScreen.js
│   └── ProfileScreen.js
├── store/              # Redux store
│   ├── slices/         # Redux slices
│   └── api/            # RTK Query API
├── data/               # Sample data
│   └── demoData.js
├── theme/              # App theming
│   └── theme.js
└── context/            # React Context (legacy)
    └── AppContext.js
```

## 🎨 Design System

- **Color Palette**: Modern gradient-based design
- **Typography**: Material Design 3 typography scale
- **Components**: Consistent card-based layout
- **Icons**: Ionicons for consistent iconography
- **Spacing**: 8px grid system for consistent spacing

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_API_URL=your_api_url_here
EXPO_PUBLIC_WEATHER_API_KEY=your_weather_api_key
```

### App Configuration

- Update `app.json` for app metadata
- Configure `expo.json` for build settings
- Customize theme in `src/theme/theme.js`

## 📦 Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run web` - Run in web browser
- `npm run build` - Build for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React Native community for excellent documentation
- Expo team for the amazing development platform
- Material Design team for design guidelines
- Unsplash for beautiful sample images

## 📞 Support

If you have any questions or need help, please:

- Open an issue on GitHub
- Contact: your-email@example.com

---

**Happy Styling! 👗✨**
