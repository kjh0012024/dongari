import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// 화면 import
import SearchScreen from '../screens/Search/SearchScreen';
import SchoolListScreen from '../screens/Search/SchoolListScreen';
import SchoolClubScreen from '../screens/Search/SchoolClubScreen';
import CategoryListScreen from '../screens/Search/CategoryListScreen';
import CategoryClubScreen from '../screens/Search/CategoryClubScreen';
import ClubDetailScreen from '../screens/Club/ClubDetailScreen';

const SearchStack = createStackNavigator();

export default function SearchStackNavigator() {
  return (
    <SearchStack.Navigator>
      <SearchStack.Screen 
        name="SearchMain" 
        component={SearchScreen} 
        options={{ headerShown: false }} 
      />
      <SearchStack.Screen 
        name="SchoolList" 
        component={SchoolListScreen} 
        options={{ title: '학교 목록' }} 
      />
      <SearchStack.Screen 
        name="SchoolClub" 
        component={SchoolClubScreen} 
        options={{ title: '학교 동아리' }} 
      />
      <SearchStack.Screen 
        name="CategoryList" 
        component={CategoryListScreen} 
        options={{ title: '카테고리 목록' }} 
      />
      <SearchStack.Screen 
        name="CategoryClub" 
        component={CategoryClubScreen} 
        options={{ title: '카테고리 동아리' }} 
      />
      <SearchStack.Screen 
        name="ClubDetail" 
        component={ClubDetailScreen} 
        options={{ title: '동아리 상세' }} 
      />
    </SearchStack.Navigator>
  );
}
