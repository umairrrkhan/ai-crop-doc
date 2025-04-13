import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import TabNavigator from './TabNavigator';
import SettingsScreen from '../screens/SettingsScreen';
import HelpSupportScreen from '../screens/HelpSupportScreen';
import PrivacySettings from '../screens/PrivacySettings';
import About from '../screens/About';
import YieldPredictionScreen from '../screens/YieldPredictionScreen';
import AgriculturalCalculatorScreen from '../screens/AgriculturalCalculatorScreen';
import CropRevenueScreen from '../screens/CropRevenueScreen';
import EnvironmentalFactorsScreen from '../screens/EnvironmentalFactorsScreen';
import ResourceManagementScreen from '../screens/ResourceManagementScreen';
import SoilHealthScreen from '../screens/SoilHealthScreen';
import ChatScreen from '../screens/ChatScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [initialRoute, setInitialRoute] = useState('Login');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkUserSession();
  }, []);

  const checkUserSession = async () => {
    try {
      const userSession = await AsyncStorage.getItem('user_session');
      if (userSession) {
        setInitialRoute('MainApp');
      }
    } catch (error) {
      console.error('Error checking user session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return null; // or a loading spinner
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="MainApp" 
          component={TabNavigator} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="HelpSupport" 
          component={HelpSupportScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="PrivacySettings" 
          component={PrivacySettings}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="About" 
          component={About}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="AgriculturalCalculator" 
          component={AgriculturalCalculatorScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="CropRevenue" 
          component={CropRevenueScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="EnvironmentalFactors" 
          component={EnvironmentalFactorsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="ResourceManagement" 
          component={ResourceManagementScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="SoilHealth"
          component={SoilHealthScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="YieldPrediction"
          component={YieldPredictionScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Chat"
          component={ChatScreen}
          options={{ headerShown: false }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}