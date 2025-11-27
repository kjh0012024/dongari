// App.js
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

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
const MainStack = createStackNavigator(); // ★ 새로 추가된 스택

// 1. 찾기 탭 내부 스택 (이제 여기엔 상세화면이 없습니다)
function SearchStackScreen() {
  return (
    <SearchStack.Navigator>
      <SearchStack.Screen name="SearchMain" component={SearchScreen} options={{ headerShown: false }} />
      <SearchStack.Screen name="SchoolFilter" component={SchoolFilterScreen} options={{ title: '학교별 찾기' }} />
      <SearchStack.Screen name="CategoryFilter" component={CategoryFilterScreen} options={{ title: '카테고리별 찾기' }} />
    </SearchStack.Navigator>
  );
}

// 2. 메인 탭 (하단 탭바)
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

// 3. ★ 메인 스택 (탭 화면 + 상세 화면을 묶어주는 가장 큰 틀)
function MainStackScreen() {
  return (
    <MainStack.Navigator>
      {/* 탭 화면을 기본으로 보여줌 */}
      <MainStack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
      
      {/* 상세 화면을 여기에 둠으로써 어디서든 접근 가능하게 함 */}
      <MainStack.Screen name="ClubDetail" component={ClubDetailScreen} options={{ title: '동아리 상세' }} />
    </MainStack.Navigator>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <MainStackScreen /> // ★ MainTabs 대신 MainStackScreen을 렌더링
      ) : (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
          <AuthStack.Screen name="Login" component={LoginScreen} initialParams={{ setIsLoggedIn }} />
          <AuthStack.Screen name="Register" component={RegisterScreen} />
        </AuthStack.Navigator>
      )}
    </NavigationContainer>
  );
}