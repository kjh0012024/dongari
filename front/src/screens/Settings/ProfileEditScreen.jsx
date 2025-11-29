// src/screens/Settings/ProfileEditScreen.jsx
import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Modal, FlatList, ScrollView, ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../../api';

export default function ProfileEditScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [school, setSchool] = useState('');
  
  const [loading, setLoading] = useState(true); // 초기 데이터 로딩
  const [saving, setSaving] = useState(false);  // 저장 중 로딩
  const [schools, setSchools] = useState([]);

  // 학교 찾기 모달 관련
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const filteredSchools = schools.filter(s =>
    (s.name || '').toLowerCase().includes(searchText.toLowerCase())
  );

  // 1. 화면 켜지면 내 정보 가져오기
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const [user, schoolList] = await Promise.all([
          api.getUserInfo(token),
          api.getSchools(),
        ]);

        setEmail(user.email || '');
        setSchool(user.school || user.schoolName || '');
        const normalizedSchools = (schoolList || []).map(s =>
          typeof s === 'string' ? { id: s, name: s } : { id: s.id, name: s.name }
        );
        setSchools(normalizedSchools);
      } catch (err) {
        console.error('[ProfileEdit] 사용자 정보/학교 불러오기 실패', err);
        Alert.alert('오류', '프로필 정보를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // 2. 저장 버튼 클릭 시
  const handleSave = async () => {
    if (!email || !school) {
      Alert.alert("알림", "아이디와 학교는 필수입니다.");
      return;
    }

    // 비밀번호 변경을 원할 경우만 체크
    if (password && password !== confirmPassword) {
      Alert.alert("오류", "새 비밀번호가 서로 다릅니다.");
      return;
    }

    setSaving(true);

    const token = await AsyncStorage.getItem('userToken');
    const result = await api.updateUser(token, { email, password, school });
    setSaving(false);

    if (result.success) {
      Alert.alert("성공", "정보가 수정되었습니다.", [
        { text: "확인", onPress: () => navigation.goBack() }
      ]);
    } else {
      Alert.alert('실패', result.message || '정보 수정에 실패했습니다.');
    }
  };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="tomato" /></View>;
  }

  return (
    <ScrollView style={styles.container}>
      
      {/* 섹션 1: 기본 정보 */}
      <View style={styles.section}>
        <Text style={styles.label}>아이디 (이메일) 변경</Text>
        <TextInput 
          style={styles.input} 
          value={email} 
          onChangeText={setEmail} 
          autoCapitalize="none"
        />
      </View>

      {/* 섹션 2: 학교 변경 */}
      <View style={styles.section}>
        <Text style={styles.label}>학교 변경</Text>
        <TouchableOpacity 
          style={[styles.input, styles.selectInput]} 
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.inputText}>{school}</Text>
        </TouchableOpacity>
      </View>

      {/* 섹션 3: 비밀번호 변경 */}
      <View style={styles.section}>
        <Text style={styles.label}>새 비밀번호 (변경 시에만 입력)</Text>
        <TextInput 
          style={styles.input} 
          placeholder="새 비밀번호"
          secureTextEntry 
          value={password} 
          onChangeText={setPassword} 
        />
        <TextInput 
          style={styles.input} 
          placeholder="새 비밀번호 확인"
          secureTextEntry 
          value={confirmPassword} 
          onChangeText={setConfirmPassword} 
        />
      </View>

      {/* 저장 버튼 */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        {saving ? <ActivityIndicator color="#fff"/> : <Text style={styles.saveText}>저장하기</Text>}
      </TouchableOpacity>


      {/* 🏫 학교 찾기 모달 (재사용) */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>학교 변경</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.closeText}>닫기</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.searchInput}
            placeholder="학교 검색"
            value={searchText}
            onChangeText={setSearchText}
          />

          <FlatList
            data={filteredSchools}
            keyExtractor={(item) => item.id?.toString?.() || item.name}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.schoolItem}
                onPress={() => {
                  setSchool(item.name);
                  setModalVisible(false);
                  setSearchText('');
                }}
              >
                <Text style={styles.schoolName}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  section: { marginBottom: 25 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#555', marginBottom: 8 },
  input: { height: 50, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 15, fontSize: 16, marginBottom: 10 },
  selectInput: { justifyContent: 'center', backgroundColor: '#f9f9f9' },
  inputText: { fontSize: 16, color: '#000' },

  saveButton: { height: 50, backgroundColor: 'tomato', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 10, marginBottom: 50 },
  saveText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  /* 모달 스타일 */
  modalContainer: { flex: 1, backgroundColor: '#fff', paddingTop: 50, paddingHorizontal: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold' },
  closeText: { fontSize: 16, color: 'blue' },
  searchInput: { height: 50, backgroundColor: '#f0f0f0', borderRadius: 8, paddingHorizontal: 15, marginBottom: 20 },
  schoolItem: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  schoolName: { fontSize: 16 }
});