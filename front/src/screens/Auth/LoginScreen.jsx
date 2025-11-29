// src/screens/Auth/LoginScreen.jsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../../api';

export default function LoginScreen({ navigation, route }) {
  // App.js에서 setIsLoggedIn 함수 받아오기
  const setIsLoggedIn = route.params?.setIsLoggedIn || (() => {});
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // 1. [프론트 검사] 빈칸인지 확인
    if (!email || !password) {
      Alert.alert("알림", "이메일과 비밀번호를 모두 입력해주세요.");
      return; // 빈칸이면 여기서 함수 종료 (서버 요청 안 함)
    }

    setLoading(true);

    // 2. [서버 요청] 입력한 email과 password를 api로 보냄
    const res = await api.login(email, password);

    setLoading(false);

    // 3. [결과 처리] 성공 여부에 따라 분기
    if (res.success) {
      if (res.token) {
        await AsyncStorage.setItem('userToken', res.token);
      }
      setIsLoggedIn(true); // 성공 -> 메인 화면으로 전환
    } else {
      Alert.alert("로그인 실패", res.error || "아이디 또는 비밀번호가 틀렸습니다.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dongari</Text>
      
      <TextInput 
        style={styles.input} 
        placeholder="이메일 (test)" 
        value={email} 
        onChangeText={setEmail}
        autoCapitalize="none" // 아이디 입력 시 첫 글자 대문자 방지
      />
      
      <TextInput 
        style={styles.input} 
        placeholder="비밀번호 (1234)" 
        secureTextEntry 
        value={password} 
        onChangeText={setPassword} 
      />
      
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        {loading ? <ActivityIndicator color="#fff"/> : <Text style={styles.btnText}>로그인</Text>}
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>회원가입 하러가기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 40 },
  input: { width: '100%', height: 50, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 15, marginBottom: 15 },
  button: { width: '100%', height: 50, backgroundColor: 'tomato', justifyContent: 'center', alignItems: 'center', borderRadius: 8 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  link: { marginTop: 20, color: 'gray' }
});