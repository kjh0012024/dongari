// src/navigation/AppNavigator.jsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ClubManagementScreen from '../screens/Management/ClubManagementScreen';
import ClubDetailManagementScreen from '../screens/Management/ClubDetailManagementScreen';
import EditClubInfoScreen from '../screens/Management/EditClubInfoScreen';
import ManagePhotosScreen from '../screens/Management/ManagePhotosScreen';
import ApplicantsScreen from '../screens/Management/ApplicantsScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ClubManagement"
        component={ClubManagementScreen}
        options={{ title: '내 동아리 관리' }}
      />
      <Stack.Screen
        name="ClubDetailManagement"
        component={ClubDetailManagementScreen}
        options={{ title: '동아리 상세' }}
      />
      <Stack.Screen
        name="EditClubInfo"
        component={EditClubInfoScreen}
        options={{ title: '동아리 정보 수정' }}
      />
      <Stack.Screen
        name="ManagePhotos"
        component={ManagePhotosScreen}
        options={{ title: '사진 관리' }}
      />
      <Stack.Screen
        name="Applicants"
        component={ApplicantsScreen}
        options={{ title: '신청자 목록' }}
      />
    </Stack.Navigator>
  );
}
