import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '@/constants/Colors';
import React from 'react';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const [currentTheme, setCurrentTheme] = useState(Colors.light);

  useEffect(() => {
    getThemeName().then((tn: keyof typeof Colors) => {
      setCurrentTheme(Colors[tn])
      console.log(currentTheme)
    })
  })
  return (
    <>
      <ThemeProvider value={currentTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        </Stack>
      </ThemeProvider>
    </>
  )

async function storeThemeName(value: string) {
  try {
    await AsyncStorage.setItem('themeName', value)
  } catch (e) {
    // saving error
  }
}

async function getThemeName(): Promise<keyof typeof Colors> {
  try {
    const value = await AsyncStorage.getItem('themeName')
    if(value !== null) {
      return value as keyof typeof Colors;
    } else { return 'dark'; }
  } catch(e) {
    // error reading value
    throw new Error();
  }
}
}

