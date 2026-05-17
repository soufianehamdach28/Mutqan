import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from '../screens/HomeScreen';
import ProDashboardScreen from '../screens/ProDashboardScreen';
import SearchScreen from '../screens/SearchScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import MessagesListScreen from '../screens/MessagesListScreen';
import MessagingScreen from '../screens/MessagingScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ProProfileScreen from '../screens/ProProfileScreen';
import QuoteRequestScreen from '../screens/QuoteRequestScreen';
import { colors, typography, shadows } from '../theme';
import { useAuthStore } from '../store/useAuthStore';
import { hapticSelection } from '../utils/haptics';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// ─── Tab Configs ─────────────────────────────────────────────────────────────
const TABS = [
  { name: 'Home',      icon: 'home',          activeIcon: 'home',           label: 'Home' },
  { name: 'Search',   icon: 'magnify',        activeIcon: 'magnify',        label: 'Explore' },
  { name: 'Favorites', icon: 'heart-outline', activeIcon: 'heart',          label: 'Saved' },
  { name: 'Messages', icon: 'chat-outline',   activeIcon: 'chat',           label: 'Messages' },
  { name: 'Profile',  icon: 'account-outline', activeIcon: 'account',       label: 'Profile' },
];

// ─── Role-aware Home Tab ────────────────────────────────────────────────────
const HomeTabScreen = () => {
  const { user } = useAuthStore();
  return user?.role === 'pro' ? <ProDashboardScreen /> : <HomeScreen />;
};

// ─── Main Tab Navigator ──────────────────────────────────────────────────────
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const tabConfig = TABS.find(t => t.name === route.name)!;
        return {
          headerShown: false,
          tabBarShowLabel: true,
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabLabel,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.gray400,
          tabBarIcon: ({ focused, color }) => (
            <Icon name={focused ? tabConfig.activeIcon : tabConfig.icon} size={24} color={color} />
          ),
          tabBarLabel: tabConfig.label,
        };
      }}
      screenListeners={{
        tabPress: () => hapticSelection(),
      }}
    >
      <Tab.Screen name="Home" component={HomeTabScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={({ }) => {
          // We use a listener pattern in the screen for dynamic badge
          return {};
        }}
      />
      <Tab.Screen name="Messages" component={MessagesListScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

// ─── Root Stack (includes modal screens on top of tabs) ──────────────────────
export const MainTabNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen
        name="ProProfile"
        component={ProProfileScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="QuoteRequest"
        component={QuoteRequestScreen}
        options={{ animation: 'slide_from_bottom', presentation: 'modal' }}
      />
      <Stack.Screen
        name="Messaging"
        component={MessagingScreen}
        options={{ animation: 'slide_from_right' }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray100,
    height: Platform.OS === 'ios' ? 88 : 64,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    paddingTop: 8,
    ...shadows.lg,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: -2,
  },
});
