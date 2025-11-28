// src/screens/Settings/SettingsScreen.jsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen({ navigation, route }) {
  // 로그아웃 처리 함수 (App.js에서 setIsLoggedIn 함수를 전달받아야 함)
  const handleLogout = async () => {
    Alert.alert("로그아웃", "정말 로그아웃 하시겠습니까?", [
      { text: "취소", style: "cancel" },
      { 
        text: "확인", 
        onPress: async () => {
          await AsyncStorage.removeItem('userToken'); // 토큰 삭제
          // 실제 앱에서는 상태 관리(Context 등)를 통해 로그인 화면으로 보냅니다.
          // 여기서는 임시로 재시작 알림을 띄웁니다.
          Alert.alert("알림", "앱을 재시작하면 로그인 화면으로 이동합니다.");
        }
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>설정</Text>
        
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>내 정보 수정</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>알림 설정</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <Text style={[styles.menuText, { color: 'tomato' }]}>로그아웃</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30 },
  menuItem: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  menuText: { fontSize: 16 },
});