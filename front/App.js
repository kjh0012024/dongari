// App.js
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// 기존 스크린
import LoginScreen from './src/screens/Auth/LoginScreen';
import RegisterScreen from './src/screens/Auth/RegisterScreen';
import FeedScreen from './src/screens/Feed/FeedScreen';
import CalenderScreen from './src/screens/Calender/CalenderScreen';
import SearchStackNavigator from './src/navigation/SearchStackNavigator'; // SearchStack 분리된 파일 사용
import ClubDetailScreen from './src/screens/Club/ClubDetailScreen';
import ClubApplyScreen from './src/screens/Club/ClubApplyScreen';

// ★ [추가됨] 새로 만든 관리 및 설정 화면 import
import ClubManagementScreen from './src/screens/Management/ClubManagementScreen';
import SettingsScreen from './src/screens/Settings/SettingsScreen';

const AuthStack = createStackNavigator();
const Tab = createBottomTabNavigator();
const MainStack = createStackNavigator();

// 2. 메인 탭 (하단 탭바)
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray', // 비활성 아이콘 색상 추가
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          
          if (route.name === 'Feed') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Calender') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } 
          // ★ [추가됨] 관리 탭 아이콘
          else if (route.name === 'Management') {
            iconName = focused ? 'clipboard' : 'clipboard-outline';
          } 
          // ★ [추가됨] 설정 탭 아이콘
          else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Feed" component={FeedScreen} options={{ tabBarLabel: '내 피드' }} />
      <Tab.Screen name="Search" component={SearchStackNavigator} options={{ tabBarLabel: '찾기' }} />
      <Tab.Screen name="Calender" component={CalenderScreen} options={{ tabBarLabel: '캘린더' }} />
      
      {/* ★ [추가됨] 탭 2개 추가 */}
      <Tab.Screen name="Management" component={ClubManagementScreen} options={{ tabBarLabel: '동아리 관리' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ tabBarLabel: '설정' }} />
    </Tab.Navigator>
  );
}

// 3. 메인 스택 (탭 화면 + 상세 화면을 묶어주는 가장 큰 틀)
function MainStackScreen() {
  return (
    <MainStack.Navigator>
      {/* 탭 화면을 기본으로 보여줌 */}
      <MainStack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
      
      {/* 상세 화면들 (전체 화면으로 뜸) */}
      <MainStack.Screen 
        name="ClubDetail" 
        component={ClubDetailScreen} 
        options={{ title: '동아리 상세' }} 
      />
      <MainStack.Screen 
        name="ClubApply" 
        component={ClubApplyScreen} 
        options={{ title: '동아리 신청' }} 
      />
    </MainStack.Navigator>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <MainStackScreen />
      ) : (
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
          <AuthStack.Screen name="Login" component={LoginScreen} initialParams={{ setIsLoggedIn }} />
          <AuthStack.Screen name="Register" component={RegisterScreen} />
        </AuthStack.Navigator>
      )}
    </NavigationContainer>
  );
}