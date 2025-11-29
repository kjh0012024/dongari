import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Modal, FlatList 
} from 'react-native';
import { mockApi } from '../../api';



export default function RegisterScreen({ navigation }) {
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        setSchoolsLoading(true);
        const res = await mockApi.getSchools();  // 아래에서 만들 API
        // res가 ['경북대학교', '서울대학교', ...] 이런 형태라고 가정
        setSchoolList(res);
      } catch (err) {
        console.error("[RegisterScreen] 학교 목록 불러오기 실패:", err);
        Alert.alert("오류", "학교 목록을 불러오지 못했습니다.");
      } finally {
        setSchoolsLoading(false);
      }
    };
  
    fetchSchools();
  }, []);

  // 1. 상태 관리
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [school, setSchool] = useState(''); // 학교 상태만 남김
  
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); // 모달 상태
  const [searchText, setSearchText] = useState(''); // 학교 검색어

  const [schoolList, setSchoolList] = useState([]);  // 🔹 백엔드에서 받아올 학교 목록
  const [schoolsLoading, setSchoolsLoading] = useState(false);

  // 2. 학교 검색 필터링
  const filteredSchools = schoolList.filter(s => s.includes(searchText));

  // 3. 회원가입 처리
  const handleRegister = async () => {
    // 빈칸 검사 (학교 포함)
    if (!email || !password || !confirmPassword || !school) {
      Alert.alert("알림", "모든 항목을 입력해주세요.");
      return;
    }

    // 비밀번호 일치 검사
    if (password !== confirmPassword) {
      Alert.alert("오류", "비밀번호가 서로 다릅니다.");
      return;
    }

    setLoading(true);

    // [서버 요청] 이메일, 비번, 학교 정보 전송
    const res = await mockApi.register(email, password, school);
    console.log("회원가입 결과:", res);
    setLoading(false);

    if (res.success) {
      Alert.alert("성공", "회원가입이 완료되었습니다!\n로그인 해주세요.", [
        { text: "확인", onPress: () => navigation.goback() }
      ]);
    } else {
      Alert.alert("실패", res.message || "회원가입에 실패했습니다.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>회원가입</Text>
      
      {/* 이메일 */}
      <TextInput 
        style={styles.input} 
        placeholder="이메일" 
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      
      {/* 학교 찾기 (터치하면 모달 뜸) */}
      <TouchableOpacity 
        style={[styles.input, styles.schoolInput]} 
        onPress={() => setModalVisible(true)}
      >
        <Text style={school ? styles.inputText : styles.placeholderText}>
          {school || "학교를 선택해주세요 >"}
        </Text>
      </TouchableOpacity>
      
      {/* 비밀번호 */}
      <TextInput 
        style={styles.input} 
        placeholder="비밀번호" 
        secureTextEntry 
        value={password}
        onChangeText={setPassword}
      />
      
      {/* 비밀번호 확인 */}
      <TextInput 
        style={styles.input} 
        placeholder="비밀번호 확인" 
        secureTextEntry 
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      
      {/* 가입 버튼 */}
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        {loading ? <ActivityIndicator color="#fff"/> : <Text style={styles.btnText}>가입 완료</Text>}
      </TouchableOpacity>

      {/* 🏫 학교 찾기 모달 (팝업) */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>학교 찾기</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.closeText}>닫기</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.searchInput}
            placeholder="학교 이름을 검색하세요"
            value={searchText}
            onChangeText={setSearchText}
          />

          <FlatList
            data={filteredSchools}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.schoolItem} 
                onPress={() => {
                  setSchool(item);       // 학교 선택
                  setModalVisible(false); // 모달 닫기
                  setSearchText('');      // 검색어 초기화
                }}
              >
                <Text style={styles.schoolName}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30 },
  
  input: { width: '100%', height: 50, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 15, marginBottom: 15, justifyContent: 'center' },
  schoolInput: { backgroundColor: '#f9f9f9', borderColor: '#eee' }, // 학교 선택 칸 디자인
  
  inputText: { color: '#000' },
  placeholderText: { color: '#aaa' },

  button: { width: '100%', height: 50, backgroundColor: '#333', justifyContent: 'center', alignItems: 'center', borderRadius: 8, marginTop: 10 },
  btnText: { color: '#fff', fontWeight: 'bold' },

  /* 모달 스타일 */
  modalContainer: { flex: 1, backgroundColor: '#fff', paddingTop: 50, paddingHorizontal: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold' },
  closeText: { fontSize: 16, color: 'blue' },
  searchInput: { height: 50, backgroundColor: '#f0f0f0', borderRadius: 8, paddingHorizontal: 15, marginBottom: 20 },
  schoolItem: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  schoolName: { fontSize: 16 }
});