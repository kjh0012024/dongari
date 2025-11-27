// App.js
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// 경로에 맞춰 import
import LoginScreen from './src/screens/Auth/LoginScreen';
import RegisterScreen from './src/screens/Auth/RegisterScreen';
import FeedScreen from './src/screens/Feed/FeedScreen';
import SearchScreen from './src/screens/Search/SearchScreen';
import SchoolFilterScreen from './src/screens/Search/SchoolFilterScreen';
import CategoryFilterScreen from './src/screens/Search/CategoryFilterScreen';
import ClubDetailScreen from './src/screens/Club/ClubDetailScreen';
import CalenderScreen from './src/screens/Calender/CalenderScreen';

const AuthStack = createStackNavigator();
const Tab = createBottomTabNavigator();
const SearchStack = createStackNavigator();

// 1. 찾기 탭 내부 스택 (찾기 메인 -> 필터 -> 상세)
function SearchStackScreen() {
  return (
    <SearchStack.Navigator>
      <SearchStack.Screen name="SearchMain" component={SearchScreen} options={{ headerShown: false }} />
      <SearchStack.Screen name="SchoolFilter" component={SchoolFilterScreen} options={{ title: '학교별 찾기' }} />
      <SearchStack.Screen name="CategoryFilter" component={CategoryFilterScreen} options={{ title: '카테고리별 찾기' }} />
      <SearchStack.Screen name="ClubDetail" component={ClubDetailScreen} options={{ title: '동아리 상세' }} />
    </SearchStack.Navigator>
  );
}

// 2. 메인 탭 (로그인 후 화면)
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: 'tomato',
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Feed') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Search') iconName = focused ? 'search' : 'search-outline';
          else if (route.name === 'Calender') iconName = focused ? 'calendar' : 'calendar-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Feed" component={FeedScreen} options={{ tabBarLabel: '내 피드' }} />
      <Tab.Screen name="Search" component={SearchStackScreen} options={{ tabBarLabel: '찾기' }} />
      <Tab.Screen name="Calender" component={CalenderScreen} options={{ tabBarLabel: '캘린더' }} />
    </Tab.Navigator>
  );
}

// 3. 전체 앱 (로그인 여부 체크)
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <MainTabs />
      ) : (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
          <AuthStack.Screen name="Login" component={LoginScreen} initialParams={{ setIsLoggedIn }} />
          <AuthStack.Screen name="Register" component={RegisterScreen} />
        </AuthStack.Navigator>
      )}
    </NavigationContainer>
  );
}