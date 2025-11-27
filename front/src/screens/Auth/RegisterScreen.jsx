// src/screens/Auth/RegisterScreen.jsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { mockApi } from '../../api'; // API 불러오기

export default function RegisterScreen({ navigation }) {
  // 입력값 상태 관리
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // 1. [프론트 검사] 빈칸 확인
    if (!email || !password || !confirmPassword) {
      Alert.alert("알림", "모든 항목을 입력해주세요.");
      return;
    }

    // 2. [프론트 검사] 비밀번호 일치 확인
    if (password !== confirmPassword) {
      Alert.alert("오류", "비밀번호가 서로 다릅니다.");
      return;
    }

    setLoading(true);

    // 3. [서버 요청] 회원가입 시도
    const res = await mockApi.register(email, password);

    setLoading(false);

    // 4. [결과 처리]
    if (res.success) {
      Alert.alert("성공", "회원가입이 완료되었습니다!\n로그인 해주세요.", [
        { text: "확인", onPress: () => navigation.goBack() } // 확인 누르면 로그인 화면으로 이동
      ]);
    } else {
      // 이미 존재하는 이메일 등 실패 사유 표시
      Alert.alert("실패", res.message || "회원가입에 실패했습니다.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>회원가입</Text>
      
      <TextInput 
        style={styles.input} 
        placeholder="이메일" 
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      
      <TextInput 
        style={styles.input} 
        placeholder="비밀번호" 
        secureTextEntry 
        value={password}
        onChangeText={setPassword}
      />
      
      <TextInput 
        style={styles.input} 
        placeholder="비밀번호 확인" 
        secureTextEntry 
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        {loading ? <ActivityIndicator color="#fff"/> : <Text style={styles.btnText}>가입 완료</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30 },
  input: { width: '100%', height: 50, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 15, marginBottom: 15 },
  button: { width: '100%', height: 50, backgroundColor: '#333', justifyContent: 'center', alignItems: 'center', borderRadius: 8 },
  btnText: { color: '#fff', fontWeight: 'bold' }
});