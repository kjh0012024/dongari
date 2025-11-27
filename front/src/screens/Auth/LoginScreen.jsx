// src/screens/Auth/LoginScreen.jsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { mockApi } from '../../api'; // 상위 폴더로 이동해서 api import

export default function LoginScreen({ navigation, route }) {
  // App.js에서 로그인 상태 변경 함수를 params로 받았다고 가정
  const setIsLoggedIn = route.params?.setIsLoggedIn || (() => {}); 
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const res = await mockApi.login(email, password);
    setLoading(false);
    if (res.success) {
      setIsLoggedIn(true);
    } else {
      Alert.alert("로그인 실패");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>UnivClub</Text>
      <TextInput style={styles.input} placeholder="이메일" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="비밀번호" secureTextEntry value={password} onChangeText={setPassword} />
      
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